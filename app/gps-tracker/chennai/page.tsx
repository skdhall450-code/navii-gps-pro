import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "chennai")!;
export const metadata: Metadata = { title: "GPS Tracker in Chennai | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Chennai for cars, trucks, buses, manufacturing logistics, employee transport and commercial fleets across Tamil Nadu.", keywords: ["GPS tracker in Chennai", "GPS tracker Chennai", "vehicle tracking system Chennai", "car GPS tracker Chennai", "truck GPS tracking Chennai", "fleet management software Chennai", "GPS tracker Tamil Nadu"], alternates: { canonical: "https://naviigps.com/gps-tracker/chennai" }, openGraph: { title: "GPS Tracker in Chennai | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Chennai.", url: "https://naviigps.com/gps-tracker/chennai", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Chennai" }] } };
export default function ChennaiPage() { return <CityGpsPage city={city} />; }
