import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "australia")!;
export const metadata: Metadata = { title: "GPS Tracker in Australia | Fleet Tracking Software | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Sydney, Melbourne, Brisbane, Perth and across Australia.", keywords: ["GPS tracker Australia", "vehicle tracking system Australia", "GPS tracker Sydney", "fleet management software Australia", "truck tracking Australia"], alternates: { canonical: "https://naviigps.com/gps-tracker/australia" } };
export default function AustraliaPage() { return <CountryGpsPage country={country} />; }
