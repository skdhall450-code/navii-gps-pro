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
  ['@/hooks/use-tracking-now', moduleUrl(`export const useTrackingNow = () => globalThis.__panelTests.now;`)],
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
const { default: VehicleDetails } = await import('../app/dashboard/vehicles/[id]/page.tsx');
const { default: Readiness } = await import('../components/tracking/CustomerReadiness.tsx');
const { useVehicleSelection } = await import('../hooks/use-vehicle-selection.ts');
const now = Date.parse('2026-10-07T10:00:00Z');
const recent = new Date(now - 1000).toISOString();
const stale = new Date(now - 600001).toISOString();
const device = { id: 'd-2', imei: null, terminalId: '000123456789', model: 'GX3', simNumber: null, isActive: true, lastSeenAt: recent };
const vehicle = { id: 'v-2', vehicleNo: 'SYNTHETIC-2', name: 'Fixture only', status: 'MOVING', latitude: 30, longitude: 76, lastUpdate: recent, speed: 47, ignition: true, battery: 12.3, device };
function detail(patch = {}) {
  state.cursor = 0;
  state.values = [{ ...vehicle, ...patch }, [], false, false, null, null];
  return renderToStaticMarkup(React.createElement(VehicleDetails));
}
function makeWindow(search) {
  const events = new Map();
  const entries = [new URL('https://example.test/dashboard/live-tracking' + search)];
  let index = 0;
  const window = {
    get location() { return entries[index]; },
    addEventListener(event, callback) { if (!events.has(event)) events.set(event, new Set()); events.get(event).add(callback); },
    removeEventListener(event, callback) { events.get(event)?.delete(callback); },
    dispatchEvent(event) { for (const callback of events.get(event.type) ?? []) callback(); },
    history: {
      state: { nextState: 'preserved' },
      replaceState(state, _, url) { assert.equal(state.nextState, 'preserved'); entries[index] = new URL(url); },
      pushState(state, _, url) { assert.equal(state.nextState, 'preserved'); entries.splice(++index); entries.push(new URL(url)); },
      back() { if (index) { index--; window.dispatchEvent(new Event('popstate')); } },
      forward() { if (index + 1 < entries.length) { index++; window.dispatchEvent(new Event('popstate')); } },
    },
  };
  return window;
}
beforeEach(() => Object.assign(state, { now, cursor: 0, values: [], effects: [], subscriptions: [] }));

test('rendered detail hides stale GPS telemetry despite fresh communication; identity stays terminal-only', () => {
  const html = detail({ lastUpdate: stale });
  assert.match(html, /Connection: Connected/);
  assert.match(html, /Awaiting GPS/);
  assert.match(html, /Last known location/);
  assert.match(html, /Last communication/);
  assert.match(html, /Last GPS fix/);
  assert.match(html, /Terminal ID/);
  assert.match(html, /000123456789/);
  assert.doesNotMatch(html, /47\.0 km\/h|12\.300 V|>ON<|NTCB \/ FLEX|Port 5001/);
  assert.match(html, /JT\/T808-2013 binary TCP/);
});
test('detail keeps exact vehicle in all map/history links', () => {
  const html = detail();
  assert.equal((html.match(/href="\/dashboard\/live-tracking\?vehicleId=v-2"/g) ?? []).length, 2);
  assert.equal((html.match(/href="\/dashboard\/history\?vehicleId=v-2"/g) ?? []).length, 2);
  assert.match(html, /47\.0 km\/h/);
  assert.match(html, /12\.300 V/);
});
test('rendered detail suppresses telemetry for missing fix, offline, disabled, or missing device', () => {
  for (const patch of [{ latitude: null }, { lastUpdate: null }, { device: { ...device, lastSeenAt: stale } }, { device: { ...device, isActive: false } }, { device: null }]) {
    const html = detail(patch);
    assert.match(html, /Current telemetry unavailable/);
    assert.doesNotMatch(html, /47\.0 km\/h|12\.300 V|>ON</);
  }
});
test('rendered customer checklist never declares customer login verified from admin visibility', () => {
  const html = renderToStaticMarkup(React.createElement(Readiness, { device: { ...device, vehicle: { ...vehicle, customerId: 'c-2' } }, now, evidence: { role: 'ADMIN', subscriptions: [{ vehicleId: 'v-2', status: 'ACTIVE', startDate: recent, endDate: new Date(now + 60000).toISOString() }], operationalIds: ['v-2'] } }));
  assert.match(html, /6\. Customer visibility: Not confirmed/);
  assert.match(html, /does not prove customer access/);
  assert.match(html, /Review subscriptions/);
});
test('dealer checklist has no subscription management action or false negative for missing scope', () => {
  const html = renderToStaticMarkup(React.createElement(Readiness, { device: { ...device, vehicle }, now, evidence: { role: 'DEALER', subscriptions: [], operationalIds: [] } }));
  assert.match(html, /5\. Active subscription: Not confirmed/);
  assert.doesNotMatch(html, /Review subscriptions/);
});
test('real selection hook preserves explicit vehicle through list refresh, Back and Forward', () => {
  globalThis.window = makeWindow('?vehicleId=v-2');
  const vehicles = [{ id: 'v-1' }, { id: 'v-2' }];
  let selection = useVehicleSelection(vehicles);
  assert.equal(selection.selectedVehicleId, 'v-2');
  selection.setSelectedVehicleId('v-1');
  assert.equal(useVehicleSelection(vehicles).selectedVehicleId, 'v-1');
  window.history.back();
  assert.equal(useVehicleSelection([...vehicles].reverse()).selectedVehicleId, 'v-2');
  window.history.forward();
  assert.equal(useVehicleSelection(vehicles).selectedVehicleId, 'v-1');
});
test('selection hook does not choose first vehicle for unauthorized query or write unscoped selections', () => {
  globalThis.window = makeWindow('?vehicleId=private');
  const result = useVehicleSelection([{ id: 'v-1' }, { id: 'v-2' }]);
  assert.equal(result.selectedVehicleId, '');
  assert.equal(result.selectionUnavailable, true);
  for (const effect of state.effects) effect();
  result.setSelectedVehicleId('another-private');
  assert.equal(window.location.search, '?vehicleId=private');
});
test('selection hook stores only the first default selection, then list order cannot reset it', () => {
  globalThis.window = makeWindow('');
  assert.equal(useVehicleSelection([{ id: 'v-2' }, { id: 'v-1' }]).selectedVehicleId, 'v-2');
  for (const effect of state.effects) effect();
  assert.equal(window.location.search, '?vehicleId=v-2');
  assert.equal(useVehicleSelection([{ id: 'v-1' }, { id: 'v-2' }]).selectedVehicleId, 'v-2');
});
test('selection hook subscribes to and cleans up browser navigation events', () => {
  globalThis.window = makeWindow('?vehicleId=v-2');
  useVehicleSelection([{ id: 'v-2' }]);
  let updates = 0;
  const cleanup = state.subscriptions[0](() => { updates++; });
  window.dispatchEvent(new Event('popstate'));
  window.dispatchEvent(new Event('navii-vehicle-selection'));
  assert.equal(updates, 2);
  cleanup();
  window.dispatchEvent(new Event('popstate'));
  assert.equal(updates, 2);
});
test('repeated selection of the current vehicle does not add duplicate Back entries', () => {
  globalThis.window = makeWindow('?vehicleId=v-2');
  const vehicles = [{ id: 'v-1' }, { id: 'v-2' }];
  useVehicleSelection(vehicles).setSelectedVehicleId('v-1');
  useVehicleSelection(vehicles).setSelectedVehicleId('v-1');
  window.history.back();
  assert.equal(useVehicleSelection(vehicles).selectedVehicleId, 'v-2');
});
test('invalid coordinates never render as an actual last location', () => {
  const html = detail({ latitude: 91, longitude: 181 });
  assert.doesNotMatch(html, /91\.000000|181\.000000|>91<|>181</);
});
