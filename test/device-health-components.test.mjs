import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { beforeEach, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = new URL('../', import.meta.url).href;
const state = { React };
globalThis.__healthTests = state;
const moduleUrl = source => 'data:text/javascript,' + encodeURIComponent(source);
const hooksMock = moduleUrl(`
const s = globalThis.__healthTests;
export const useState = initial => {
  const index = s.cursor++;
  if (!(index in s.values)) s.values[index] = typeof initial === 'function' ? initial() : initial;
  return [s.values[index], value => { s.values[index] = typeof value === 'function' ? value(s.values[index]) : value; }];
};
export const useRef = value => { const index = s.cursor++; if (!(index in s.values)) s.values[index] = { current: value }; return s.values[index]; };
export const useCallback = callback => callback;
export const useMemo = factory => factory();
export const useEffect = effect => { s.effects.push(effect); };
export const useSyncExternalStore = (subscribe, snapshot) => { s.subscriptions.push(subscribe); return snapshot(); };
`);
const mocked = new Map([
  ['next/link', moduleUrl(`export default function Link(props) { return globalThis.__healthTests.React.createElement('a', { href: props.href }, props.children); }`)],
  ['next/navigation', moduleUrl(`export const useParams = () => ({ id: 'v-2' }); export const useRouter = () => ({ replace() {} });`)],
  ['@/components/auth/RoleRouteGuard', moduleUrl(`export default props => props.children;`)],
  ['@/hooks/use-tracking-now', moduleUrl(`export const useTrackingNow = () => globalThis.__healthTests.now;`)],
]);
registerHooks({
  resolve(specifier, context, next) {
    const local = context.parentURL?.startsWith(root) && !context.parentURL.includes('/node_modules/');
    if (specifier === 'react' && local) return { url: hooksMock, shortCircuit: true };
    if (mocked.has(specifier)) return { url: mocked.get(specifier), shortCircuit: true };
    if (specifier.startsWith('@/') || local && specifier.startsWith('.')) {
      const base = specifier.startsWith('@/') ? new URL('../' + specifier.slice(2), import.meta.url) : new URL(specifier, context.parentURL);
      const url = ['', '.ts', '.tsx'].map(ext => new URL(base.href + ext)).find(url => /\.tsx?$/.test(url.href) && existsSync(url));
      if (url) return { url: url.href, shortCircuit: true };
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith(root) && !url.includes('/node_modules/') && /\.tsx?$/.test(url)) return {
      format: 'module', shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText,
    };
    return next(url, context);
  },
});
const { default: HealthView } = await import('../components/device-health/DeviceHealthView.tsx');
const { useDeviceHealth: readHealthHook } = await import('../hooks/use-device-health.ts');
const now = Date.parse('2026-10-07T10:00:00Z');
const time = delta => new Date(now + delta).toISOString();
const device = { id: 'd-2', model: 'GX3', imei: null, terminalId: '000123456789', isActive: true, lastSeenAt: time(-1000), vehicle: { id: 'v-2', vehicleNo: 'SYNTHETIC-2', companyId: 'company-1', dealerId: 'dealer-1', customerId: 'c-2', latitude: 30, longitude: 76, lastUpdate: time(-1000) } };
const active = { vehicleId: 'v-2', status: 'ACTIVE', startDate: time(-1000), endDate: time(30 * 86400000) };
const snapshot = { devices: [device], evidence: { role: 'ADMIN', subscriptions: [active], operationalIds: ['v-2'] }, checkedAt: now, warnings: [] };
const render = (data = snapshot, filter = 'all', query = '') => renderToStaticMarkup(React.createElement(HealthView, { snapshot: data, now, filter, query, onFilter() {}, onQuery() {} }));
const flush = async () => { for (let i = 0; i < 8; i++) await new Promise(resolve => setImmediate(resolve)); };
let token, events, timers, intervals;
const response = (data, status = 200) => new Response(JSON.stringify({ success: true, data }), { status });
function api(url) {
  const path = new URL(url).pathname;
  return Promise.resolve(response({ '/api/auth/me': { id: 'u', role: 'ADMIN', companyId: 'company-1' }, '/api/gps/device-management': [device], '/api/gps/billing/subscriptions': [active], '/api/gps/latest': [{ id: 'v-2' }] }[path]));
}
const hook = () => { state.cursor = 0; return readHealthHook(); };
beforeEach(() => {
  Object.assign(state, { now, cursor: 0, values: [], effects: [], subscriptions: [] });
  token = 'synthetic-token'; events = new Map(); timers = new Set(); intervals = new Set();
  globalThis.localStorage = { getItem: () => token };
  globalThis.document = { visibilityState: 'visible' };
  globalThis.window = {
    setTimeout(callback) { timers.add(callback); return callback; }, clearTimeout(callback) { timers.delete(callback); },
    setInterval(callback) { intervals.add(callback); return callback; }, clearInterval(callback) { intervals.delete(callback); },
    addEventListener(name, callback) { events.set(name, callback); }, removeEventListener(name) { events.delete(name); },
  };
  globalThis.fetch = api;
});

test('health cards render scoped identity, exact timestamps and no fake live/SIM claims', () => {
  const html = render();
  assert.match(html, /Administrator-scoped devices/);
  assert.match(html, /Terminal ID: 000123456789/);
  assert.match(html, /Last communication/);
  assert.match(html, /Last GPS timestamp/);
  assert.match(html, /dateTime="2026-10-07T09:59:59.000Z"/);
  assert.match(html, /Customer login visibility.*separate verification/);
  assert.match(html, /SIM validity.*not provided/);
  assert.doesNotMatch(html, /sms:|tel:|Send SMS|Reset device|healthy SIM/);
});
test('map link keeps exact scoped vehicle; dealer gets no management link from expired own row', () => {
  assert.match(render(), /href="\/dashboard\/live-tracking\?vehicleId=v-2"/);
  const data = { ...snapshot, evidence: { role: 'DEALER', subscriptions: [{ ...active, endDate: time(-1) }], operationalIds: [] } };
  const html = render(data);
  assert.match(html, /Other account records may exist/);
  assert.doesNotMatch(html, /Open map|Review subscriptions/);
  assert.doesNotMatch(html, /href="\/dashboard\/vehicles\/v-2"/);
  assert.match(html, /href="\/dashboard\/device-setup"/);
});
test('partial evidence banner, filters and empty states do not imply a complete healthy fleet', () => {
  const html = render({ ...snapshot, warnings: ['Subscription records are unavailable.'], evidence: { role: 'ADMIN', subscriptions: null, operationalIds: null } });
  assert.match(html, /Some checks are unavailable/);
  assert.match(html, /Subscription access unconfirmed/);
  assert.match(html, /Tracking access unconfirmed/);
  assert.doesNotMatch(html, /Open map/);
  assert.match(render(snapshot, 'all', 'absent'), /No devices match these filters/);
  assert.match(render({ ...snapshot, devices: [] }), /No devices returned in this account/);
});
test('rendered connected but stale GPS queue provides diagnosis and safe next steps', () => {
  const html = render({ ...snapshot, devices: [{ ...device, vehicle: { ...device.vehicle, lastUpdate: time(-700000) } }] });
  assert.match(html, /Connected without a current GPS fix/);
  assert.match(html, /check device placement or sky view/);
  assert.match(html, /Device setup/);
  assert.doesNotMatch(html, /SIM expired|Offline for/);
});
test('hook authenticates once, refreshes without overlap and cleans up on unmount', async () => {
  let calls = 0;
  fetch = async (...args) => { calls++; return api(...args); };
  let value = hook(); const cleanup = state.effects[0]();
  value.refresh(); value.refresh();
  await flush(); value = hook();
  assert.equal(calls, 4); assert.ok(value.snapshot); assert.equal(value.refreshing, false);
  value.refresh(); await flush(); assert.equal(calls, 8);
  cleanup(); assert.equal(intervals.size, 0); assert.equal(events.size, 0); assert.equal(timers.size, 0);
});
test('hook clears prior queue on permission loss and failed refresh', async () => {
  hook(); const cleanup = state.effects[0](); await flush(); assert.ok(hook().snapshot);
  fetch = async () => response(null, 403);
  hook().refresh(); await flush();
  assert.equal(hook().snapshot, null); assert.equal(hook().error.code, 'forbidden');
  cleanup();
});
test('session change cancels old request; late old account cannot overwrite new data', async () => {
  let release;
  fetch = () => new Promise(resolve => { release = resolve; });
  hook(); const cleanup = state.effects[0]();
  token = 'new-account'; fetch = api; events.get('storage')({ key: 'navii_access_token' });
  await flush(); assert.ok(hook().snapshot); assert.equal(hook().refreshing, false);
  release(response({ id: 'old', role: 'ADMIN' })); await flush();
  assert.ok(hook().snapshot); assert.equal(hook().error, null); assert.equal(hook().refreshing, false);
  cleanup();
});
test('timeout clears data and exposes retry; unmount ignores a late reply', async () => {
  let reject, signal;
  fetch = (_url, options) => new Promise((_resolve, fail) => { reject = fail; signal = options.signal; });
  hook(); const cleanup = state.effects[0]();
  [...timers][0](); assert.equal(signal.aborted, true); reject(new Error('aborted')); await flush();
  assert.equal(hook().snapshot, null); assert.match(hook().error.message, /timed out/); assert.equal(hook().refreshing, false);
  cleanup();
});
test('missing session never calls any data API; hidden tabs do not poll', async () => {
  token = null; let calls = 0; fetch = async (...args) => { calls++; return api(...args); };
  hook(); const cleanup = state.effects[0](); await flush();
  assert.equal(calls, 0); assert.equal(hook().error.code, 'unauthorized');
  token = 'again'; document.visibilityState = 'hidden'; [...intervals][0](); await flush(); assert.equal(calls, 0);
  document.visibilityState = 'visible'; [...intervals][0](); await flush(); assert.equal(calls, 4);
  cleanup();
});
test('same-tab token change during an in-flight read cannot expose the previous account snapshot', async () => {
  let release;
  fetch = (url, options) => new URL(url).pathname === '/api/auth/me' ? new Promise(resolve => { release = resolve; }) : api(url, options);
  hook(); const cleanup = state.effects[0]();
  token = 'new-account-without-storage-event';
  release(response({ id: 'u', role: 'ADMIN', companyId: 'company-1' })); await flush();
  assert.equal(hook().snapshot, null); assert.match(hook().error.message, /account changed/);
  cleanup();
});
test('unmount discards a successful late read and removes every scheduled callback', async () => {
  let release;
  fetch = (url, options) => new URL(url).pathname === '/api/auth/me' ? new Promise(resolve => { release = resolve; }) : api(url, options);
  hook(); const cleanup = state.effects[0](); cleanup();
  release(response({ id: 'u', role: 'ADMIN', companyId: 'company-1' })); await flush();
  assert.equal(hook().snapshot, null); assert.equal(events.size, 0); assert.equal(intervals.size, 0); assert.equal(timers.size, 0);
});
