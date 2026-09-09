import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "agartala")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Agartala | Vehicle Tracking System | NAVII GPS",
  description: "GPS tracker and vehicle tracking solutions in Agartala, Tripura for cars, trucks, buses and commercial fleets.",
  keywords: ["GPS tracker Agartala", "vehicle tracking Agartala", "fleet management Agartala", "GPS tracker Tripura"],
};

export default function AgartalaGpsPage() {
  return <CityGpsPage city={city} />;
}
