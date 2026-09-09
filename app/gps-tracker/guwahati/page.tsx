import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "guwahati")!;
export const metadata: Metadata = { title: "GPS Tracker in Guwahati | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Guwahati for cars, trucks, buses, logistics and commercial fleets across Assam and the Northeast.", keywords: ["GPS tracker in Guwahati", "GPS tracker Guwahati", "vehicle tracking system Guwahati", "car GPS tracker Guwahati", "fleet management Assam", "truck GPS Guwahati", "commercial vehicle GPS Northeast India"], alternates: { canonical: "https://naviigps.com/gps-tracker/guwahati" }, openGraph: { title: "GPS Tracker in Guwahati | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Guwahati.", url: "https://naviigps.com/gps-tracker/guwahati", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Guwahati" }] } };
export default function GuwahatiPage() { return <CityGpsPage city={city} />; }
