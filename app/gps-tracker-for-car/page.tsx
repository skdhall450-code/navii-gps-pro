import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Gauge,
  MapPinned,
  Route,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

export const metadata: Metadata = {
  title: "GPS Tracker for Cars India",
  description:
    "GPS tracker for cars with live location, route history, geofencing and vehicle alerts through NAVII GPS tracking solutions across India.",
  keywords: uniqueKeywords([
    "GPS tracker for car",
    "GPS tracker for car India",
    "car GPS tracker",
    "car GPS tracking device",
    "GPS tracking device for car",
    "vehicle GPS tracker",
    "car tracking system",
    "car GPS tracking system",
    "GPS tracker for personal car",
    "4G GPS tracker for car",
    "real-time car tracking",
    "vehicle tracking system India",
  ]),
  alternates: {
    canonical: "https://naviigps.com/gps-tracker-for-car",
  },
  openGraph: {
    title: "GPS Tracker for Car in India | NAVII GPS",
    description:
      "Track cars with live location, route history, geofencing and vehicle alerts using NAVII GPS tracking solutions.",
    url: "https://naviigps.com/gps-tracker-for-car",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NAVII GPS tracker for car",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPS Tracker for Car | NAVII GPS INDIA",
    description:
      "Car GPS tracking with live location, route history, geofencing and vehicle alerts.",
    images: ["/og-image.jpg"],
  },
};

const features = [
  {
    title: "Live Car Location",
    description:
      "View the latest location of a connected car through the NAVII GPS tracking platform for easier vehicle visibility.",
    icon: MapPinned,
  },
  {
    title: "Route & Trip History",
    description:
      "Review route activity and trip history to understand vehicle movement and support day-to-day monitoring.",
    icon: Route,
  },
  {
    title: "Geofence & Alerts",
    description:
      "Use location boundaries and configurable vehicle alerts to stay informed about important movements and events.",
    icon: ShieldCheck,
  },
  {
    title: "Vehicle Activity Visibility",
    description:
      "Use tracking data and reports to improve visibility across personal, business and multi-vehicle operations.",
    icon: Gauge,
  },
];

const useCases = [
  "Personal and family cars",
  "Company and employee vehicles",
  "Taxi and cab operations",
  "Rental and leased vehicles",
  "Small business vehicle fleets",
  "Commercial passenger vehicles",
];

export default function GPSCarPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/gps-tracker-for-car#webpage",
        url: "https://naviigps.com/gps-tracker-for-car",
        name: "GPS Tracker for Car in India | NAVII GPS",
        description: metadata.description,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/gps-tracker-for-car#service",
        name: "GPS Tracker for Car",
        serviceType: "Car GPS Tracking",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/gps-tracker-for-car",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "GPS Tracker for Car", item: "https://naviigps.com/gps-tracker-for-car" },
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
                CAR GPS TRACKING
              </span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                GPS Tracker for Car
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  with Real-Time Vehicle Visibility
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                Track a car with live location visibility, route history, geofencing and configurable alerts through the NAVII GPS platform. Choose a suitable GPS tracking device for your vehicle and monitoring requirements.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/products/g17-gps-tracker" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">
                  Explore G17 GPS Tracker <ArrowRight size={19} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">
                  Discuss Your Requirement
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">CAR TRACKING FEATURES</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Stay connected to your vehicle</h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                NAVII GPS combines suitable vehicle GPS hardware with tracking software to give authorized users a clearer view of car movement and activity.
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
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-700">WHERE CAR GPS TRACKING HELPS</span>
              <h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">GPS tracking for different car use cases</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Use vehicle tracking to improve visibility for personal cars, business vehicles and passenger-transport operations. The right device and configuration depend on the vehicle and required tracking features.
              </p>
              <ul className="mt-8 space-y-4">
                {useCases.map((useCase) => (
                  <li key={useCase} className="flex gap-3 text-slate-700"><CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={20} />{useCase}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-2xl md:p-12">
              <Car size={44} className="text-cyan-300" />
              <h3 className="mt-7 text-3xl font-bold">Choose the Right Car GPS Tracker</h3>
              <p className="mt-5 leading-8 text-slate-300">
                Consider vehicle compatibility, connectivity, tracking frequency, installation requirements and the software features you need before selecting a GPS tracking device.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Live Location</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Route History</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Geofence Alerts</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Fleet Reports</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-9 text-center md:p-12">
              <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Explore Car GPS Tracking Solutions</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Explore GPS tracking devices and software from NAVII GPS for cars and vehicle fleets.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/products/g17-gps-tracker" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">G17 GPS Tracker <ArrowRight size={18} /></Link>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">View GPS Trackers</Link>
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">GPS Tracking Software</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white md:p-14">
              <h2 className="text-4xl font-extrabold">Need a GPS Tracker for Your Car?</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">
                Share your vehicle type and tracking requirements with NAVII GPS so the appropriate hardware and software configuration can be evaluated.
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
