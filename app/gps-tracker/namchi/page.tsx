import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "namchi")!;
export const metadata: Metadata = { title: "GPS Tracker in Namchi | Vehicle Tracking System", description: "GPS tracker and vehicle tracking solutions in Namchi for cars, trucks, buses, tourism fleets and institutional vehicles across Sikkim.", keywords: uniqueKeywords([...new Set([...["GPS tracker Namchi", "vehicle tracking Namchi", "fleet management Sikkim", "tourism fleet GPS Namchi", "commercial vehicle GPS Sikkim"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/namchi" }, openGraph: { title: "GPS Tracker in Namchi | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Namchi.", url: "https://naviigps.com/gps-tracker/namchi", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Namchi" }] } };
export default function NamchiPage() { return <CityGpsPage city={city} />; }
