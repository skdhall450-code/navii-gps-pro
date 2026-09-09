import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "hyderabad")!;
export const metadata: Metadata = { title: "GPS Tracker in Hyderabad | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Hyderabad for cars, pharma logistics, staff transport, delivery vehicles and commercial fleets across Telangana.", keywords: ["GPS tracker in Hyderabad", "GPS tracker Hyderabad", "vehicle tracking system Hyderabad", "car GPS tracker Hyderabad", "fleet management software Hyderabad", "commercial vehicle GPS Telangana"], alternates: { canonical: "https://naviigps.com/gps-tracker/hyderabad" }, openGraph: { title: "GPS Tracker in Hyderabad | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Hyderabad.", url: "https://naviigps.com/gps-tracker/hyderabad", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Hyderabad" }] } };
export default function HyderabadPage() { return <CityGpsPage city={city} />; }
