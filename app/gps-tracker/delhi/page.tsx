import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BellRing, CheckCircle2, MapPin, RadioTower, Route, ShieldCheck } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const url = "https://naviigps.com/gps-tracker/delhi";

export const metadata: Metadata = {
  title: "GPS Tracker in Delhi | Vehicle Tracking & Fleet Management | NAVII GPS",
  description:
    "GPS tracker in Delhi for cars, trucks, buses and commercial fleets. NAVII GPS provides live vehicle tracking, route history, geofencing, alerts, fleet reports and GPS solutions across Delhi NCR.",
  keywords: [
    "GPS tracker in Delhi",
    "GPS tracker Delhi",
    "vehicle tracking system Delhi",
    "GPS tracking company Delhi",
    "car GPS tracker Delhi",
    "truck GPS tracking Delhi",
    "fleet management Delhi",
    "commercial vehicle tracking Delhi",
    "AIS 140 GPS Delhi",
    "GPS installation Delhi",
    "GPS tracker Noida",
    "GPS tracker Gurgaon",
    "GPS tracker Ghaziabad",
    "GPS tracker Faridabad",
  ],
  alternates: { canonical: url },
  openGraph: {
    title: "GPS Tracker in Delhi | NAVII GPS",
    description: "Vehicle GPS tracking and fleet management solutions for Delhi NCR.",
    url,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking solutions in Delhi" }],
  },
};

const features = [
  { title: "Live Vehicle Tracking", text: "Monitor connected cars, trucks, buses and commercial vehicles from the NAVII GPS platform with current location visibility.", icon: RadioTower },
  { title: "Routes & Trip History", text: "Review available route and journey history to support transport planning and day-to-day fleet operations.", icon: Route },
  { title: "Geofences & Alerts", text: "Configure location boundaries and supported overspeed, ignition, power-cut and SOS alerts for better operational awareness.", icon: BellRing },
  { title: "Fleet Reports", text: "Use trip, mileage, idle and other available reports to improve fleet oversight and operational decisions.", icon: ShieldCheck },
];

const areas = ["New Delhi", "Gurugram", "Noida", "Greater Noida", "Ghaziabad", "Faridabad", "Manesar", "Bahadurgarh"];
const useCases = ["Logistics and transport fleets", "Company and employee vehicles", "Truck and commercial fleets", "School and staff transportation", "Taxi and passenger fleets", "Last-mile delivery vehicles"];

export default function DelhiGpsTrackerPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: "GPS Tracker in Delhi | NAVII GPS", description: metadata.description, inLanguage: "en-IN", isPartOf: { "@id": "https://naviigps.com/#website" } },
      { "@type": "Service", "@id": `${url}#service`, name: "GPS Tracking Solutions in Delhi", serviceType: "Vehicle GPS Tracking and Fleet Management", provider: { "@id": "https://naviigps.com/#organization" }, areaServed: [{ "@type": "City", name: "Delhi" }, { "@type": "City", name: "Gurugram" }, { "@type": "City", name: "Noida" }, { "@type": "City", name: "Ghaziabad" }, { "@type": "City", name: "Faridabad" }], url },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
        { "@type": "ListItem", position: 2, name: "GPS Tracker India", item: "https://naviigps.com/gps-tracker-india" },
        { "@type": "ListItem", position: 3, name: "GPS Tracker Delhi", item: url },
      ] },
      { "@type": "FAQPage", mainEntity: [
        { "@type": "Question", name: "Does NAVII GPS provide GPS trackers in Delhi?", acceptedAnswer: { "@type": "Answer", text: "NAVII GPS provides vehicle GPS tracking devices and fleet management software for cars, trucks, buses and commercial fleets operating in Delhi and Delhi NCR." } },
        { "@type": "Question", name: "Can I track a truck or commercial fleet in Delhi?", acceptedAnswer: { "@type": "Answer", text: "Yes. NAVII GPS supports connected vehicle tracking with live location, route history, geofencing, alerts and fleet reporting features, subject to the selected device and configuration." } },
        { "@type": "Question", name: "Do you support GPS tracking in Gurgaon and Noida?", acceptedAnswer: { "@type": "Answer", text: "NAVII GPS serves vehicle and fleet tracking requirements across Delhi NCR, including Gurugram, Noida, Greater Noida, Ghaziabad and Faridabad." } },
      ] },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.12em] text-cyan-200"><MapPin size={17} /> DELHI NCR</span>
            <h1 className="mt-7 max-w-5xl text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracker in Delhi for Cars, Trucks & Commercial Fleets</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">NAVII GPS provides vehicle GPS trackers and fleet management software for businesses and authorized vehicle owners operating across Delhi and the wider NCR region.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white">Request a Free Consultation <ArrowRight size={19} /></Link>
              <Link href="/products" className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold">View GPS Devices</Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center"><span className="text-sm font-semibold tracking-[0.16em] text-blue-700">DELHI VEHICLE TRACKING</span><h2 className="mt-4 text-4xl font-extrabold text-slate-900 md:text-5xl">Vehicle Tracking Solutions in Delhi</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">Connect suitable GPS hardware with the NAVII platform to monitor vehicle movement, routes and supported fleet events from one dashboard.</p></div>
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-4">{features.map((feature) => { const Icon = feature.icon; return <article key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3><p className="mt-3 leading-7 text-slate-600">{feature.text}</p></article>; })}</div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2">
            <div><span className="text-sm font-semibold tracking-[0.16em] text-blue-700">LOCAL FLEET USE CASES</span><h2 className="mt-4 text-4xl font-extrabold text-slate-900">GPS Tracking for Delhi Businesses</h2><p className="mt-6 text-lg leading-8 text-slate-600">Delhi NCR has dense urban routes, commercial corridors and intercity transport operations. Centralized GPS visibility can help authorized teams coordinate vehicles and review operational activity.</p><ul className="mt-8 space-y-4">{useCases.map((item) => <li key={item} className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />{item}</li>)}</ul></div>
            <div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-xl"><h3 className="text-3xl font-bold">Delhi NCR Coverage</h3><p className="mt-5 leading-8 text-slate-300">Explore GPS tracking requirements for vehicles operating in Delhi, Gurugram, Noida, Greater Noida, Ghaziabad, Faridabad and nearby business corridors.</p><div className="mt-7 flex flex-wrap gap-2">{areas.map((area) => <span key={area} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">{area}</span>)}</div><Link href="/software" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold">Explore Fleet Software <ArrowRight size={17} /></Link></div>
          </div>
        </section>

        <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6"><div className="rounded-[32px] border border-slate-200 bg-slate-50 p-9 md:p-12"><h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">GPS Tracker for Cars, Trucks & Buses in Delhi</h2><p className="mt-5 text-lg leading-8 text-slate-600">NAVII GPS offers devices and software for different vehicle tracking requirements. Available features depend on the selected hardware, connectivity and configuration.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/gps-tracker-for-car" className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-cyan-300">GPS Tracker for Car <ArrowRight className="ml-2 inline" size={17} /></Link><Link href="/truck-gps" className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-cyan-300">Truck GPS Tracking <ArrowRight className="ml-2 inline" size={17} /></Link><Link href="/ais-140-gps" className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-cyan-300">AIS-140 GPS Solutions <ArrowRight className="ml-2 inline" size={17} /></Link><Link href="/commercial-vehicle-tracking" className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-cyan-300">Commercial Vehicle Tracking <ArrowRight className="ml-2 inline" size={17} /></Link></div></div></div></section>

        <section className="bg-slate-50 py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2><div className="mt-8 space-y-4"><details className="rounded-2xl border border-slate-200 bg-white p-6"><summary className="cursor-pointer font-bold">Does NAVII GPS provide GPS trackers in Delhi?</summary><p className="mt-3 leading-7 text-slate-600">Yes. NAVII GPS provides vehicle GPS tracking devices and fleet management software for cars, trucks, buses and commercial fleets operating in Delhi and Delhi NCR.</p></details><details className="rounded-2xl border border-slate-200 bg-white p-6"><summary className="cursor-pointer font-bold">Can I track trucks and commercial fleets in Delhi?</summary><p className="mt-3 leading-7 text-slate-600">Yes. Supported deployments can provide live location, route history, geofencing, alerts and fleet reports through the NAVII GPS platform.</p></details><details className="rounded-2xl border border-slate-200 bg-white p-6"><summary className="cursor-pointer font-bold">Do you support Gurgaon, Noida and Ghaziabad?</summary><p className="mt-3 leading-7 text-slate-600">NAVII GPS supports vehicle and fleet tracking requirements across Delhi NCR, including Gurugram, Noida, Greater Noida, Ghaziabad and Faridabad.</p></details></div></div></section>

        <section className="bg-white py-16"><div className="mx-auto max-w-6xl px-6"><div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white md:p-14"><h2 className="text-4xl font-extrabold">Need GPS Tracking in Delhi?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">Share your vehicle type and fleet size with NAVII GPS to discuss a suitable tracking setup.</p><Link href="/contact" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-700">Contact NAVII GPS <ArrowRight size={19} /></Link></div></div></section>
      </main>
      <Footer />
    </>
  );
}
