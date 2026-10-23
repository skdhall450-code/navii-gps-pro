import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
function compile(path, overrides = {}, globals = {}) {
  const output = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiledModule = { exports: {} }, names = Object.keys(globals);
  new Function("require", "module", "exports", ...names, output)(id => overrides[id] ?? require(id), compiledModule, compiledModule.exports, ...Object.values(globals));
  return compiledModule.exports;
}
const policy = compile("../lib/renewal-worklist.ts");
const path = "../components/renewals/RenewalWorklist.tsx";
const asOf = Date.parse("2026-10-23T12:00:00.000Z");
const snapshot = { actor: { id: "a1", role: "ADMIN", companyId: "c1", dealerId: null, customerId: null }, asOf, subscriptions: [{ id: "s1", vehicleId: "v1", vehicleNo: "QA-RENEW", companyId: "c1", dealerId: null, customerId: null, status: "ACTIVE", startDate: "2026-10-01T12:00:00.000Z", endDate: "2026-10-30T12:00:00.000Z", planName: "Annual plan" }] };
function render({ data = snapshot, loading = false, error = "", filter = "DAYS30", zone = "Asia/Kolkata" } = {}) {
  const values = [data, loading, error, filter, "", zone, 0]; let index = 0;
  const component = compile(path, {
    react: { ...React, useState: () => [values[index++], () => {}], useRef: () => ({ current: 0 }), useEffect: () => {} },
    "@/lib/renewal-worklist": policy,
    "@/lib/renewal-worklist-client": { loadRenewalSnapshot: () => { throw new Error("Unexpected render-time request"); } },
    "next/link": ({ children, href, className }) => React.createElement("a", { href, className }, children),
  }).default;
  return renderToStaticMarkup(React.createElement(component));
}
test("rendered worklist shows precise dates, cumulative windows and one vehicle", () => {
  const html = render();
  assert.match(html, /Renewal worklist/); assert.match(html, /Next 7 days/); assert.match(html, /Next 15 days/); assert.match(html, /Next 30 days/);
  assert.match(html, /15 days includes the next 7 days/); assert.match(html, /24 hours from the snapshot/); assert.match(html, /1 of 1 vehicles/); assert.match(html, /QA-RENEW/);
  assert.match(html, /Asia\/Kolkata/); assert.match(html, /30 Oct 2026, 5:30 pm/); assert.match(html, /2026-10-30T12:00:00.000Z/);
});
test("timezone changes display without changing the selected renewal window", () => {
  const html = render({ zone: "UTC" });
  assert.match(html, /30 Oct 2026, 12:00 pm/); assert.match(html, /1 of 1 vehicles/);
});
test("Kolkata midnight rollover changes the calendar date but not expiry filtering", () => {
  const data = { ...snapshot, subscriptions: snapshot.subscriptions.map(row => ({ ...row, endDate: "2026-10-30T20:00:00.000Z" })) };
  const india = render({ data, filter: "DAYS15", zone: "Asia/Kolkata" });
  const utc = render({ data, filter: "DAYS15", zone: "UTC" });
  assert.match(india, /31 Oct 2026, 1:30 am/); assert.match(utc, /30 Oct 2026, 8:00 pm/);
  assert.match(india, /1 of 1 vehicles/); assert.match(utc, /1 of 1 vehicles/);
  assert.match(render({ data, filter: "DAYS7" }), /No records match/);
});
test("loading and failed reads show no zero/all-clear or old vehicle records", () => {
  for (const html of [render({ data: null, loading: true }), render({ data: null, error: "Access changed" })]) {
    assert.doesNotMatch(html, /QA-RENEW|0 of 0|No records match/);
  }
  assert.match(render({ data: null, error: "Access changed" }), /role="alert"/);
});
test("empty filters disclose visible-history limits and manual follow-up only", () => {
  const html = render({ filter: "ATTENTION" });
  assert.match(html, /No records match/); assert.match(html, /without visible subscription history are not included/);
  assert.match(html, /does not send reminders or renew subscriptions/); assert.match(html, /current vehicle assignment or device connectivity/);
  assert.doesNotMatch(html, /mailto:|tel:|Send reminder|Renew now/);
});

const settled = () => new Promise(resolve => setImmediate(resolve));
function deferred() { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
function mount() {
  const states = [], effects = [], listeners = new Map(), calls = [], intervals = new Set();
  let token = "session-a";
  const refs = { current: 0 };
  const component = compile(path, {
    react: { ...React, useState: initial => { const state = { value: initial }; states.push(state); return [initial, update => { state.value = typeof update === "function" ? update(state.value) : update; }]; }, useRef: () => refs, useEffect: effect => effects.push(effect), useMemo: factory => factory() },
    "@/lib/renewal-worklist": policy,
    "@/lib/renewal-worklist-client": { loadRenewalSnapshot: (...args) => { const next = deferred(); calls.push({ args, ...next }); return next.promise; } },
    "next/link": () => null,
  }, {
    localStorage: { getItem: () => token },
    window: { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: (name, fn) => { if (listeners.get(name) === fn) listeners.delete(name); } },
    document: { visibilityState: "visible" },
    setInterval: fn => { intervals.add(fn); return fn; }, clearInterval: fn => intervals.delete(fn),
  }).default;
  component();
  const cleanup = effects[0]();
  return { states, effects, listeners, calls, intervals, cleanup, setToken: next => { token = next; } };
}
test("focus refresh clears old records and ignores a slower prior request", async () => {
  const m = mount(); m.listeners.get("focus")(); assert.equal(m.calls.length, 2); assert.equal(m.calls[0].args[2].aborted, true);
  m.calls[1].resolve(snapshot); await settled(); assert.equal(m.states[0].value, snapshot);
  m.calls[0].resolve({ ...snapshot, asOf: 1 }); await settled(); assert.equal(m.states[0].value, snapshot);
  m.listeners.get("focus")(); assert.equal(m.states[0].value, null); assert.equal(m.states[1].value, true);
  m.cleanup();
});
test("session switch clears results and resets filters before the next identity load", async () => {
  const m = mount(); m.calls[0].resolve(snapshot); await settled();
  m.states[3].value = "ATTENTION"; m.states[4].value = "old vehicle";
  m.setToken("session-b"); m.listeners.get("storage")();
  assert.equal(m.states[0].value, null); assert.equal(m.states[3].value, "DAYS30"); assert.equal(m.states[4].value, ""); assert.equal(m.calls[1].args[0], "session-b");
  m.cleanup();
});
test("same-window session removal is noticed without a storage event", async () => {
  const m = mount(); m.calls[0].resolve(snapshot); await settled(); m.setToken(null); [...m.intervals][0](); await settled();
  assert.equal(m.states[0].value, null); assert.match(m.states[2].value, /Sign in/); assert.equal(m.calls.length, 1); m.cleanup();
});
test("unmount cancels and detaches listeners; late successes cannot restore records", async () => {
  const m = mount(); m.cleanup(); assert.equal(m.calls[0].args[2].aborted, true); assert.equal(m.listeners.size, 0); assert.equal(m.intervals.size, 0);
  m.calls[0].resolve(snapshot); await settled(); assert.equal(m.states[0].value, null);
});
test("cancelled prior failures cannot overwrite a subsequent successful refresh", async () => {
  const m = mount(); m.listeners.get("focus")(); m.calls[1].resolve(snapshot); await settled();
  m.calls[0].reject(new Error("old failure")); await settled(); assert.equal(m.states[0].value, snapshot); assert.equal(m.states[2].value, ""); m.cleanup();
});
