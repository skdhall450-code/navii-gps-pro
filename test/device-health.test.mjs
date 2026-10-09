import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';

registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.startsWith(new URL('../', import.meta.url).href) && specifier.startsWith('.')) {
      const base = new URL(specifier, context.parentURL);
      const url = ['.ts', '.tsx'].map(ext => new URL(base.href + ext)).find(existsSync);
      if (url) return { url: url.href, shortCircuit: true };
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith(new URL('../', import.meta.url).href) && /\.tsx?$/.test(url)) return {
      format: 'module', shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText,
    };
    return next(url, context);
  },
});
const { loadDeviceHealth, parseHealthDevices, deviceHealthRow, buildHealthRows, healthCounts, filterHealthRows, observationTime, DeviceHealthError } = await import('../lib/device-health.ts');
const now = Date.parse('2026-10-07T10:00:00Z');
const time = delta => new Date(now + delta).toISOString();
const device = { id: 'd-2', model: 'GX3', imei: null, terminalId: '000123456789', isActive: true, lastSeenAt: time(-1000), vehicle: { id: 'v-2', vehicleNo: 'SYNTHETIC-2', companyId: 'company-1', dealerId: 'dealer-1', customerId: 'c-2', latitude: 30, longitude: 76, lastUpdate: time(-1000) } };
const active = { vehicleId: 'v-2', status: 'ACTIVE', startDate: time(-1000), endDate: time(30 * 86400000) };
const evidence = { role: 'ADMIN', subscriptions: [active], operationalIds: ['v-2'] };
const categories = (patch = {}, ev = evidence) => deviceHealthRow({ ...device, ...patch }, ev, now).issues.map(issue => issue.category);
const response = (data, status = 200) => new Response(JSON.stringify({ success: true, data }), { status });
function mockRequest(overrides = {}) {
  const requests = [];
  const answers = { '/api/auth/me': { id: 'user-1', role: 'ADMIN', companyId: 'company-1' }, '/api/gps/device-management': [device], '/api/gps/billing/subscriptions': [active], '/api/gps/latest': [{ id: 'v-2' }], ...overrides };
  return { requests, fetch: async (url, options) => {
    const path = new URL(url).pathname;
    requests.push({ path, options });
    if (answers[path] instanceof Error) throw answers[path];
    if (answers[path] instanceof Response) return answers[path];
    return response(answers[path]);
  } };
}
const load = request => loadDeviceHealth('https://example.test/', { Authorization: 'Bearer synthetic' }, new AbortController().signal, request);

test('fully observed active terminal-only GX3 has no detected issue', () => assert.deepEqual(categories(), []));
test('offline uses heartbeat age, never a recent GPS timestamp', () => {
  assert.deepEqual(categories({ lastSeenAt: time(-600001) }), ['offline']);
  assert.deepEqual(categories({ lastSeenAt: time(-600000) }), []);
});
test('recent communication with stale, missing or invalid GPS is a GPS issue', () => {
  for (const patch of [{ lastUpdate: time(-600001) }, { lastUpdate: null }, { latitude: null }, { longitude: 181 }]) {
    assert.deepEqual(categories({ vehicle: { ...device.vehicle, ...patch } }), ['gps']);
  }
});
test('zero coordinates are valid; missing and disabled heartbeat are activation evidence', () => {
  assert.deepEqual(categories({ vehicle: { ...device.vehicle, latitude: 0, longitude: 0 } }), []);
  assert.deepEqual(categories({ lastSeenAt: null }), ['activation']);
  assert.deepEqual(categories({ isActive: false }), ['activation']);
});
test('invalid and future heartbeat are unknown, never a measured offline duration', () => {
  for (const timestamp of ['broken', time(60001)]) assert.deepEqual(categories({ lastSeenAt: timestamp }), ['unknown']);
  assert.deepEqual(categories({ lastSeenAt: time(60000) }), []);
  assert.match(observationTime(time(60001), now).label, /Future/);
  assert.equal(observationTime(time(60001), now).ageMs, null);
});
test('GPS future or invalid timestamp is explicitly unknown even while connected', () => {
  assert.deepEqual(categories({ vehicle: { ...device.vehicle, lastUpdate: 'broken' } }), ['gps', 'unknown']);
  assert.deepEqual(categories({ vehicle: { ...device.vehicle, lastUpdate: time(60001) } }), ['gps', 'unknown']);
});
test('missing customer is incomplete activation; omitted customer is unknown', () => {
  assert.deepEqual(categories({ vehicle: { ...device.vehicle, customerId: null } }), ['activation']);
  assert.deepEqual(categories({ vehicle: { ...device.vehicle, customerId: undefined } }), ['unknown']);
});
test('manager subscription diagnosis is date-based rather than trusting a stored status label', () => {
  assert.deepEqual(categories({}, { ...evidence, subscriptions: [{ ...active, status: 'EXPIRED' }] }), []);
  for (const subscription of [{ ...active, endDate: time(-1) }, { ...active, startDate: time(1) }, { ...active, status: 'SUSPENDED' }, { ...active, status: 'CANCELLED' }]) {
    assert.deepEqual(categories({}, { ...evidence, subscriptions: [subscription] }), ['subscription']);
  }
  assert.deepEqual(categories({}, { ...evidence, subscriptions: [] }), ['subscription']);
});
test('upcoming continuous renewal extends coverage but gaps and short renewals still need attention', () => {
  const soon = { ...active, endDate: time(86400000) };
  assert.deepEqual(categories({}, { ...evidence, subscriptions: [soon] }), ['subscription']);
  const renewal = { ...active, status: 'UPCOMING', startDate: soon.endDate };
  assert.deepEqual(categories({}, { ...evidence, subscriptions: [soon, renewal] }), []);
  assert.deepEqual(categories({}, { ...evidence, subscriptions: [soon, { ...renewal, startDate: time(86400001) }] }), ['subscription']);
  assert.deepEqual(categories({}, { ...evidence, subscriptions: [soon, { ...renewal, endDate: time(2 * 86400000) }] }), ['subscription']);
});
test('dealer operational access is positive evidence despite a narrower subscription list', () => {
  assert.deepEqual(categories({}, { ...evidence, role: 'DEALER', subscriptions: [] }), []);
  const issues = deviceHealthRow(device, { role: 'DEALER', subscriptions: [], operationalIds: [] }, now).issues;
  assert.ok(issues.every(item => item.category === 'unknown'));
  assert.ok(issues.some(item => /scope/.test(item.detail)));
});
test('dealer expired visible record means review only, never a definitive no-access claim', () => {
  const result = deviceHealthRow(device, { role: 'DEALER', subscriptions: [{ ...active, endDate: time(-1) }], operationalIds: [] }, now);
  assert.equal(result.issues[0].category, 'subscription');
  assert.match(result.issues[0].detail, /Other account records may exist/);
  assert.doesNotMatch(result.issues[0].title, /No current subscription/);
});
test('unavailable endpoints cannot silently turn unknown checks green', () => {
  assert.deepEqual(categories({}, { role: 'ADMIN', subscriptions: null, operationalIds: null }), ['unknown', 'unknown']);
  assert.deepEqual(categories({}, { ...evidence, operationalIds: [] }), ['unknown']);
});
test('timestamp labels contain observation age only and never a negative duration', () => {
  assert.equal(observationTime(null, now).kind, 'missing');
  assert.equal(observationTime('invalid', now).kind, 'invalid');
  assert.equal(observationTime(time(30000), now).label, 'Less than 1 minute ago');
  assert.equal(observationTime(time(-120000), now).label, '2 minutes ago');
  assert.equal(observationTime(time(-7200000), now).label, '2 hours ago');
  assert.equal(observationTime(time(-2 * 86400000), now).label, '2 days ago');
});
test('counts count devices once per category; filters and stable priority survive list refresh', () => {
  const offline = { ...device, id: 'd-offline', lastSeenAt: time(-600001), vehicle: { ...device.vehicle, vehicleNo: 'A' } };
  const activation = { ...device, id: 'd-activation', isActive: false, vehicle: { ...device.vehicle, customerId: null } };
  const snapshot = { devices: [device, activation, offline], evidence, checkedAt: now, warnings: [] };
  const rows = buildHealthRows(snapshot, now);
  assert.deepEqual(rows.map(row => row.device.id), ['d-offline', 'd-activation', 'd-2']);
  assert.deepEqual(healthCounts(rows), { all: 3, attention: 2, clear: 1, offline: 1, gps: 0, activation: 1, subscription: 0, unknown: 0 });
  assert.equal(filterHealthRows(rows, 'activation', '').length, 1);
  assert.equal(filterHealthRows(rows, 'attention', 'gx3').length, 2);
  assert.equal(filterHealthRows(rows, 'all', ' 000123456789 ').length, 3);
  assert.equal(filterHealthRows(rows, 'clear', 'SYNTHETIC').length, 1);
  assert.equal(filterHealthRows(rows, 'all', 'not-found').length, 0);
  assert.deepEqual(buildHealthRows({ ...snapshot, devices: [...snapshot.devices].reverse() }, now), rows);
});
test('parser rejects missing identity, duplicate records and non-boolean activity, preserves optional unknowns', () => {
  for (const value of [null, {}, [null], [{ ...device, id: '' }], [device, device], [{ ...device, isActive: 'true' }], [{ ...device, vehicle: null }]]) assert.equal(parseHealthDevices(value), null);
  const parsed = parseHealthDevices([{ ...device, vehicle: { id: 'v-2', vehicleNo: 'SYNTHETIC' } }]);
  assert.equal(parsed[0].vehicle.customerId, undefined);
  assert.equal(parsed[0].vehicle.latitude, null);
  assert.equal(parsed[0].simNumber, null);
});
test('loader verifies server role before all data reads, uses only authenticated uncached GETs', async () => {
  const request = mockRequest();
  const snapshot = await load(request.fetch);
  assert.equal(request.requests[0].path, '/api/auth/me');
  assert.equal(request.requests.length, 4);
  assert.equal(snapshot.devices.length, 1);
  assert.deepEqual(snapshot.warnings, []);
  for (const { options } of request.requests) {
    assert.equal(options.method, 'GET'); assert.equal(options.cache, 'no-store');
    assert.equal(options.headers.Authorization, 'Bearer synthetic'); assert.ok(options.signal);
    assert.equal(options.body, undefined);
  }
});
test('customer, forged/unknown role and invalid auth data fail closed before device reads', async () => {
  for (const me of [{ id: 'u', role: 'CUSTOMER' }, { id: 'u', role: 'USER' }, { id: 'u', role: 'ROOT' }, { role: 'ADMIN' }, null]) {
    const request = mockRequest({ '/api/auth/me': me });
    await assert.rejects(load(request.fetch), error => error instanceof DeviceHealthError && error.code === 'forbidden');
    assert.equal(request.requests.length, 1);
  }
});
test('device permission loss and malformed/partial list never become a clean empty queue', async () => {
  for (const value of [response(null, 403), null, [device, null], new Response(JSON.stringify({ success: true, count: 2, data: [device] }))]) {
    const request = mockRequest({ '/api/gps/device-management': value });
    await assert.rejects(load(request.fetch), error => error instanceof DeviceHealthError);
  }
});
test('optional unavailable or malformed data produces warnings and explicit null evidence', async () => {
  for (const subscriptionData of [response(null, 403), new Error('network'), [{ ...active, endDate: 'broken' }], [{ ...active, startDate: active.endDate }]]) {
    const request = mockRequest({ '/api/gps/billing/subscriptions': subscriptionData, '/api/gps/latest': [{}] });
    const snapshot = await load(request.fetch);
    assert.equal(snapshot.evidence.subscriptions, null);
    assert.equal(snapshot.evidence.operationalIds, null);
    assert.equal(snapshot.warnings.length, 2);
  }
});
test('session expiry on any endpoint invalidates the entire result', async () => {
  for (const path of ['/api/auth/me', '/api/gps/device-management', '/api/gps/billing/subscriptions', '/api/gps/latest']) {
    const request = mockRequest({ [path]: response(null, 401) });
    await assert.rejects(load(request.fetch), error => error.code === 'unauthorized');
  }
});
test('aborted requests cannot be downgraded into an apparently successful partial snapshot', async () => {
  const controller = new AbortController();
  const request = async () => { controller.abort(); throw new Error('aborted'); };
  await assert.rejects(loadDeviceHealth('https://example.test', {}, controller.signal, request), /aborted/);
});
test('current account scope rejects stale-token company or dealer records before displaying them', async () => {
  for (const [me, record] of [
    [{ id: 'u', role: 'ADMIN', companyId: 'company-new' }, device],
    [{ id: 'u', role: 'DEALER', companyId: 'company-1', dealerId: 'dealer-new' }, device],
    [{ id: 'u', role: 'DEALER', companyId: 'company-1' }, device],
    [{ id: 'u', role: 'ADMIN', companyId: 'company-1' }, { ...device, vehicle: { ...device.vehicle, companyId: undefined } }],
  ]) {
    const request = mockRequest({ '/api/auth/me': me, '/api/gps/device-management': [record] });
    await assert.rejects(load(request.fetch), error => error.code === 'forbidden');
  }
});
test('matched dealer and super-admin cross-company records are allowed, unrelated tracking ids are dropped', async () => {
  for (const me of [{ id: 'u', role: 'DEALER', companyId: 'company-1', dealerId: 'dealer-1' }, { id: 'u', role: 'SUPER_ADMIN' }]) {
    const request = mockRequest({ '/api/auth/me': me, '/api/gps/latest': [{ id: 'v-2' }, { id: 'outside-device-scope' }] });
    const result = await load(request.fetch);
    assert.equal(result.devices.length, 1);
    assert.deepEqual(result.evidence.operationalIds, ['v-2']);
  }
});
