'use client';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { selectScopedVehicleId } from '@/lib/vehicle-navigation';
const selectionEvent = 'navii-vehicle-selection';
function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(selectionEvent, callback);
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener(selectionEvent, callback); };
}
function getSnapshot() { return window.location.search; }
function updateQuery(id: string, replace: boolean) {
  const url = new URL(window.location.href);
  url.searchParams.set('vehicleId', id);
  window.history[replace ? 'replaceState' : 'pushState'](window.history.state, '', url);
  window.dispatchEvent(new Event(selectionEvent));
}
export function useVehicleSelection(vehicles: readonly { id: string }[]) {
  const search = useSyncExternalStore(subscribe, getSnapshot, () => '');
  const requestedId = new URLSearchParams(search).get('vehicleId');
  const selectedVehicleId = selectScopedVehicleId(vehicles, requestedId);
  useEffect(() => {
    // Store the first automatic selection so Back and refreshed list ordering retain it.
    if (requestedId === null && selectedVehicleId) updateQuery(selectedVehicleId, true);
  }, [requestedId, selectedVehicleId]);
  const setSelectedVehicleId = useCallback((id: string) => {
    if (vehicles.some(vehicle => vehicle.id === id) && new URLSearchParams(window.location.search).get('vehicleId') !== id) updateQuery(id, false);
  }, [vehicles]);
  return { selectedVehicleId, setSelectedVehicleId, selectionUnavailable: requestedId !== null && !selectedVehicleId };
}
