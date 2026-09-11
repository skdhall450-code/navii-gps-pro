import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "gangtok")!;

export const metadata: Metadata = {
  alternates: { canonical: "https://naviigps.com/gps-tracker/gangtok" },
  openGraph: { title: "GPS Tracker in Gangtok | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Gangtok, Sikkim for cars, trucks, buses, tourism and institutional fleets.", url: "https://naviigps.com/gps-tracker/gangtok", type: "website", images: ["/og-image.jpg"] },
  title: "GPS Tracker in Gangtok | Vehicle Tracking System",
  description: "GPS tracker and vehicle tracking solutions in Gangtok, Sikkim for cars, trucks, buses, tourism and institutional fleets.",
  keywords: uniqueKeywords([...new Set([...["GPS tracker Gangtok", "vehicle tracking Gangtok", "fleet management Gangtok", "GPS tracker Sikkim"], ...generateLocalKeywords(city.name, city.sectors)])]),
};

export default function GangtokGpsPage() {
  return <CityGpsPage city={city} />;
}
