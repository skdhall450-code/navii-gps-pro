import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "shillong")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Shillong | Vehicle Tracking System | NAVII GPS",
  description: "GPS tracker and vehicle tracking solutions in Shillong, Meghalaya for cars, trucks, buses, tourism and commercial fleets.",
  keywords: ["GPS tracker Shillong", "vehicle tracking Shillong", "fleet management Shillong", "GPS tracker Meghalaya"],
};

export default function ShillongGpsPage() {
  return <CityGpsPage city={city} />;
}
