import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "tura")!;
export const metadata: Metadata = { title: "GPS Tracker in Tura | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Tura for cars, trucks, buses, tourism fleets and commercial vehicles across Meghalaya.", keywords: ["GPS tracker Tura", "vehicle tracking Tura", "fleet management Meghalaya", "commercial vehicle GPS Tura", "tourism fleet tracking Tura"], alternates: { canonical: "https://naviigps.com/gps-tracker/tura" }, openGraph: { title: "GPS Tracker in Tura | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Tura.", url: "https://naviigps.com/gps-tracker/tura", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Tura" }] } };
export default function TuraPage() { return <CityGpsPage city={city} />; }
