import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "jharkhand")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Jharkhand | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Jharkhand for cars, trucks, buses, logistics fleets and commercial vehicles across Ranchi, Jamshedpur, Dhanbad and other cities.",
  keywords: [
    "GPS tracker Jharkhand",
    "vehicle tracking Jharkhand",
    "GPS tracker Ranchi",
    "fleet management Jharkhand",
    "commercial vehicle GPS Jharkhand",
  ],
};

export default function JharkhandGpsPage() {
  return <StateGpsPage state={state} />;
}
