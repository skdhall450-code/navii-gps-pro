// Preserve the map's two-minute LIVE window for GPS. Heartbeat connectivity
// has its own ten-minute expiry and cannot make an older fix current.
export const FRESHNESS_MS = 120_000;
export const COMMUNICATION_FRESHNESS_MS = 600_000;
// Match the mobile ACC contract; GPS fixes/heartbeats are not ACC observations.
export const IGNITION_FRESHNESS_MS = 300_000;
export const IGNITION_FUTURE_TOLERANCE_MS = 30_000;
export type TrackingVehicle = {
  latitude: number | null; longitude: number | null; lastUpdate: string | null;
  speed?: number | null; ignition?: boolean | null; battery?: number | null;
  ignitionSource?: string | null; ignitionObservedAt?: string | null;
  device?: { isActive: boolean; lastSeenAt?: string | null } | null;
};
export type TrackingState = 'MOVING' | 'IDLE' | 'GPS_STALE' | 'OFFLINE';
export const TRACKING_LABELS: Record<TrackingState, string> = {
  MOVING: 'Moving', IDLE: 'Idle', GPS_STALE: 'Awaiting GPS', OFFLINE: 'Offline',
};
export function hasCoordinates(vehicle: Pick<TrackingVehicle, 'latitude' | 'longitude'>): boolean {
  return typeof vehicle.latitude === 'number' && Number.isFinite(vehicle.latitude) && Math.abs(vehicle.latitude) <= 90 &&
    typeof vehicle.longitude === 'number' && Number.isFinite(vehicle.longitude) && Math.abs(vehicle.longitude) <= 180;
}
export function isFresh(timestamp: string | null | undefined, now: number, maxAge = FRESHNESS_MS) {
  if (!timestamp) return false;
  const age = now - Date.parse(timestamp);
  return Number.isFinite(age) && age >= -60_000 && age <= maxAge;
}
export function getTrackingDetails(vehicle: TrackingVehicle, now: number) {
  const device = vehicle.device;
  const connected = !!device?.isActive && isFresh(device.lastSeenAt, now, COMMUNICATION_FRESHNESS_MS);
  const gpsFresh = hasCoordinates(vehicle) && isFresh(vehicle.lastUpdate, now);
  const state: TrackingState = !connected ? 'OFFLINE' : !gpsFresh ? 'GPS_STALE' : (vehicle.speed ?? 0) > 2 ? 'MOVING' : 'IDLE';
  const connection = !device ? 'No device' : !device.isActive ? 'Disabled' : connected ? 'Connected' : !device.lastSeenAt ? 'Not yet connected' : 'Offline';
  const gps = !hasCoordinates(vehicle) || !vehicle.lastUpdate ? 'No fix' : gpsFresh ? 'Current' : 'Last known location';
  return { state, connection, gps, connected, gpsFresh, current: connected && gpsFresh };
}
export function getTelemetry(vehicle: TrackingVehicle, now: number) {
  const tracking = getTrackingDetails(vehicle, now);
  return {
    ...tracking,
    speed: tracking.current && typeof vehicle.speed === 'number' && Number.isFinite(vehicle.speed) && vehicle.speed >= 0 ? `${vehicle.speed.toFixed(1)} km/h` : 'Unavailable',
    ignition: getIgnitionTelemetry(vehicle, now),
    battery: tracking.current && typeof vehicle.battery === 'number' && Number.isFinite(vehicle.battery) ? `${vehicle.battery.toFixed(3)} V` : 'Unavailable',
  };
}

export function getIgnitionTelemetry(vehicle: TrackingVehicle, now: number): 'ON' | 'OFF' | 'Stale' | 'Unavailable' {
  const observedAt = typeof vehicle.ignitionObservedAt === 'string' ? Date.parse(vehicle.ignitionObservedAt) : NaN;
  if (!Number.isFinite(now) || typeof vehicle.ignition !== 'boolean' || vehicle.ignitionSource !== 'ACC' ||
    !Number.isFinite(observedAt) || observedAt > now + IGNITION_FUTURE_TOLERANCE_MS ||
    !getTrackingDetails(vehicle, now).connected) return 'Unavailable';
  if (now - observedAt > IGNITION_FRESHNESS_MS) return 'Stale';
  return vehicle.ignition ? 'ON' : 'OFF';
}
