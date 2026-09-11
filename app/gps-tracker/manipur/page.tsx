import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "manipur")!;

export const metadata: Metadata = {
  alternates: { canonical: "https://naviigps.com/gps-tracker/manipur" },
  openGraph: { title: "GPS Tracker in Manipur | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Manipur for cars, trucks, buses, institutional fleets and commercial vehicles across Imphal, Thoubal, Bishnupur and other cities.", url: "https://naviigps.com/gps-tracker/manipur", type: "website", images: ["/og-image.jpg"] },
  title: "GPS Tracker in Manipur | Vehicle Tracking System",
  description:
    "GPS tracker and vehicle tracking solutions in Manipur for cars, trucks, buses, institutional fleets and commercial vehicles across Imphal, Thoubal, Bishnupur and other cities.",
  keywords: uniqueKeywords([...new Set([...[
    "GPS tracker Manipur",
    "vehicle tracking Manipur",
    "GPS tracker Imphal",
    "fleet management Manipur",
    "commercial vehicle GPS Manipur",
  ], ...generateLocalKeywords(state.name, state.sectors)])]),
};

export default function ManipurGpsPage() {
  return <StateGpsPage state={state} />;
}
