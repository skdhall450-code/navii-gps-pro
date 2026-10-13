import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
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

const pageTitle = "School Bus GPS Tracker in India | Routes & Alerts";
const pageDescription = "Track school bus location, route history and geofence alerts with NAVII GPS. Plan compatible devices, staff access and a pilot for your school transport fleet.";

const faqs = [
  {
    question: "What does a school bus GPS tracking system include?",
    answer: "A typical setup combines a compatible GPS device installed in the bus, connectivity and tracking software. Confirm the proposed location updates, trip history, geofences and supported alerts in a demo using your transport workflow. Hardware, installation and service charges should be listed in the quote.",
  },
  {
    question: "Can school staff track buses on a phone?",
    answer: "Authorised transport staff can use the available mobile or web access to review connected buses. Confirm the supported access method, assigned vehicles and permissions during setup, and check the location timestamp before treating a position as current.",
  },
  {
    question: "Can parents receive school bus location or arrival notifications?",
    answer: "Parent access and arrival notifications need a separate review of the proposed software configuration. Ask for a demonstration of who can see each bus and how any notifications are delivered before promising the service to parents. Do not share transport staff login credentials for parent access.",
  },
  {
    question: "Does GPS tracking confirm that a student boarded the bus?",
    answer: "Vehicle GPS reports the bus position and trip activity; it does not by itself confirm an individual student's boarding or attendance. If attendance is required, discuss a separate process or compatible integration and verify its availability before including it in the rollout.",
  },
  {
    question: "What happens when a school bus stops reporting its location?",
    answer: "The last reported position may remain visible while fresh data is unavailable. Check the timestamp and device connection status, then ask the transport team to investigate power, connectivity or device issues. Use the school's established contact process when a journey needs an immediate update.",
  },
  {
    question: "How much does school bus GPS tracking cost?",
    answer: "Pricing depends on bus count, selected devices, installation, connectivity and software services. Share your routes and required alerts with NAVII GPS and request an itemised quote covering setup, recurring charges, support and any separately scoped integrations.",
  },
];

const dailyWorkflows = [
  ["Before the morning route", "Check the assigned bus, latest report time and device connection. Confirm which transport staff member monitors the journey and whom they contact if a bus stops reporting."],
  ["During pickup and drop-off", "Review reported bus locations against the planned route and configured stop or campus geofences. Check delays with the transport team; entering a geofence does not confirm that a student boarded or left the bus."],
  ["After the final return", "Review recorded trips and available alerts with the operator. Use the findings to refine stop boundaries, address reporting gaps and plan the next route review."],
];

const rolloutChecklist = [
  "List your buses, usual routes, pickup points and campus gates, including any contracted or replacement vehicles that need access arrangements.",
  "Confirm device and vehicle power compatibility, installation responsibilities and connectivity coverage on representative routes.",
  "Assign authorised staff, vehicle permissions, geofence boundaries and alert recipients. Demonstrate any requested parent access separately.",
  "Pilot a morning and afternoon route, review location timestamps and recorded trips, and agree support contacts and recurring service costs before expanding.",
];

export const metadata: Metadata = {
  title: pageTitle,
  description:
    pageDescription,
  keywords: uniqueKeywords([
    "GPS tracking system for school bus",
    "GPS tracking for school bus",
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
  ]),
  alternates: {
    canonical: "https://naviigps.com/school-bus-gps",
  },
  openGraph: {
    title: `${pageTitle} | NAVII GPS`,
    description:
      pageDescription,
    url: "https://naviigps.com/school-bus-gps",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NAVII GPS tracking system for school buses",
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
    title: "Live School Bus Location",
    description:
      "View the latest reported location of connected school buses and check its timestamp. Fresh updates depend on the device connection and reporting setup.",
    icon: RadioTower,
  },
  {
    title: "Routes & Trip History",
    description:
      "Review completed routes and trip activity to support school transport planning and monitoring.",
    icon: MapPinned,
  },
  {
    title: "Geofence & Vehicle Alerts",
    description:
      "Configure campus and stop boundaries and supported vehicle alerts. Agree who receives each alert and who follows up with the transport operator.",
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
        "@type": "FAQPage",
        "@id": "https://naviigps.com/school-bus-gps#faq",
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question", name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/school-bus-gps#webpage",
        url: "https://naviigps.com/school-bus-gps",
        name: pageTitle,
        description: metadata.description,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/school-bus-gps#service",
        name: "GPS Tracking System for School Bus",
        serviceType: "School Bus GPS Tracking and Fleet Monitoring",
        provider: { "@id": "https://naviigps.com/#organization" },
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
                School Bus GPS Tracking
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  for Transport Teams in India
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                Review school bus locations, recorded routes and configured geofence alerts through NAVII GPS. Give authorised transport staff the information they need to monitor daily journeys, with compatible hardware and access arranged for your fleet.
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
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">GPS tracking for school bus operations</h2>
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

        <section className="bg-[#06142E] py-24 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-extrabold md:text-4xl">A daily workflow for school transport teams</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {dailyWorkflows.map(([title, description]) => (
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
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Plan your school bus GPS rollout</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Use a representative route to agree the device setup, reporting expectations and access each person needs before adding the full fleet.</p>
            <ol className="mt-8 space-y-4">
              {rolloutChecklist.map((item, index) => (
                <li key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <span className="font-bold text-blue-700">{index + 1}.</span>
                  <p className="leading-8 text-slate-700">{item}</p>
                </li>
              ))}
            </ol>
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
              <h3 className="mt-7 text-3xl font-bold">Improve School Transport Visibility</h3>
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

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-9 text-center md:p-12">
              <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Connect School Bus Tracking with Fleet Software</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Combine school bus GPS tracking with NAVII GPS fleet management software and suitable vehicle GPS hardware for a complete transport monitoring setup.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/software" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Fleet Management Software <ArrowRight size={18} /></Link>
                <Link href="/ais-140-gps" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">Explore AIS-140 GPS</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">School bus GPS questions</h2>
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

        <section className="bg-white py-16">
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
      <section className="bg-slate-50 py-12"><div className="mx-auto max-w-5xl px-6"><h2 className="text-2xl font-bold text-slate-900">Plan your school bus tracking system</h2><p className="mt-4 leading-7 text-slate-600">Review device selection, location updates and access for school transport teams.</p><Link href="/gps-tracking-system-school-bus" className="mt-5 inline-block font-semibold text-blue-700">Read the school bus tracking system guide</Link></div></section></main>
      <Footer />
    </>
  );
}
