import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "dibrugarh")!;
export const metadata: Metadata = { title: "GPS Tracker in Dibrugarh | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Dibrugarh for cars, trucks, buses, tea logistics and commercial fleets across Assam.", keywords: ["GPS tracker Dibrugarh", "vehicle tracking Dibrugarh", "fleet management Assam", "truck GPS Dibrugarh", "commercial vehicle GPS Dibrugarh"], alternates: { canonical: "https://naviigps.com/gps-tracker/dibrugarh" }, openGraph: { title: "GPS Tracker in Dibrugarh | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Dibrugarh.", url: "https://naviigps.com/gps-tracker/dibrugarh", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Dibrugarh" }] } };
export default function DibrugarhPage() { return <CityGpsPage city={city} />; }
