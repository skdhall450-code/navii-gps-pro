import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "kochi")!;
export const metadata: Metadata = { title: "GPS Tracker in Kochi | Vehicle Tracking System", description: "GPS trackers and vehicle tracking systems in Kochi for cars, port logistics, tourism transport, delivery vehicles and commercial fleets across Kerala.", keywords: uniqueKeywords([...new Set([...["GPS tracker in Kochi", "GPS tracker Kochi", "GPS tracker Cochin", "vehicle tracking system Kochi", "car GPS tracker Kochi", "fleet management software Kochi", "commercial vehicle GPS Kerala"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/kochi" }, openGraph: { title: "GPS Tracker in Kochi | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Kochi.", url: "https://naviigps.com/gps-tracker/kochi", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Kochi" }] } };
export default function KochiPage() { return <CityGpsPage city={city} />; }
