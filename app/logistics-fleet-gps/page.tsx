import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChartNoAxesCombined,
  PackageCheck,
  RadioTower,
  Route,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

const pageTitle = "Logistics Fleet GPS Tracking India | Dispatch & Trips";
const pageDescription = "Monitor logistics vehicles, depot geofences and recorded trips with NAVII GPS. Plan device compatibility, dispatch access and reports for your delivery fleet.";

const workflows = [
  ["Check vehicles before dispatch", "Review the assigned vehicle, latest location timestamp and connection status before using the map for dispatch decisions. Confirm the planned route and the team responsible for following up on delays."],
  ["Review warehouse and customer stops", "Configure geofences around relevant depot, warehouse and customer locations. Compare recorded entry and exit events with loading appointments and driver updates to investigate waiting time."],
  ["Reconcile the completed journey", "Review received trip data alongside dispatch records and delivery documents. Use unexplained route changes or reporting gaps as prompts for a follow-up with the operator."],
];

const rolloutChecks = [
  "List vehicle types, owned and contracted vehicles, regular routes, depots and required reporting periods.",
  "Confirm compatible GPS hardware, vehicle power, installation arrangements and connectivity along representative routes.",
  "Assign authorised dispatch users, vehicle access, geofence boundaries and the people responsible for reviewing configured alerts.",
  "Pilot a depot-to-customer journey, compare available trip and stop records with operating records, and agree support and renewal costs before adding more vehicles.",
];

const faqs = [
  {
    question: "How can GPS tracking help a logistics dispatch team?",
    answer: "Dispatch staff can review the latest reported vehicle positions, recorded trips and configured alerts to support daily coordination. Check each location timestamp and confirm availability with the operating team before reassigning a vehicle or communicating a delivery update.",
  },
  {
    question: "Can geofences help review warehouse waiting time?",
    answer: "Configured entry and exit events can help identify a vehicle's reported presence around a warehouse or depot. Compare these events with appointment, gate and loading records. Reporting intervals and boundary placement affect the record, and time inside a geofence does not by itself explain the cause of a delay.",
  },
  {
    question: "Does vehicle tracking provide proof of delivery?",
    answer: "A vehicle position or geofence event shows reported vehicle activity; it does not confirm that goods were handed over or accepted. Keep the delivery document or other agreed confirmation process. If an electronic proof-of-delivery integration is needed, request a separate assessment of its availability and scope.",
  },
  {
    question: "Can owned and contracted vehicles appear in the same fleet view?",
    answer: "Compatible connected vehicles can be assessed for a shared fleet setup. Confirm the device model, operator authorisation, vehicle assignments and user permissions for each contracted vehicle. Existing third-party devices or feeds need a compatibility review before inclusion is promised.",
  },
  {
    question: "Can NAVII GPS connect to our transport or warehouse software?",
    answer: "Share the system name, required data fields, update frequency and access requirements for an integration assessment. Confirm the supported interfaces and responsibilities before rollout. A transport management or warehouse integration is a separate scope, rather than an assumed feature of every tracking subscription.",
  },
  {
    question: "What should we include in a logistics fleet tracking enquiry?",
    answer: "Provide fleet size, vehicle types, operating routes, depot locations, existing GPS hardware, required reports and dispatch user count. Request an itemised quote for devices, installation, connectivity, software renewals and any additional sensors or integrations, with support arrangements explained.",
  },
];

export const metadata: Metadata = {
  title: pageTitle,
  description:
    pageDescription,
  keywords: uniqueKeywords([
    "logistics fleet tracking system",
    "logistics GPS tracking system India",
    "fleet tracking system India",
    "logistics vehicle tracking",
    "delivery vehicle tracking system",
    "transport fleet management software",
    "fleet management software India",
    "GPS fleet tracking software",
    "commercial vehicle tracking system",
    "truck fleet tracking",
    "last mile delivery tracking",
    "logistics fleet management",
  ]),
  alternates: {
    canonical: "https://naviigps.com/logistics-fleet-gps",
  },
  openGraph: {
    title: `${pageTitle} | NAVII GPS`,
    description:
      pageDescription,
    url: "https://naviigps.com/logistics-fleet-gps",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NAVII GPS logistics fleet tracking system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | NAVII GPS`,
    description:
      pageDescription,
    images: ["/og-image.jpg"],
  },
};

const features = [
  {
    title: "Live Fleet Visibility",
    description:
      "View the latest reported location and connection information for connected vehicles. Check the timestamp before using a position for dispatch decisions.",
    icon: RadioTower,
  },
  {
    title: "Routes & Trip History",
    description:
      "Review route activity and completed trips to support dispatch planning, transport control and performance review.",
    icon: Route,
  },
  {
    title: "Geofences & Alerts",
    description:
      "Create location boundaries and configure movement alerts for important fleet events and operational exceptions.",
    icon: ShieldCheck,
  },
  {
    title: "Trip & Fleet Reports",
    description:
      "Review available trip and fleet reports alongside dispatch and delivery records. Confirm the report fields and retention period needed by your team.",
    icon: ChartNoAxesCombined,
  },
];

const useCases = [
  "Logistics and transport companies",
  "Courier and delivery fleets",
  "E-commerce last-mile operations",
  "Goods and cargo transporters",
  "Truck and commercial vehicle fleets",
  "Contract logistics operators",
];

export default function LogisticsFleetGPSPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": "https://naviigps.com/logistics-fleet-gps#faq",
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question", name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/logistics-fleet-gps#webpage",
        url: "https://naviigps.com/logistics-fleet-gps",
        name: pageTitle,
        description: metadata.description,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/logistics-fleet-gps#service",
        name: "Logistics Fleet Tracking System",
        serviceType: "Logistics Fleet GPS Tracking and Vehicle Monitoring",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/logistics-fleet-gps",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "Logistics Fleet GPS", item: "https://naviigps.com/logistics-fleet-gps" },
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
                LOGISTICS FLEET GPS
              </span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                Logistics Fleet Tracking System
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  for Dispatch Teams in India
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                Review logistics vehicle locations, recorded routes and configured depot alerts through NAVII GPS. Connect suitable hardware and fleet software to support dispatch coordination, warehouse stop reviews and daily transport reporting.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">
                  Discuss Logistics Tracking <ArrowRight size={19} />
                </Link>
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">
                  Explore Fleet Software
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">LOGISTICS TRACKING FEATURES</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Visibility from dispatch to delivery</h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Connect suitable GPS hardware with NAVII GPS software to monitor logistics vehicles and delivery fleets from one platform.
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

        <section className="bg-[#06142E] py-24 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-extrabold md:text-4xl">From dispatch checks to trip reconciliation</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {workflows.map(([title, description]) => (
                <article key={title} className="rounded-3xl border border-white/15 bg-white/5 p-7">
                  <h3 className="text-xl font-bold text-cyan-200">{title}</h3>
                  <p className="mt-4 leading-8 text-slate-300">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Plan a logistics fleet tracking pilot</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Start with a representative route and agree which vehicle events your team will review. Validate the setup before expanding across depots or contractors.</p>
            <ol className="mt-8 space-y-4">
              {rolloutChecks.map((item, index) => (
                <li key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <span className="font-bold text-blue-700">{index + 1}.</span>
                  <p className="leading-8 text-slate-700">{item}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 leading-8 text-slate-600">Comparing setups for a mixed fleet? <Link href="/vehicle-tracking-system" className="font-semibold text-blue-700 underline underline-offset-4">Read the vehicle tracking selection guide</Link>. If tank-level data is required, <Link href="/fuel-monitoring-system" className="font-semibold text-blue-700 underline underline-offset-4">review fuel monitoring compatibility and calibration</Link>.</p>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-700">LOGISTICS USE CASES</span>
              <h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">Built for logistics and delivery fleets</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Improve operational visibility across goods transport, courier vehicles, last-mile delivery and multi-vehicle logistics operations. Build monitoring workflows around your routes, vehicles and business requirements.
              </p>
              <ul className="mt-8 space-y-4">
                {useCases.map((useCase) => (
                  <li key={useCase} className="flex gap-3 text-slate-700"><CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={20} />{useCase}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-2xl md:p-12">
              <PackageCheck size={44} className="text-cyan-300" />
              <h3 className="mt-7 text-3xl font-bold">Connect Fleet & Delivery Visibility</h3>
              <p className="mt-5 leading-8 text-slate-300">
                Bring vehicle locations, route activity, alerts and fleet reporting together so authorized teams can monitor day-to-day logistics operations more effectively.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Live Fleet Tracking</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Route History</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Delivery Visibility</span>
                <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">Fleet Reports</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-9 text-center md:p-12">
              <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Combine Logistics Tracking with Fleet Software</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Use NAVII GPS fleet management software with suitable GPS devices to manage vehicle location, trips, alerts and operational reports.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Fleet Management Software <ArrowRight size={18} /></Link>
                <Link href="/truck-gps" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">Truck GPS Tracking</Link>
                <Link href="/industries" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">Industry Solutions</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Logistics fleet GPS questions</h2>
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

        <section className="bg-white py-8">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="text-slate-600">
              Looking for a GPS tracker for commercial vehicles? Explore the <Link href="/products/g17-gps-tracker" className="font-semibold text-blue-700 hover:text-blue-800">G17 GPS Tracker</Link> or contact NAVII GPS for a fleet requirement review.
            </p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white md:p-14">
              <h2 className="text-4xl font-extrabold">Need Logistics Fleet Tracking?</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">
                Share your fleet size, vehicle types, delivery routes and tracking requirements with NAVII GPS so the appropriate hardware and software configuration can be evaluated.
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
