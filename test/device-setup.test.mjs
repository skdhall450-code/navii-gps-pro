import assert from 'node:assert/strict';
import test from 'node:test';
import { parseDeviceRows, deviceProgress, prepareCommand } from '../lib/device-setup.ts';
const now = Date.parse('2026-09-14T00:00:00Z');
const device = { id: 'd', model: 'PT06', imei: '012345678901234', simNumber: '+919876543210', isActive: true, lastSeenAt: null, vehicle: { id: 'v', vehicleNo: 'GPS-012345678901234', latitude: null, longitude: null, lastUpdate: null } };
// Synthetic fixture, deliberately not a manufacturer's actual provisioning command.
const config = { model: 'PT06', template: 'TEST,{IMEI},{SERVER},{PORT},{APN}#', server: '192.0.2.1', port: '5001', apn: 'test.apn' };
test('bulk paste preserves leading zeroes and large IMEIs as strings', () => {
  assert.deepEqual(parseDeviceRows('PT06\t012345678901234\t+919876543210')[0], { model: 'PT06', imei: device.imei, simNumber: device.simNumber });
  assert.equal(parseDeviceRows('PT06,012345678901234,+919876543210\nGT06,012345678901235,+919876543211').length, 2);
  for (const input of ['', 'PT06,123', 'PT06,"123",+919876543210', Array(101).fill('A,1,2').join('\n')]) assert.throws(() => parseDeviceRows(input));
});
test('registration, connection and GPS are distinct stages', () => {
  assert.equal(deviceProgress(device, now).stage, 'Registered');
  const connected = { ...device, lastSeenAt: new Date(now).toISOString() };
  assert.equal(deviceProgress(connected, now).stage, 'Awaiting GPS');
  const live = { ...connected, vehicle: { ...device.vehicle, latitude: 30, longitude: 76, lastUpdate: new Date(now).toISOString() } };
  assert.equal(deviceProgress(live, now).stage, 'Live');
  assert.equal(deviceProgress(live, now + 600001).stage, 'Offline');
  assert.equal(deviceProgress({ ...live, isActive: false }, now).stage, 'Disabled');
  assert.equal(deviceProgress({ ...live, vehicle: { ...live.vehicle, latitude: 95 } }, now).stage, 'Awaiting GPS');
});
test('commands have exactly one validated recipient and encode the body safely', () => {
  const before = structuredClone(device);
  const prepared = prepareCommand(device, config);
  assert.equal(prepared.body, 'TEST,012345678901234,192.0.2.1,5001,test.apn#');
  assert.equal(prepared.href, 'sms:+919876543210?body=' + encodeURIComponent(prepared.body));
  assert.deepEqual(device, before);
  assert.equal(deviceProgress(device, now).stage, 'Registered');
});
test('mismatched model, disabled devices and invalid SIMs cannot prepare SMS', () => {
  for (const patch of [{ model: 'GT06' }, { isActive: false }, { imei: 'bad' }, { simNumber: '9876543210' }, { simNumber: '+919876543210,+919876543211' }]) assert.throws(() => prepareCommand({ ...device, ...patch }, config));
});
test('missing, unsafe, multiline and overlength commands are blocked', () => {
  for (const patch of [{ template: '' }, { apn: '' }, { port: '65536' }, { port: '1.5' }, { server: 'https://example.com' }, { template: 'TEST\nRESET' }, { template: 'A'.repeat(161) }, { template: '{UNKNOWN}' }, { template: '{constructor}' }, { template: '^'.repeat(81) }]) assert.throws(() => prepareCommand(device, { ...config, ...patch }));
});
