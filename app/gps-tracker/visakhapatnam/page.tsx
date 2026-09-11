import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "visakhapatnam")!;
export const metadata: Metadata = { title: "GPS Tracker in Visakhapatnam | Vehicle Tracking", description: "GPS trackers and vehicle tracking systems in Visakhapatnam for cars, port transport, industrial logistics and commercial fleets across Andhra Pradesh.", keywords: uniqueKeywords([...new Set([...["GPS tracker in Visakhapatnam", "GPS tracker Vizag", "vehicle tracking system Visakhapatnam", "car GPS tracker Vizag", "truck GPS tracking Visakhapatnam", "fleet management software Vizag", "commercial vehicle GPS Andhra Pradesh"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/visakhapatnam" }, openGraph: { title: "GPS Tracker in Visakhapatnam | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Visakhapatnam.", url: "https://naviigps.com/gps-tracker/visakhapatnam", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Visakhapatnam" }] } };
export default function VisakhapatnamPage() { return <CityGpsPage city={city} />; }
