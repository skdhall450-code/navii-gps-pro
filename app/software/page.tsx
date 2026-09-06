import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Fleet Management & GPS Tracking Software",
  description:
    "NAVII GPS tracking and fleet management software provides live vehicle locations, route history, alerts, reports, geofencing and operational analytics.",
  alternates: {
    canonical:
      "https://naviigps.com/software",
  },
  openGraph: {
    title:
      "Fleet Management & GPS Tracking Software | NAVII GPS INDIA",
    description:
      "Monitor vehicles, trips, alerts and fleet operations through the NAVII GPS platform.",
    url:
      "https://naviigps.com/software",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt:
          "NAVII GPS fleet management software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Fleet Management & GPS Tracking Software | NAVII GPS INDIA",
    description:
      "Live tracking, reports, alerts, geofencing and fleet analytics.",
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
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              AIS-140 GPS Tracking Software
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-slate-600">
              Explore deployment-focused GPS tracking for buses and public transport with live vehicle visibility, route history, alerts and reports.
            </p>
            <Link
              href="/ais-140-gps"
              className="mt-5 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Explore AIS-140 GPS Tracking
            </Link>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </>
  );
}
