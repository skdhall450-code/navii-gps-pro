import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "kolkata")!;
export const metadata: Metadata = { title: "GPS Tracker in Kolkata | Vehicle Tracking System", description: "GPS trackers and vehicle tracking systems in Kolkata for cars, trucks, buses, logistics, employee transport and commercial fleets across West Bengal.", keywords: uniqueKeywords([...new Set([...["GPS tracker in Kolkata", "GPS tracker Kolkata", "vehicle tracking system Kolkata", "car GPS tracker Kolkata", "fleet management software Kolkata", "truck GPS Kolkata", "commercial vehicle GPS West Bengal"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/kolkata" }, openGraph: { title: "GPS Tracker in Kolkata | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Kolkata.", url: "https://naviigps.com/gps-tracker/kolkata", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Kolkata" }] } };
export default function KolkataPage() { return <CityGpsPage city={city} />; }
