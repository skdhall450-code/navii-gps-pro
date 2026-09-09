import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "uae")!;
export const metadata: Metadata = { title: "GPS Tracker in UAE | Fleet Tracking Software | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Dubai, Abu Dhabi, Sharjah and across the UAE. Confirm network and deployment compatibility.", keywords: ["GPS tracker UAE", "vehicle tracking system UAE", "GPS tracker Dubai", "fleet management software UAE", "commercial vehicle tracking Dubai"], alternates: { canonical: "https://naviigps.com/gps-tracker/uae" } };
export default function UaePage() { return <CountryGpsPage country={country} />; }
