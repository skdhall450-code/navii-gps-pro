import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { DelhiGpsPage } from "@/components/seo/DelhiGpsPage";

export const metadata: Metadata = { title: "GPS Tracker in Delhi | Vehicle Tracking System", description: "GPS trackers and vehicle tracking systems across all 13 current Delhi revenue districts for cars, delivery vehicles, employee transport and commercial fleets.", keywords: uniqueKeywords(["GPS tracker in Delhi", "GPS tracker Delhi", "vehicle tracking system Delhi", "car GPS tracker Delhi", "truck GPS tracking Delhi", "fleet management software Delhi", "commercial vehicle GPS Delhi NCR", "GPS tracker Delhi districts"]), alternates: { canonical: "https://naviigps.com/gps-tracker/delhi" }, openGraph: { title: "GPS Tracker in Delhi | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions across Delhi's current 13 revenue districts.", url: "https://naviigps.com/gps-tracker/delhi", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Delhi" }] } };
export default function DelhiPage() { return <DelhiGpsPage />; }
