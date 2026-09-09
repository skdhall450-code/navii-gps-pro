import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "nagaland")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Nagaland | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Nagaland for cars, trucks, buses, commercial fleets and institutional vehicles across Dimapur, Kohima, Mokokchung and other cities.",
  keywords: [
    "GPS tracker Nagaland",
    "vehicle tracking Nagaland",
    "GPS tracker Dimapur",
    "fleet management Nagaland",
    "commercial vehicle GPS Nagaland",
  ],
};

export default function NagalandGpsPage() {
  return <StateGpsPage state={state} />;
}
