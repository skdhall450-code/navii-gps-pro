import type { Metadata } from "next";
import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { internationalCountries } from "@/lib/seo/internationalCountries";
const country = internationalCountries.find((item) => item.slug === "new-zealand")!;
export const metadata: Metadata = { title: "GPS Tracker in New Zealand | Fleet Tracking | NAVII GPS", description: "GPS tracking devices and fleet software planning for vehicles in Auckland, Wellington, Christchurch and across New Zealand.", keywords: ["GPS tracker New Zealand", "vehicle tracking system New Zealand", "GPS tracker Auckland", "fleet management software New Zealand", "commercial vehicle tracking NZ"], alternates: { canonical: "https://naviigps.com/gps-tracker/new-zealand" } };
export default function NewZealandPage() { return <CountryGpsPage country={country} />; }
