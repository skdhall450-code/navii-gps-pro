import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "qatar")!;
export const metadata: Metadata = { title: "GPS Tracker in Qatar | Fleet Tracking Software | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Doha, Al Rayyan, Al Wakrah and across Qatar. Confirm network and deployment compatibility.", keywords: ["GPS tracker Qatar", "vehicle tracking system Qatar", "GPS tracker Doha", "fleet management software Qatar", "commercial vehicle tracking Doha"], alternates: { canonical: "https://naviigps.com/gps-tracker/qatar" } };
export default function QatarPage() { return <CountryGpsPage country={country} />; }
