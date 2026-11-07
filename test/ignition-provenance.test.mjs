import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getTelemetry, IGNITION_FRESHNESS_MS, IGNITION_FUTURE_TOLERANCE_MS } from '../lib/tracking-state.ts';

const now = Date.parse('2026-11-05T07:00:00Z');
const iso = offset => new Date(now + offset).toISOString();
const vehicle = { latitude: 30, longitude: 76, lastUpdate: iso(-1000), speed: 35,
  ignition: true, battery: 14.2, device: { isActive: true, lastSeenAt: iso(-1000) } };
const acc = { ...vehicle, ignitionSource: 'ACC', ignitionObservedAt: iso(-1000) };
const label = (value, at = now) => getTelemetry(value, at).ignition;

test('legacy booleans and charging cannot establish ACC provenance', () => {
  for (const ignition of [true, false]) {
    assert.equal(label({ ...vehicle, ignition }), 'Unavailable');
    for (const ignitionSource of [undefined, null, '', 'GPS', 'HEARTBEAT', 'CHARGING', 'EXTERNAL_POWER', 'CARRIED_FORWARD', 'acc'])
      assert.equal(label({ ...acc, ignition, ignitionSource, charging: true, externalPower: true }), 'Unavailable');
  }
});

test('deployed ingest carry-forward of true or false cannot become verified through successive GPS packets', () => {
  for (const ignition of [true, false]) {
    for (const elapsed of [0, 15000, 60000, 121000, 301000, 1200000]) {
      const receivedAt = iso(elapsed);
      // A position packet omitted ignition; ingest retained the old boolean.
      const carried = { ...vehicle, ignition, lastUpdate: receivedAt,
        device: { isActive: true, lastSeenAt: receivedAt } };
      const result = getTelemetry(carried, now + elapsed);
      assert.equal(result.current, true);
      assert.equal(result.speed, '35.0 km/h');
      assert.equal(result.ignition, 'Unavailable');
      assert.equal(carried.ignitionSource, undefined);
      assert.equal(carried.ignitionObservedAt, undefined);
    }
  }
});

test('carried ACC provenance retains its original observation age across repeated GPS-only updates', () => {
  for (const ignition of [true, false]) {
    const originalObservation = iso(0);
    for (const elapsed of [0, 15000, 120000, 300000, 300001, 1200000]) {
      const receivedAt = iso(elapsed);
      const carried = { ...acc, ignition, ignitionObservedAt: originalObservation,
        lastUpdate: receivedAt, device: { isActive: true, lastSeenAt: receivedAt } };
      const result = getTelemetry(carried, now + elapsed);
      assert.equal(result.current, true);
      assert.equal(result.ignition, elapsed > IGNITION_FRESHNESS_MS ? 'Stale' : ignition ? 'ON' : 'OFF');
      assert.equal(carried.ignitionObservedAt, originalObservation);
    }
  }
});
test('verified ACC has an independent observation clock and preserves measured OFF', () => {
  assert.equal(label(acc), 'ON');
  assert.equal(label({ ...acc, ignition: false }), 'OFF');
  assert.equal(label({ ...acc, latitude: null, lastUpdate: iso(-600000) }), 'ON');
  assert.equal(label({ ...acc, ignitionObservedAt: iso(-IGNITION_FRESHNESS_MS) }), 'ON');
  assert.equal(label({ ...acc, ignitionObservedAt: iso(-IGNITION_FRESHNESS_MS - 1) }), 'Stale');
  assert.equal(label({ ...acc, ignition: false, ignitionObservedAt: iso(-IGNITION_FRESHNESS_MS - 1) }), 'Stale');
});
test('missing, malformed and future ACC observations never show ON or OFF', () => {
  for (const ignitionObservedAt of [undefined, null, '', 'invalid', 123, iso(IGNITION_FUTURE_TOLERANCE_MS + 1)])
    assert.equal(label({ ...acc, ignitionObservedAt }), 'Unavailable');
  for (const ignition of [undefined, null, 0, 1, 'false']) assert.equal(label({ ...acc, ignition }), 'Unavailable');
  assert.equal(label({ ...acc, ignitionObservedAt: iso(IGNITION_FUTURE_TOLERANCE_MS) }), 'ON');
  assert.equal(label(acc, NaN), 'Unavailable');
});
test('fresh GPS and heartbeats do not renew old ACC; cached ACC ages without a response', () => {
  const old = { ...acc, ignitionObservedAt: iso(-IGNITION_FRESHNESS_MS - 1) };
  assert.equal(label({ ...old, lastUpdate: iso(0), device: { isActive: true, lastSeenAt: iso(0) } }), 'Stale');
  assert.equal(label(acc, now + IGNITION_FRESHNESS_MS), 'Stale');
  assert.equal(acc.ignition, true);
  assert.equal(acc.ignitionObservedAt, iso(-1000));
});
test('missing, disabled and disconnected devices cannot report current ignition', () => {
  for (const device of [null, { isActive: false, lastSeenAt: iso(0) }, { isActive: true },
    { isActive: true, lastSeenAt: iso(-600001) }]) assert.equal(label({ ...acc, device }), 'Unavailable');
});
