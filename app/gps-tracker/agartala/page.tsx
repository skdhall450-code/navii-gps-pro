import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "agartala")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Agartala | Vehicle Tracking System",
  description: "GPS tracker and vehicle tracking solutions in Agartala, Tripura for cars, trucks, buses and commercial fleets.",
  keywords: uniqueKeywords([...new Set([...["GPS tracker Agartala", "vehicle tracking Agartala", "fleet management Agartala", "GPS tracker Tripura"], ...generateLocalKeywords(city.name, city.sectors)])]),
};

export default function AgartalaGpsPage() {
  return <CityGpsPage city={city} />;
}
