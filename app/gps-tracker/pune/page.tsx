import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "pune")!;
export const metadata: Metadata = { title: "GPS Tracker in Pune | Vehicle Tracking System", description: "GPS trackers and vehicle tracking systems in Pune for cars, automotive logistics, employee transport, delivery vehicles and commercial fleets across Maharashtra.", keywords: uniqueKeywords([...new Set([...["GPS tracker in Pune", "GPS tracker Pune", "vehicle tracking system Pune", "car GPS tracker Pune", "truck GPS tracking Pune", "fleet management software Pune", "commercial vehicle GPS Maharashtra"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/pune" }, openGraph: { title: "GPS Tracker in Pune | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Pune.", url: "https://naviigps.com/gps-tracker/pune", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Pune" }] } };
export default function PunePage() { return <CityGpsPage city={city} />; }
