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
const { getTelemetry, getTrackingDetails, hasCoordinates, isFresh, FRESHNESS_MS } = await import('../lib/tracking-state.ts');
const { selectScopedVehicleId, vehicleTrackingHref } = await import('../lib/vehicle-navigation.ts');
const { getModelProtocol } = await import('../lib/device-protocol.ts');
const { customerReadiness, grantsGpsAccess, loadReadinessEvidence, UNKNOWN_READINESS } = await import('../lib/customer-readiness.ts');
const { deviceProgress } = await import('../lib/device-setup.ts');
const now = Date.parse('2026-10-07T10:00:00Z');
const fresh = new Date(now - 1_000).toISOString();
const stale = new Date(now - FRESHNESS_MS - 1).toISOString();
const vehicle = { id: 'v-2', latitude: 30, longitude: 76, lastUpdate: fresh, speed: 42, ignition: true, battery: 12.4, device: { id: 'd', imei: null, terminalId: '000123456789', model: 'GX3', isActive: true, lastSeenAt: fresh } };
const setup = { ...vehicle.device, vehicle: { ...vehicle, customerId: 'c-1' } };
const active = { vehicleId: 'v-2', status: 'ACTIVE', startDate: new Date(now - 60_000).toISOString(), endDate: new Date(now + 60_000).toISOString() };
const evidence = { role: 'ADMIN', subscriptions: [active], operationalIds: ['v-2'] };
const step = (steps, prefix) => steps.find(item => item.label.startsWith(prefix));

test('fresh heartbeat cannot refresh stale GPS or stored telemetry', () => {
  const result = getTelemetry({ ...vehicle, lastUpdate: stale }, now);
  assert.equal(result.connection, 'Connected');
  assert.equal(result.gps, 'Last known location');
  assert.equal(result.state, 'GPS_STALE');
  assert.equal(result.current, false);
  assert.deepEqual([result.speed, result.ignition, result.battery], ['—', '—', '—']);
});
test('missing fix, invalid coordinates and invalid timestamps never make current telemetry', () => {
  for (const patch of [{ latitude: null }, { latitude: NaN }, { latitude: 91 }, { longitude: -181 }, { lastUpdate: null }, { lastUpdate: 'invalid' }]) {
    const result = getTelemetry({ ...vehicle, ...patch }, now);
    assert.equal(result.current, false);
    assert.equal(result.speed, '—');
  }
  assert.equal(hasCoordinates({ latitude: 0, longitude: 0 }), true);
});
test('absent, disabled, offline and future heartbeat cannot borrow the GPS timestamp', () => {
  for (const device of [null, { ...vehicle.device, isActive: false }, { ...vehicle.device, lastSeenAt: stale }, { ...vehicle.device, lastSeenAt: null }, { ...vehicle.device, lastSeenAt: new Date(now + 60_001).toISOString() }]) {
    assert.equal(getTelemetry({ ...vehicle, device }, now).current, false);
    assert.equal(getTrackingDetails({ ...vehicle, device }, now).state, 'OFFLINE');
  }
});
test('10 minute freshness and clock-skew boundary agree with mobile; zero is valid', () => {
  assert.equal(isFresh(new Date(now - FRESHNESS_MS).toISOString(), now), true);
  assert.equal(isFresh(stale, now), false);
  assert.equal(isFresh(new Date(now + 60_000).toISOString(), now), true);
  const result = getTelemetry({ ...vehicle, speed: 0, battery: 0, ignition: false }, now);
  assert.deepEqual([result.speed, result.battery, result.ignition, result.state], ['0.0 km/h', '0.000 V', 'OFF', 'IDLE']);
});
test('terminal-only GX3 does not need IMEI to communicate or have a fix', () => {
  assert.equal(getTelemetry(vehicle, now).current, true);
  assert.equal(deviceProgress(setup, now).stage, 'Live');
  assert.equal(deviceProgress({ ...setup, vehicle: { ...setup.vehicle, lastUpdate: stale } }, now).stage, 'Awaiting GPS');
});
test('explicit authorized vehicle wins over list order; unauthorized or blank query never falls back', () => {
  const vehicles = [{ id: 'v-1' }, { id: 'v-2' }];
  assert.equal(selectScopedVehicleId(vehicles, 'v-2'), 'v-2');
  assert.equal(selectScopedVehicleId(vehicles, 'private-vehicle'), '');
  assert.equal(selectScopedVehicleId(vehicles, ''), '');
  assert.equal(selectScopedVehicleId(vehicles, null), 'v-1');
  assert.equal(selectScopedVehicleId([], 'v-2'), '');
  assert.equal(selectScopedVehicleId([...vehicles].reverse(), 'v-2'), 'v-2');
});
test('navigation encodes identity only; injected path/query cannot change destination', () => {
  const href = vehicleTrackingHref('history', 'v&admin=true/#');
  const parsed = new URL(href, 'https://example.test');
  assert.equal(parsed.pathname, '/dashboard/history');
  assert.equal(parsed.searchParams.get('vehicleId'), 'v&admin=true/#');
  assert.equal(parsed.searchParams.size, 1);
});
test('protocol is exact model evidence, never the old fixed NTCB label or guessed port', () => {
  assert.equal(getModelProtocol('G17 / GT06'), 'GT06 binary TCP');
  assert.match(getModelProtocol('GX3'), /JT\/T808/);
  assert.match(getModelProtocol('PT06'), /GT06/);
  assert.match(getModelProtocol('G17'), /Unknown/);
  assert.match(getModelProtocol('G17-new-unverified'), /Unknown/);
  assert.equal(getModelProtocol(null), 'Unknown');
});
test('readiness separates customer login verification from technical readiness and admin visibility', () => {
  const result = customerReadiness(setup, evidence, now);
  assert.ok(result.slice(0, 5).every(item => item.state === 'pass'));
  assert.equal(step(result, '6.').state, 'unknown');
  assert.match(step(result, '6.').detail, /verify.*customer login/);
  assert.match(step(result, 'Your').detail, /does not prove customer access/);
});
test('assignment and subscription blockers are independent from live device registration', () => {
  const result = customerReadiness({ ...setup, vehicle: { ...setup.vehicle, customerId: null } }, { ...evidence, subscriptions: [] }, now);
  assert.equal(step(result, '1.').state, 'pass');
  assert.equal(step(result, '2.').state, 'pass');
  assert.equal(step(result, '4.').state, 'pending');
  assert.equal(step(result, '5.').state, 'pending');
  assert.equal(step(result, '6.').state, 'pending');
});
test('active subscription uses backend dates, excludes suspended/cancelled, handles exact end boundary', () => {
  for (const status of ['SUSPENDED', 'CANCELLED', 'invalid']) assert.equal(grantsGpsAccess({ ...active, status }, now), false);
  assert.equal(grantsGpsAccess({ ...active, status: 'EXPIRED' }, now), true); // Stored status can lag dates.
  assert.equal(grantsGpsAccess({ ...active, endDate: new Date(now).toISOString() }, now), false);
  assert.equal(grantsGpsAccess({ ...active, startDate: new Date(now + 1).toISOString() }, now), false);
  assert.equal(grantsGpsAccess({ ...active, endDate: 'invalid' }, now), false);
});
test('dealer scope cannot turn absent subscription into a global negative', () => {
  const result = customerReadiness(setup, { role: 'DEALER', subscriptions: [], operationalIds: [] }, now);
  assert.equal(step(result, '5.').state, 'unknown');
  const withAccess = customerReadiness(setup, { role: 'DEALER', subscriptions: [], operationalIds: ['v-2'] }, now);
  assert.equal(step(withAccess, '5.').state, 'pass');
  assert.equal(step(withAccess, '6.').state, 'unknown');
});
test('failed reads remain unknown; admin operational visibility is not subscription evidence', () => {
  const result = customerReadiness(setup, { ...evidence, subscriptions: null }, now);
  assert.equal(step(result, '5.').state, 'unknown');
  assert.equal(step(customerReadiness(setup, UNKNOWN_READINESS, now), 'Your').state, 'unknown');
});
test('readiness loader uses only existing read-only scoped endpoints and omits billing personal fields', async () => {
  const calls = [];
  const result = await loadReadinessEvidence('https://api.example.test', { Authorization: 'Bearer synthetic' }, new AbortController().signal, async (url, options) => {
    calls.push([url, options]);
    return Response.json({ success: true, data: url.endsWith('/me') ? { role: 'ADMIN' } : url.endsWith('/latest') ? [{ id: 'v-2' }] : [{ ...active, priceAtPurchase: 'private', customer: { name: 'private' } }] });
  });
  assert.equal(calls.length, 3);
  assert.ok(calls.every(([, options]) => !options.method && options.cache === 'no-store' && options.signal));
  assert.deepEqual(result.subscriptions, [active]);
  assert.deepEqual(result.operationalIds, ['v-2']);
});
test('readiness loader does not accept a cached or failed auth role, and handles denied/failed optional data', async () => {
  for (const role of ['USER', 'CUSTOMER', null, 'invalid']) {
    const result = await loadReadinessEvidence('', {}, new AbortController().signal, async url => Response.json({ success: true, data: url.endsWith('/me') ? { role } : [active] }));
    assert.deepEqual(result, UNKNOWN_READINESS);
  }
  const partial = await loadReadinessEvidence('', {}, new AbortController().signal, async url => url.endsWith('/me') ? Response.json({ success: true, data: { role: 'ADMIN' } }) : new Response('', { status: 403 }));
  assert.deepEqual(partial, { role: 'ADMIN', subscriptions: null, operationalIds: null });
  const failed = await loadReadinessEvidence('', {}, new AbortController().signal, async () => { throw new Error('offline'); });
  assert.deepEqual(failed, UNKNOWN_READINESS);
});
test('malformed readiness rows keep complete-list conclusions unknown', async () => {
  for (const malformed of [{}, { ...active, startDate: 'invalid' }, { ...active, status: 'unknown' }]) {
    const result = await loadReadinessEvidence('', {}, new AbortController().signal, async url => Response.json({ success: true, data: url.endsWith('/me') ? { role: 'ADMIN' } : [malformed] }));
    assert.equal(result.subscriptions, null);
    assert.equal(result.operationalIds, null);
    assert.equal(step(customerReadiness(setup, result, now), '5.').state, 'unknown');
  }
});
