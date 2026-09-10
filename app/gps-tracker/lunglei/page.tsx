import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "lunglei")!;
export const metadata: Metadata = { title: "GPS Tracker in Lunglei | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Lunglei for cars, trucks, buses, passenger transport and institutional vehicles across Mizoram.", keywords: ["GPS tracker Lunglei", "vehicle tracking Lunglei", "fleet management Mizoram", "commercial vehicle GPS Lunglei", "passenger transport GPS Lunglei"], alternates: { canonical: "https://naviigps.com/gps-tracker/lunglei" }, openGraph: { title: "GPS Tracker in Lunglei | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Lunglei.", url: "https://naviigps.com/gps-tracker/lunglei", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Lunglei" }] } };
export default function LungleiPage() { return <CityGpsPage city={city} />; }
