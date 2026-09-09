import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "meghalaya")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Meghalaya | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Meghalaya for cars, trucks, buses, tourism fleets and commercial vehicles across Shillong, Tura, Jowai and other cities.",
  keywords: [
    "GPS tracker Meghalaya",
    "vehicle tracking Meghalaya",
    "GPS tracker Shillong",
    "fleet management Meghalaya",
    "commercial vehicle GPS Meghalaya",
  ],
};

export default function MeghalayaGpsPage() {
  return <StateGpsPage state={state} />;
}
