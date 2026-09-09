import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "ranchi")!;
export const metadata: Metadata = { title: "GPS Tracker in Ranchi | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Ranchi for cars, trucks, employee transport, mining logistics and commercial fleets across Jharkhand.", keywords: ["GPS tracker in Ranchi", "GPS tracker Ranchi", "vehicle tracking system Ranchi", "car GPS tracker Ranchi", "fleet management Jharkhand", "truck GPS Ranchi", "commercial vehicle GPS Jharkhand"], alternates: { canonical: "https://naviigps.com/gps-tracker/ranchi" }, openGraph: { title: "GPS Tracker in Ranchi | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Ranchi.", url: "https://naviigps.com/gps-tracker/ranchi", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Ranchi" }] } };
export default function RanchiPage() { return <CityGpsPage city={city} />; }
