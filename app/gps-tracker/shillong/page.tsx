import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "shillong")!;

export const metadata: Metadata = {
  alternates: { canonical: "https://naviigps.com/gps-tracker/shillong" },
  openGraph: { title: "GPS Tracker in Shillong | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Shillong, Meghalaya for cars, trucks, buses, tourism and commercial fleets.", url: "https://naviigps.com/gps-tracker/shillong", type: "website", images: ["/og-image.jpg"] },
  title: "GPS Tracker in Shillong | Vehicle Tracking System",
  description: "GPS tracker and vehicle tracking solutions in Shillong, Meghalaya for cars, trucks, buses, tourism and commercial fleets.",
  keywords: uniqueKeywords([...new Set([...["GPS tracker Shillong", "vehicle tracking Shillong", "fleet management Shillong", "GPS tracker Meghalaya"], ...generateLocalKeywords(city.name, city.sectors)])]),
};

export default function ShillongGpsPage() {
  return <CityGpsPage city={city} />;
}
