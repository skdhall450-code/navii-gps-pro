import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "kuwait")!;
export const metadata: Metadata = { title: "GPS Tracker in Kuwait | Fleet Tracking Software | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Kuwait City, Al Ahmadi, Farwaniya and across Kuwait. Confirm deployment compatibility.", keywords: ["GPS tracker Kuwait", "vehicle tracking system Kuwait", "GPS tracker Kuwait City", "fleet management software Kuwait", "commercial vehicle tracking Kuwait"], alternates: { canonical: "https://naviigps.com/gps-tracker/kuwait" } };
export default function KuwaitPage() { return <CountryGpsPage country={country} />; }
