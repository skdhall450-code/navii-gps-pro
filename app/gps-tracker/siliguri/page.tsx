import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "siliguri")!;
export const metadata: Metadata = { title: "GPS Tracker in Siliguri | Vehicle Tracking System", description: "GPS trackers and vehicle tracking systems in Siliguri for logistics, trucks, commercial vehicles, delivery fleets and regional transport across North Bengal.", keywords: uniqueKeywords([...new Set([...["GPS tracker in Siliguri", "GPS tracker Siliguri", "vehicle tracking system Siliguri", "truck GPS Siliguri", "fleet management Siliguri", "commercial vehicle GPS North Bengal", "logistics GPS Siliguri"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/siliguri" }, openGraph: { title: "GPS Tracker in Siliguri | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Siliguri.", url: "https://naviigps.com/gps-tracker/siliguri", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Siliguri" }] } };
export default function SiliguriPage() { return <CityGpsPage city={city} />; }
