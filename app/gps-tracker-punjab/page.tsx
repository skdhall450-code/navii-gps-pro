import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, RadioTower, Route, ShieldCheck } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const pageUrl = "https://naviigps.com/gps-tracker-punjab";

export const metadata: Metadata = {
  title: "GPS Tracker in Punjab | Vehicle Tracking System",
  description:
    "GPS trackers and vehicle tracking systems in Punjab for cars, trucks, school buses and commercial fleets. NAVII GPS serves Dera Bassi, Mohali, Chandigarh region and businesses across India.",
  keywords: uniqueKeywords([
    "GPS tracker in Punjab",
    "GPS tracker Punjab",
    "vehicle tracking system Punjab",
    "GPS tracking company Punjab",
    "GPS tracker Dera Bassi",
    "GPS tracker Mohali",
    "GPS tracker Chandigarh",
    "car GPS tracker Punjab",
    "truck GPS tracking Punjab",
    "fleet management software Punjab",
    "commercial vehicle GPS Punjab",
  ]),
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "GPS Tracker in Punjab | NAVII GPS",
    description:
      "Vehicle GPS tracking devices and fleet management software for cars, trucks, buses and commercial fleets in Punjab.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NAVII GPS vehicle tracking solutions in Punjab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPS Tracker in Punjab | NAVII GPS",
    description: "Vehicle GPS tracking and fleet management solutions in Punjab.",
    images: ["/og-image.jpg"],
  },
};

const benefits = [
  { title: "Live Vehicle Location", text: "Monitor the latest location reported by connected cars, trucks, buses and commercial vehicles.", icon: RadioTower },
  { title: "Route History", text: "Review available journey and route records for practical fleet oversight.", icon: Route },
  { title: "Geofences & Alerts", text: "Create location boundaries and monitor supported vehicle events from the tracking platform.", icon: ShieldCheck },
];

export default function GPSTrackerPunjabPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "GPS Tracker in Punjab | Vehicle Tracking System | NAVII GPS",
        description: "GPS tracking devices and fleet management solutions for vehicles and fleets in Punjab.",
        isPartOf: { "@id": "https://naviigps.com/#website" },
        about: { "@id": "https://naviigps.com/#organization" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        name: "GPS Tracking Solutions in Punjab",
        serviceType: "Vehicle GPS Tracking and Fleet Management",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: [
          { "@type": "State", name: "Punjab" },
          { "@type": "City", name: "Dera Bassi" },
          { "@type": "City", name: "Mohali" },
          { "@type": "City", name: "Chandigarh" },
        ],
        url: pageUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "GPS Tracker in Punjab", item: pageUrl },
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
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.14em] text-cyan-200"><MapPin size={17} /> PUNJAB GPS TRACKING</span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracker in Punjab for Cars and Commercial Fleets</h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">NAVII GPS provides connected vehicle tracking devices and fleet management software for cars, trucks, school buses and commercial fleets in Punjab.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Request a Consultation <ArrowRight size={19} /></Link>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">View GPS Trackers</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return <article key={benefit.title} className="rounded-3xl border border-slate-200 p-8 shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h2 className="mt-5 text-2xl font-bold text-slate-900">{benefit.title}</h2><p className="mt-3 leading-7 text-slate-600">{benefit.text}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold tracking-[0.18em] text-blue-700">LOCAL SUPPORT, INDIA-WIDE PLATFORM</span>
              <h2 className="mt-4 text-4xl font-extrabold text-slate-900 md:text-5xl">Vehicle Tracking from Dera Bassi, Punjab</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">Based in Dera Bassi, NAVII GPS serves vehicle owners and fleet operators in Punjab, including the Mohali and Chandigarh region, while supporting deployments across India.</p>
              <ul className="mt-8 space-y-4">
                {["GPS trackers for cars and personal vehicles", "Truck and logistics fleet tracking", "School bus and passenger transport visibility", "4G vehicle trackers and fleet management software"].map((item) => <li key={item} className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />{item}</li>)}
              </ul>
            </div>
            <div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-xl">
              <h3 className="text-3xl font-bold">Choose a GPS Solution for Your Fleet</h3>
              <p className="mt-5 leading-8 text-slate-300">Tell us your vehicle type, fleet size and monitoring requirements. The NAVII GPS team can help you shortlist a suitable device and software workflow.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/gps-tracker-for-car" className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold">Car GPS Tracker</Link>
                <Link href="/truck-gps" className="rounded-xl border border-white/20 px-5 py-3 font-semibold">Truck GPS Tracking</Link>
                <Link href="/software" className="rounded-xl border border-white/20 px-5 py-3 font-semibold">Fleet Software</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
