import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "united-kingdom")!;
export const metadata: Metadata = { title: "GPS Tracker in United Kingdom | Fleet Tracking | NAVII GPS", description: "GPS tracking devices and fleet software planning for commercial vehicles in London, Birmingham, Manchester and across the United Kingdom.", keywords: ["GPS tracker UK", "vehicle tracking system United Kingdom", "GPS tracker London", "fleet management software UK", "commercial vehicle tracking UK"], alternates: { canonical: "https://naviigps.com/gps-tracker/united-kingdom" } };
export default function UnitedKingdomPage() { return <CountryGpsPage country={country} />; }
