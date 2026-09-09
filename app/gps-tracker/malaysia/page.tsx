import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "malaysia")!;
export const metadata: Metadata = { title: "GPS Tracker in Malaysia | Fleet Tracking Software | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Kuala Lumpur, Selangor, Johor Bahru, Penang and across Malaysia.", keywords: ["GPS tracker Malaysia", "vehicle tracking system Malaysia", "GPS tracker Kuala Lumpur", "fleet management software Malaysia", "truck tracking Malaysia"], alternates: { canonical: "https://naviigps.com/gps-tracker/malaysia" } };
export default function MalaysiaPage() { return <CountryGpsPage country={country} />; }
