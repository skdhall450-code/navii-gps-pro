import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "sikkim")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Sikkim | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Sikkim for cars, trucks, buses, tourism fleets and institutional vehicles across Gangtok, Namchi, Gyalshing and other cities.",
  keywords: [
    "GPS tracker Sikkim",
    "vehicle tracking Sikkim",
    "GPS tracker Gangtok",
    "fleet management Sikkim",
    "commercial vehicle GPS Sikkim",
  ],
};

export default function SikkimGpsPage() {
  return <StateGpsPage state={state} />;
}
