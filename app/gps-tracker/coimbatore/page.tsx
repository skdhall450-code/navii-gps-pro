import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "coimbatore")!;
export const metadata: Metadata = { title: "GPS Tracker in Coimbatore | Vehicle Tracking System", description: "GPS trackers and vehicle tracking systems in Coimbatore for cars, textile logistics, manufacturing transport and commercial fleets across Tamil Nadu.", keywords: uniqueKeywords([...new Set([...["GPS tracker in Coimbatore", "GPS tracker Coimbatore", "vehicle tracking system Coimbatore", "car GPS tracker Coimbatore", "truck GPS tracking Coimbatore", "fleet management software Coimbatore", "commercial vehicle GPS Tamil Nadu"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/coimbatore" }, openGraph: { title: "GPS Tracker in Coimbatore | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Coimbatore.", url: "https://naviigps.com/gps-tracker/coimbatore", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Coimbatore" }] } };
export default function CoimbatorePage() { return <CityGpsPage city={city} />; }
