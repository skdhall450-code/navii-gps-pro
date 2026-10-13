import test from 'node:test';
import assert from 'node:assert/strict';
import { blankAlertPolicy, validateAlertPolicy, minuteToTime, timeToMinute } from '../lib/alert-policies.ts';
const valid = () => ({ ...blankAlertPolicy(), name: 'Evening vehicle alert', vehicleId: 'vehicle_1' });
test('new policies are disabled with all external channels off', () => {
  const input = blankAlertPolicy();
  assert.equal(input.enabled, false);
  assert.equal(input.emailEnabled, false);
  assert.equal(input.whatsappEnabled, false);
  assert.equal(input.pushEnabled, false);
  assert.equal(validateAlertPolicy(valid()), null);
});
test('validates positive bounded integer cooldown, names, enum and vehicle', () => {
  for (const patch of [{ cooldownMinutes: 0 }, { cooldownMinutes: -1 }, { cooldownMinutes: 0.5 }, { cooldownMinutes: 10081 }, { cooldownMinutes: NaN }, { name: ' ' }, { name: 'a'.repeat(81) }, { name: 'a\nb' }, { vehicleId: '' }, { type: 'GEOFENCE' }, { priority: 'URGENT' }]) assert.ok(validateAlertPolicy({ ...valid(), ...patch }), JSON.stringify(patch));
  assert.equal(validateAlertPolicy({ ...valid(), cooldownMinutes: 10080 }), null);
});
test('only a real daily window and timezone can be saved', () => {
  for (const patch of [{ scheduleMode: 'BUSINESS_HOURS' }, { timeZone: 'made/up' }, { startMinute: 1440 }, { startMinute: -1 }, { startMinute: 0.5 }, { endMinute: NaN }, { endMinute: 540 }]) assert.ok(validateAlertPolicy({ ...valid(), ...patch }));
  assert.equal(validateAlertPolicy({ ...valid(), startMinute: 1320, endMinute: 360, timeZone: 'Australia/Sydney' }), null);
});
test('external delivery cannot be enabled in the client contract', () => {
  for (const field of ['emailEnabled', 'whatsappEnabled', 'pushEnabled']) assert.ok(validateAlertPolicy({ ...valid(), [field]: true }));
});
test('time input rejects malformed and roundtrips midnight, afternoon and last minute', () => {
  for (const n of [0, 1, 540, 1080, 1439]) assert.equal(timeToMinute(minuteToTime(n)), n);
  for (const value of ['', '24:00', '12:60', '1:00', '25:99']) assert.ok(Number.isNaN(timeToMinute(value)));
});

test('only a successful refresh unlocks an uncertain write', async () => {
  const { nextPolicySaveUncertainty, AlertPolicyRequestError } = await import('../lib/alert-policies.ts');
  let locked = nextPolicySaveUncertainty(false, 'UNCERTAIN_FAILURE');
  assert.equal(locked, true);
  locked = nextPolicySaveUncertainty(locked, 'CANCEL');
  assert.equal(locked, true);
  locked = nextPolicySaveUncertainty(locked, 'REFRESH_FAILED');
  assert.equal(locked, true);
  assert.equal(nextPolicySaveUncertainty(locked, 'REFRESH_SUCCEEDED'), false);
  assert.equal(new AlertPolicyRequestError('timeout', true).uncertain, true);
  assert.equal(new AlertPolicyRequestError('rejected').uncertain, false);
});
test('network, unreadable success and server errors are ambiguous, known rejections are not', async () => {
  const { policyWriteMayHaveCommitted } = await import('../lib/alert-policies.ts');
  for (const status of [undefined, 200, 201, 204, 500, 502, 503, 504]) assert.equal(policyWriteMayHaveCommitted(status), true);
  for (const status of [400, 401, 403, 404, 409, 413, 422, 429]) assert.equal(policyWriteMayHaveCommitted(status), false);
});
test('editor lock guards the handler and every write control while cancel and refresh remain reachable', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../components/alerts/AlertPolicySettings.tsx', import.meta.url), 'utf8');
  assert.match(source, /if \(savingRef.current \|\| uncertainSaveRef.current\) return/);
  assert.match(source, /disabled=\{saving \|\| uncertainSave \|\| vehicles.length === 0\}/);
  assert.match(source, /disabled=\{loading \|\| saving \|\| open \|\| uncertainSave\}/);
  assert.match(source, /disabled=\{open \|\| saving \|\| loading \|\| uncertainSave\}/);
  assert.match(source, /disabled=\{loading \|\| saving \|\| open\}/);
  assert.match(source, /recoverSave\("REFRESH_SUCCEEDED"\)/);
  assert.match(source, /recoverSave\("CANCEL"\)/);
  assert.match(source, /15000/);
});
