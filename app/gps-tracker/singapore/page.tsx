import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "singapore")!;
export const metadata: Metadata = { title: "GPS Tracker in Singapore | Fleet Tracking Software | NAVII GPS", description: "GPS tracking devices and fleet software planning for commercial vehicles across Jurong, Tuas, Changi and Singapore. Confirm regulatory and network compatibility.", keywords: ["GPS tracker Singapore", "vehicle tracking system Singapore", "fleet management software Singapore", "commercial vehicle tracking Singapore", "truck GPS Singapore"], alternates: { canonical: "https://naviigps.com/gps-tracker/singapore" } };
export default function SingaporePage() { return <CountryGpsPage country={country} />; }
