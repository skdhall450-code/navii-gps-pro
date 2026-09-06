import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  CheckCircle2,
  MapPinned,
  RadioTower,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

export const metadata: Metadata = {
  title: "School Bus GPS Tracking System in India | NAVII GPS",
  description:
    "School bus GPS tracking system for live bus location, route monitoring, geofencing, trip history and alerts. Help schools and colleges improve transport visibility with NAVII GPS.",
  keywords: [
    "school bus GPS tracking system",
    "school bus tracking system India",
    "GPS tracker for school bus",
    "school bus GPS tracker",
    "school vehicle tracking system",
    "school bus tracking software",
    "student transport GPS tracking",
    "school fleet management software",
    "bus GPS tracking system India",
    "school bus live tracking",
    "GPS tracking for schools",
    "school transport management system",
  ],
  alternates: {
    canonical: "https://naviigps.com/school-bus-gps",
  },
  openGraph: {
    title: "School Bus GPS Tracking System in India | NAVII GPS",
    description:
      "Live school bus tracking, route monitoring, geofencing, trip history and fleet alerts for school transport operations.",
    url: "https://naviigps.com/school-bus-gps",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NAVII GPS school bus GPS tracking system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "School Bus GPS Tracking System | NAVII GPS INDIA",
    description:
      "Track school buses with live location, route history, geofencing and configurable fleet alerts.",
    images: ["/og-image.jpg"],
  },
};

const features = [
  {
    title: "Live School Bus Location",
    description:
      "View the latest location of connected school buses through the NAVII GPS tracking platform.",
    icon: RadioTower,
  },
  {
    title: "Routes & Trip History",
    description:
      "Review completed routes and trip activity to support school transport planning and monitoring.",
    icon: MapPinned,
  },
  {
    title: "Geofence & Safety Alerts",
    description:
      "Configure location boundaries and vehicle alerts to improve day-to-day transport oversight.",
    icon: ShieldCheck,
  },
  {
    title: "Mobile Visibility",
    description:
      "Give authorized transport teams convenient access to vehicle and trip information through connected software tools.",
    icon: Smartphone,
  },
];

const useCases = [
  "School and college bus fleets",
  "Student transport operators",
  "Private school transport services",
  "Staff and institutional buses",
  "Multi-route school fleets",
  "Contracted bus operators",
];

export default function SchoolBusGPSPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/school-bus-gps#webpage",
        url: "https://naviigps.com/school-bus-gps",
        name: "School Bus GPS Tracking System in India | NAVII GPS",
        description: metadata.description,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/school-bus-gps#service",
        name: "School Bus GPS Tracking System",
        serviceType: "School Bus GPS Tracking and Fleet Monitoring",
        provider: { "@type": "Organization", name: "NAVII GPS INDIA" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/school-bus-gps",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "School Bus GPS", item: "https://naviigps.com/school-bus-gps" },
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
                SCHOOL TRANSPORT GPS
              </span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                School Bus GPS Tracking System
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  for Safer, More Visible Transport
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                Track school buses and institutional vehicles with live location visibility, route history, geofencing and configurable alerts through the NAVII GPS platform.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">
                  Discuss School Bus Tracking <ArrowRight size={19} />
                </Link>
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">
                  Explore GPS Software
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">SCHOOL BUS TRACKING FEATURES</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Everything transport teams need for daily visibility</h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Connect appropriate GPS hardware with NAVII GPS software to monitor school transport operations from one platform.
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
              <h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">Built for school and student transport operations</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Use GPS tracking to improve operational visibility across school buses, staff transport and contracted vehicle fleets. Configure workflows around the needs of your institution and transport team.
              </p>
              <ul className="mt-8 space-y-4">
                {useCases.map((useCase) => (
                  <li key={useCase} className="flex gap-3 text-slate-700"><CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={20} />{useCase}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-2xl md:p-12">
              <Bus size={44} className="text-cyan-300" />
              <h3 className="mt-7 text-3xl font-bold">Improve Transport Visibility</h3>
              <p className="mt-5 leading-8 text-slate-300">
                Monitor buses, routes and fleet activity while giving authorized teams a clearer view of day-to-day school transport operations.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Live Bus Tracking</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Route History</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Geofence Alerts</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Fleet Reports</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white md:p-14">
              <h2 className="text-4xl font-extrabold">Looking for a School Bus GPS Tracking Solution?</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">
                Share your number of buses, routes and transport requirements with NAVII GPS so the appropriate tracking hardware and software configuration can be evaluated.
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
