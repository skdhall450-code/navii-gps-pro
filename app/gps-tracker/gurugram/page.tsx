import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "gurugram")!;
export const metadata: Metadata = { title: "GPS Tracker in Gurugram | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Gurugram for cars, corporate fleets, employee transport, industrial logistics and delivery vehicles across Haryana.", keywords: ["GPS tracker in Gurugram", "GPS tracker Gurgaon", "vehicle tracking system Gurugram", "car GPS tracker Gurgaon", "fleet management software Gurugram", "employee transport GPS Gurgaon", "commercial vehicle GPS Haryana"], alternates: { canonical: "https://naviigps.com/gps-tracker/gurugram" }, openGraph: { title: "GPS Tracker in Gurugram | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Gurugram.", url: "https://naviigps.com/gps-tracker/gurugram", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Gurugram" }] } };
export default function GurugramPage() { return <CityGpsPage city={city} />; }
