import { getVehicleIconSvg, getVehicleTypeLabel } from "@/lib/vehicle-presentation";

export function VehicleTypeIcon({ type }: { type: unknown }) {
  return (
    <span
      role="img"
      aria-label={getVehicleTypeLabel(type)}
      className="inline-flex h-8 w-8 shrink-0"
      // SVG comes only from constant geometry, never from API-provided markup.
      dangerouslySetInnerHTML={{ __html: getVehicleIconSvg(type) }}
    />
  );
}
