import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "meghalaya")!;

export const metadata: Metadata = {
  alternates: { canonical: "https://naviigps.com/gps-tracker/meghalaya" },
  openGraph: { title: "GPS Tracker in Meghalaya | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Meghalaya for cars, trucks, buses, tourism fleets and commercial vehicles across Shillong, Tura, Jowai and other cities.", url: "https://naviigps.com/gps-tracker/meghalaya", type: "website", images: ["/og-image.jpg"] },
  title: "GPS Tracker in Meghalaya | Vehicle Tracking System",
  description:
    "GPS tracker and vehicle tracking solutions in Meghalaya for cars, trucks, buses, tourism fleets and commercial vehicles across Shillong, Tura, Jowai and other cities.",
  keywords: uniqueKeywords([...new Set([...[
    "GPS tracker Meghalaya",
    "vehicle tracking Meghalaya",
    "GPS tracker Shillong",
    "fleet management Meghalaya",
    "commercial vehicle GPS Meghalaya",
  ], ...generateLocalKeywords(state.name, state.sectors)])]),
};

export default function MeghalayaGpsPage() {
  return <StateGpsPage state={state} />;
}
