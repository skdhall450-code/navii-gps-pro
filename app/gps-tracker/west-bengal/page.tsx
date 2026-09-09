import type { Metadata } from "next";
import { StateGpsPage } from "@/components/seo/StateGpsPage";
import { indiaStates } from "@/lib/seo/indiaStates";

const state = indiaStates.find((item) => item.slug === "west-bengal")!;
export const metadata: Metadata = { title: "GPS Tracker in West Bengal | Vehicle Tracking System | NAVII GPS", description: "GPS tracker and vehicle tracking solutions in West Bengal for cars, trucks, buses, logistics fleets and commercial vehicles across Kolkata, Siliguri and other cities.", keywords: ["GPS tracker West Bengal", "GPS tracker Kolkata", "vehicle tracking West Bengal", "fleet management West Bengal", "commercial vehicle GPS West Bengal"] };
export default function WestBengalGpsPage() { return <StateGpsPage state={state} />; }
