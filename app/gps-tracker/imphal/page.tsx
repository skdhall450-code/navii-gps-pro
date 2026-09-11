import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "imphal")!;

export const metadata: Metadata = {
  alternates: { canonical: "https://naviigps.com/gps-tracker/imphal" },
  openGraph: { title: "GPS Tracker in Imphal | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Imphal, Manipur for cars, trucks, buses and commercial fleets.", url: "https://naviigps.com/gps-tracker/imphal", type: "website", images: ["/og-image.jpg"] },
  title: "GPS Tracker in Imphal | Vehicle Tracking System",
  description: "GPS tracker and vehicle tracking solutions in Imphal, Manipur for cars, trucks, buses and commercial fleets.",
  keywords: uniqueKeywords([...new Set([...["GPS tracker Imphal", "vehicle tracking Imphal", "fleet management Imphal", "GPS tracker Manipur"], ...generateLocalKeywords(city.name, city.sectors)])]),
};

export default function ImphalGpsPage() {
  return <CityGpsPage city={city} />;
}
