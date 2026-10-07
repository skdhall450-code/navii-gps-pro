/** Presentation only. The scoped server remains the authority for alert access and state. */
export const ALERT_ROLES = ['SUPER_ADMIN', 'ADMIN', 'DEALER', 'CUSTOMER', 'USER'] as const;
export type AlertRole = typeof ALERT_ROLES[number];
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
export type AlertStatus = 'ALL' | 'OPEN' | 'RESOLVED';
export type AlertWorkflowFilter = 'ALL' | 'UNASSIGNED' | 'PENDING' | 'OVERDUE' | 'ACKNOWLEDGED';
export type AlertWorkflowAction = { action: 'TAKE_OWNERSHIP' | 'ACKNOWLEDGE' } | { action: 'SET_DEADLINE'; acknowledgementDueAt: string | null };
export type AlertWorkflow = { ownershipRecoverable?: boolean; workflowVersion: 1; workflowRevision: number; owner: { id: string; name: string } | null; assignedAt: string | null; acknowledgedAt: string | null; acknowledgedBy: { id: string; name: string } | null; acknowledgementDueAt: string | null; deadlineStatus: 'NONE' | 'PENDING' | 'OVERDUE' | 'ACKNOWLEDGED' | 'RESOLVED' };
export type AlertPeriod = 'ALL' | 'HOUR' | 'DAY' | 'WEEK';
export type AlertRecord = {
  id: string;
  type: string;
  message: string;
  isResolved: boolean;
  vehicleId: string;
  createdAt: string;
  resolvedAt: string | null;
  ownershipRecoverable?: boolean;
  workflowVersion?: number;
  workflowRevision?: number;
  owner?: AlertWorkflow['owner'];
  assignedAt?: string | null;
  acknowledgedAt?: string | null;
  acknowledgedBy?: AlertWorkflow['acknowledgedBy'];
  acknowledgementDueAt?: string | null;
  deadlineStatus?: AlertWorkflow['deadlineStatus'];
  vehicle: {
    id: string;
    companyId?: string;
    vehicleNo: string;
    name?: string | null;
    device?: { imei?: string | null; terminalId?: string | null; model?: string | null } | null;
  };
};
export type AlertFilters = { search: string; status: AlertStatus; severity: AlertSeverity | 'ALL'; type: string; period: AlertPeriod; workflow: AlertWorkflowFilter };
export const DEFAULT_ALERT_FILTERS: AlertFilters = { search: '', status: 'OPEN', severity: 'ALL', type: 'ALL', period: 'ALL', workflow: 'ALL' };
export const REPEAT_WINDOW_MS = 5 * 60 * 1000;
export type AlertGroup = { id: string; events: AlertRecord[]; firstAt: string; lastAt: string };

export function alertSeverity(type: string): AlertSeverity {
  if (type === 'SOS' || type === 'POWER_CUT') return 'CRITICAL';
  if (['OVERSPEED', 'GEOFENCE_EXIT', 'OFFLINE'].includes(type)) return 'HIGH';
  if (type === 'GEOFENCE_ENTRY' || type === 'IGNITION') return 'MEDIUM';
  return 'INFO';
}
export function canManageAlerts(role: AlertRole | undefined): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'DEALER';
}
export function alertTimestamp(value: string | null): number | null {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}
export function formatAlertTimestamp(value: string | null): string {
  const timestamp = alertTimestamp(value);
  return timestamp === null ? 'Time unavailable' : new Date(timestamp).toISOString().replace('T', ' ').replace('.000Z', ' UTC').replace('Z', ' UTC');
}
export function alertTypeLabel(type: string): string { return type.replaceAll('_', ' '); }

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
export function alertWorkflow(value: unknown): AlertWorkflow | null {
  if (!object(value) || value.workflowVersion !== 1 || !Number.isSafeInteger(value.workflowRevision) || (value.workflowRevision as number) < 0) return null;
  if (value.ownershipRecoverable !== undefined && typeof value.ownershipRecoverable !== 'boolean') return null;
  const person = (entry: unknown) => entry === null || object(entry) && typeof entry.id === 'string' && !!entry.id && typeof entry.name === 'string';
  const timestamp = (entry: unknown) => entry === null || typeof entry === 'string' && alertTimestamp(entry) !== null;
  if (!person(value.owner) || !person(value.acknowledgedBy) || !['assignedAt', 'acknowledgedAt', 'acknowledgementDueAt'].every(key => timestamp(value[key])) || !['NONE', 'PENDING', 'OVERDUE', 'ACKNOWLEDGED', 'RESOLVED'].includes(value.deadlineStatus as string)) return null;
  return value as unknown as AlertWorkflow;
}
export function isAlertRecord(value: unknown): value is AlertRecord {
  if (!object(value) || !object(value.vehicle)) return false;
  const vehicle = value.vehicle;
  const device = vehicle.device;
  return typeof value.id === 'string' && value.id.length > 0 &&
    typeof value.type === 'string' && value.type.length > 0 && typeof value.message === 'string' &&
    typeof value.isResolved === 'boolean' && typeof value.vehicleId === 'string' &&
    vehicle.id === value.vehicleId && typeof vehicle.vehicleNo === 'string' &&
    (vehicle.companyId === undefined || typeof vehicle.companyId === 'string') &&
    (vehicle.name == null || typeof vehicle.name === 'string') &&
    (device == null || object(device) && ['imei', 'terminalId', 'model'].every(key => device[key] == null || typeof device[key] === 'string')) &&
    (value.workflowVersion !== 1 || alertWorkflow(value) !== null) &&
    typeof value.createdAt === 'string' && (value.resolvedAt === null || typeof value.resolvedAt === 'string');
}

export function filterAlertEvents(events: readonly AlertRecord[], filters: AlertFilters, now: number): AlertRecord[] {
  const query = filters.search.trim().toLowerCase();
  const range = { HOUR: 3600000, DAY: 86400000, WEEK: 604800000 };
  return events.filter(event => {
    if (filters.status === 'OPEN' && event.isResolved || filters.status === 'RESOLVED' && !event.isResolved) return false;
    const workflow = alertWorkflow(event);
    if (filters.workflow !== 'ALL') {
      if (!workflow) return false;
      if (filters.workflow === 'UNASSIGNED' && (event.isResolved || workflow.owner !== null)) return false;
      if (filters.workflow === 'PENDING' && (event.isResolved || workflow.acknowledgedAt !== null)) return false;
      if (filters.workflow === 'OVERDUE' && workflow.deadlineStatus !== 'OVERDUE') return false;
      if (filters.workflow === 'ACKNOWLEDGED' && workflow.acknowledgedAt === null) return false;
    }
    if (filters.type !== 'ALL' && event.type !== filters.type) return false;
    if (filters.severity !== 'ALL' && alertSeverity(event.type) !== filters.severity) return false;
    if (filters.period !== 'ALL') {
      const timestamp = alertTimestamp(event.createdAt);
      if (timestamp === null || timestamp > now || timestamp < now - range[filters.period]) return false;
    }
    return !query || [event.type, event.message, event.vehicle.vehicleNo, event.vehicle.name,
      event.vehicle.device?.imei, event.vehicle.device?.terminalId, event.vehicle.device?.model].join(' ').toLowerCase().includes(query);
  });
}

/** Exact repeats only: company + vehicle + type + message + state, within a bounded 5-minute span.
 * Original events and identifiers are retained. Unknown times never group. No server deduplication occurs. */
export function groupAlertEvents(events: readonly AlertRecord[], grouped = true): AlertGroup[] {
  const sorted = [...events].sort((a, b) => (alertTimestamp(b.createdAt) ?? -Infinity) - (alertTimestamp(a.createdAt) ?? -Infinity) || a.id.localeCompare(b.id));
  const groups: AlertGroup[] = [];
  const latest = new Map<string, AlertGroup>();
  for (const event of sorted) {
    const timestamp = alertTimestamp(event.createdAt);
    const key = JSON.stringify([event.vehicle.companyId ?? '', event.vehicleId, event.type, event.message, event.isResolved]);
    const group = grouped && timestamp !== null ? latest.get(key) : undefined;
    const last = group ? alertTimestamp(group.lastAt) : null;
    if (group && last !== null && timestamp !== null && last - timestamp <= REPEAT_WINDOW_MS) {
      group.events.push(event);
      group.firstAt = event.createdAt;
    } else {
      const next = { id: event.id, events: [event], firstAt: event.createdAt, lastAt: event.createdAt };
      groups.push(next);
      latest.set(key, next);
    }
  }
  return groups;
}
