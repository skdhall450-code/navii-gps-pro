import { redirect } from "next/navigation";
import { vehicleTrackingHref } from "@/lib/vehicle-navigation";

export default async function HistoryRedirect({
  searchParams,
}: { searchParams: Promise<{ vehicleId?: string | string[] }> }) {
  const { vehicleId } = await searchParams;
  // Destination validates this request against its server-scoped vehicle list.
  redirect(typeof vehicleId === "string" ? vehicleTrackingHref("history", vehicleId) : "/dashboard/history");
}
