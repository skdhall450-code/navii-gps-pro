import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "manipur")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Manipur | Vehicle Tracking System | NAVII GPS",
  description:
    "GPS tracker and vehicle tracking solutions in Manipur for cars, trucks, buses, institutional fleets and commercial vehicles across Imphal, Thoubal, Bishnupur and other cities.",
  keywords: [
    "GPS tracker Manipur",
    "vehicle tracking Manipur",
    "GPS tracker Imphal",
    "fleet management Manipur",
    "commercial vehicle GPS Manipur",
  ],
};

export default function ManipurGpsPage() {
  return <StateGpsPage state={state} />;
}
