import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "delhi")!;
export const metadata: Metadata = { title: "GPS Tracker in Delhi | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Delhi for cars, delivery vehicles, employee transport, warehouse distribution and commercial fleets across Delhi NCR.", keywords: ["GPS tracker in Delhi", "GPS tracker Delhi", "vehicle tracking system Delhi", "car GPS tracker Delhi", "truck GPS tracking Delhi", "fleet management software Delhi", "commercial vehicle GPS Delhi NCR"], alternates: { canonical: "https://naviigps.com/gps-tracker/delhi" }, openGraph: { title: "GPS Tracker in Delhi | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Delhi.", url: "https://naviigps.com/gps-tracker/delhi", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Delhi" }] } };
export default function DelhiPage() { return <CityGpsPage city={city} />; }
