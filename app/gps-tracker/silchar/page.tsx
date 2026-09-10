import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "silchar")!;
export const metadata: Metadata = { title: "GPS Tracker in Silchar | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Silchar for cars, trucks, buses, regional logistics and commercial fleets across Assam and Northeast India.", keywords: ["GPS tracker Silchar", "vehicle tracking Silchar", "fleet management Silchar", "truck GPS Silchar", "commercial vehicle GPS Assam"], alternates: { canonical: "https://naviigps.com/gps-tracker/silchar" }, openGraph: { title: "GPS Tracker in Silchar | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Silchar.", url: "https://naviigps.com/gps-tracker/silchar", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Silchar" }] } };
export default function SilcharPage() { return <CityGpsPage city={city} />; }
