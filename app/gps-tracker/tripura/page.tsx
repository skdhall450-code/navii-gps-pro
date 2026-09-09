import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "tripura")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Tripura | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Tripura for cars, trucks, buses, commercial fleets and institutional transport across Agartala, Dharmanagar, Udaipur and other cities.",
  keywords: [
    "GPS tracker Tripura",
    "vehicle tracking Tripura",
    "GPS tracker Agartala",
    "fleet management Tripura",
    "commercial vehicle GPS Tripura",
  ],
};

export default function TripuraGpsPage() {
  return <StateGpsPage state={state} />;
}
