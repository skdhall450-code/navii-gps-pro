// Keep these persisted values aligned with the backend VehicleType enum.
export const VEHICLE_TYPE_OPTIONS = [
  { value: "BIKE", label: "Bike" },
  { value: "SCOOTER", label: "Scooter" },
  { value: "EV_SCOOTER", label: "EV scooter" },
  { value: "CAR", label: "Car" },
  { value: "TRUCK", label: "Truck" },
  { value: "BUS", label: "Bus" },
  { value: "VAN", label: "Van" },
  { value: "AUTO_RICKSHAW", label: "Auto rickshaw" },
  { value: "TRACTOR", label: "Tractor" },
  { value: "OTHER", label: "Other vehicle" },
] as const;

export type VehicleType = (typeof VEHICLE_TYPE_OPTIONS)[number]["value"];

export function normalizeVehicleType(value: unknown): VehicleType {
  return VEHICLE_TYPE_OPTIONS.find((option) => option.value === value)?.value ?? "OTHER";
}

export function getVehicleTypeLabel(value: unknown): string {
  const type = normalizeVehicleType(value);
  return VEHICLE_TYPE_OPTIONS.find((option) => option.value === type)!.label;
}

// Constant SVG geometry: API-provided text is never inserted into SVG/HTML.
// Explicit arc flags also work with the iOS system SVG decoder.
const WHEELS = '<circle cx="8" cy="23" r="3"/><circle cx="25" cy="23" r="3"/>';
const SCOOTER = WHEELS + '<path d="M5 20h8l3-7h4l3 7h5M12 20h8l-2-12h-4M5 17h8M17 8h4"/>';
const SHAPES: Record<VehicleType, string> = {
  BIKE: WHEELS + '<path d="m8 23 7-9 6 9H8M21 23l-3-13h4M11 13h5M5 17l5-3h4"/>',
  SCOOTER,
  EV_SCOOTER: SCOOTER + '<path d="m28 3-5 6h4l-2 6 6-8h-4l2-4Z" fill="#38bdf8" stroke="none"/>',
  CAR: WHEELS + '<path d="M5 23H3v-7l5-2 3-6h11l4 6 4 2v7h-2M11 23h11M8 14h18M16 8v6"/>',
  TRUCK: WHEELS + '<path d="M5 23H2V8h17v15h3M11 23h11M19 13h6l5 6v4h-2M22 13v6h8"/>',
  BUS: WHEELS + '<path d="M5 23H3V7h26v16h-1M11 23h11M3 15h26M10 7v8M17 7v8M24 7v16"/>',
  VAN: WHEELS + '<path d="M5 23H2V9h20l8 9v5h-2M11 23h11M19 9v9h11M5 12h10v6H5Z"/>',
  AUTO_RICKSHAW: WHEELS + '<path d="M5 23H3v-8l3-7h14l5 7 3 4v4M11 23h11M6 8v9h14V8M3 17h17l5-2M13 8v9"/>',
  TRACTOR: '<circle cx="9" cy="22" r="5"/><circle cx="26" cy="24" r="3"/><path d="M4 16V8h12v12h8l3-5h-7V9M3 8h15M14 22h9M8 11h5v6"/>',
  OTHER: '<path d="M16 29S6 19 6 12a10 10 0 0 1 20 0c0 7-10 17-10 17Z"/><circle cx="16" cy="12" r="3"/>',
};

export function getVehicleIconSvg(value: unknown): string {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#e2e8f0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + SHAPES[normalizeVehicleType(value)] + '</svg>';
}

export function getVehicleIconUri(value: unknown): string {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(getVehicleIconSvg(value));
}

export function formatSimNumber(value: string | null | undefined): string {
  return value?.trim() || "Not added";
}
