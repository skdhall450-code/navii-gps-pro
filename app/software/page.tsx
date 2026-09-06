import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fleet Management Software India | GPS Tracking Software | NAVII GPS",
  description: "Fleet management software in India for real-time GPS vehicle tracking, fleet monitoring, route history, geofencing, alerts, reports and operational visibility for cars, trucks, buses and commercial fleets.",
  keywords: [
    "fleet management software India",
    "GPS fleet management software",
    "GPS fleet management software India",
    "fleet management system India",
    "fleet tracking software India",
    "GPS tracking software India",
    "vehicle tracking software India",
    "fleet GPS tracking software",
    "vehicle tracking system software",
    "real-time fleet tracking software",
    "commercial fleet management software",
    "GPS tracking system India",
    "fleet tracking system India",
  ],
  alternates: { canonical: "https://naviigps.com/software" },
  openGraph: {
    title: "Fleet Management Software India | NAVII GPS",
    description: "Manage vehicle fleets with real-time GPS tracking, route history, geofencing, alerts, reports and fleet visibility.",
    url: "https://naviigps.com/software",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS fleet management software in India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fleet Management Software India | NAVII GPS",
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

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Fleet Management Software in India</h2>
              <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                NAVII GPS provides fleet management software for businesses that need real-time visibility across cars, trucks, buses and commercial vehicles. Monitor vehicle activity, trips and fleet events from a connected GPS tracking platform.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-bold text-slate-900">Live Vehicle Tracking</h3><p className="mt-2 text-sm leading-6 text-slate-600">View connected vehicles and fleet movement with real-time GPS visibility.</p></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-bold text-slate-900">Routes & Trip History</h3><p className="mt-2 text-sm leading-6 text-slate-600">Review routes and completed trips to support transport operations.</p></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-bold text-slate-900">Geofencing & Alerts</h3><p className="mt-2 text-sm leading-6 text-slate-600">Set location boundaries and monitor important fleet events with alerts.</p></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-bold text-slate-900">Reports & Fleet Visibility</h3><p className="mt-2 text-sm leading-6 text-slate-600">Use vehicle and trip information to improve day-to-day fleet oversight.</p></div>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/truck-gps" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">Truck GPS Tracking</Link>
              <Link href="/logistics-fleet-gps" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">Logistics Fleet Tracking</Link>
              <Link href="/commercial-vehicle-tracking" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">Commercial Vehicle Tracking</Link>
              <Link href="/4g-gps-tracker" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">4G GPS Tracker</Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">GPS Fleet Management for Indian Transport Operations</h2>
            <p className="mx-auto mt-3 max-w-3xl text-slate-600">Explore deployment-focused tracking for logistics, commercial transport, public transport and other multi-vehicle operations across India.</p>
            <Link href="/ais-140-gps" className="mt-5 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore AIS-140 GPS Tracking</Link>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
