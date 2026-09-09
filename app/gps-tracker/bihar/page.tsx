import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "bihar")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Bihar | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Bihar for cars, trucks, buses, logistics fleets and commercial vehicles across Patna, Gaya, Muzaffarpur and other cities.",
  keywords: [
    "GPS tracker Bihar",
    "vehicle tracking Bihar",
    "GPS tracker Patna",
    "fleet management Bihar",
    "commercial vehicle GPS Bihar",
  ],
};

export default function BiharGpsPage() {
  return <StateGpsPage state={state} />;
}
