import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "bhubaneswar")!;
export const metadata: Metadata = { title: "GPS Tracker in Bhubaneswar | Vehicle Tracking System", description: "GPS trackers and vehicle tracking systems in Bhubaneswar for cars, buses, logistics, employee transport and commercial fleets across Odisha.", keywords: uniqueKeywords([...new Set([...["GPS tracker in Bhubaneswar", "GPS tracker Bhubaneswar", "vehicle tracking system Bhubaneswar", "car GPS tracker Bhubaneswar", "fleet management Odisha", "truck GPS Odisha", "commercial vehicle GPS Bhubaneswar"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/bhubaneswar" }, openGraph: { title: "GPS Tracker in Bhubaneswar | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Bhubaneswar.", url: "https://naviigps.com/gps-tracker/bhubaneswar", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Bhubaneswar" }] } };
export default function BhubaneswarPage() { return <CityGpsPage city={city} />; }
