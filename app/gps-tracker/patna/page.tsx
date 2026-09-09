import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "patna")!;
export const metadata: Metadata = { title: "GPS Tracker in Patna | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Patna for cars, trucks, buses, logistics, school transport and commercial fleets across Bihar.", keywords: ["GPS tracker in Patna", "GPS tracker Patna", "vehicle tracking system Patna", "car GPS tracker Patna", "fleet management Bihar", "truck GPS Patna", "school bus GPS Patna"], alternates: { canonical: "https://naviigps.com/gps-tracker/patna" }, openGraph: { title: "GPS Tracker in Patna | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Patna.", url: "https://naviigps.com/gps-tracker/patna", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Patna" }] } };
export default function PatnaPage() { return <CityGpsPage city={city} />; }
