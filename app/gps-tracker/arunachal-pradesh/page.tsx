import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "arunachal-pradesh")!;

export const metadata: Metadata = {
  title: "GPS Tracker in Arunachal Pradesh | Vehicle Tracking System",
  description:
    "GPS tracker and vehicle tracking solutions in Arunachal Pradesh for cars, trucks, buses, institutional fleets and commercial vehicles across Itanagar, Naharlagun, Pasighat and other cities.",
  keywords: uniqueKeywords([...new Set([...[
    "GPS tracker Arunachal Pradesh",
    "vehicle tracking Arunachal Pradesh",
    "GPS tracker Itanagar",
    "fleet management Arunachal Pradesh",
    "commercial vehicle GPS Arunachal Pradesh",
  ], ...generateLocalKeywords(state.name, state.sectors)])]),
};

export default function ArunachalPradeshGpsPage() {
  return <StateGpsPage state={state} />;
}
