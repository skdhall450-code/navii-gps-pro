import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BellRing, History, MapPinned, Route, ShieldCheck, Truck } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const pageTitle = "Vehicle Tracking System in India | GPS Devices & Software";
const pageDescription = "Explore NAVII GPS vehicle tracking for cars, trucks and fleets. Compare device, connectivity and software needs for location, trip history and configured alerts.";

const systemSteps = [
  ["A device reports vehicle data", "A compatible GPS tracker installed or mounted for the vehicle provides location and supported vehicle information. Power, placement and the selected hardware affect the available data."],
  ["Connectivity carries the updates", "The device sends reports through its configured connection. Check network coverage and the latest report time; a position on the map may be the last received location rather than the current one."],
  ["Software supports daily decisions", "Authorised users review available locations, trips and alerts in the tracking platform. Agree vehicle access, report requirements and who follows up on each configured alert."],
];

const selectionGuide = [
  ["A car used regularly", "A compatible vehicle-powered tracker", "Vehicle voltage, installation method, supported ignition information and access to trip history."],
  ["A mixed commercial fleet", "Devices matched to each vehicle, with shared fleet software", "Vehicle assignments, user permissions, depot geofences and the reports needed by dispatch."],
  ["An asset without a continuous power supply", "A suitable battery-powered tracking option", "Charging arrangements, mounting, reporting interval and expected use between charges."],
  ["Fuel or other sensor data", "A tracker and software configuration supporting the selected sensor", "Sensor interface, installation and calibration requirements; location tracking alone does not provide every sensor reading."],
];

const faqs = [
  {
    question: "What is the difference between a GPS tracker and a vehicle tracking system?",
    answer: "The tracker is the hardware that reports location and supported vehicle data. A vehicle tracking system also includes connectivity, software access and the configuration needed to review that data. Confirm all of these parts in the proposed setup and quote.",
  },
  {
    question: "Can one system track cars, trucks and buses?",
    answer: "A fleet platform can bring compatible connected vehicles into one view, but each vehicle still needs a suitable device and installation. Share the vehicle types, power requirements and required reports so NAVII GPS can assess a setup for the fleet.",
  },
  {
    question: "Does vehicle tracking need a SIM or data connection?",
    answer: "A cellular GPS tracker needs an active, correctly configured connectivity service to send updates to the platform. Confirm the SIM or data service included with the proposed device, coverage on your routes and renewal charges. GPS positioning and sending that position to software are separate steps.",
  },
  {
    question: "Can I see previous trips as well as the latest location?",
    answer: "Trip history is available through the configured tracking software for data the system has received and retained. Ask for a demonstration of the date range, playback and reports you need, and confirm the retention period for your service before purchase.",
  },
  {
    question: "Are fuel monitoring and remote commands included with every tracker?",
    answer: "No. Fuel monitoring requires a compatible data source and any necessary sensor installation and calibration. Remote commands depend on supported hardware, installation and authorised access. Ask for the exact supported functions to be listed for the device and software configuration being quoted.",
  },
  {
    question: "What should a vehicle tracking system quote include?",
    answer: "Request separate details for device hardware, installation, connectivity, software access and recurring renewals. Include your vehicle count, routes, users and reporting needs, and confirm support arrangements and any additional sensors or integrations before ordering.",
  },
];

export const metadata: Metadata = {
  title: pageTitle,
  description:
    pageDescription,
  keywords: uniqueKeywords([
    "vehicle tracking system",
    "vehicle tracking system India",
    "GPS vehicle tracking system",
    "vehicle tracking software",
    "vehicle GPS tracking",
    "vehicle tracking device",
    "car vehicle tracking system",
    "commercial vehicle tracking system",
    "fleet vehicle tracking",
    "GPS fleet tracking software",
    "real-time vehicle tracking",
    "GPS tracking company India",
  ]),
  alternates: { canonical: "https://naviigps.com/vehicle-tracking-system" },
  openGraph: {
    title: `${pageTitle} | NAVII GPS`,
    description:
      pageDescription,
    url: "https://naviigps.com/vehicle-tracking-system",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS vehicle tracking system" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | NAVII GPS`,
    description: pageDescription,
    images: ["/og-image.jpg"],
  },
};

const features = [
  { title: "Live Vehicle Location", description: "See the latest reported location and timestamp for connected vehicles through the NAVII GPS tracking platform.", icon: MapPinned },
  { title: "Route & Trip History", description: "Review routes and trip history to understand vehicle movement and daily operations.", icon: History },
  { title: "Geofencing & Alerts", description: "Use location boundaries and configurable alerts to improve operational awareness.", icon: BellRing },
  { title: "Fleet Reports", description: "Use tracking data and reports to support planning, control and fleet performance reviews.", icon: Route },
];

export default function VehicleTrackingSystemPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": "https://naviigps.com/vehicle-tracking-system#faq",
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question", name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/vehicle-tracking-system#webpage",
        url: "https://naviigps.com/vehicle-tracking-system",
        name: pageTitle,
        description: metadata.description,
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/vehicle-tracking-system#service",
        name: "Vehicle Tracking System",
        serviceType: "GPS Vehicle Tracking",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/vehicle-tracking-system",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "Vehicle Tracking System", item: "https://naviigps.com/vehicle-tracking-system" },
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
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-cyan-200">VEHICLE TRACKING SYSTEM</span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                Vehicle Tracking System in India
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">for Cars, Trucks & Fleets</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                Connect suitable GPS devices, connectivity and NAVII GPS software to review vehicle locations, recorded trips and configured alerts. Choose a setup around your vehicle types, daily routes and the people who need access.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Explore GPS Tracking Devices <ArrowRight size={19} /></Link>
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">Explore Tracking Software</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">CORE TRACKING FEATURES</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Core tools for vehicle visibility</h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">Combine suitable GPS hardware with tracking software to improve visibility across personal, commercial and fleet vehicles.</p>
            </div>
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return <article key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3><p className="mt-3 leading-7 text-slate-600">{feature.description}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#06142E] py-24 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-extrabold md:text-4xl">How a vehicle tracking system works</h2>
            <ol className="mt-10 grid gap-6 lg:grid-cols-3">
              {systemSteps.map(([title, description], index) => (
                <li key={title} className="rounded-3xl border border-white/15 bg-white/5 p-7">
                  <span className="text-sm font-semibold text-cyan-300">STEP {index + 1}</span>
                  <h3 className="mt-3 text-xl font-bold">{title}</h3>
                  <p className="mt-4 leading-8 text-slate-300">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Match the tracking setup to your vehicle</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Start with the power source, operating pattern and information you need. Ask for compatibility to be checked against the actual vehicle and device.</p>
            <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200">
              <table className="w-full min-w-[640px] text-left text-slate-700">
                <caption className="px-6 py-5 text-left text-xl font-bold text-slate-900">Vehicle tracking selection guide</caption>
                <thead className="bg-blue-50 text-slate-900"><tr>{["Your requirement", "Setup to discuss", "What to confirm"].map((heading) => <th key={heading} scope="col" className="px-6 py-4 font-semibold">{heading}</th>)}</tr></thead>
                <tbody>{selectionGuide.map(([requirement, setup, checks]) => <tr key={requirement} className="border-t border-slate-200"><th scope="row" className="px-6 py-5 font-semibold">{requirement}</th><td className="px-6 py-5 leading-7">{setup}</td><td className="px-6 py-5 leading-7">{checks}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="mt-7 leading-8 text-slate-600">Need tank-level information? <Link href="/fuel-monitoring-system" className="font-semibold text-blue-700 underline underline-offset-4">Review fuel monitoring requirements</Link>. For institutional fleets, <Link href="/school-bus-gps" className="font-semibold text-blue-700 underline underline-offset-4">explore school bus tracking workflows</Link>.</p>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-3xl border border-slate-200 bg-white p-8"><CarIcon /><h3 className="mt-5 text-2xl font-bold text-slate-900">Cars & Personal Vehicles</h3><p className="mt-3 leading-7 text-slate-600">Improve visibility for personal and business cars with live location, trip history and configurable vehicle alerts.</p><Link href="/gps-tracker-for-car" className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">GPS Tracker for Car <ArrowRight size={17} /></Link></article>
              <article className="rounded-3xl border border-slate-200 bg-white p-8"><Truck size={34} className="text-cyan-700" /><h3 className="mt-5 text-2xl font-bold text-slate-900">Trucks & Commercial Fleets</h3><p className="mt-3 leading-7 text-slate-600">Track commercial vehicles and trucks with fleet visibility, routes, geofencing and operational reports.</p><Link href="/truck-gps" className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">Truck GPS Tracking <ArrowRight size={17} /></Link></article>
              <article className="rounded-3xl border border-slate-200 bg-white p-8"><ShieldCheck size={34} className="text-cyan-700" /><h3 className="mt-5 text-2xl font-bold text-slate-900">Fleet Operations</h3><p className="mt-3 leading-7 text-slate-600">Connect tracking devices with fleet software for centralized monitoring, alerts and reporting.</p><Link href="/commercial-vehicle-tracking" className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">Commercial Vehicle Tracking <ArrowRight size={17} /></Link></article>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Before you order: test a representative journey</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Share your vehicle list and required reports, confirm installation and user access, then request a demonstration or pilot. Review a normal journey, a parked period and a configured geofence event. Agree reporting expectations, support contacts and renewal costs before expanding to more vehicles.</p>
            <h2 className="mt-14 text-3xl font-extrabold text-slate-900 md:text-4xl">Vehicle tracking system questions</h2>
            <div className="mt-10 space-y-6">
              {faqs.map(({ question, answer }) => (
                <article key={question} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                  <h3 className="text-xl font-bold text-slate-900">{question}</h3>
                  <p className="mt-4 leading-8 text-slate-600">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#06142E] py-20 text-white">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-4xl font-extrabold md:text-5xl">Choose the right vehicle tracking setup</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">Tell NAVII GPS about your vehicle type and tracking requirements. We can help you identify a suitable device and software workflow.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4"><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Discuss Your Requirement <ArrowRight size={19} /></Link><Link href="/4g-gps-tracker" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">Explore 4G GPS Tracker</Link></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function CarIcon() {
  return <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700"><span className="text-lg">🚗</span></div>;
}
