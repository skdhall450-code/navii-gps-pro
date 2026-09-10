import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "jorhat")!;
export const metadata: Metadata = { title: "GPS Tracker in Jorhat | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Jorhat for cars, trucks, buses, tea logistics and commercial fleets across Assam.", keywords: ["GPS tracker Jorhat", "vehicle tracking Jorhat", "fleet management Jorhat", "truck GPS Jorhat", "commercial vehicle GPS Assam"], alternates: { canonical: "https://naviigps.com/gps-tracker/jorhat" }, openGraph: { title: "GPS Tracker in Jorhat | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Jorhat.", url: "https://naviigps.com/gps-tracker/jorhat", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Jorhat" }] } };
export default function JorhatPage() { return <CityGpsPage city={city} />; }
