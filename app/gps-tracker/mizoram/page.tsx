import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "mizoram")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Mizoram | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Mizoram for cars, trucks, buses, passenger transport and commercial fleets across Aizawl, Lunglei, Champhai and other cities.",
  keywords: [
    "GPS tracker Mizoram",
    "vehicle tracking Mizoram",
    "GPS tracker Aizawl",
    "fleet management Mizoram",
    "commercial vehicle GPS Mizoram",
  ],
};

export default function MizoramGpsPage() {
  return <StateGpsPage state={state} />;
}
