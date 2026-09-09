import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "canada")!;
export const metadata: Metadata = { title: "GPS Tracker in Canada | Fleet Tracking Software | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Toronto, Vancouver, Montreal, Calgary and across Canada.", keywords: ["GPS tracker Canada", "vehicle tracking system Canada", "GPS tracker Toronto", "fleet management software Canada", "truck tracking Canada"], alternates: { canonical: "https://naviigps.com/gps-tracker/canada" } };
export default function CanadaPage() { return <CountryGpsPage country={country} />; }
