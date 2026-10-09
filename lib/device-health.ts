import { grantsGpsAccess, type ReadinessEvidence, type ReadinessSubscription } from './customer-readiness';
import type { SetupDevice } from './device-setup';
import { FRESHNESS_MS, getTrackingDetails } from './tracking-state';

export const HEALTH_ROLES = ['SUPER_ADMIN', 'ADMIN', 'DEALER'] as const;
export const HEALTH_CATEGORIES = {
  offline: 'Offline',
  gps: 'Awaiting GPS',
  activation: 'Incomplete activation',
  subscription: 'Subscription attention',
  unknown: 'Unconfirmed evidence',
} as const;
export type HealthCategory = keyof typeof HEALTH_CATEGORIES;
export type HealthIssue = { category: HealthCategory; title: string; detail: string; action: string };
export type HealthRow = { device: SetupDevice; issues: HealthIssue[]; priority: number };
export type HealthSnapshot = {
  devices: SetupDevice[];
  evidence: ReadinessEvidence;
  checkedAt: number;
  warnings: string[];
};

export class DeviceHealthError extends Error {
  constructor(message: string, public code: 'unauthorized' | 'forbidden' | 'unavailable') { super(message); }
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
const textOrNull = (value: unknown) => typeof value === 'string' ? value : null;
const id = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

// Fail closed on an incomplete device list. Dropping bad rows could falsely make
// the queue look clear. Optional missing observations remain explicitly unknown.
export function parseHealthDevices(value: unknown): SetupDevice[] | null {
  if (!Array.isArray(value)) return null;
  const seen = new Set<string>();
  const devices: SetupDevice[] = [];
  for (const item of value) {
    if (!record(item) || !id(item.id) || seen.has(item.id) || typeof item.isActive !== 'boolean' ||
      !record(item.vehicle) || !id(item.vehicle.id) || !id(item.vehicle.vehicleNo)) return null;
    seen.add(item.id);
    const vehicle = item.vehicle;
    devices.push({
      id: item.id, imei: textOrNull(item.imei), terminalId: textOrNull(item.terminalId),
      model: textOrNull(item.model), simNumber: textOrNull(item.simNumber), isActive: item.isActive,
      lastSeenAt: textOrNull(item.lastSeenAt),
      vehicle: {
        id: vehicle.id as string, vehicleNo: vehicle.vehicleNo as string,
        ...(typeof vehicle.customerId === 'string' || vehicle.customerId === null ? { customerId: vehicle.customerId } : {}),
        latitude: typeof vehicle.latitude === 'number' ? vehicle.latitude : null,
        longitude: typeof vehicle.longitude === 'number' ? vehicle.longitude : null,
        lastUpdate: textOrNull(vehicle.lastUpdate),
      },
    });
  }
  return devices;
}

function parseSubscriptions(value: unknown): ReadinessSubscription[] | null {
  if (!Array.isArray(value) || !value.every(item => record(item) && id(item.vehicleId) &&
    typeof item.status === 'string' && ['UPCOMING', 'ACTIVE', 'EXPIRING', 'EXPIRED', 'SUSPENDED', 'CANCELLED'].includes(item.status) &&
    typeof item.startDate === 'string' && Number.isFinite(Date.parse(item.startDate)) &&
    typeof item.endDate === 'string' && Number.isFinite(Date.parse(item.endDate)) && Date.parse(item.endDate) > Date.parse(item.startDate))) return null;
  return value.map(({ vehicleId, status, startDate, endDate }) => ({ vehicleId, status, startDate, endDate }));
}

export async function loadDeviceHealth(
  api: string, headers: HeadersInit, signal: AbortSignal, request: typeof fetch = fetch,
): Promise<HealthSnapshot> {
  async function read(path: string, required = false): Promise<unknown> {
    try {
      const response = await request(api.replace(/\/$/, '') + path, { method: 'GET', headers, signal, cache: 'no-store' });
      if (response.status === 401) throw new DeviceHealthError('Session expired. Sign in again.', 'unauthorized');
      if (required && response.status === 403) throw new DeviceHealthError('This account no longer has access to Device Health Centre.', 'forbidden');
      if (!response.ok) {
        if (required) throw new DeviceHealthError('Device Health Centre could not load. Please retry.', 'unavailable');
        return null;
      }
      const result: unknown = await response.json();
      if (!record(result) || result.success !== true || !('data' in result)) return null;
      // Current endpoints return full lists. Never call a partial response a full queue.
      if (Array.isArray(result.data) && typeof result.count === 'number' && result.count > result.data.length) return null;
      return result.data;
    } catch (error) {
      if (signal.aborted || error instanceof DeviceHealthError) throw error;
      if (required) throw new DeviceHealthError('Device Health Centre could not load. Please retry.', 'unavailable');
      return null;
    }
  }

  // The stored browser role is only a navigation hint. Verify server authority
  // before requesting operational records, and rely on each backend's scoping.
  const me = await read('/api/auth/me', true);
  if (!record(me) || !id(me.id) || typeof me.role !== 'string' ||
    !(HEALTH_ROLES as readonly string[]).includes(me.role)) {
    throw new DeviceHealthError('Administrator or dealer access is required.', 'forbidden');
  }
  if (me.role !== 'SUPER_ADMIN' && !id(me.companyId) || me.role === 'DEALER' && !id(me.dealerId)) {
    throw new DeviceHealthError('The current account scope could not be verified. Sign in again.', 'forbidden');
  }
  const [deviceData, subscriptionData, operationalData] = await Promise.all([
    read('/api/gps/device-management', true),
    read('/api/gps/billing/subscriptions'),
    read('/api/gps/latest'),
  ]);
  const devices = parseHealthDevices(deviceData);
  if (devices === null) throw new DeviceHealthError('The device list is incomplete or invalid. Retry before reviewing health.', 'unavailable');
  // Older JWTs can carry an obsolete scope. Do not display records that disagree
  // with the current /me identity. Backend enforcement remains the real boundary.
  if (me.role !== 'SUPER_ADMIN' && (deviceData as Record<string, unknown>[]).some(item => {
    const vehicle = item.vehicle as Record<string, unknown>;
    return vehicle.companyId !== me.companyId || me.role === 'DEALER' && vehicle.dealerId !== me.dealerId;
  })) throw new DeviceHealthError('Device records do not match the current account scope. Sign in again.', 'forbidden');
  const subscriptions = parseSubscriptions(subscriptionData);
  const operationalIds = Array.isArray(operationalData) && operationalData.every(item => record(item) && id(item.id))
    ? operationalData.map(item => item.id as string).filter(vehicleId => devices.some(device => device.vehicle.id === vehicleId)) : null;
  const warnings: string[] = [];
  if (subscriptions === null) warnings.push('Subscription records are unavailable. Subscription health is not fully checked.');
  if (operationalIds === null) warnings.push('Your tracking access could not be checked. Map links are hidden until it is confirmed.');
  return { devices, evidence: { role: me.role, subscriptions, operationalIds }, checkedAt: Date.now(), warnings };
}

export function observationTime(value: string | null | undefined, now: number) {
  if (!value) return { kind: 'missing' as const, label: 'Not reported', timestamp: null, ageMs: null };
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return { kind: 'invalid' as const, label: 'Invalid timestamp', timestamp: null, ageMs: null };
  const age = now - timestamp;
  if (age < -60_000) return { kind: 'future' as const, label: 'Future timestamp; verify clock', timestamp, ageMs: null };
  const ageMs = Math.max(0, age);
  const label = ageMs < 60_000 ? 'Less than 1 minute ago' : ageMs < 3_600_000 ? `${Math.floor(ageMs / 60_000)} minutes ago`
    : ageMs < 86_400_000 ? `${Math.floor(ageMs / 3_600_000)} hours ago` : `${Math.floor(ageMs / 86_400_000)} days ago`;
  return { kind: 'known' as const, label, timestamp, ageMs };
}

export function deviceHealthRow(device: SetupDevice, evidence: ReadinessEvidence, now: number): HealthRow {
  const issues: HealthIssue[] = [];
  const add = (category: HealthCategory, title: string, detail: string, action: string) => issues.push({ category, title, detail, action });
  const tracking = getTrackingDetails({ ...device.vehicle, device }, now);
  const heartbeat = observationTime(device.lastSeenAt, now);
  const gps = observationTime(device.vehicle.lastUpdate, now);
  if (!device.isActive) {
    add('activation', 'Device disabled', 'The device record is disabled; communication is not treated as current.', 'Review the device record and confirm why it was disabled.');
  } else if (heartbeat.kind === 'missing') {
    add('activation', 'Communication not yet confirmed', 'No last-communication timestamp was reported.', 'Review installation and the existing setup checklist.');
  } else if (heartbeat.kind !== 'known') {
    add('unknown', 'Communication time unconfirmed', heartbeat.label + '.', 'Verify the reported timestamp before diagnosing connectivity.');
  } else if (heartbeat.ageMs! > FRESHNESS_MS) {
    add('offline', 'No recent communication', 'The last reported communication is older than 10 minutes. This does not identify the cause.', 'Check installation, power and network coverage with the installer.');
  }
  if (tracking.connected && !tracking.gpsFresh) {
    add('gps', 'Connected without a current GPS fix', gps.kind === 'known' && gps.ageMs! > FRESHNESS_MS
      ? 'Communication is recent, but the last GPS timestamp is older than 10 minutes.'
      : 'Communication is recent, but a valid, current location is not confirmed.', 'Review the last GPS fix and check device placement or sky view.');
  }
  if (gps.kind === 'invalid' || gps.kind === 'future') {
    add('unknown', 'GPS time unconfirmed', gps.label + '.', 'Verify the reported GPS timestamp before relying on location freshness.');
  }
  if (device.vehicle.customerId === null || device.vehicle.customerId === '') {
    add('activation', 'Customer assignment missing', 'No customer is assigned to this vehicle.', 'Review the vehicle and its customer assignment.');
  } else if (device.vehicle.customerId === undefined) {
    add('unknown', 'Customer assignment unconfirmed', 'This response does not report a customer assignment.', 'Check the existing assignment page within your account scope.');
  }

  const manager = evidence.role === 'ADMIN' || evidence.role === 'SUPER_ADMIN';
  const subscriptions = evidence.subscriptions?.filter(item => item.vehicleId === device.vehicle.id);
  const current = subscriptions?.filter(item => grantsGpsAccess(item, now)) ?? [];
  const operational = evidence.operationalIds?.includes(device.vehicle.id);
  if (current.length) {
    let coveredUntil = Math.max(...current.map(item => Date.parse(item.endDate)));
    for (const item of [...subscriptions ?? []].filter(item => !['SUSPENDED', 'CANCELLED'].includes(item.status))
      .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))) {
      if (Date.parse(item.startDate) <= coveredUntil) coveredUntil = Math.max(coveredUntil, Date.parse(item.endDate));
    }
    if (coveredUntil - now <= 7 * 86_400_000) {
      add('subscription', 'Subscription coverage ends within 7 days', `Current coverage in the visible records ends ${new Date(coveredUntil).toISOString()}.`, manager ? 'Review subscription dates and renewal plans.' : 'Ask the administrator to confirm renewal coverage beyond the visible records.');
    }
  } else if (!(evidence.role === 'DEALER' && operational)) {
    if (manager && subscriptions !== undefined) {
      add('subscription', 'No current subscription', 'No visible subscription grants GPS access at the current date and time.', 'Review subscription dates, suspension and customer assignment.');
    } else if (subscriptions?.length) {
      add('subscription', 'Visible subscription records need review', 'None of the records visible to this dealer currently grants access. Other account records may exist.', 'Ask the administrator to confirm current subscription coverage.');
    } else {
      add('unknown', 'Subscription access unconfirmed', 'No positive access evidence is available in this account’s scope.', 'Confirm current subscription coverage with the administrator.');
    }
  }
  if (operational === undefined) {
    add('unknown', 'Tracking access unconfirmed', 'The account’s scoped tracking list could not be checked.', 'Refresh and verify access before opening the map.');
  } else if (!operational) {
    add('unknown', 'Vehicle not in your tracking list', 'This vehicle was not returned by the account’s scoped tracking endpoint.', 'Review account access and assignment; this alone does not prove a customer cannot track it.');
  }
  const priority = issues.some(item => item.category === 'offline' || item.category === 'gps') ? 0
    : issues.some(item => item.category === 'activation' || item.category === 'subscription') ? 1 : issues.length ? 2 : 3;
  return { device, issues, priority };
}

export function buildHealthRows(snapshot: HealthSnapshot, now: number): HealthRow[] {
  return snapshot.devices.map(device => deviceHealthRow(device, snapshot.evidence, now)).sort((a, b) =>
    a.priority - b.priority || a.device.vehicle.vehicleNo.localeCompare(b.device.vehicle.vehicleNo) || a.device.id.localeCompare(b.device.id));
}

export function healthCounts(rows: HealthRow[]) {
  const counts = { all: rows.length, attention: 0, clear: 0, offline: 0, gps: 0, activation: 0, subscription: 0, unknown: 0 };
  for (const row of rows) {
    counts[row.issues.length ? 'attention' : 'clear']++;
    for (const category of new Set(row.issues.map(issue => issue.category))) counts[category]++;
  }
  return counts;
}
export type HealthFilter = HealthCategory | 'attention' | 'all' | 'clear';
export function filterHealthRows(rows: HealthRow[], filter: HealthFilter, search: string) {
  const query = search.trim().toLowerCase();
  return rows.filter(row => (filter === 'all' || filter === 'attention' && row.issues.length > 0 ||
    filter === 'clear' && row.issues.length === 0 || row.issues.some(issue => issue.category === filter)) &&
    [row.device.vehicle.vehicleNo, row.device.model, row.device.imei, row.device.terminalId].some(value => value?.toLowerCase().includes(query)));
}
