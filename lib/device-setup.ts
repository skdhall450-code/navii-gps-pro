export type SetupDevice = {
  id: string; imei: string; model: string | null; simNumber: string | null; isActive: boolean; lastSeenAt: string | null;
  vehicle: { id: string; vehicleNo: string; lastUpdate: string | null; latitude: number | null; longitude: number | null };
};
export type RegistrationRow = { model: string; imei: string; simNumber: string };
export type RegistrationResult = { row: number; status: 'CREATED' | 'EXISTS' | 'INVALID' | 'DUPLICATE' | 'CONFLICT' | 'FAILED'; message: string; deviceId?: string };
export const isRegistered = (result?: RegistrationResult) => result?.status === 'CREATED' || result?.status === 'EXISTS';
export function parseDeviceRows(text: string): RegistrationRow[] {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim());
  if (!lines.length || lines.length > 100) throw new Error('Paste between 1 and 100 rows.');
  return lines.map((line, index) => {
    const parts = line.split(line.includes('\t') ? '\t' : ',').map(value => value.trim());
    if (parts.length !== 3 || parts.some(value => !value || value.includes('"'))) throw new Error('Row ' + (index + 1) + ': use Model, IMEI, SIM phone number, without a heading.');
    return { model: parts[0], imei: parts[1], simNumber: parts[2] };
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
export type CommandConfig = { model: string; template: string; server: string; port: string; apn: string };
export function prepareCommand(device: SetupDevice, config: CommandConfig): { body: string; href: string } {
  if (!device.isActive) throw new Error('Enable this device before preparing a command.');
  if (!config.model || device.model?.trim().toLowerCase() !== config.model.trim().toLowerCase()) throw new Error('The command model does not match this device.');
  if (!/^\d{15}$/.test(device.imei)) throw new Error('Check the device IMEI.');
  if (!device.simNumber || !/^\+[1-9]\d{9,14}$/.test(device.simNumber)) throw new Error('Edit the SIM phone number to include + and its country code.');
  const template = config.template.trim();
  if (!template) throw new Error('Enter the SMS command from the device manual.');
  const values: Record<string, string> = { IMEI: device.imei, SIM: device.simNumber, SERVER: config.server.trim(), PORT: config.port.trim(), APN: config.apn.trim() };
  const body = template.replace(/\{([^{}]+)\}/g, (_match, key: string) => {
    if (!Object.hasOwn(values, key) || !values[key]) throw new Error('Fill in a value for {' + key + '} or correct the placeholder.');
    if (key === 'SERVER' && !/^[a-zA-Z0-9.-]{1,253}$/.test(values[key])) throw new Error('Enter a server IP or hostname without a URL or port.');
    if (key === 'PORT' && (!/^\d{1,5}$/.test(values[key]) || Number(values[key]) < 1 || Number(values[key]) > 65535)) throw new Error('Enter a port between 1 and 65535.');
    if (key === 'APN' && !/^[a-zA-Z0-9.-]{1,100}$/.test(values[key])) throw new Error('Enter the APN supplied by the SIM operator.');
    return values[key];
  });
  if (/[{}]/.test(body) || Array.from(body).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126)) throw new Error('Use one line of plain text and valid placeholders.');
  const septets = Array.from(body).reduce((count, char) => count + ('^[]~|\\'.includes(char) ? 2 : char.charCodeAt(0) === 96 ? 999 : 1), 0);
  if (septets > 160) throw new Error('Keep the command within one SMS (160 GSM characters).');
  // One recipient per composer. Opening it is not evidence of SMS delivery.
  return { body, href: 'sms:' + device.simNumber + '?body=' + encodeURIComponent(body) };
}
