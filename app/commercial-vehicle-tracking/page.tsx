import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChartNoAxesCombined, RadioTower, Route, ShieldCheck, Truck } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

const pageTitle = "Commercial Vehicle GPS Tracking India | Mixed Fleets";
const pageDescription = "Plan GPS tracking for trucks, vans, cabs and mixed commercial fleets. Review installation, vehicle access, trip records and renewal requirements with NAVII GPS.";

const rollout = [
  ["Match the setup to each vehicle", "Record vehicle type, power supply, existing tracker and installation location. Confirm hardware compatibility for each vehicle group before ordering a fleet-wide installation."],
  ["Keep vehicle assignments current", "Identify owned and contracted vehicles and the people authorised to view them. When a vehicle leaves the contract, review its access and assignment before adding its replacement."],
  ["Agree the daily review process", "Check the latest report timestamp and connection status before dispatch. Compare received trips and geofence events with operating records, and assign someone to investigate gaps or unexpected stops."],
  ["Pilot before expanding", "Test representative vehicles and routes. Review available reports, user access and support arrangements, then agree installation scheduling and recurring charges for the wider fleet."],
];
const faqs = [
  { question: "Can different commercial vehicle types use the same platform?", answer: "A mixed fleet can be assessed for a shared NAVII GPS setup. Confirm compatible hardware, connectivity and the required reporting functions for each truck, van, cab or bus. A device suitable for one vehicle is not automatically suitable for every vehicle in the fleet." },
  { question: "How should we manage vehicles that change during a contract?", answer: "Keep a record of vehicle and device assignments, contract dates and authorised users. When a vehicle is replaced, arrange the required device installation or reassignment and review access to the outgoing vehicle. Confirm how existing trip records will be retained before changing the setup." },
  { question: "Can we use GPS trackers already installed in our vehicles?", answer: "Share the device model, protocol information and current connection arrangements for a compatibility review. Confirm that the device can report to the intended platform and that you have permission to change its configuration. Support for an existing third-party tracker must be checked before rollout." },
  { question: "What should operators check when a vehicle stops updating?", answer: "Start with the latest report timestamp and connection status. Ask the installer or support team to review power, SIM connectivity, coverage and device configuration as appropriate. An old map position is the last received location and should not be treated as confirmation of the current vehicle position." },
  { question: "What costs should a commercial fleet quotation include?", answer: "Request separate details for hardware, installation, SIM connectivity, software subscription and renewals. Include any additional sensors, integration work and device transfer arrangements. Share the vehicle count, types and operating routes so the proposed setup and support scope can be assessed." },
  { question: "Does GPS location confirm driver attendance or a completed delivery?", answer: "A reported vehicle position or trip record describes vehicle activity. It does not by itself confirm who was driving, staff attendance or customer acceptance of a delivery. Use the relevant operating records and separately agreed verification processes alongside tracking data." },
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: uniqueKeywords([
    "commercial vehicle tracking system",
    "commercial vehicle GPS tracker",
    "commercial vehicle tracking system India",
    "GPS tracking for commercial vehicles",
    "vehicle tracking system for commercial vehicles",
    "commercial fleet tracking",
    "heavy vehicle GPS tracking",
    "fleet tracking system India",
    "commercial vehicle fleet management",
    "GPS fleet tracking software",
    "vehicle tracking software India",
    "commercial vehicle GPS tracking",
  ]),
  alternates: { canonical: "https://naviigps.com/commercial-vehicle-tracking" },
  openGraph: {
    title: `${pageTitle} | NAVII GPS`,
    description: pageDescription,
    url: "https://naviigps.com/commercial-vehicle-tracking",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS commercial vehicle tracking system" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | NAVII GPS`,
    description: pageDescription,
    images: ["/og-image.jpg"],
  },
};

const features = [
  { title: "Real-Time Vehicle Tracking", description: "Review the latest reported position of connected vehicles. Check the timestamp and connection status before acting on a map location.", icon: RadioTower },
  { title: "Routes & Trip History", description: "Review route activity and completed trips to improve dispatch control and fleet operations.", icon: Route },
  { title: "Geofencing & Alerts", description: "Create location boundaries and configure alerts for important vehicle movement and operational events.", icon: ShieldCheck },
  { title: "Fleet Reports & Analytics", description: "Use trip records and fleet reports to understand vehicle utilization and daily performance.", icon: ChartNoAxesCombined },
];

const vehicleTypes = [
  "Trucks and heavy commercial vehicles",
  "Goods and cargo transport vehicles",
  "Delivery and logistics vehicles",
  "Buses and contract transport fleets",
  "Taxi and commercial cab fleets",
  "Mixed commercial vehicle fleets",
];

export default function CommercialVehicleTrackingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": "https://naviigps.com/commercial-vehicle-tracking#faq",
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question", name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/commercial-vehicle-tracking#webpage",
        url: "https://naviigps.com/commercial-vehicle-tracking",
        name: "Commercial Vehicle Tracking System in India | NAVII GPS",
        description: metadata.description,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/commercial-vehicle-tracking#service",
        name: "Commercial Vehicle Tracking System",
        serviceType: "Commercial Vehicle GPS Tracking and Fleet Monitoring",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/commercial-vehicle-tracking",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "Commercial Vehicle Tracking", item: "https://naviigps.com/commercial-vehicle-tracking" },
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
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-cyan-200">COMMERCIAL VEHICLE GPS</span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">Commercial Vehicle Tracking System<span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">for Mixed Fleets in India</span></h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Track commercial vehicles with live location visibility, route history, geofencing, alerts and fleet reports through the NAVII GPS platform.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Discuss Your Fleet <ArrowRight size={19} /></Link>
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">Explore Fleet Software</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center"><span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">COMMERCIAL VEHICLE TRACKING FEATURES</span><h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Control your fleet with better visibility</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">Connect suitable GPS hardware with NAVII GPS software to monitor commercial vehicles and fleet activity from one platform.</p></div>
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-4">{features.map((feature) => { const Icon = feature.icon; return <article key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3><p className="mt-3 leading-7 text-slate-600">{feature.description}</p></article>; })}</div>
          </div>
        </section>

        <section className="bg-slate-50 py-24"><div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center"><div><span className="text-sm font-semibold tracking-[0.2em] text-cyan-700">FLEET TYPES</span><h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">Built for commercial transport fleets</h2><p className="mt-5 text-lg leading-8 text-slate-600">Support day-to-day monitoring across goods transport, delivery, passenger and mixed commercial fleets. Configure tracking workflows around your vehicles and operational requirements.</p><ul className="mt-8 space-y-4">{vehicleTypes.map((type) => <li key={type} className="flex gap-3 text-slate-700"><CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={20} />{type}</li>)}</ul></div><div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-2xl md:p-12"><Truck size={44} className="text-cyan-300" /><h3 className="mt-7 text-3xl font-bold">One platform for fleet visibility</h3><p className="mt-5 leading-8 text-slate-300">Bring vehicle locations, routes, alerts and reports together so authorized teams can monitor commercial fleet operations more effectively.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Live Tracking</span><span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Route History</span><span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Geofence Alerts</span><span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Fleet Reports</span></div></div></div></section>

        <section className="bg-white py-16"><div className="mx-auto max-w-6xl px-6"><div className="rounded-[32px] border border-slate-200 bg-slate-50 p-9 text-center md:p-12"><h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Combine Vehicle Tracking with Fleet Management Software</h2><p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">Use NAVII GPS fleet management software with suitable GPS devices to manage vehicle locations, trips, alerts and operational reports.</p><div className="mt-8 flex flex-wrap justify-center gap-4"><Link href="/software" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Fleet Management Software <ArrowRight size={18} /></Link><Link href="/truck-gps" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">Truck GPS Tracking</Link><Link href="/logistics-fleet-gps" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">Logistics Fleet Tracking</Link></div></div></div></section>

        <section className="bg-[#06142E] py-24 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-extrabold md:text-4xl">Plan tracking across a mixed commercial fleet</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {rollout.map(([title, description]) => (
                <article key={title} className="rounded-3xl border border-white/15 bg-white/5 p-7">
                  <h3 className="text-xl font-bold text-cyan-200">{title}</h3>
                  <p className="mt-4 leading-8 text-slate-300">{description}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 leading-8 text-slate-300">Compare hardware and software requirements in the <Link href="/vehicle-tracking-system" className="font-semibold text-cyan-200 underline underline-offset-4">vehicle tracking selection guide</Link>. For passenger routes, review the <Link href="/school-bus-gps" className="font-semibold text-cyan-200 underline underline-offset-4">school transport workflow</Link>.</p>
          </div>
        </section>
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Commercial vehicle tracking questions</h2>
            <div className="mt-10 space-y-6">
              {faqs.map(({ question, answer }) => (
                <article key={question} className="rounded-3xl border border-slate-200 bg-white p-7">
                  <h3 className="text-xl font-bold text-slate-900">{question}</h3>
                  <p className="mt-4 leading-8 text-slate-600">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-8"><div className="mx-auto max-w-6xl px-6 text-center"><p className="text-slate-600">Looking for a GPS tracker for commercial vehicles? Explore the <Link href="/products/g17-gps-tracker" className="font-semibold text-blue-700 hover:text-blue-800">G17 GPS Tracker</Link> or contact NAVII GPS for a fleet requirement review.</p></div></section>

        <section className="bg-white py-16"><div className="mx-auto max-w-5xl px-6"><div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white md:p-14"><h2 className="text-4xl font-extrabold">Need Commercial Vehicle Tracking?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">Share your fleet size, vehicle types and tracking requirements with NAVII GPS so the appropriate hardware and software configuration can be evaluated.</p><Link href="/contact" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-slate-100">Contact NAVII GPS <ArrowRight size={19} /></Link></div></div></section>
      </main>
      <Footer />
    </>
  );
}
