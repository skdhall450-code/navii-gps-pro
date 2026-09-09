import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "ahmedabad")!;
export const metadata: Metadata = { title: "GPS Tracker in Ahmedabad | Vehicle Tracking System | NAVII GPS", description: "GPS trackers and vehicle tracking systems in Ahmedabad for cars, manufacturing logistics, textile distribution and commercial fleets across Gujarat.", keywords: ["GPS tracker in Ahmedabad", "GPS tracker Ahmedabad", "vehicle tracking system Ahmedabad", "car GPS tracker Ahmedabad", "truck GPS tracking Ahmedabad", "fleet management software Ahmedabad", "commercial vehicle GPS Gujarat"], alternates: { canonical: "https://naviigps.com/gps-tracker/ahmedabad" }, openGraph: { title: "GPS Tracker in Ahmedabad | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Ahmedabad.", url: "https://naviigps.com/gps-tracker/ahmedabad", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Ahmedabad" }] } };
export default function AhmedabadPage() { return <CityGpsPage city={city} />; }
