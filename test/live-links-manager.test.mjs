import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), ts = require('../node_modules/typescript');
const jsx = (type, props) => ({ type, props });
function boot() {
  const values = [[{ id: 'v', vehicleNo: 'TEST' }], 'v', [], true, false, 1, true, false, '', '', null, Date.now()];
  let cursor = 0, resolveCreate;
  let storedToken = 'synthetic-jwt';
  const refs = [], effects = [], events = {};
  const react = {
    useState: initial => { const id = cursor++; if (!(id in values)) values[id] = initial; return [values[id], value => values[id] = typeof value === 'function' ? value(values[id]) : value]; },
    useRef: initial => { const ref = { current: initial }; refs.push(ref); return ref; },
    useEffect: fn => effects.push(fn), useCallback: fn => fn,
  };
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL('../app/dashboard/live-links/page.tsx', import.meta.url), 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require: name => name === 'react' ? react : name === 'react/jsx-runtime' ? { jsx, jsxs: jsx } : () => null, process: { env: {} }, window: { location: { origin: 'http://localhost' }, addEventListener: (name, fn) => events[name] = fn, removeEventListener() {} }, localStorage: { getItem: () => storedToken }, fetch: (url, options) => options?.method === 'POST' ? new Promise(resolve => resolveCreate = resolve) : Promise.resolve({ ok: true, json: async () => ({ success: true, data: { enabled: false } }) }), AbortController, Date, JSON, setInterval: () => 1, clearInterval() {}, encodeURIComponent });
  const page = exports.default(), manager = page.props.children;
  const tree = manager.type(); effects[0]();
  function find(node) {
    if (!node || typeof node !== 'object') return null;
    if (node.type === 'button' && node.props.children === 'Create link') return node;
    const children = node.props?.children;
    for (const child of Array.isArray(children) ? children : [children]) { const result = find(child); if (result) return result; }
    return null;
  }
  return { values, events, switchAccount: () => { storedToken = "another-synthetic-jwt"; }, create: find(tree).props.onClick, finish: () => resolveCreate({ ok: true, json: async () => ({ success: true, data: { id: 'l', vehicleId: 'v', token: 'nvl_' + 'a'.repeat(43), createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 3600000).toISOString(), revokedAt: null } }) }) };
}
test('create finishing after BFCache return cannot restore secret or leave busy', async () => {
  const s = boot(), pending = s.create(); s.events.pagehide(); s.events.pageshow(); s.finish(); await pending;
  assert.equal(s.values[10], null); assert.equal(s.values[7], false);
});
test('create finishing while hidden cannot restore secret; return resets busy', async () => {
  const s = boot(), pending = s.create(); s.events.pagehide(); s.finish(); await pending; s.events.pageshow();
  assert.equal(s.values[10], null); assert.equal(s.values[7], false);
});

test('account switch while creating rejects late old-account capability', async () => {
  const s = boot(), pending = s.create(); s.switchAccount(); s.finish(); await pending;
  assert.equal(s.values[10], null); assert.match(s.values[8], /account changed/);
});
test('cross-tab account change clears existing secret, vehicles and links', async () => {
  const s = boot(), pending = s.create(); s.finish(); await pending; assert.ok(s.values[10]);
  s.switchAccount(); s.events.storage();
  assert.equal(s.values[10], null); assert.equal(s.values[0].length, 0); assert.equal(s.values[2].length, 0); assert.equal(s.values[3], false);
});
