import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "dimapur")!;

export const metadata: Metadata = {
  alternates: { canonical: "https://naviigps.com/gps-tracker/dimapur" },
  openGraph: { title: "GPS Tracker in Dimapur | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Dimapur, Nagaland for cars, trucks, buses and commercial fleets.", url: "https://naviigps.com/gps-tracker/dimapur", type: "website", images: ["/og-image.jpg"] },
  title: "GPS Tracker in Dimapur | Vehicle Tracking System",
  description: "GPS tracker and vehicle tracking solutions in Dimapur, Nagaland for cars, trucks, buses and commercial fleets.",
  keywords: uniqueKeywords([...new Set([...["GPS tracker Dimapur", "vehicle tracking Dimapur", "fleet management Dimapur", "GPS tracker Nagaland"], ...generateLocalKeywords(city.name, city.sectors)])]),
};

export default function DimapurGpsPage() {
  return <CityGpsPage city={city} />;
}
