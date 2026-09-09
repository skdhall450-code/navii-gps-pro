import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "odisha")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Odisha | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Odisha for cars, trucks, buses, logistics fleets and commercial vehicles across Bhubaneswar, Cuttack, Rourkela and other cities.",
  keywords: [
    "GPS tracker Odisha",
    "vehicle tracking Odisha",
    "GPS tracker Bhubaneswar",
    "fleet management Odisha",
    "commercial vehicle GPS Odisha",
  ],
};

export default function OdishaGpsPage() {
  return <StateGpsPage state={state} />;
}
