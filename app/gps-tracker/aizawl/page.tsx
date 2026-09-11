import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "aizawl")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Aizawl | Vehicle Tracking System",
  description: "GPS tracker and vehicle tracking solutions in Aizawl, Mizoram for cars, trucks, buses, passenger transport and commercial fleets.",
  keywords: uniqueKeywords([...new Set([...["GPS tracker Aizawl", "vehicle tracking Aizawl", "fleet management Aizawl", "GPS tracker Mizoram"], ...generateLocalKeywords(city.name, city.sectors)])]),
};

export default function AizawlGpsPage() {
  return <CityGpsPage city={city} />;
}
