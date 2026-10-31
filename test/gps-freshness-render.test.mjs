import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { beforeEach, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = new URL('../', import.meta.url).href;
const state = { React };
globalThis.__panelTests = state;
const moduleUrl = source => 'data:text/javascript,' + encodeURIComponent(source);
const hooksMock = moduleUrl(`
const s = globalThis.__panelTests;
export const useState = initial => {
  const index = s.cursor++;
  if (!(index in s.values)) s.values[index] = typeof initial === 'function' ? initial() : initial;
  return [s.values[index], value => { s.values[index] = typeof value === 'function' ? value(s.values[index]) : value; }];
};
export const useRef = value => ({ current: value });
export const useCallback = callback => callback;
export const useMemo = factory => factory();
export const useEffect = effect => { s.effects.push(effect); };
export const useSyncExternalStore = (subscribe, snapshot) => { s.subscriptions.push(subscribe); return snapshot(); };
`);
const mocked = new Map([
  ['next/link', moduleUrl(`export default function Link(props) { return globalThis.__panelTests.React.createElement('a', { href: props.href }, props.children); }`)],
  ['next/navigation', moduleUrl(`export const useParams = () => ({ id: 'v-2' }); export const useRouter = () => ({ replace() {} });`)],
  ['@/components/auth/RoleRouteGuard', moduleUrl(`export default props => props.children;`)],
  // These tests retain the actual legacy admin dashboard. Customer UI is browser-tested separately.
  ['@/components/customer/CustomerSession', moduleUrl(`export const useCustomerSession = () => null;`)],
  ['@/components/customer/CustomerHome', moduleUrl(`export default function CustomerHome() { throw new Error('Legacy dashboard must not render customer Home'); }`)],
  ['@/hooks/use-tracking-now', moduleUrl(`export const useTrackingNow = () => globalThis.__panelTests.now;`)],
  ['@/hooks/use-visible-poll', moduleUrl(`export const useVisiblePoll = () => ({ refresh() {}, pending: false, initialLoading: false });`)],
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

mocked.set('leaflet', moduleUrl(`export default { divIcon: props => props };`));
mocked.set('react-leaflet', moduleUrl(`
const wrapper = props => props.children;
export const MapContainer = wrapper, TileLayer = () => null, Marker = wrapper, Popup = wrapper, Polyline = () => null;
export const useMap = () => ({});
`));
const { default: Dashboard } = await import('../app/dashboard/page.tsx');
const { default: Vehicles } = await import('../app/dashboard/vehicles/page.tsx');
const { default: Detail } = await import('../app/dashboard/vehicles/[id]/page.tsx');
const { default: Tracking } = await import('../components/tracking/LiveTrackingMap.tsx');
const { default: DeviceSetup } = await import('../app/dashboard/device-setup/page.tsx');
const { useTrackingNow } = await import('../hooks/use-tracking-now.ts');
const now = Date.parse('2026-10-24T16:52:49.971Z');
const fresh = new Date(now - 1000).toISOString();
const vehicle = { id: 'v-2', vehicleNo: 'SYNTHETIC', name: 'Test', latitude: 30, longitude: 76,
  status: 'MOVING', speed: 35, ignition: true, battery: 12.3, lastUpdate: fresh,
  device: { id: 'd-2', imei: 'synthetic', isActive: true, lastSeenAt: fresh } };
const screens = [
  [Dashboard, v => [[v], false, null, null]],
  [Vehicles, v => [[v], [], [], { role: 'CUSTOMER' }, false]],
  [Detail, v => [v, [], null, null, null]],
  [Tracking, v => [[v], 'v-2', { vehicleId: 'v-2', points: [] }, null, null, null, true]],
];
function render(Component, values) {
  state.cursor = 0; state.values = values; state.effects = [];
  return renderToStaticMarkup(React.createElement(Component));
}
beforeEach(() => Object.assign(state, { now, cursor: 0, values: [], effects: [], subscriptions: [] }));

test('all four real screens hide stale speed even while the device communicates', () => {
  for (const [Component, values] of screens) {
    const html = render(Component, values({ ...vehicle, lastUpdate: '2026-10-24T14:16:29Z' }));
    assert.match(html, /Awaiting GPS/);
    assert.match(html, /Unavailable/);
    assert.doesNotMatch(html, /35\.0 km\/h|12\.300 V|>ON</);
  }
});
test('all four screens retain measured zero and suppress disabled-device telemetry', () => {
  for (const [Component, values] of screens) {
    assert.match(render(Component, values({ ...vehicle, speed: 0, ignition: false })), /0\.0 km\/h/);
    const disabled = render(Component, values({ ...vehicle, device: { ...vehicle.device, isActive: false } }));
    assert.doesNotMatch(disabled, /35\.0 km\/h/);
  }
});
test('device setup renders stale GPS separately from recent contact and explains both windows', () => {
  const originalNow = Date.now;
  try {
    Date.now = () => now;
    const setupDevice = { ...vehicle.device, model: 'Synthetic test', simNumber: null,
      vehicle: { ...vehicle, lastUpdate: new Date(now - 5 * 60_000).toISOString() } };
    const stale = render(DeviceSetup, [[setupDevice]]);
    assert.match(stale, />Connected</);
    assert.match(stale, />Awaiting GPS</);
    assert.match(stale, />GPS stale</);
    assert.doesNotMatch(stale, />Live<|>GPS current</);
    assert.match(stale, /Connection stays current for 10 minutes; GPS fixes for 2 minutes/);
    const current = render(DeviceSetup, [[{ ...setupDevice, vehicle: { ...setupDevice.vehicle, lastUpdate: fresh } }]]);
    assert.match(current, />Live</);
    assert.match(current, />GPS current</);
    const disabled = render(DeviceSetup, [[{ ...setupDevice, isActive: false }]]);
    assert.match(disabled, />Disabled</);
    assert.doesNotMatch(disabled, />Live</);
  } finally { Date.now = originalNow; }
});
test('last known marker and timestamp remain visible without presenting stale speed as live', () => {
  const html = render(Tracking, screens[3][1]({ ...vehicle, lastUpdate: '2026-10-24T14:16:29Z' }));
  assert.match(html, /Last known location/);
  assert.match(html, /Last GPS fix/);
  assert.match(html, /Last communication/);
  assert.match(html, /30\.000000/);
  assert.match(html, /76\.000000/);
});
test('history retains original historical speed when current telemetry is stale', () => {
  const point = { id: 'p', latitude: 30, longitude: 76, speed: 35, ignition: true, battery: 12.3, recordedAt: fresh };
  const html = render(Detail, [{ ...vehicle, lastUpdate: '2026-10-24T14:16:29Z' }, [point], null, null, null]);
  assert.match(html, /Unavailable/);
  assert.match(html, /35/);
  assert.match(html, /History/);
});
test('freshness clock advances without a response and cancels its interval on unmount', () => {
  let callback; let cleared;
  globalThis.window = {
    setInterval(fn, ms) { callback = fn; assert.equal(ms, 5000); return 7; },
    clearInterval(id) { cleared = id; },
  };
  const originalNow = Date.now;
  try {
    Date.now = () => now;
    assert.equal(useTrackingNow(), now);
    const cleanup = state.effects[0]();
    Date.now = () => now + 700_000;
    callback(); state.cursor = 0;
    assert.equal(useTrackingNow(), now + 700_000);
    cleanup(); assert.equal(cleared, 7);
  } finally { Date.now = originalNow; delete globalThis.window; }
});
