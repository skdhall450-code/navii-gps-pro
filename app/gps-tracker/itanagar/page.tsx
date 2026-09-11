import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "itanagar")!;

export const metadata: Metadata = {
  alternates: { canonical: "https://naviigps.com/gps-tracker/itanagar" },
  openGraph: { title: "GPS Tracker in Itanagar | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Itanagar, Arunachal Pradesh for cars, trucks, buses and commercial fleets.", url: "https://naviigps.com/gps-tracker/itanagar", type: "website", images: ["/og-image.jpg"] },
  title: "GPS Tracker in Itanagar | Vehicle Tracking System",
  description: "GPS tracker and vehicle tracking solutions in Itanagar, Arunachal Pradesh for cars, trucks, buses and commercial fleets.",
  keywords: uniqueKeywords([...new Set([...["GPS tracker Itanagar", "vehicle tracking Itanagar", "fleet management Itanagar", "GPS tracker Arunachal Pradesh"], ...generateLocalKeywords(city.name, city.sectors)])]),
};

export default function ItanagarGpsPage() {
  return <CityGpsPage city={city} />;
}
