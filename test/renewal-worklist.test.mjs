import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
function compile(path, overrides = {}) {
  const output = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiledModule = { exports: {} };
  new Function("require", "module", "exports", output)(id => overrides[id] ?? require(id), compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
const policy = compile("../lib/renewal-worklist.ts");
const { loadRenewalSnapshot, assertRenewalTokenScope } = compile("../lib/renewal-worklist-client.ts", { "./renewal-worklist": policy });
const { parseRenewalActor, parseRenewalSubscriptions, buildRenewalWorklist, filterRenewalRows } = policy;
const now = Date.parse("2026-10-23T12:00:00.000Z"), day = 86_400_000;
const iso = days => new Date(now + days * day).toISOString();
const actor = { id: "user1", role: "ADMIN", companyId: "company1", dealerId: null, customerId: null };
const jwt = (claims = {}) => `header.${Buffer.from(JSON.stringify({ sub: actor.id, ...actor, ...claims })).toString("base64url")}.signature`;
const subscription = (id = "s1", start = -20, end = 7, extra = {}) => ({ id, vehicleId: "v1", companyId: "company1", dealerId: null, customerId: null, status: "ACTIVE", startDate: iso(start), endDate: iso(end), vehicle: { id: "v1", vehicleNo: "QA-001" }, plan: { name: "Annual plan" }, ...extra });
const payload = data => ({ success: true, count: data.length, data });
const rows = (data, time = now) => buildRenewalWorklist(parseRenewalSubscriptions(payload(data), actor), time);

test("expired history does not flag a vehicle whose current period was renewed", () => {
  const result = rows([subscription("old", -60, -30, { status: "EXPIRED" }), subscription("new", -30, 335)]);
  assert.equal(result.length, 1); assert.equal(result[0].state, "COVERED"); assert.equal(result[0].endDate, iso(335));
  assert.equal(filterRenewalRows(result, "ATTENTION").length, 0);
});
test("adjacent future renewals extend the complete current coverage chain", () => {
  const result = rows([subscription("future2", 37, 67, { status: "UPCOMING" }), subscription(), subscription("future1", 7, 37, { status: "UPCOMING" })]);
  assert.equal(result[0].periods, 3); assert.equal(result[0].endDate, iso(67)); assert.equal(result[0].state, "COVERED");
});
test("a future period after a gap cannot hide the current renewal deadline", () => {
  const result = rows([subscription(), subscription("future", 8, 38, { status: "UPCOMING" })]);
  assert.equal(result[0].endDate, iso(7)); assert.equal(result[0].state, "DUE");
});
test("expired coverage plus a future period explicitly reports a gap", () => {
  const [result] = rows([subscription("old", -30, -1), subscription("future", 2, 32)]);
  assert.equal(result.state, "GAP"); assert.equal(result.nextStart, iso(2)); assert.equal(result.endDate, iso(-1));
});
test("expired history picks the latest coverage end independent of input order", () => {
  const [result] = rows([subscription("latest", -30, -1), subscription("old", -60, -30)]);
  assert.equal(result.state, "EXPIRED"); assert.equal(result.endDate, iso(-1));
});
test("future-only and cancelled-only histories are not renewal reminders", () => {
  assert.equal(rows([subscription("future", 1, 31)])[0].state, "UPCOMING");
  const cancelled = rows([subscription("cancelled", -1, 31, { status: "CANCELLED" })]);
  assert.equal(cancelled[0].state, "CANCELLED"); assert.equal(filterRenewalRows(cancelled, "DAYS30").length, 0);
});
test("suspended periods never extend coverage and current suspension needs review", () => {
  assert.equal(rows([subscription(), subscription("blocked", 7, 37, { status: "SUSPENDED" })])[0].endDate, iso(7));
  assert.equal(rows([subscription("blocked", -1, 7, { status: "SUSPENDED" })])[0].state, "SUSPENDED");
});
test("conflicting current or future overlapping periods fail into review", () => {
  for (const extra of [subscription("overlap", -1, 30), subscription("overlap", 6, 30), subscription("blocked", -1, 30, { status: "SUSPENDED" })]) assert.equal(rows([subscription(), extra])[0].state, "REVIEW");
});
test("a suspended interval inside a future renewal chain prevents a covered claim", () => {
  const [result] = rows([subscription(), subscription("renewed", 7, 60), subscription("suspended", 10, 60, { status: "SUSPENDED" })]);
  assert.equal(result.state, "REVIEW");
});
test("inconsistent vehicle identity is reviewable rather than silently selected", () => {
  assert.equal(rows([subscription(), subscription("future", 7, 37, { vehicle: { id: "v1", vehicleNo: "OTHER" } })])[0].state, "REVIEW");
});
test("7/15/30 filters use exact rolling durations and include boundaries once per vehicle", () => {
  for (const limit of [7, 15, 30]) {
    assert.equal(filterRenewalRows(rows([subscription("edge", -1, limit)]), `DAYS${limit}`).length, 1);
    assert.equal(filterRenewalRows(rows([subscription("beyond", -1, limit + 1 / day)]), `DAYS${limit}`).length, 0);
  }
  assert.equal(rows([subscription("ended", -1, 0)])[0].state, "EXPIRED");
  assert.equal(rows([subscription("starting", 0, 7)])[0].state, "DUE");
});
test("search filters vehicle or plan without changing the underlying counts", () => {
  const result = rows([subscription()]);
  assert.equal(filterRenewalRows(result, "DAYS7", " annual ").length, 1);
  assert.equal(filterRenewalRows(result, "DAYS7", "other").length, 0);
  assert.equal(result.length, 1);
});
test("effective labels use dates even when stored ACTIVE or EXPIRED is stale", () => {
  assert.equal(rows([subscription("old", -30, -1, { status: "ACTIVE" })])[0].state, "EXPIRED");
  assert.equal(rows([subscription("new", -1, 100, { status: "EXPIRED" })])[0].state, "COVERED");
});
test("scope projection excludes prices, contacts, telemetry and other super-admin companies", () => {
  const data = [subscription("own", -1, 7, { priceAtPurchase: "999", notes: "private", device: { imei: "private" } }), subscription("other", -1, 7, { companyId: "other" })];
  const result = parseRenewalSubscriptions(payload(data), { ...actor, role: "SUPER_ADMIN" });
  assert.equal(result.length, 1); assert.equal(JSON.stringify(result).includes("private"), false); assert.equal("priceAtPurchase" in result[0], false);
  assert.throws(() => parseRenewalSubscriptions(payload(data), actor), /scope changed/);
});
test("dealer/customer billing scope requires exact linked identities", () => {
  for (const [role, key] of [["DEALER", "dealerId"], ["CUSTOMER", "customerId"]]) {
    const scoped = { ...actor, role, [key]: "linked1" };
    assert.throws(() => parseRenewalSubscriptions(payload([subscription()]), scoped), /scope changed/);
    assert.equal(parseRenewalSubscriptions(payload([subscription("s1", -1, 1, { [key]: "linked1" })]), scoped).length, 1);
  }
});
test("incomplete envelopes, duplicate IDs and malformed dates cannot show all-clear", () => {
  for (const broken of [{ data: [] }, { success: true, count: 2, data: [] }, payload([subscription(), subscription()]), payload([subscription("bad", -1, 7, { endDate: "2026-02-30T12:00:00.000Z" })]), payload([subscription("bad", 7, -1)]), payload([subscription("bad", -1, 7, { status: "UNKNOWN" })])]) assert.throws(() => parseRenewalSubscriptions(broken, actor), /incomplete|invalid/);
});
test("profile rejects unsupported roles, missing links and disabled linked accounts", () => {
  assert.deepEqual(parseRenewalActor({ data: actor }), actor);
  for (const user of [{ ...actor, role: "USER" }, { ...actor, role: "DEALER" }, { ...actor, role: "CUSTOMER", customerId: "c1", customer: { id: "c1", isActive: false } }]) assert.throws(() => parseRenewalActor({ data: user }));
  assert.equal(parseRenewalActor({ data: { ...actor, role: "DEALER", dealerId: "d1", dealer: { id: "d1", isActive: true } } }).dealerId, "d1");
});
test("stale role, company, actor and linkage JWT claims are rejected", () => {
  assert.doesNotThrow(() => assertRenewalTokenScope(jwt(), actor));
  for (const change of [{ sub: "other" }, { role: "SUPER_ADMIN" }, { companyId: "other" }, { dealerId: "old" }]) assert.throws(() => assertRenewalTokenScope(jwt(change), actor), /permissions changed/);
});
const response = body => ({ ok: true, status: 200, json: async () => body });
function clientFixture(replies = [{ data: actor }, payload([subscription()]), { data: actor }]) {
  const calls = [], token = jwt();
  return { calls, token, request: async (url, init) => { calls.push({ url, init }); return response(replies.shift()); } };
}
test("successful reads verify actor before and after complete subscriptions, GET only", async () => {
  const f = clientFixture(); const snapshot = await loadRenewalSnapshot(f.token, () => f.token, new AbortController().signal, f.request);
  assert.equal(snapshot.subscriptions.length, 1); assert.equal(f.calls.length, 3);
  assert.deepEqual(f.calls.map(c => new URL(c.url).pathname), ["/api/auth/me", "/api/gps/billing/subscriptions", "/api/auth/me"]);
  assert.ok(f.calls.every(c => c.init.method === "GET" && c.init.cache === "no-store" && !c.init.body));
});
test("stale JWT stops before the billing request", async () => {
  const f = clientFixture(); const token = jwt({ role: "SUPER_ADMIN" });
  await assert.rejects(loadRenewalSnapshot(token, () => token, new AbortController().signal, f.request), /permissions changed/); assert.equal(f.calls.length, 1);
});
test("a token switch while JSON is pending discards the response", async () => {
  const token = jwt(); let current = token, release;
  const pending = loadRenewalSnapshot(token, () => current, new AbortController().signal, async () => ({ ok: true, status: 200, json: () => new Promise(resolve => { release = resolve; }) }));
  await new Promise(resolve => setImmediate(resolve)); current = "new-session"; release({ data: actor });
  await assert.rejects(pending, /session changed/);
});
test("permission changes during the list read cannot become a visible snapshot", async () => {
  const f = clientFixture([{ data: actor }, payload([subscription()]), { data: { ...actor, companyId: "other" } }]);
  await assert.rejects(loadRenewalSnapshot(f.token, () => f.token, new AbortController().signal, f.request), /permissions changed/);
});
test("full response timeout covers a hung JSON body", async () => {
  const token = jwt();
  await assert.rejects(loadRenewalSnapshot(token, () => token, new AbortController().signal, async () => ({ ok: true, status: 200, json: () => new Promise(() => {}) }), 10), /timed out/);
});
test("aborted reads stop even when the fetch implementation ignores AbortSignal", async () => {
  const token = jwt(), controller = new AbortController();
  const pending = loadRenewalSnapshot(token, () => token, controller.signal, async () => new Promise(() => {})); controller.abort();
  await assert.rejects(pending, { name: "AbortError" });
});
test("pre-aborted reads and forbidden responses issue no billing request", async () => {
  const f = clientFixture(), controller = new AbortController(); controller.abort();
  await assert.rejects(loadRenewalSnapshot(f.token, () => f.token, controller.signal, f.request), { name: "AbortError" }); assert.equal(f.calls.length, 0);
  await assert.rejects(loadRenewalSnapshot(f.token, () => f.token, new AbortController().signal, async () => ({ ok: false, status: 403 })), /cannot access/);
});
