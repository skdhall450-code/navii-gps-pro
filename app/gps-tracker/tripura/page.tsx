import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "tripura")!;

export const metadata: Metadata = {
  alternates: { canonical: "https://naviigps.com/gps-tracker/tripura" },
  openGraph: { title: "GPS Tracker in Tripura | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Tripura for cars, trucks, buses, commercial fleets and institutional transport across Agartala, Dharmanagar, Udaipur and other cities.", url: "https://naviigps.com/gps-tracker/tripura", type: "website", images: ["/og-image.jpg"] },
  title: "GPS Tracker in Tripura | Vehicle Tracking System",
  description:
    "GPS tracker and vehicle tracking solutions in Tripura for cars, trucks, buses, commercial fleets and institutional transport across Agartala, Dharmanagar, Udaipur and other cities.",
  keywords: uniqueKeywords([...new Set([...[
    "GPS tracker Tripura",
    "vehicle tracking Tripura",
    "GPS tracker Agartala",
    "fleet management Tripura",
    "commercial vehicle GPS Tripura",
  ], ...generateLocalKeywords(state.name, state.sectors)])]),
};

export default function TripuraGpsPage() {
  return <StateGpsPage state={state} />;
}
