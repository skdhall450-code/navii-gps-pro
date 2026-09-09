import type { Metadata } from "next";
import { CityGpsPage } from "@/components/seo/CityGpsPage";
import { priorityCities } from "@/lib/seo/priorityCities";

const city = priorityCities.find((item) => item.slug === "gangtok")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Gangtok | Vehicle Tracking System | NAVII GPS",
  description: "GPS tracker and vehicle tracking solutions in Gangtok, Sikkim for cars, trucks, buses, tourism and institutional fleets.",
  keywords: ["GPS tracker Gangtok", "vehicle tracking Gangtok", "fleet management Gangtok", "GPS tracker Sikkim"],
};

export default function GangtokGpsPage() {
  return <CityGpsPage city={city} />;
}
