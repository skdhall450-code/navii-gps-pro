import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getTelemetry, getTrackingDetails, isFresh, FRESHNESS_MS, COMMUNICATION_FRESHNESS_MS } from '../lib/tracking-state.ts';

const now = Date.parse('2026-10-24T16:52:49.971Z');
const fresh = new Date(now - 1000).toISOString();
const vehicle = { latitude: 30, longitude: 76, lastUpdate: fresh, speed: 67, ignition: true, battery: 12.4,
  device: { isActive: true, lastSeenAt: fresh } };

test('reported stale GPS speeds remain unavailable despite recent heartbeats', () => {
  for (const [lastUpdate, speed] of [['2026-10-24T14:16:29Z', 35], ['2026-10-24T07:34:56Z', 8], ['2026-10-24T07:07:51Z', 32]]) {
    const reading = { ...vehicle, lastUpdate, speed };
    const result = getTelemetry(reading, now);
    assert.equal(result.connection, 'Connected');
    assert.equal(result.state, 'GPS_STALE');
    assert.equal(result.gps, 'Last known location');
    assert.deepEqual([result.speed, result.ignition, result.battery], Array(3).fill('Unavailable'));
    assert.equal(reading.speed, speed); // Display policy must preserve historical readings.
    assert.equal(reading.lastUpdate, lastUpdate);
  }
});
test('fresh data retains measured speed, including genuine zero', () => {
  assert.equal(getTelemetry({ ...vehicle, lastUpdate: '2026-10-24T16:51:06Z' }, now).speed, '67.0 km/h');
  const result = getTelemetry({ ...vehicle, speed: 0, ignition: false, battery: 0 }, now);
  assert.deepEqual([result.speed, result.ignition, result.battery, result.state], ['0.0 km/h', 'OFF', '0.000 V', 'IDLE']);
});
test('missing, invalid or implausibly future GPS never presents current telemetry', () => {
  for (const patch of [{ latitude: null }, { latitude: NaN }, { latitude: 91 }, { longitude: 181 },
    { lastUpdate: null }, { lastUpdate: 'invalid' }, { lastUpdate: new Date(now + 60_001).toISOString() }]) {
    assert.equal(getTelemetry({ ...vehicle, ...patch }, now).current, false);
    assert.equal(getTelemetry({ ...vehicle, ...patch }, now).speed, 'Unavailable');
  }
});
test('GPS timestamp cannot substitute for communication or device activation', () => {
  for (const device of [null, { isActive: false, lastSeenAt: fresh }, { isActive: true },
    { isActive: true, lastSeenAt: new Date(now - COMMUNICATION_FRESHNESS_MS - 1).toISOString() }]) {
    assert.equal(getTrackingDetails({ ...vehicle, device }, now).state, 'OFFLINE');
    assert.equal(getTelemetry({ ...vehicle, device }, now).speed, 'Unavailable');
  }
});
test('cached response expires even if the vehicle object never changes', () => {
  const reading = { ...vehicle, lastUpdate: new Date(now).toISOString(), device: { isActive: true, lastSeenAt: new Date(now).toISOString() } };
  assert.equal(getTelemetry(reading, now + FRESHNESS_MS).current, true);
  assert.equal(getTelemetry(reading, now + FRESHNESS_MS + 1).current, false);
  assert.equal(isFresh(new Date(now + 60_001).toISOString(), now), false);
});
test('non-finite, negative and missing speed are unavailable rather than invented zero', () => {
  for (const speed of [NaN, Infinity, -1, null, undefined]) assert.equal(getTelemetry({ ...vehicle, speed }, now).speed, 'Unavailable');
});
