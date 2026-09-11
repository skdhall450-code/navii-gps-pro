import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "kohima")!;
export const metadata: Metadata = { title: "GPS Tracker in Kohima | Vehicle Tracking System", description: "GPS tracker and vehicle tracking solutions in Kohima for cars, trucks, buses, commercial fleets and institutional vehicles across Nagaland.", keywords: uniqueKeywords([...new Set([...["GPS tracker Kohima", "vehicle tracking Kohima", "fleet management Nagaland", "commercial vehicle GPS Kohima", "truck GPS Kohima"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/kohima" }, openGraph: { title: "GPS Tracker in Kohima | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Kohima.", url: "https://naviigps.com/gps-tracker/kohima", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Kohima" }] } };
export default function KohimaPage() { return <CityGpsPage city={city} />; }
