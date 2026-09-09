import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "bengaluru")!;
export const metadata: Metadata = { title: "GPS Tracker in Bengaluru | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Bengaluru for cars, staff transport, delivery vehicles and commercial fleets across Karnataka.", keywords: ["GPS tracker in Bengaluru", "GPS tracker Bangalore", "vehicle tracking system Bengaluru", "car GPS tracker Bangalore", "fleet management software Bengaluru", "commercial vehicle GPS Karnataka"], alternates: { canonical: "https://naviigps.com/gps-tracker/bengaluru" }, openGraph: { title: "GPS Tracker in Bengaluru | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Bengaluru.", url: "https://naviigps.com/gps-tracker/bengaluru", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Bengaluru" }] } };
export default function BengaluruPage() { return <CityGpsPage city={city} />; }
