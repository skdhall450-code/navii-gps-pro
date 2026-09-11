import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "noida")!;
export const metadata: Metadata = { title: "GPS Tracker in Noida | Vehicle Tracking System", description: "GPS trackers and vehicle tracking systems in Noida for cars, technology company fleets, employee transport, e-commerce logistics and commercial vehicles across Uttar Pradesh.", keywords: uniqueKeywords([...new Set([...["GPS tracker in Noida", "GPS tracker Noida", "vehicle tracking system Noida", "car GPS tracker Noida", "fleet management software Noida", "GPS tracker Greater Noida", "commercial vehicle GPS Uttar Pradesh"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/noida" }, openGraph: { title: "GPS Tracker in Noida | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Noida.", url: "https://naviigps.com/gps-tracker/noida", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Noida" }] } };
export default function NoidaPage() { return <CityGpsPage city={city} />; }
