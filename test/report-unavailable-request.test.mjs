import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as helpers from '../lib/report-workspace.ts';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../components/reports/ReportsWorkspace.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {
  module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
}}).outputText;
const filters = {vehicleId: 'synthetic-vehicle', fromLocal: '2026-10-11T00:00', toLocal: '2026-10-12T00:00', timezone: 'UTC', preset: 'CUSTOM', kind: 'ACTIVITY'};
const vehicle = {id: filters.vehicleId, vehicleNo: 'SYNTHETIC-ONLY', name: null};

// Exercise the real async submit closure with isolated fetch/storage and React hooks.
// This is handler plus static-render coverage, not browser or backend authorization QA.
function harness(response) {
  const states = [[vehicle], false, filters, null, false, '', '', 0, ''];
  const refs = [{current: null}, {current: 0}];
  const requests = [];
  const redirects = [];
  let stateIndex = 0, refIndex = 0, idIndex = 0;
  const hooks = {...React,
    // Direct invocation has no React dispatcher; IDs stay stable across tree() calls.
    // Real useId and repeated-instance uniqueness are covered by the SSR render tests.
    useId: () => `synthetic-report-${idIndex++}`,
    useState(initial) {
      const index = stateIndex++;
      if (index >= states.length) states[index] = initial;
      return [states[index], next => { states[index] = typeof next === 'function' ? next(states[index]) : next; }];
    },
    useRef: () => refs[refIndex++],
    useEffect: () => {},
    useCallback: callback => callback,
  };
  const overrides = {react: hooks, 'next/navigation': {useRouter: () => ({replace: path => redirects.push(path)})}, '@/lib/report-workspace': helpers};
  const compiledModule = {exports: {}};
  new Function('require', 'module', 'exports', 'fetch', 'localStorage', compiled)(
    id => overrides[id] ?? require(id), compiledModule, compiledModule.exports,
    async (url, options) => {
      requests.push({url, options});
      return typeof response === 'function' ? response(requests.length - 1) : response;
    },
    {getItem: key => key === 'navii_access_token' ? 'synthetic-test-only' : null},
  );
  function tree() { stateIndex = 0; refIndex = 0; idIndex = 0; return compiledModule.exports.default(); }
  function find(node, type) {
    if (!node || typeof node !== 'object') return null;
    if (node.type === type) return node;
    for (const child of React.Children.toArray(node.props?.children)) {
      const match = find(child, type);
      if (match) return match;
    }
    return null;
  }
  return {
    states, requests, redirects,
    async submit() { await find(tree(), 'form').props.onSubmit({preventDefault() {}}); },
    html: () => renderToStaticMarkup(tree()),
  };
}

test('activity history HTTP 503 is unavailable, not an empty report or export', async () => {
  const message = 'Vehicle activity history is unavailable because historical ownership cannot be verified.';
  const app = harness({status: 503, ok: false, json: async () => ({success: false, status: 'unavailable', message})});
  await app.submit();
  assert.equal(app.requests.length, 1);
  const request = app.requests[0];
  assert.match(request.url, /\/api\/gps\/reports\/v2\/trip\/synthetic-vehicle\?/);
  assert.equal(new URL(request.url).searchParams.get('alertContract'), null);
  assert.equal(request.options.cache, 'no-store');
  assert.equal(app.states[3], null);
  assert.equal(app.states[4], false);
  const html = app.html();
  assert.ok(html.includes(message));
  assert.match(html, /role="alert"/);
  assert.doesNotMatch(html, /aria-label="Generated report"|Download CSV|Print summary|Activity coverage complete|No recorded data in this period|0\.00 km/);
});

function activityReport(marker = 1) {
  return {
    definitionsVersion: '2026-10-11', vehicle,
    period: {from: '2026-10-11T00:00:00.000Z', to: '2026-10-12T00:00:00.000Z'},
    summary: {totalPoints: 1, totalDistanceKm: marker, maxSpeedKph: 10, averageSpeedKph: null, runningSeconds: 0, idleSeconds: 0, parkedSeconds: 0, unknownSeconds: 0},
    coverage: {requestedSeconds: 86400, coveredSeconds: 1, unobservedSeconds: 86399, coveragePercent: 0.001, complete: false, dataComplete: true, distanceComplete: false, distanceObservedSeconds: 1, truncated: false, pathTruncated: false, pointLimit: 20000, firstRecordedAt: null, lastRecordedAt: null, gapCount: 0, gapSeconds: 0, distanceRejectedSegments: 0},
    positions: [{id: `synthetic-position-${marker}`, latitude: 28, longitude: 77, speed: 10, ignition: null, battery: null, recordedAt: '2026-10-11T00:00:00.000Z'}],
  };
}
const success = marker => ({status: 200, ok: true, json: async () => ({success: true, data: activityReport(marker)})});
const denial = (status, code) => ({status, ok: false, json: async () => ({success: false, status: 'unavailable', code, message: 'Synthetic historical ownership unavailable'})});
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return {promise, resolve}; }
function assertCleared(app) {
  assert.equal(app.states[3], null);
  assert.doesNotMatch(app.html(), /aria-label="Generated report"|Download CSV|Print summary|Recorded positions|The earlier report remains below/);
}

for (const [status, code] of [[401, undefined], [403, undefined], [503, 'LEGACY_ALERT_OWNERSHIP_UNVERIFIABLE'], [503, 'POSITION_HISTORY_OWNERSHIP_UNVERIFIABLE']]) {
  test(`active ${status} ${code ?? 'authorization denial'} clears prior successful history and export`, async () => {
    const app = harness(index => index === 0 ? success(1) : denial(status, code));
    await app.submit();
    assert.match(app.html(), /Download CSV/);
    await app.submit();
    assertCleared(app);
    assert.deepEqual(app.redirects, status === 401 ? ['/login'] : []);
  });

  test(`stale ${status} ${code ?? 'authorization denial'} cannot clear a newer success or redirect`, async () => {
    const delayed = deferred();
    const app = harness(index => index === 0 ? delayed.promise : success(2));
    const oldRequest = app.submit();
    await app.submit();
    const current = app.states[3];
    delayed.resolve(denial(status, code));
    await oldRequest;
    assert.equal(app.states[3], current);
    assert.equal(app.states[3].activity.summary.totalDistanceKm, 2);
    assert.equal(app.states[5], '');
    assert.deepEqual(app.redirects, []);
    assert.match(app.html(), /Download CSV/);
  });
}

for (const [status, code] of [[403, undefined], [503, 'LEGACY_ALERT_OWNERSHIP_UNVERIFIABLE'], [503, 'POSITION_HISTORY_OWNERSHIP_UNVERIFIABLE']]) {
  test(`stale ${status} body parsing cannot clear a newer success`, async () => {
    const body = deferred(), parsing = deferred();
    const app = harness(index => index === 0 ? {status, ok: false, json: () => { parsing.resolve(); return body.promise; }} : success(2));
    const oldRequest = app.submit();
    await parsing.promise;
    await app.submit();
    const current = app.states[3];
    body.resolve({success: false, code, message: 'Synthetic historical ownership unavailable'});
    await oldRequest;
    assert.equal(app.states[3], current);
    assert.equal(app.states[5], '');
    assert.deepEqual(app.redirects, []);
  });
}

test('a temporary 503 without ownership denial preserves and labels the earlier successful report', async () => {
  const app = harness(index => index === 0 ? success(1) : {status: 503, ok: false, json: async () => ({success: false, code: 'TEMPORARY_SOURCE_FAILURE', message: 'Synthetic temporary failure'})});
  await app.submit();
  const earlier = app.states[3];
  await app.submit();
  assert.equal(app.states[3], earlier);
  assert.match(app.html(), /Synthetic temporary failure.*The earlier report remains below/);
  assert.match(app.html(), /Download CSV/);
});

test('active403 clears prior history before parsing an unavailable body', async () => {
  const body = deferred(), parsing = deferred();
  const app = harness(index => index === 0 ? success(1) : {status: 403, ok: false, json: () => { parsing.resolve(); return body.promise; }});
  await app.submit();
  const denied = app.submit();
  await parsing.promise;
  assertCleared(app);
  body.resolve(null);
  await denied;
  assertCleared(app);
});

test('unavailable HTTP status cannot be turned into success by a success-shaped body', async () => {
  const app = harness({status: 503, ok: false, json: async () => ({success: true, data: {positions: [], summary: {totalDistanceKm: 0}}})});
  await app.submit();
  assert.equal(app.states[3], null);
  assert.match(app.html(), /Report could not be generated/);
  assert.doesNotMatch(app.html(), /aria-label="Generated report"|Download CSV|No recorded data in this period/);
});

test('unavailable activity response with no JSON still exposes no fabricated history', async () => {
  const app = harness({status: 503, ok: false, json: async () => { throw Error('Not JSON'); }});
  await app.submit();
  assert.equal(app.states[3], null);
  assert.match(app.html(), /Report could not be generated/);
  assert.doesNotMatch(app.html(), /aria-label="Generated report"|Download CSV|0\.00 km/);
});
