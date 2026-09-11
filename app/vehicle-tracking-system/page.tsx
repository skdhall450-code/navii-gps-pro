import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BellRing, History, MapPinned, Route, ShieldCheck, Truck } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

export const metadata: Metadata = {
  title: "Vehicle Tracking System India",
  description:
    "Vehicle tracking system for cars, trucks, buses and commercial fleets in India with live GPS location, route history, geofencing, alerts and reports.",
  keywords: uniqueKeywords([
    "vehicle tracking system",
    "vehicle tracking system India",
    "GPS vehicle tracking system",
    "vehicle tracking software",
    "vehicle GPS tracking",
    "vehicle tracking device",
    "car vehicle tracking system",
    "commercial vehicle tracking system",
    "fleet vehicle tracking",
    "GPS fleet tracking software",
    "real-time vehicle tracking",
    "GPS tracking company India",
  ]),
  alternates: { canonical: "https://naviigps.com/vehicle-tracking-system" },
  openGraph: {
    title: "Vehicle Tracking System in India | NAVII GPS",
    description:
      "Real-time vehicle tracking for cars, trucks, buses and commercial fleets with GPS location, routes, geofencing, alerts and reports.",
    url: "https://naviigps.com/vehicle-tracking-system",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS vehicle tracking system" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vehicle Tracking System in India | NAVII GPS",
    description: "Live vehicle tracking, routes, alerts, geofencing and fleet reports for India.",
    images: ["/og-image.jpg"],
  },
};

const features = [
  { title: "Live Vehicle Location", description: "See the latest location of connected vehicles through the NAVII GPS tracking platform.", icon: MapPinned },
  { title: "Route & Trip History", description: "Review routes and trip history to understand vehicle movement and daily operations.", icon: History },
  { title: "Geofencing & Alerts", description: "Use location boundaries and configurable alerts to improve operational awareness.", icon: BellRing },
  { title: "Fleet Reports", description: "Use tracking data and reports to support planning, control and fleet performance reviews.", icon: Route },
];

export default function VehicleTrackingSystemPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/vehicle-tracking-system#webpage",
        url: "https://naviigps.com/vehicle-tracking-system",
        name: "Vehicle Tracking System in India | NAVII GPS",
        description: metadata.description,
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/vehicle-tracking-system#service",
        name: "Vehicle Tracking System",
        serviceType: "GPS Vehicle Tracking",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/vehicle-tracking-system",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "Vehicle Tracking System", item: "https://naviigps.com/vehicle-tracking-system" },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

        <section className="relative overflow-hidden bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-4xl">
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-cyan-200">VEHICLE TRACKING SYSTEM</span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                Vehicle Tracking System in India
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">for Cars, Trucks & Fleets</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                Monitor connected vehicles with live GPS location, route history, geofencing, configurable alerts and fleet reports through the NAVII GPS platform.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Explore GPS Tracking Devices <ArrowRight size={19} /></Link>
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">Explore Tracking Software</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">CORE TRACKING FEATURES</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Everything you need for vehicle visibility</h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">Combine suitable GPS hardware with tracking software to improve visibility across personal, commercial and fleet vehicles.</p>
            </div>
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return <article key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3><p className="mt-3 leading-7 text-slate-600">{feature.description}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-3xl border border-slate-200 bg-white p-8"><CarIcon /><h3 className="mt-5 text-2xl font-bold text-slate-900">Cars & Personal Vehicles</h3><p className="mt-3 leading-7 text-slate-600">Improve visibility for personal and business cars with live location, trip history and configurable vehicle alerts.</p><Link href="/gps-tracker-for-car" className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">GPS Tracker for Car <ArrowRight size={17} /></Link></article>
              <article className="rounded-3xl border border-slate-200 bg-white p-8"><Truck size={34} className="text-cyan-700" /><h3 className="mt-5 text-2xl font-bold text-slate-900">Trucks & Commercial Fleets</h3><p className="mt-3 leading-7 text-slate-600">Track commercial vehicles and trucks with fleet visibility, routes, geofencing and operational reports.</p><Link href="/truck-gps" className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">Truck GPS Tracking <ArrowRight size={17} /></Link></article>
              <article className="rounded-3xl border border-slate-200 bg-white p-8"><ShieldCheck size={34} className="text-cyan-700" /><h3 className="mt-5 text-2xl font-bold text-slate-900">Fleet Operations</h3><p className="mt-3 leading-7 text-slate-600">Connect tracking devices with fleet software for centralized monitoring, alerts and reporting.</p><Link href="/commercial-vehicle-tracking" className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">Commercial Vehicle Tracking <ArrowRight size={17} /></Link></article>
            </div>
          </div>
        </section>

        <section className="bg-[#06142E] py-20 text-white">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-4xl font-extrabold md:text-5xl">Choose the right vehicle tracking setup</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">Tell NAVII GPS about your vehicle type and tracking requirements. We can help you identify a suitable device and software workflow.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4"><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Discuss Your Requirement <ArrowRight size={19} /></Link><Link href="/4g-gps-tracker" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">Explore 4G GPS Tracker</Link></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function CarIcon() {
  return <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700"><span className="text-lg">🚗</span></div>;
}
