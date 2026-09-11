import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "assam")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Assam | Vehicle Tracking System",
  description:
    "GPS tracker and vehicle tracking solutions in Assam for cars, trucks, buses, logistics fleets and commercial vehicles across Guwahati, Dibrugarh, Silchar and other cities.",
  keywords: uniqueKeywords([...new Set([...[
    "GPS tracker Assam",
    "vehicle tracking Assam",
    "GPS tracker Guwahati",
    "fleet management Assam",
    "commercial vehicle GPS Assam",
  ], ...generateLocalKeywords(state.name, state.sectors)])]),
};

export default function AssamGpsPage() {
  return <StateGpsPage state={state} />;
}
