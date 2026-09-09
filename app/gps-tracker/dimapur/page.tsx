import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "dimapur")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Dimapur | Vehicle Tracking System | NAVII GPS",
  description: "GPS tracker and vehicle tracking solutions in Dimapur, Nagaland for cars, trucks, buses and commercial fleets.",
  keywords: ["GPS tracker Dimapur", "vehicle tracking Dimapur", "fleet management Dimapur", "GPS tracker Nagaland"],
};

export default function DimapurGpsPage() {
  return <CityGpsPage city={city} />;
}
