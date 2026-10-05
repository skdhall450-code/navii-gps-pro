export type SetupDevice = {
  id: string; imei: string | null; terminalId?: string | null; model: string | null; simNumber: string | null; isActive: boolean; lastSeenAt: string | null;
  vehicle: { id: string; companyId?: string; vehicleNo: string; lastUpdate: string | null; latitude: number | null; longitude: number | null };
};
export type RegistrationRow = { model: string; imei: string; terminalId?: string; simNumber: string };
export type RegistrationResult = { row: number; status: 'CREATED' | 'EXISTS' | 'INVALID' | 'DUPLICATE' | 'CONFLICT' | 'FAILED'; message: string; deviceId?: string };
export const isRegistered = (result?: RegistrationResult) => result?.status === 'CREATED' || result?.status === 'EXISTS';
export function parseDeviceRows(text: string): RegistrationRow[] {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim());
  if (!lines.length || lines.length > 100) throw new Error('Paste between 1 and 100 rows.');
  return lines.map((line, index) => {
    const parts = line.split(line.includes('\t') ? '\t' : ',').map(value => value.trim());
    if (![3, 4].includes(parts.length) || parts.some(value => value.includes('"')) || !parts[0] || !parts[2] || (!parts[1] && !(parts[0].toLowerCase() === 'gx3' && /^\d{12}$/.test(parts[3] || '')))) throw new Error('Row ' + (index + 1) + ': use Model, IMEI, SIM phone number, optional GX3 terminal ID, without a heading.');
    return { model: parts[0], imei: parts[1], simNumber: parts[2], ...(parts.length === 4 ? { terminalId: parts[3] } : {}) };
  });
}
function fresh(value: string | null, now: number) {
  if (!value) return false;
  const age = now - Date.parse(value);
  return Number.isFinite(age) && age >= -60_000 && age <= 600_000;
}
export function deviceProgress(device: SetupDevice, now: number) {
  const connected = device.isActive && fresh(device.lastSeenAt, now);
  const { latitude, longitude, lastUpdate } = device.vehicle;
  const hasFix = typeof latitude === 'number' && Number.isFinite(latitude) && Math.abs(latitude) <= 90 &&
    typeof longitude === 'number' && Number.isFinite(longitude) && Math.abs(longitude) <= 180;
  const gpsFresh = hasFix && fresh(lastUpdate, now);
  return { connected, gpsFresh,
    connection: !device.isActive ? 'Disabled' : connected ? 'Connected' : !device.lastSeenAt ? 'Not yet connected' : 'Offline',
    gps: !hasFix || !lastUpdate ? 'No GPS fix' : gpsFresh ? 'GPS current' : 'GPS stale',
    stage: !device.isActive ? 'Disabled' : connected && gpsFresh ? 'Live' : connected ? 'Awaiting GPS' : device.lastSeenAt ? 'Offline' : 'Registered',
  };
}
export type CommandConfig = { model: string; template: string; server: string; port: string; apn: string; password?: string; smsCountryCode?: string };
export const DEFAULT_DEVICE_SERVER = 'api.naviigps.com';
export const DEFAULT_DEVICE_PORT = '5101';
export type DeviceSetupPreset = { model: string; profileId: string; commandId: string; server: string; port: string; apn: string; smsCountryCode: string };
export function getDeviceSetupPreset(model: string): DeviceSetupPreset | null {
  const normalized = model.trim().toUpperCase().replace(/\s+/g, '');
  if (normalized !== 'G17/GT06') return null;
  return { model: model.trim(), profileId: 'jimi-concox-gt06-current', commandId: 'apn', server: DEFAULT_DEVICE_SERVER, port: DEFAULT_DEVICE_PORT, apn: 'Airteliot.com', smsCountryCode: '+91' };
}
function resolveSmsRecipient(simNumber: string, countryCode?: string): string {
  const value = simNumber.trim();
  if (/^\+[1-9]\d{9,14}$/.test(value)) return value;
  if (!/^\d{10,15}$/.test(value) || !countryCode || !/^\+[1-9]\d{0,2}$/.test(countryCode.trim())) {
    throw new Error('Enter the SIM number with + and country code, or set the SMS country code for a saved local-format number.');
  }
  const recipient = countryCode.trim() + value;
  if (!/^\+[1-9]\d{9,14}$/.test(recipient)) throw new Error('Check the SIM number and SMS country code.');
  return recipient;
}
export function prepareCommand(device: SetupDevice, config: CommandConfig): { body: string; href: string; recipient: string } {
  if (!device.isActive) throw new Error('Enable this device before preparing a command.');
  if (!config.model || device.model?.trim().toLowerCase() !== config.model.trim().toLowerCase()) throw new Error('The command model does not match this device.');
  if (device.imei && !/^\d{15}$/.test(device.imei)) throw new Error('Check the device IMEI.');
  if (!device.imei && !(device.model?.trim().toLowerCase() === 'gx3' && /^\d{12}$/.test(device.terminalId || ''))) throw new Error('Check the device IMEI or GX3 terminal ID.');
  if (!device.simNumber) throw new Error('Add a SIM phone number before preparing a command.');
  const recipient = resolveSmsRecipient(device.simNumber, config.smsCountryCode);
  const template = config.template.trim();
  if (!template) throw new Error('Enter the SMS command from the device manual.');
  const values: Record<string, string> = { IMEI: device.imei || '', TERMINAL_ID: device.terminalId || '', SIM: device.simNumber, SERVER: config.server.trim(), PORT: config.port.trim(), APN: config.apn.trim(), PASSWORD: config.password?.trim() || '' };
  const body = template.replace(/\{([^{}]+)\}/g, (_match, key: string) => {
    if (!Object.hasOwn(values, key) || !values[key]) throw new Error('Fill in a value for {' + key + '} or correct the placeholder.');
    if (key === 'IMEI' && !/^\d{15}$/.test(values[key])) throw new Error('This command requires the real 15-digit IMEI.');
    if (key === 'TERMINAL_ID' && !/^\d{12}$/.test(values[key])) throw new Error('This command requires a confirmed 12-digit terminal ID.');
    if (key === 'SERVER' && !/^[a-zA-Z0-9.-]{1,253}$/.test(values[key])) throw new Error('Enter a server IP or hostname without a URL or port.');
    if (key === 'PORT' && (!/^\d{1,5}$/.test(values[key]) || Number(values[key]) < 1 || Number(values[key]) > 65535)) throw new Error('Enter a port between 1 and 65535.');
    if (key === 'APN' && !/^[a-zA-Z0-9.-]{1,100}$/.test(values[key])) throw new Error('Enter the APN supplied by the SIM operator.');
    if (key === 'PASSWORD' && !/^[a-zA-Z0-9]{1,16}$/.test(values[key])) throw new Error('Enter the device SMS password using 1–16 letters or digits.');
    return values[key];
  });
  if (/[{}]/.test(body) || Array.from(body).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126)) throw new Error('Use one line of plain text and valid placeholders.');
  const septets = Array.from(body).reduce((count, char) => count + ('^[]~|\\'.includes(char) ? 2 : char.charCodeAt(0) === 96 ? 999 : 1), 0);
  if (septets > 160) throw new Error('Keep the command within one SMS (160 GSM characters).');
  // One recipient per composer. Opening it is not evidence of SMS delivery.
  return { body, recipient, href: 'sms:' + recipient + '?body=' + encodeURIComponent(body) };
}

export class RegistrationError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

// Older receivers already support atomic vehicle+device creation. Only a 404 from
// the new bulk route enables this compatibility path; auth failures and timeouts do not.
export async function registerDeviceBatch(
  api: string, headers: Record<string, string>, rows: RegistrationRow[],
  signal?: AbortSignal, request: typeof fetch = fetch,
): Promise<RegistrationResult[]> {
  if (!rows.length || rows.length > 100) throw new Error('Submit between 1 and 100 devices.');
  const bulk = await request(api + '/api/gps/device-management/setup/bulk', {
    method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ devices: rows }), signal,
  });
  if (bulk.status !== 404) {
    const json = await bulk.json().catch(() => null);
    if (!bulk.ok || !json?.success || !Array.isArray(json.data)) throw new RegistrationError(typeof json?.message === 'string' ? json.message : 'Registration unavailable. Check the server and retry.', bulk.status);
    const results = json.data as RegistrationResult[];
    if (results.length !== rows.length || results.some((item, index) => item.row !== index + 1)) throw new Error('Incomplete result. Refresh devices before retrying.');
    return results;
  }
  if (rows.some(row => row.terminalId?.trim())) throw new RegistrationError('GX3 terminal registration requires the updated backend. Deploy it before retrying.', 404);
  const meResponse = await request(api + '/api/auth/me', { headers, signal, cache: 'no-store' });
  const me = await meResponse.json().catch(() => null);
  if (!meResponse.ok || !me?.success || !['ADMIN', 'SUPER_ADMIN'].includes(me.data?.role) || typeof me.data?.companyId !== 'string' || !me.data.companyId) throw new RegistrationError('Administrator sign-in is required.', meResponse.status === 401 ? 401 : 403);
  const companyId: string = me.data.companyId;
  const listResponse = await request(api + '/api/gps/device-management', { headers, signal, cache: 'no-store' });
  const list = await listResponse.json().catch(() => null);
  if (!listResponse.ok || !list?.success || !Array.isArray(list.data)) throw new RegistrationError('Cannot check existing devices. Retry after refreshing.', listResponse.status);
  const known = new Map<string, SetupDevice>(list.data.filter((device: SetupDevice) => device.imei).map((device: SetupDevice) => [device.imei!, device]));
  const seen = new Set<string>();
  const results: RegistrationResult[] = [];
  for (const [index, input] of rows.entries()) {
    const row = index + 1;
    const model = typeof input.model === 'string' ? input.model.trim() : '';
    const imei = typeof input.imei === 'string' ? input.imei.trim() : '';
    const simNumber = typeof input.simNumber === 'string' ? input.simNumber.trim() : '';
    if (!model || model.length > 80 || Array.from(model).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) || !/^\d{15}$/.test(imei) || !/^\+[1-9]\d{9,14}$/.test(simNumber)) {
      results.push({ row, status: 'INVALID', message: 'Check model, 15-digit IMEI and SIM phone number with + and country code.' }); continue;
    }
    if (seen.has(imei)) { results.push({ row, status: 'DUPLICATE', message: 'This IMEI appears more than once in this batch.' }); continue; }
    seen.add(imei);
    const existing = known.get(imei);
    if (existing) {
      const matches = existing.vehicle.companyId === companyId && existing.model === model && existing.simNumber === simNumber;
      results.push(matches ? { row, status: 'EXISTS', message: 'Already registered with these details', deviceId: existing.id } : { row, status: 'CONFLICT', message: 'IMEI already registered; review its existing record' });
      continue;
    }
    if (signal?.aborted) { results.push({ row, status: 'FAILED', message: 'Request interrupted. Refresh before retrying.' }); continue; }
    try {
      const response = await request(api + '/api/gps/vehicles', {
        method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, signal,
        body: JSON.stringify({ vehicleNo: 'GPS-' + imei, name: model + ' device', companyId, imei, model, simNumber }),
      });
      const json = await response.json().catch(() => null);
      if (response.ok && json?.success && json.data?.device?.id) results.push({ row, status: 'CREATED', message: 'Registered; waiting for device connection', deviceId: json.data.device.id });
      else if (response.status === 401 || response.status === 403) {
        results.push({ row, status: 'FAILED', message: 'Session or access changed. Sign in and refresh before retrying.' });
        for (let rest = row + 1; rest <= rows.length; rest++) results.push({ row: rest, status: 'FAILED', message: 'Not attempted after an access error.' });
        break;
      } else results.push({ row, status: response.status === 400 || response.status === 409 ? 'CONFLICT' : 'FAILED', message: 'Could not confirm registration. Refresh and check this IMEI before retrying.' });
    } catch {
      // An interrupted write may have committed. Do not automatically send it again.
      results.push({ row, status: 'FAILED', message: 'Could not confirm registration. Refresh before retrying.' });
      for (let rest = row + 1; rest <= rows.length; rest++) results.push({ row: rest, status: 'FAILED', message: 'Not attempted after a connection error.' });
      break;
    }
  }
  return results;
}
