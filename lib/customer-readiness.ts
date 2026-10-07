import { getTrackingDetails } from './tracking-state';
import type { SetupDevice } from './device-setup';

export type ReadinessSubscription = { vehicleId: string; status: string; startDate: string; endDate: string };
export type ReadinessEvidence = {
  role: string | null;
  subscriptions: ReadinessSubscription[] | null;
  operationalIds: string[] | null;
};
export const UNKNOWN_READINESS: ReadinessEvidence = { role: null, subscriptions: null, operationalIds: null };
export type ReadinessStep = { label: string; state: 'pass' | 'pending' | 'unknown'; detail: string };

// Same date-based rule as backend GpsController.activeSubscriptionWhere.
export function grantsGpsAccess(subscription: ReadinessSubscription, now: number) {
  return !['SUSPENDED', 'CANCELLED'].includes(subscription.status) &&
    ['UPCOMING', 'ACTIVE', 'EXPIRING', 'EXPIRED'].includes(subscription.status) &&
    Date.parse(subscription.startDate) <= now && Date.parse(subscription.endDate) > now;
}
export function customerReadiness(device: SetupDevice, evidence: ReadinessEvidence, now: number): ReadinessStep[] {
  const tracking = getTrackingDetails({ ...device.vehicle, device }, now);
  const assigned = typeof device.vehicle.customerId === 'string' && !!device.vehicle.customerId;
  const assignmentKnown = device.vehicle.customerId !== undefined;
  const manager = evidence.role === 'ADMIN' || evidence.role === 'SUPER_ADMIN';
  // Dealer subscription records may be narrower than the current vehicle scope.
  // A vehicle in its operational list is positive evidence of subscription access;
  // an absent row never proves that another account cannot access the vehicle.
  const active = !!evidence.subscriptions?.some(item => item.vehicleId === device.vehicle.id && grantsGpsAccess(item, now)) ||
    evidence.role === 'DEALER' && !!evidence.operationalIds?.includes(device.vehicle.id);
  const subscriptionKnown = active || manager && evidence.subscriptions !== null;
  const visible = evidence.operationalIds?.includes(device.vehicle.id);
  return [
    { label: '1. Registration', state: device.id ? 'pass' : 'unknown', detail: device.id ? 'Device registered' : 'Not confirmed' },
    { label: '2. Communication', state: tracking.connected ? 'pass' : 'pending', detail: tracking.connection },
    { label: '3. GPS fix', state: tracking.gpsFresh ? 'pass' : 'pending', detail: tracking.gps },
    { label: '4. Customer assignment', state: assigned ? 'pass' : assignmentKnown ? 'pending' : 'unknown', detail: assigned ? 'Customer assigned' : assignmentKnown ? 'Assign a customer' : 'Not reported' },
    { label: '5. Active subscription', state: active ? 'pass' : subscriptionKnown ? 'pending' : 'unknown', detail: active ? 'Current date-based access confirmed' : subscriptionKnown ? 'No current subscription' : 'Not confirmed in this account’s scope' },
    { label: '6. Customer visibility', state: !assigned && assignmentKnown || !active && subscriptionKnown ? 'pending' : 'unknown', detail: assigned && active ? 'Assignment + subscription ready; verify the linked customer login' : 'Requires customer assignment, current subscription and a linked login' },
    { label: 'Your tracking access', state: visible === undefined ? 'unknown' : visible ? 'pass' : 'pending', detail: visible === undefined ? 'Could not verify your scoped tracking list' : visible ? manager ? 'Visible to you as administrator; this does not prove customer access' : 'Visible in your account’s tracking list' : 'Not in your account’s tracking list' },
  ];
}

export async function loadReadinessEvidence(api: string, headers: HeadersInit, signal: AbortSignal, request: typeof fetch = fetch): Promise<ReadinessEvidence> {
  async function read(path: string) {
    try {
      const response = await request(api + path, { headers, signal, cache: 'no-store' });
      if (!response.ok) return null;
      const result = await response.json();
      return result?.success ? result.data : null;
    } catch { return null; }
  }
  const [me, subscriptions, operational] = await Promise.all([
    read('/api/auth/me'), read('/api/gps/billing/subscriptions'), read('/api/gps/latest'),
  ]);
  const role = typeof me?.role === 'string' ? me.role : null;
  // Never elevate scope based on cached client-side role information.
  if (!['SUPER_ADMIN', 'ADMIN', 'DEALER'].includes(role ?? '')) return UNKNOWN_READINESS;
  return {
    role,
    subscriptions: Array.isArray(subscriptions) && subscriptions.every(item => typeof item?.vehicleId === 'string' && !!item.vehicleId && ['UPCOMING', 'ACTIVE', 'EXPIRING', 'EXPIRED', 'SUSPENDED', 'CANCELLED'].includes(item.status) && typeof item.startDate === 'string' && Number.isFinite(Date.parse(item.startDate)) && typeof item.endDate === 'string' && Number.isFinite(Date.parse(item.endDate))) ? subscriptions.map(({ vehicleId, status, startDate, endDate }) => ({ vehicleId, status, startDate, endDate })) : null,
    operationalIds: Array.isArray(operational) && operational.every(item => typeof item?.id === 'string' && !!item.id) ? operational.map(item => item.id) : null,
  };
}
