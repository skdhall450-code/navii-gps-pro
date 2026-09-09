import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "imphal")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Imphal | Vehicle Tracking System | NAVII GPS",
  description: "GPS tracker and vehicle tracking solutions in Imphal, Manipur for cars, trucks, buses and commercial fleets.",
  keywords: ["GPS tracker Imphal", "vehicle tracking Imphal", "fleet management Imphal", "GPS tracker Manipur"],
};

export default function ImphalGpsPage() {
  return <CityGpsPage city={city} />;
}
