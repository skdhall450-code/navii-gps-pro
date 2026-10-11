// Match mobile tracking-state: communication and GPS freshness are separate.
export const FRESHNESS_MS = 600_000;
export type TrackingVehicle = {
  latitude: number | null; longitude: number | null; lastUpdate: string | null;
  speed?: number | null; ignition?: boolean | null; battery?: number | null;
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
export function isFresh(timestamp: string | null | undefined, now: number) {
  if (!timestamp) return false;
  const age = now - Date.parse(timestamp);
  return Number.isFinite(age) && age >= -60_000 && age <= FRESHNESS_MS;
}
export function getTrackingDetails(vehicle: TrackingVehicle, now: number) {
  const device = vehicle.device;
  const connected = !!device?.isActive && isFresh(device.lastSeenAt, now);
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
    speed: tracking.current && typeof vehicle.speed === 'number' && Number.isFinite(vehicle.speed) ? `${vehicle.speed.toFixed(1)} km/h` : '—',
    ignition: tracking.current && typeof vehicle.ignition === 'boolean' ? vehicle.ignition ? 'ON' : 'OFF' : '—',
    battery: tracking.current && typeof vehicle.battery === 'number' && Number.isFinite(vehicle.battery) ? `${vehicle.battery.toFixed(3)} V` : '—',
  };
}
