import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { formatLastSeen } from '../lib/communication-time.ts';
import { getTelemetry } from '../lib/tracking-state.ts';
const now = Date.parse('2026-11-16T12:50:00Z');
const at = age => new Date(now - age).toISOString();
const vehicle = age => ({ latitude: 28, longitude: 77, lastUpdate: at(0), speed: 0,
  device: { isActive: true, lastSeenAt: at(age) } });
test('future timestamps never masquerade as Just now, without weakening freshness', () => {
  for (const age of [-1, -60_000, -60_001, -19_800_000]) {
    assert.equal(formatLastSeen(at(age), now), 'Clock ahead');
    assert.equal(getTelemetry(vehicle(age), now).connected, age >= -60_000);
  }
  const telemetry = getTelemetry(vehicle(-60_001), now);
  assert.equal(telemetry.state, 'OFFLINE');
  assert.equal(telemetry.speed, 'Unavailable');
});
test('normal age labels and unavailable dates retain explicit output', () => {
  for (const [age, label] of [[0,'Just now'],[9999,'Just now'],[10000,'10s ago'],[60000,'1m ago'],[3600000,'1h ago'],[86400000,'1d ago']])
    assert.equal(formatLastSeen(at(age), now), label);
  assert.equal(formatLastSeen(null, now), 'Never');
  assert.equal(formatLastSeen('invalid', now), 'Unknown');
  assert.equal(formatLastSeen(at(0), NaN), 'Unknown');
});
test('communication and GPS expiry and disabled-device protections remain intact', () => {
  assert.equal(getTelemetry(vehicle(600_000), now).connected, true);
  assert.equal(getTelemetry(vehicle(600_001), now).state, 'OFFLINE');
  const stale = vehicle(0); stale.lastUpdate = at(120_001);
  assert.equal(getTelemetry(stale, now).state, 'GPS_STALE');
  stale.device.isActive = false;
  assert.equal(getTelemetry(stale, now).state, 'OFFLINE');
});
test('all three map age labels use the shared tracking clock', () => {
  const source = readFileSync(new URL('../components/tracking/LiveTrackingMap.tsx', import.meta.url), 'utf8');
  assert.equal((source.match(/getCommunicationTimestamp\((?:selectedVehicle|vehicle)\), now,/g) || []).length, 3);
  assert.ok(!source.includes('function formatLastSeen('));
});
