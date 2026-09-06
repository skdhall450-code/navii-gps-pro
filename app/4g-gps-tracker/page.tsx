import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Gauge, MapPinned, RadioTower, Route, ShieldCheck, Smartphone } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

export const metadata: Metadata = {
  title: "4G GPS Tracker for Vehicle in India | NAVII GPS",
  description:
    "4G GPS tracker for vehicles with connected live location, route history, geofencing and fleet alerts. Explore the GS900 4G GPS Tracker and NAVII GPS vehicle tracking platform.",
  keywords: [
    "4G GPS tracker for vehicle",
    "4G GPS tracker India",
    "4G vehicle GPS tracker",
    "4G GPS tracking device",
    "4G GPS tracker for car",
    "4G GPS tracker for truck",
    "4G vehicle tracking system",
    "4G GPS tracking system India",
    "4G fleet GPS tracker",
    "GS900 4G GPS Tracker",
    "real-time 4G vehicle tracking",
    "vehicle tracking system India",
  ],
  alternates: { canonical: "https://naviigps.com/4g-gps-tracker" },
  openGraph: {
    title: "4G GPS Tracker for Vehicle in India | NAVII GPS",
    description: "Connected 4G GPS tracking for cars, trucks and vehicle fleets with live monitoring, routes, geofences and alerts.",
    url: "https://naviigps.com/4g-gps-tracker",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS 4G GPS tracker for vehicle" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "4G GPS Tracker for Vehicle | NAVII GPS INDIA",
    description: "4G vehicle GPS tracking with live location, route history, geofencing and fleet alerts.",
    images: ["/og-image.jpg"],
  },
};

const features = [
  { title: "4G Mobile Connectivity", description: "Use supported 4G mobile connectivity for connected vehicle data communication, subject to network coverage and hardware configuration.", icon: RadioTower },
  { title: "Live Vehicle Location", description: "View the latest reported GNSS location of connected cars, trucks and other supported vehicles through the tracking platform.", icon: MapPinned },
  { title: "Route & Trip History", description: "Review available journeys and route activity to support vehicle monitoring, dispatch and fleet operations.", icon: Route },
  { title: "Geofence & Fleet Alerts", description: "Configure location boundaries and vehicle alerts according to the deployed device and platform configuration.", icon: ShieldCheck },
];

const useCases = [
  "Cars and personal vehicles",
  "Commercial vehicle fleets",
  "Truck and transport operations",
  "Logistics and delivery fleets",
  "Company and employee vehicles",
  "Multi-vehicle fleet monitoring",
];

export default function FourGGpsTrackerPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/4g-gps-tracker#webpage",
        url: "https://naviigps.com/4g-gps-tracker",
        name: "4G GPS Tracker for Vehicle in India | NAVII GPS",
        description: metadata.description,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/4g-gps-tracker#service",
        name: "4G GPS Tracker for Vehicle",
        serviceType: "4G Vehicle GPS Tracking",
        provider: { "@type": "Organization", name: "NAVII GPS INDIA" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/4g-gps-tracker",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "4G GPS Tracker", item: "https://naviigps.com/4g-gps-tracker" },
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
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-cyan-200">4G VEHICLE GPS</span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                4G GPS Tracker for Vehicle
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">for Connected Fleet Tracking</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                Monitor connected vehicles with 4G mobile connectivity, live location visibility, route history, geofencing and configurable fleet alerts through the NAVII GPS platform.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/products/gs900-4g-gps-tracker" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Explore GS900 4G GPS Tracker <ArrowRight size={19} /></Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">Discuss Your Requirement</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">4G GPS TRACKING FEATURES</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Connected tracking for modern vehicles</h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">The exact functions available depend on the selected 4G hardware, installation, network coverage and NAVII GPS platform configuration.</p>
            </div>
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => { const Icon = feature.icon; return <article key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3><p className="mt-3 leading-7 text-slate-600">{feature.description}</p></article>; })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-700">WHERE 4G GPS TRACKING HELPS</span>
              <h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">4G tracking for cars, trucks and fleets</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">A 4G vehicle GPS tracker can support connected location monitoring across personal vehicles, transport operations and multi-vehicle fleets.</p>
              <ul className="mt-8 space-y-4">{useCases.map((item) => <li key={item} className="flex gap-3 text-slate-700"><CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={20} />{item}</li>)}</ul>
            </div>
            <div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-2xl md:p-12">
              <Smartphone size={44} className="text-cyan-300" />
              <h3 className="mt-7 text-3xl font-bold">Why choose 4G connectivity?</h3>
              <p className="mt-5 leading-8 text-slate-300">4G connectivity provides a modern cellular communication path for compatible tracking hardware. Actual availability depends on the device, SIM/network and coverage at the vehicle location.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2"><span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">4G Connectivity</span><span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Live Location</span><span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Route History</span><span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Fleet Alerts</span></div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6"><div className="rounded-[32px] border border-slate-200 bg-slate-50 p-9 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Explore the GS900 4G GPS Tracker</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">The NAVII GS900 is listed as a 4G vehicle tracking solution for live monitoring, fleet history and configurable alerts. Hardware functions remain configuration dependent.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4"><Link href="/products/gs900-4g-gps-tracker" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">View GS900 Product <ArrowRight size={18} /></Link><Link href="/software" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">GPS Tracking Software</Link><Link href="/products" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">All GPS Trackers</Link></div>
          </div></div>
        </section>

        <section className="bg-white py-16"><div className="mx-auto max-w-6xl px-6"><div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white md:p-14"><h2 className="text-4xl font-extrabold">Need a 4G GPS Tracker for Your Vehicle?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">Share your vehicle type, operating area and tracking requirements with NAVII GPS so the appropriate hardware and software configuration can be evaluated.</p><Link href="/contact" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-slate-100">Contact NAVII GPS <ArrowRight size={19} /></Link></div></div></section>
      </main>
      <Footer />
    </>
  );
}
