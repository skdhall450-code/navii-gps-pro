import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  RadioTower,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

const pageTitle = "GPS for Trucks in India | Live Tracking";
const fullTitle = `${pageTitle} | NAVII GPS INDIA`;
const pageDescription =
  "GPS for trucks in India with live location, trip history and geofence alerts. Compare NAVII GPS devices and request a quote for your truck or fleet.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: uniqueKeywords([
    "GPS tracker for truck",
    "GPS tracker for truck India",
    "truck GPS tracker",
    "truck GPS tracker India",
    "truck GPS tracking system",
    "truck tracking system India",
    "truck GPS tracking software",
    "commercial truck GPS tracker",
    "heavy vehicle GPS tracking",
    "truck fleet tracking system",
    "truck fleet management software",
    "commercial vehicle tracking system",
    "vehicle tracking system India",
    "logistics fleet tracking",
  ]),
  alternates: { canonical: "https://naviigps.com/truck-gps" },
  openGraph: {
    title: fullTitle,
    description: pageDescription,
    url: "https://naviigps.com/truck-gps",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS truck GPS tracking system" }],
  },
  twitter: {
    card: "summary_large_image",
    title: fullTitle,
    description: pageDescription,
    images: ["/og-image.jpg"],
  },
};

const features = [
  {
    title: "Live truck location",
    description: "Find the latest reported position of a connected truck before checking a dispatch or responding to a delivery enquiry. Use the NAVII GPS platform to view your vehicles from one place.",
    icon: RadioTower,
  },
  {
    title: "Trip history and playback",
    description: "Review where a truck travelled and replay recorded journeys. Use route history when checking a completed trip or discussing route activity with your operations team.",
    icon: Route,
  },
  {
    title: "Geofences and vehicle alerts",
    description: "Set boundaries around locations that matter to your operation. Configure geofence and overspeed alerts, with ignition monitoring where the selected device and installation support it.",
    icon: ShieldCheck,
  },
  {
    title: "Fleet reports and mobile access",
    description: "Review vehicle and trip information from the web dashboard, or check supported tracking information through the mobile app. Confirm the reports and alert settings you need when planning your setup.",
    icon: Gauge,
  },
];

const devices = [
  {
    name: "G17 GPS Tracker",
    description: "A wired tracker for trucks and other commercial vehicles. Supported setups offer location tracking, ignition status, trip playback, geofencing and overspeed alerts through the NAVII GPS web and mobile platform.",
    href: "/products/g17-gps-tracker",
  },
  {
    name: "GS900 4G GPS Tracker",
    description: "An option for connected vehicle monitoring using a supported 4G mobile network. Review device suitability and mobile network coverage for your routes with NAVII GPS. Available functions depend on the selected hardware and installation.",
    href: "/products/gs900-4g-gps-tracker",
  },
];

const installationChecklist = [
  "Share the number of trucks, vehicle types and main operating routes.",
  "List the tracking functions you need, such as trip playback, ignition monitoring or geofence alerts.",
  "Confirm installation arrangements for your location and compatibility with your vehicles.",
  "Ask for an itemised quote covering hardware, installation, platform access, the SIM or data arrangement and any recurring charges.",
  "If you need fuel monitoring, ask for a separate compatibility and installation review.",
];

const faqs = [
  {
    question: "How much does GPS tracking for a truck cost?",
    answer: "Ask NAVII GPS for a quote based on your truck count, device and required functions. Confirm what the quote includes and whether installation, connectivity, platform access or optional equipment carry separate or recurring charges.",
  },
  {
    question: "Can I track trucks from my phone?",
    answer: "NAVII GPS provides mobile and web access for supported tracking deployments. After the tracker is installed and configured, you can check available vehicle information through the connected platform. Ask for a demonstration of the functions you plan to use.",
  },
  {
    question: "Will tracking work on every operating route?",
    answer: "Connected tracking depends on the device, its installation and available network coverage. For a 4G setup, discuss coverage along your regular routes before choosing the hardware. Ask how the proposed setup handles periods without connectivity.",
  },
  {
    question: "Does truck GPS tracking include fuel monitoring?",
    answer: "Fuel-level monitoring needs a compatible sensor and tracking setup. The vehicle and fuel tank must be assessed, and the sensor calibrated during installation. Ask NAVII GPS to quote fuel monitoring separately if it is part of your requirement.",
    href: "/products/fuel-monitoring-sensor",
    linkText: "Fuel Monitoring Sensor",
  },
];

export default function TruckGPSPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/truck-gps#webpage",
        url: "https://naviigps.com/truck-gps",
        name: fullTitle,
        description: pageDescription,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/truck-gps#service",
        name: "GPS Tracker for Truck",
        serviceType: "Truck GPS Tracking and Fleet Monitoring",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/truck-gps",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "GPS Tracker for Truck", item: "https://naviigps.com/truck-gps" },
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
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-cyan-200">TRUCK GPS TRACKING</span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                GPS for Trucks{" "}
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">in India</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Track your trucks from the NAVII GPS mobile app or web dashboard. Check the latest reported location, review completed journeys and use geofence alerts to follow movements around depots, warehouses and customer sites. Choose a device and software setup around your truck type, operating routes and reporting needs.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Get a Truck GPS Quote <ArrowRight size={19} className="shrink-0" aria-hidden="true" /></Link>
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">See Tracking Software</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">TRUCK GPS TRACKING FEATURES</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Truck GPS tracking for daily operations</h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">Connect suitable GPS hardware with <Link href="/software" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-800">NAVII GPS tracking software</Link> to monitor your trucks from one platform.</p>
            </div>
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} aria-hidden="true" /></div>
                    <h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-700">TRUCK GPS DEVICES</span>
              <h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">Choose a GPS tracker for your trucks</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Start with your vehicle type and the information you need to see each day. Check the device, installation and software configuration together before selecting a tracker.</p>
            </div>
            <div className="mt-12 grid gap-7 md:grid-cols-2">
              {devices.map((device) => (
                <article key={device.name} className="flex flex-col rounded-[32px] bg-[#06142E] p-8 text-white shadow-xl md:p-10">
                  <Truck size={36} className="text-cyan-300" aria-hidden="true" />
                  <h3 className="mt-6 text-3xl font-bold">{device.name}</h3>
                  <p className="mb-7 mt-5 leading-8 text-slate-300">{device.description}</p>
                  <Link href={device.href} className="mt-auto inline-flex items-center gap-2 font-semibold text-cyan-300 underline decoration-cyan-300/40 underline-offset-4 hover:text-cyan-200">Explore the {device.name} <ArrowRight size={18} className="shrink-0" aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-4xl font-extrabold text-slate-900 md:text-5xl">What to confirm before installation</h2>
            <ul className="mt-10 space-y-5">
              {installationChecklist.map((item) => (
                <li key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-lg leading-8 text-slate-700">
                  <CheckCircle2 className="mt-1 shrink-0 text-emerald-600" size={24} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-4xl font-extrabold text-slate-900 md:text-5xl">Questions about GPS for trucks</h2>
            <div className="mt-10 space-y-6">
              {faqs.map((faq) => (
                <article key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-7 md:p-9">
                  <h3 className="text-xl font-bold text-slate-900 md:text-2xl">{faq.question}</h3>
                  <p className="mt-4 leading-8 text-slate-600">{faq.answer}</p>
                  {faq.href && <Link href={faq.href} className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-800">{faq.linkText} <ArrowRight size={18} aria-hidden="true" /></Link>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="bg-white pt-16">
          <p className="mx-auto max-w-5xl px-6 text-center text-lg leading-8 text-slate-600">Managing a mixed delivery fleet? <Link href="/logistics-fleet-gps" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-800">Explore logistics fleet tracking</Link>.</p>
        </div>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-8 text-center text-white md:p-14">
              <h2 className="text-3xl font-extrabold md:text-4xl">Find the right GPS setup for your trucks</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">Tell NAVII GPS how many trucks you operate, which routes they run and what you need to monitor. Ask for a device recommendation and an itemised quote for your tracking setup.</p>
              <Link href="/contact" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-slate-100">Discuss My Truck Tracking Setup <ArrowRight size={19} className="shrink-0" aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
