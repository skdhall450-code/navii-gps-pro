import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "oman")!;
export const metadata: Metadata = { title: "GPS Tracker in Oman | Fleet Tracking Software | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Muscat, Sohar, Salalah and across Oman. Confirm network and deployment compatibility.", keywords: ["GPS tracker Oman", "vehicle tracking system Oman", "GPS tracker Muscat", "fleet management software Oman", "truck tracking Oman"], alternates: { canonical: "https://naviigps.com/gps-tracker/oman" } };
export default function OmanPage() { return <CountryGpsPage country={country} />; }
