import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  CheckCircle2,
  ClipboardCheck,
  MapPinned,
  RadioTower,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

export const metadata: Metadata = {
  title: "AIS-140 GPS Tracking Solutions for Public Transport",
  description:
    "Explore AIS-140 GPS tracking solutions for buses, public transport and commercial fleets. NAVII GPS supports vehicle tracking, live location visibility, alerts, reports and deployment-focused fleet monitoring.",
  keywords: uniqueKeywords([
    "AIS-140 GPS tracker",
    "AIS 140 GPS tracking system",
    "AIS-140 GPS device",
    "AIS-140 vehicle tracking system",
    "AIS-140 GPS tracker for buses",
    "AIS-140 GPS tracking software",
    "AIS-140 compliant GPS tracking",
    "public transport GPS tracking",
    "bus GPS tracking system India",
    "vehicle tracking system India",
    "commercial vehicle GPS tracking",
    "AIS-140 tracking solution India",
  ]),
  alternates: {
    canonical: "https://naviigps.com/ais-140-gps",
  },
  openGraph: {
    title: "AIS-140 GPS Tracking Solutions | NAVII GPS INDIA",
    description:
      "GPS tracking and fleet monitoring solutions for AIS-140-focused public transport and commercial vehicle deployments.",
    url: "https://naviigps.com/ais-140-gps",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AIS-140 GPS tracking solutions by NAVII GPS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIS-140 GPS Tracking Solutions | NAVII GPS INDIA",
    description:
      "Vehicle tracking software and GPS monitoring solutions for AIS-140-focused transport deployments.",
    images: ["/og-image.jpg"],
  },
};

const features = [
  {
    title: "Live Vehicle Visibility",
    description:
      "Monitor connected buses and commercial vehicles through real-time location visibility on the NAVII GPS platform.",
    icon: RadioTower,
  },
  {
    title: "Routes & Trip History",
    description:
      "Review route history and trip activity to support transport operations and fleet planning.",
    icon: MapPinned,
  },
  {
    title: "Alerts & Monitoring",
    description:
      "Use configurable vehicle and movement alerts to improve day-to-day fleet oversight.",
    icon: ShieldCheck,
  },
  {
    title: "Fleet Reports",
    description:
      "Use operational reports and vehicle data to support fleet visibility and performance review.",
    icon: ClipboardCheck,
  },
];

const deploymentPoints = [
  "Confirm the required AIS-140 hardware and certification for the deployment.",
  "Validate SIM, communication and backend integration requirements before installation.",
  "Configure vehicle, route and alert workflows according to the operating requirement.",
  "Test device communication and tracking visibility before fleet rollout.",
];

export default function AIS140GPSPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/ais-140-gps#webpage",
        url: "https://naviigps.com/ais-140-gps",
        name: "AIS-140 GPS Tracking Solutions for Public Transport | NAVII GPS",
        description: metadata.description,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/ais-140-gps#service",
        name: "AIS-140 GPS Tracking Solutions",
        serviceType: "Vehicle GPS Tracking and Fleet Monitoring",
        provider: { "@type": "Organization", name: "NAVII GPS INDIA" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/ais-140-gps",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "AIS-140 GPS", item: "https://naviigps.com/ais-140-gps" },
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
                AIS-140 GPS SOLUTIONS
              </span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                AIS-140 GPS Tracking Solutions
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  for Public Transport & Fleets
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                Explore deployment-focused GPS tracking and fleet monitoring for
                buses, public transport and commercial vehicle operations where
                AIS-140 requirements apply.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">
                  Discuss AIS-140 Requirement <ArrowRight size={19} />
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
            <div className="max-w-3xl">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">WHY AIS-140 FLEETS NEED A TRACKING PLATFORM</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Connect compliant hardware with practical fleet monitoring</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                AIS-140-focused deployments require more than a GPS device. Fleet teams also need dependable vehicle visibility, operational monitoring and a software workflow that matches their deployment and integration requirements.
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
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-700">DEPLOYMENT STRATEGY</span>
              <h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">Plan the right AIS-140 GPS deployment</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Hardware certification, connectivity, backend integration and operational testing should be validated for the specific fleet and authority requirements before rollout.
              </p>
              <ul className="mt-8 space-y-4">
                {deploymentPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-slate-700"><CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={20} />{point}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-2xl md:p-12">
              <Bus size={42} className="text-cyan-300" />
              <h3 className="mt-7 text-3xl font-bold">Built for Transport Operations</h3>
              <p className="mt-5 leading-8 text-slate-300">
                Use NAVII GPS tracking software with appropriate connected hardware to manage vehicle location, trips, alerts and fleet reporting from one platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="rounded-full bg-white/10 px-4 py-2">Bus Tracking</span>
                <span className="rounded-full bg-white/10 px-4 py-2">Fleet Monitoring</span>
                <span className="rounded-full bg-white/10 px-4 py-2">Route History</span>
                <span className="rounded-full bg-white/10 px-4 py-2">Alerts & Reports</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white md:p-14">
              <Truck className="mx-auto" size={42} />
              <h2 className="mt-6 text-4xl font-extrabold">Looking for an AIS-140 GPS Tracking Solution?</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">
                Share your fleet size, vehicle type and deployment requirements with NAVII GPS so the appropriate hardware and software configuration can be evaluated.
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
