import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  MapPinned,
  RadioTower,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

export const metadata: Metadata = {
  title: "Truck GPS Tracking System in India | NAVII GPS",
  description:
    "Truck GPS tracking system for live truck location, route monitoring, trip history, geofencing, vehicle alerts and fleet visibility. NAVII GPS helps transport and logistics operators manage commercial trucks across India.",
  keywords: [
    "truck GPS tracking system",
    "truck GPS tracker India",
    "GPS tracker for truck",
    "truck tracking system India",
    "truck GPS tracking software",
    "commercial truck GPS tracker",
    "heavy vehicle GPS tracking",
    "fleet GPS tracking system",
    "logistics fleet tracking",
    "truck fleet management software",
    "vehicle tracking system India",
    "commercial vehicle tracking system",
  ],
  alternates: {
    canonical: "https://naviigps.com/truck-gps",
  },
  openGraph: {
    title: "Truck GPS Tracking System in India | NAVII GPS",
    description:
      "Track trucks and commercial fleets with live location, route history, geofencing, alerts and fleet monitoring through NAVII GPS.",
    url: "https://naviigps.com/truck-gps",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NAVII GPS truck GPS tracking system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truck GPS Tracking System | NAVII GPS INDIA",
    description:
      "Live truck tracking, route history, geofencing and fleet alerts for commercial transport operations.",
    images: ["/og-image.jpg"],
  },
};

const features = [
  {
    title: "Live Truck Location",
    description:
      "See the latest location and operational status of connected trucks through the NAVII GPS tracking platform.",
    icon: RadioTower,
  },
  {
    title: "Route & Trip History",
    description:
      "Review completed trips and route activity to support dispatch planning, fleet control and operational analysis.",
    icon: Route,
  },
  {
    title: "Geofence & Vehicle Alerts",
    description:
      "Create location boundaries and configure alerts for important vehicle movements and fleet events.",
    icon: ShieldCheck,
  },
  {
    title: "Fleet Performance Visibility",
    description:
      "Use vehicle activity, trip records and fleet reports to improve utilization and day-to-day transport oversight.",
    icon: Gauge,
  },
];

const useCases = [
  "Logistics and transport companies",
  "Heavy commercial truck fleets",
  "Fleet owners and operators",
  "Goods and cargo transport",
  "Contracted transport fleets",
  "Multi-vehicle logistics operations",
];

export default function TruckGPSPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/truck-gps#webpage",
        url: "https://naviigps.com/truck-gps",
        name: "Truck GPS Tracking System in India | NAVII GPS",
        description: metadata.description,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/truck-gps#service",
        name: "Truck GPS Tracking System",
        serviceType: "Truck GPS Tracking and Fleet Monitoring",
        provider: { "@type": "Organization", name: "NAVII GPS INDIA" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/truck-gps",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "Truck GPS", item: "https://naviigps.com/truck-gps" },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        <section className="relative overflow-hidden bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-4xl">
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-cyan-200">
                COMMERCIAL TRUCK GPS
              </span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                Truck GPS Tracking System
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  for Smarter Fleet Operations
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                Track trucks and commercial vehicles with live location visibility, route history, geofencing and configurable alerts through the NAVII GPS platform.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">
                  Discuss Truck Tracking <ArrowRight size={19} />
                </Link>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">
                  Explore GPS Trackers
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">TRUCK TRACKING FEATURES</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Visibility across every truck trip</h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Connect suitable GPS hardware with NAVII GPS software to monitor commercial trucks and logistics fleets from one platform.
              </p>
            </div>
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div>
                    <h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-700">WHO IT SUPPORTS</span>
              <h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">Built for truck and logistics fleets</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Use GPS tracking to improve visibility across goods transport, heavy commercial vehicles and multi-truck logistics operations. Configure monitoring workflows around your fleet requirements.
              </p>
              <ul className="mt-8 space-y-4">
                {useCases.map((useCase) => (
                  <li key={useCase} className="flex gap-3 text-slate-700"><CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={20} />{useCase}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-2xl md:p-12">
              <Truck size={44} className="text-cyan-300" />
              <h3 className="mt-7 text-3xl font-bold">Control Your Truck Fleet</h3>
              <p className="mt-5 leading-8 text-slate-300">
                Monitor trucks, routes and fleet activity while giving authorized teams a clearer view of daily transport operations.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Live Truck Tracking</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Trip History</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Geofence Alerts</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Fleet Reports</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-9 text-center md:p-12">
              <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Explore GPS Tracking for Logistics Fleets</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Combine truck tracking with fleet management software and suitable GPS devices for a complete commercial vehicle monitoring setup.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Fleet Management Software <ArrowRight size={18} /></Link>
                <Link href="/industries" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">Industry Solutions</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-8">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="text-slate-600">
              Looking for a truck GPS tracker? Explore the <Link href="/products/g17-gps-tracker" className="font-semibold text-blue-700 hover:text-blue-800">G17 GPS Tracker</Link> or discuss your fleet requirement with NAVII GPS.
            </p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white md:p-14">
              <h2 className="text-4xl font-extrabold">Need Truck GPS Tracking?</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">
                Share your number of trucks, operating routes and tracking requirements with NAVII GPS so the appropriate hardware and software configuration can be evaluated.
              </p>
              <Link href="/contact" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-slate-100">
                Contact NAVII GPS <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
