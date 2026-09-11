import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "udaipur")!;
export const metadata: Metadata = { title: "GPS Tracker in Udaipur, Tripura | Vehicle Tracking System", description: "GPS tracker and vehicle tracking solutions in Udaipur, Tripura for cars, trucks, buses, commercial fleets and institutional transport.", keywords: uniqueKeywords([...new Set([...["GPS tracker Udaipur Tripura", "vehicle tracking Udaipur Tripura", "fleet management Tripura", "commercial vehicle GPS Tripura", "GPS tracker Tripura"], ...generateLocalKeywords(city.name, city.sectors)])]), alternates: { canonical: "https://naviigps.com/gps-tracker/udaipur" }, openGraph: { title: "GPS Tracker in Udaipur, Tripura | NAVII GPS", description: "Vehicle GPS tracking and fleet management solutions in Udaipur, Tripura.", url: "https://naviigps.com/gps-tracker/udaipur", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Udaipur, Tripura" }] } };
export default function UdaipurPage() { return <CityGpsPage city={city} />; }
