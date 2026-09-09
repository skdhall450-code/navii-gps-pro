import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "bahrain")!;
export const metadata: Metadata = { title: "GPS Tracker in Bahrain | Fleet Tracking Software | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Manama, Muharraq, Riffa and across Bahrain. Confirm network and deployment compatibility.", keywords: ["GPS tracker Bahrain", "vehicle tracking system Bahrain", "GPS tracker Manama", "fleet management software Bahrain", "commercial vehicle tracking Bahrain"], alternates: { canonical: "https://naviigps.com/gps-tracker/bahrain" } };
export default function BahrainPage() { return <CountryGpsPage country={country} />; }
