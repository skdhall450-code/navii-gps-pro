import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "saudi-arabia")!;
export const metadata: Metadata = { title: "GPS Tracker in Saudi Arabia | Fleet Tracking | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Riyadh, Jeddah, Dammam and across Saudi Arabia. Confirm network and deployment compatibility.", keywords: ["GPS tracker Saudi Arabia", "vehicle tracking system Saudi Arabia", "GPS tracker Riyadh", "fleet management software Saudi Arabia", "truck tracking Saudi Arabia"], alternates: { canonical: "https://naviigps.com/gps-tracker/saudi-arabia" } };
export default function SaudiArabiaPage() { return <CountryGpsPage country={country} />; }
