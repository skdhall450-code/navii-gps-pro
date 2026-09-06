import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPinned, RadioTower, ShieldCheck, Truck, Users, BarChart3 } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

export const metadata: Metadata = {
  title: "GPS Tracking Company in India | NAVII GPS",
  description: "NAVII GPS provides GPS tracking systems, vehicle tracking devices and fleet management software for cars, trucks, buses and commercial fleets across India.",
  keywords: [
    "GPS tracking company in India",
    "GPS tracking company India",
    "GPS tracking company in Punjab",
    "vehicle tracking company India",
    "GPS tracking solutions India",
    "fleet tracking company India",
    "GPS tracking system provider India",
    "vehicle tracking system provider",
    "fleet management company India",
    "GPS tracker company India",
    "commercial vehicle tracking company",
    "GPS fleet management software India",
  ],
  alternates: { canonical: "https://naviigps.com/gps-tracking-company-india" },
  openGraph: {
    title: "GPS Tracking Company in India | NAVII GPS",
    description: "GPS tracking devices, vehicle tracking systems and fleet management software for businesses across India.",
    url: "https://naviigps.com/gps-tracking-company-india",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPS Tracking Company in India | NAVII GPS",
    description: "Vehicle tracking devices and fleet management solutions for cars, trucks, buses and commercial fleets.",
    images: ["/og-image.jpg"],
  },
};

const capabilities = [
  { title: "Real-Time Vehicle Tracking", text: "Monitor connected cars, trucks, buses and commercial vehicles with live GPS location visibility.", icon: RadioTower },
  { title: "Fleet Management Software", text: "Manage vehicle status, routes, trip history, geofences, alerts and operational reports from one platform.", icon: BarChart3 },
  { title: "Tracking Devices", text: "Choose GPS tracking devices for different vehicle and fleet requirements, including connected 4G solutions.", icon: Truck },
  { title: "Fleet Safety & Control", text: "Use geofencing, movement alerts and monitoring tools to improve visibility and day-to-day fleet control.", icon: ShieldCheck },
];

const solutions = [
  "GPS tracker for cars and personal vehicles",
  "4G GPS tracking for commercial vehicles",
  "Truck and logistics fleet tracking",
  "School bus and passenger transport tracking",
  "AIS-140 deployment-focused tracking solutions",
  "Fleet management and vehicle tracking software",
];

export default function GPSTrackingCompanyIndiaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/gps-tracking-company-india#webpage",
        url: "https://naviigps.com/gps-tracking-company-india",
        name: "GPS Tracking Company in India | NAVII GPS",
        description: "GPS tracking systems, vehicle tracking devices and fleet management software for businesses across India.",
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        name: "GPS Tracking Solutions in India",
        serviceType: "GPS Vehicle Tracking and Fleet Management",
        provider: { "@type": "Organization", name: "NAVII GPS INDIA (OPC) PRIVATE LIMITED", url: "https://naviigps.com" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/gps-tracking-company-india",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "GPS Tracking Company in India", item: "https://naviigps.com/gps-tracking-company-india" },
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
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-cyan-200">GPS TRACKING SOLUTIONS INDIA</span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracking Company in India</h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">NAVII GPS provides vehicle tracking devices and fleet management software for cars, trucks, buses and commercial fleets, helping businesses improve real-time visibility and operational control.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Talk to NAVII GPS <ArrowRight size={19} /></Link>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">Explore GPS Devices</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {capabilities.map((item) => {
                const Icon = item.icon;
                return <article key={item.title} className="rounded-3xl border border-slate-200 p-7 shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h2 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h2><p className="mt-3 leading-7 text-slate-600">{item.text}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold tracking-[0.18em] text-blue-700">WHY NAVII GPS</span>
              <h2 className="mt-4 text-4xl font-extrabold text-slate-900 md:text-5xl">Vehicle Tracking Solutions for Indian Fleets</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">From individual vehicles to larger commercial operations, NAVII GPS brings connected tracking devices and software together for practical fleet visibility.</p>
              <ul className="mt-8 space-y-4">
                {solutions.map((solution) => <li key={solution} className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />{solution}</li>)}
              </ul>
            </div>
            <div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-xl">
              <MapPinned size={38} className="text-cyan-300" />
              <h3 className="mt-6 text-3xl font-bold">One Platform for Fleet Visibility</h3>
              <p className="mt-5 leading-8 text-slate-300">Connect tracking devices with fleet software to review live location, routes, alerts and reports. Explore the platform or choose a device based on your vehicle requirements.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold">GPS Fleet Software <ArrowRight size={17} /></Link>
                <Link href="/4g-gps-tracker" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold">4G GPS Tracker <ArrowRight size={17} /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <Users className="mx-auto text-blue-700" size={38} />
            <h2 className="mt-5 text-4xl font-extrabold text-slate-900">Looking for a GPS Tracking Company in Punjab or Across India?</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">Share your vehicle type, fleet size and tracking requirements with NAVII GPS. Our team can help identify the appropriate tracking device and software workflow.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-7 py-4 font-semibold text-white">Contact NAVII GPS <ArrowRight size={19} /></Link>
              <Link href="/industries" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-7 py-4 font-semibold text-slate-800">View Industry Solutions <ArrowRight size={19} /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
