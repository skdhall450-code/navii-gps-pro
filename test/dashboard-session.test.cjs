/* eslint-disable @typescript-eslint/no-require-imports -- Node tests transpile the actual TSX component and capture its effect without a browser. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const filename = path.join(__dirname, "../app/dashboard/layout.tsx");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
    target: ts.ScriptTarget.ES2017,
  },
}).outputText;

const token = "synthetic-session-token";
const profile = {
  id: "synthetic-user",
  name: "Test User",
  email: "test@example.invalid",
  role: "CUSTOMER",
  companyId: "synthetic-company",
};
const savedProfile = JSON.stringify({ ...profile, name: "Cached User" });

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

// Drain the promise continuations started by the actual effect, without timers,
// real requests, or copied session-verification logic.
const settled = () => new Promise((resolve) => setImmediate(resolve));
const validResponse = () => ({ ok: true, json: async () => ({ data: profile }) });

function mountLayout({ hasToken = true } = {}) {
  const storage = new Map([["navii_user", savedProfile]]);
  if (hasToken) storage.set("navii_access_token", token);
  const removed = [];
  const written = [];
  const redirects = [];
  const states = [];
  const effects = [];
  const requests = [];
  const router = { replace: (href) => redirects.push(href) };
  const hooks = {
    useState(initial) {
      const state = { value: initial, updates: [] };
      states.push(state);
      return [initial, (value) => {
        state.value = value;
        state.updates.push(value);
      }];
    },
    useMemo: (factory) => factory(),
    useEffect: (effect) => effects.push(effect),
  };
  const modules = {
    react: hooks,
    "react/jsx-runtime": require("react/jsx-runtime"),
    "next/link": () => null,
    "next/navigation": { usePathname: () => "/dashboard", useRouter: () => router },
    "lucide-react": require("lucide-react"),
    // Presentation-only wrapper; keep exercising the actual layout session effect.
    "@/components/customer/CustomerShell": ({ children }) => children,
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      assert.ok(Object.hasOwn(modules, name), `Unexpected component import: ${name}`);
      return modules[name];
    },
    process: { env: { NEXT_PUBLIC_API_URL: "https://api.example.invalid" } },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem(key, value) {
        written.push([key, value]);
        storage.set(key, value);
      },
      removeItem(key) {
        removed.push(key);
        storage.delete(key);
      },
    },
    fetch(url, options) {
      const pending = deferred();
      requests.push({ url, options, ...pending });
      return pending.promise;
    },
  }, { filename });
  exports.default({ children: null });
  assert.equal(effects.length, 1, "Capture the layout's actual session effect");
  assert.equal(states.length, 3);
  const cleanup = effects[0]();
  assert.equal(typeof cleanup, "function");
  return { storage, removed, written, redirects, states, requests, cleanup, restart: effects[0] };
}

function assertNoUpdates(layout) {
  assert.deepEqual(layout.removed, []);
  assert.deepEqual(layout.written, []);
  assert.deepEqual(layout.redirects, []);
  assert.deepEqual(layout.states.map((state) => state.updates), [[], [], []]);
  assert.equal(layout.storage.get("navii_access_token"), token);
  assert.equal(layout.storage.get("navii_user"), savedProfile);
}

const failures = [
  ["network rejection", (request) => request.reject(new Error("Synthetic network failure"))],
  ["invalid session response", (request) => request.resolve({ ok: false, status: 401 })],
  ["missing user profile", (request) => request.resolve({ ok: true, json: async () => ({}) })],
  ["invalid response JSON", (request) => request.resolve({
    ok: true,
    json: async () => { throw new SyntaxError("Synthetic invalid JSON"); },
  })],
];

for (const [name, fail] of failures) {
  test(`cleanup ignores pending ${name} without clearing auth or redirecting`, async () => {
    const layout = mountLayout();
    assert.equal(layout.requests.length, 1);
    layout.cleanup();
    fail(layout.requests[0]);
    await settled();
    assertNoUpdates(layout);
  });

  test(`active ${name} still clears auth and redirects to login`, async () => {
    const layout = mountLayout();
    fail(layout.requests[0]);
    await settled();
    assert.deepEqual(layout.removed, ["navii_access_token", "navii_user"]);
    assert.equal(layout.storage.has("navii_access_token"), false);
    assert.equal(layout.storage.has("navii_user"), false);
    assert.deepEqual(layout.redirects, ["/login"]);
    assert.deepEqual(layout.written, []);
    assert.deepEqual(layout.states.map((state) => state.updates), [[], [], []]);
    layout.cleanup();
  });
}

test("active verification retains the token, caches the user and shows the dashboard", async () => {
  const layout = mountLayout();
  const request = layout.requests[0];
  assert.equal(request.url, "https://api.example.invalid/api/auth/me");
  assert.equal(request.options.method, "GET");
  assert.equal(request.options.headers.Authorization, `Bearer ${token}`);
  assert.equal(request.options.cache, "no-store");
  request.resolve(validResponse());
  await settled();
  assert.equal(layout.storage.get("navii_access_token"), token);
  assert.equal(layout.storage.get("navii_user"), JSON.stringify(profile));
  assert.deepEqual(layout.states.map((state) => state.value), [profile, false, token]);
  assert.deepEqual(layout.removed, []);
  assert.deepEqual(layout.redirects, []);
  layout.cleanup();
});

test("cleanup while the response body is pending ignores a late parsing failure", async () => {
  const layout = mountLayout();
  const body = deferred();
  layout.requests[0].resolve({ ok: true, json: () => body.promise });
  await settled();
  layout.cleanup();
  body.reject(new SyntaxError("Synthetic invalid JSON"));
  await settled();
  assertNoUpdates(layout);
});

test("cleanup ignores a late successful verification too", async () => {
  const layout = mountLayout();
  layout.cleanup();
  layout.requests[0].resolve(validResponse());
  await settled();
  assertNoUpdates(layout);
});

test("a cancelled effect cannot clear the session verified by its replacement", async () => {
  const layout = mountLayout();
  layout.cleanup();
  const cleanupReplacement = layout.restart();
  assert.equal(layout.requests.length, 2);
  layout.requests[1].resolve(validResponse());
  await settled();
  layout.requests[0].reject(new Error("Older synthetic request failed"));
  await settled();
  assert.equal(layout.storage.get("navii_access_token"), token);
  assert.equal(layout.storage.get("navii_user"), JSON.stringify(profile));
  assert.deepEqual(layout.states.map((state) => state.updates), [[profile], [false], [token]]);
  assert.deepEqual(layout.removed, []);
  assert.deepEqual(layout.redirects, []);
  cleanupReplacement();
});

test("a missing token still redirects without requesting a profile", async () => {
  const layout = mountLayout({ hasToken: false });
  await settled();
  assert.deepEqual(layout.requests, []);
  assert.deepEqual(layout.redirects, ["/login"]);
  layout.cleanup();
});


test("late successful verification never binds a replacement token to the old profile", async () => {
  const layout = mountLayout();
  layout.storage.set("navii_access_token", "replacement-synthetic-token");
  layout.requests[0].resolve(validResponse());
  await settled();
  assert.deepEqual(layout.states.map(state => state.updates), [[], [], []]);
  assert.equal(layout.storage.get("navii_access_token"), "replacement-synthetic-token");
});


test("late failed verification never clears a replacement session", async () => {
  const layout = mountLayout();
  layout.storage.set("navii_access_token", "replacement-synthetic-token");
  layout.requests[0].reject(new Error("old request failed"));
  await settled();
  assert.deepEqual(layout.removed, []);
  assert.deepEqual(layout.written, []);
  assert.deepEqual(layout.redirects, []);
  assert.deepEqual(layout.states.map(state => state.updates), [[], [], []]);
  assert.equal(layout.storage.get("navii_access_token"), "replacement-synthetic-token");
});
