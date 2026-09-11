import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "sikkim")!;

export const metadata: Metadata = {
  alternates: { canonical: "https://naviigps.com/gps-tracker/sikkim" },
  openGraph: { title: "GPS Tracker in Sikkim | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in Sikkim for cars, trucks, buses, tourism fleets and institutional vehicles across Gangtok, Namchi, Gyalshing and other cities.", url: "https://naviigps.com/gps-tracker/sikkim", type: "website", images: ["/og-image.jpg"] },
  title: "GPS Tracker in Sikkim | Vehicle Tracking System",
  description:
    "GPS tracker and vehicle tracking solutions in Sikkim for cars, trucks, buses, tourism fleets and institutional vehicles across Gangtok, Namchi, Gyalshing and other cities.",
  keywords: uniqueKeywords([...new Set([...[
    "GPS tracker Sikkim",
    "vehicle tracking Sikkim",
    "GPS tracker Gangtok",
    "fleet management Sikkim",
    "commercial vehicle GPS Sikkim",
  ], ...generateLocalKeywords(state.name, state.sectors)])]),
};

export default function SikkimGpsPage() {
  return <StateGpsPage state={state} />;
}
