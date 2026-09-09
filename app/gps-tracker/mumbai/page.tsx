import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "mumbai")!;
export const metadata: Metadata = { title: "GPS Tracker in Mumbai | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Mumbai for cars, port logistics, delivery vehicles, corporate transport and commercial fleets across Maharashtra.", keywords: ["GPS tracker in Mumbai", "GPS tracker Mumbai", "vehicle tracking system Mumbai", "car GPS tracker Mumbai", "truck GPS tracking Mumbai", "fleet management software Mumbai", "GPS tracker Navi Mumbai", "GPS tracker Thane"], alternates: { canonical: "https://naviigps.com/gps-tracker/mumbai" }, openGraph: { title: "GPS Tracker in Mumbai | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Mumbai.", url: "https://naviigps.com/gps-tracker/mumbai", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Mumbai" }] } };
export default function MumbaiPage() { return <CityGpsPage city={city} />; }
