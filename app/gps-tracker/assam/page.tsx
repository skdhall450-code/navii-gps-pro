import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "assam")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Assam | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Assam for cars, trucks, buses, logistics fleets and commercial vehicles across Guwahati, Dibrugarh, Silchar and other cities.",
  keywords: [
    "GPS tracker Assam",
    "vehicle tracking Assam",
    "GPS tracker Guwahati",
    "fleet management Assam",
    "commercial vehicle GPS Assam",
  ],
};

export default function AssamGpsPage() {
  return <StateGpsPage state={state} />;
}
