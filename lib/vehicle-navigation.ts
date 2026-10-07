// A URL is a selection request, never permission to access a vehicle.
export function selectScopedVehicleId(vehicles: readonly { id: string }[], requestedId: string | null): string {
  if (requestedId !== null) return vehicles.some(vehicle => vehicle.id === requestedId) ? requestedId : '';
  return vehicles[0]?.id ?? '';
}
export function vehicleTrackingHref(page: 'live-tracking' | 'history', vehicleId: string) {
  return `/dashboard/${page}?${new URLSearchParams({ vehicleId }).toString()}`;
}
