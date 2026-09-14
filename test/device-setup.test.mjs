import assert from 'node:assert/strict';
import test from 'node:test';
import { parseDeviceRows, deviceProgress, prepareCommand, registerDeviceBatch } from '../lib/device-setup.ts';
import { SAFE_SMS_PROFILES, findSmsCommand, supportsSmsProfile } from '../lib/device-command-profiles.ts';
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

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
test('legacy fallback uses verified company and handles invalid, duplicate and existing rows', async () => {
  const requests = [];
  const row = { model: 'PT06', imei: '012345678901235', simNumber: '+919876543211' };
  const request = async (url, init) => {
    requests.push({ url, init });
    if (url.endsWith('/setup/bulk')) return jsonResponse({}, 404);
    if (url.endsWith('/api/auth/me')) return jsonResponse({ success: true, data: { role: 'ADMIN', companyId: 'trusted-company' } });
    if (url.endsWith('/device-management')) return jsonResponse({ success: true, data: [{ ...device, vehicle: { ...device.vehicle, companyId: 'trusted-company' } }] });
    const sent = JSON.parse(init.body);
    assert.equal(sent.companyId, 'trusted-company');
    assert.equal(sent.vehicleNo, 'GPS-' + row.imei);
    assert.equal(sent.imei, row.imei);
    return jsonResponse({ success: true, data: { device: { id: 'created' } } });
  };
  const result = await registerDeviceBatch('https://api.example', { Authorization: 'Bearer test' }, [
    { model: device.model, imei: device.imei, simNumber: device.simNumber }, row, row, { ...row, imei: 'bad' },
  ], undefined, request);
  assert.deepEqual(result.map(item => item.status), ['EXISTS', 'CREATED', 'DUPLICATE', 'INVALID']);
  assert.equal(requests.filter(item => item.url.endsWith('/vehicles')).length, 1);
});
test('bulk auth, server errors and timeouts never trigger fallback writes', async () => {
  for (const status of [401, 403, 500]) {
    let calls = 0;
    await assert.rejects(registerDeviceBatch('', {}, [device], undefined, async () => { calls++; return jsonResponse({}, status); }));
    assert.equal(calls, 1);
  }
  let calls = 0;
  await assert.rejects(registerDeviceBatch('', {}, [device], undefined, async () => { calls++; throw new Error('timeout'); }));
  assert.equal(calls, 1);
});
test('legacy network interruption preserves partial successes and stops further writes', async () => {
  let writes = 0;
  const rows = [1,2,3].map(n => ({ model: 'PT06', imei: '01234567890123' + n, simNumber: '+91987654321' + n }));
  const request = async (url) => {
    if (url.endsWith('/setup/bulk')) return jsonResponse({}, 404);
    if (url.endsWith('/api/auth/me')) return jsonResponse({ success: true, data: { role: 'ADMIN', companyId: 'a' } });
    if (url.endsWith('/device-management')) return jsonResponse({ success: true, data: [] });
    writes++;
    if (writes === 2) throw new Error('timeout');
    return jsonResponse({ success: true, data: { device: { id: 'new' } } });
  };
  const result = await registerDeviceBatch('', {}, rows, undefined, request);
  assert.deepEqual(result.map(row => row.status), ['CREATED', 'FAILED', 'FAILED']);
  assert.equal(writes, 2);
});
test('a successful bulk response does not call legacy routes', async () => {
  let calls = 0;
  const result = await registerDeviceBatch('', {}, [device], undefined, async () => { calls++; return jsonResponse({ success: true, data: [{ row: 1, status: 'CREATED', message: 'Registered' }] }); });
  assert.equal(result[0].status, 'CREATED');
  assert.equal(calls, 1);
});


test('verified provisioning profiles expose only safe setup and diagnostic commands', () => {
  assert.deepEqual(SAFE_SMS_PROFILES.map(profile => profile.id), [
    'jimi-concox-gt06-current',
    'concox-gt06-legacy-numeric',
    'teltonika-fm',
    'meitrack-a21',
  ]);
  assert.equal(findSmsCommand('jimi-concox-gt06-current', 'server-ip').template, 'SERVER,0,{SERVER},{PORT},0#');
  assert.equal(findSmsCommand('concox-gt06-legacy-numeric', 'server-ip').template, '803#{SERVER}#{PORT}#');
  assert.equal(findSmsCommand('teltonika-fm', 'configure').template.startsWith('  setparam '), true);
  assert.equal(findSmsCommand('meitrack-a21', 'configure').template, '{PASSWORD},A21,1,{SERVER},{PORT},{APN},,');
  assert.equal(supportsSmsProfile(SAFE_SMS_PROFILES[0], 'GT06N'), true);
  assert.equal(supportsSmsProfile(SAFE_SMS_PROFILES[2], 'FMC920'), true);
  assert.equal(supportsSmsProfile(SAFE_SMS_PROFILES[2], 'PT06'), false);
  assert.equal(supportsSmsProfile(SAFE_SMS_PROFILES[3], 'T355G'), true);
  for (const profile of SAFE_SMS_PROFILES) {
    for (const command of profile.commands) {
      assert.doesNotMatch(command.template, /RELAY|DYD|HFYD|cut.?off|factory|reset/i);
    }
  }
});


test('protected profiles require a validated device SMS password', () => {
  const meitrack = { ...device, model: 'T355G' };
  const meitrackConfig = {
    model: 'T355G',
    template: findSmsCommand('meitrack-a21', 'configure').template,
    server: '192.0.2.1',
    port: '5001',
    apn: 'test.apn',
    password: '0000',
  };
  assert.equal(prepareCommand(meitrack, meitrackConfig).body, '0000,A21,1,192.0.2.1,5001,test.apn,,');
  assert.throws(() => prepareCommand(meitrack, { ...meitrackConfig, password: '' }));
  assert.throws(() => prepareCommand(meitrack, { ...meitrackConfig, password: 'bad password' }));
});
