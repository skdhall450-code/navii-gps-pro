import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GPS Fleet Management Software in India | NAVII GPS",
  description: "GPS fleet management software for real-time vehicle tracking, fleet monitoring, route history, geofencing, alerts, reports and operational visibility across India.",
  keywords: [
    "GPS fleet management software",
    "GPS fleet management software India",
    "fleet management software",
    "fleet management software India",
    "GPS tracking software",
    "vehicle tracking software",
    "fleet GPS tracking software",
    "vehicle tracking system software",
    "real-time fleet tracking software",
    "commercial fleet management software",
    "GPS tracking system India",
    "fleet tracking system India",
  ],
  alternates: { canonical: "https://naviigps.com/software" },
  openGraph: {
    title: "GPS Fleet Management Software in India | NAVII GPS",
    description: "Manage vehicle fleets with real-time GPS tracking, route history, geofencing, alerts, reports and fleet visibility.",
    url: "https://naviigps.com/software",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS fleet management software" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPS Fleet Management Software in India | NAVII GPS",
    description: "Real-time fleet tracking, vehicle monitoring, alerts, reports and geofencing with NAVII GPS.",
    images: ["/og-image.jpg"],
  },
};

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

import SoftwareHero from "@/components/software/hero/SoftwareHero";
import DashboardPreview from "@/components/software/dashboard/DashboardPreview";
import SoftwareFeatures from "@/components/software/features/SoftwareFeatures";
import SoftwareModules from "@/components/software/modules/SoftwareModules";
import MobileApps from "@/components/software/apps/MobileApps";
import IndustrySupport from "@/components/software/industries/IndustrySupport";
import CTA from "@/components/software/CTA";

export default function SoftwarePage() {
  return (
    <>
      <Header />
      <main>
        <SoftwareHero />
        <DashboardPreview />
        <SoftwareFeatures />
        <SoftwareModules />
        <MobileApps />
        <IndustrySupport />

        <section className="bg-slate-50 py-10">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">GPS Fleet Management Software</h2>
            <p className="mx-auto mt-3 max-w-3xl text-slate-600">Manage cars, trucks, buses and commercial fleets with real-time vehicle tracking, route history, geofencing, alerts and operational reports.</p>
            <Link href="/ais-140-gps" className="mt-5 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore AIS-140 GPS Tracking</Link>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
