import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "itanagar")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Itanagar | Vehicle Tracking System | NAVII GPS",
  description: "GPS tracker and vehicle tracking solutions in Itanagar, Arunachal Pradesh for cars, trucks, buses and commercial fleets.",
  keywords: ["GPS tracker Itanagar", "vehicle tracking Itanagar", "fleet management Itanagar", "GPS tracker Arunachal Pradesh"],
};

export default function ItanagarGpsPage() {
  return <CityGpsPage city={city} />;
}
