import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import { PageSchema } from "@/components/seo/PageSchema";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Bus,
  Car,
  CheckCircle2,
  Factory,
  Fuel,
  Gauge,
  Hospital,
  MapPinned,
  MessageCircle,
  PackageCheck,
  RadioTower,
  School,
  Siren,
  Tractor,
  Truck,
  ChartNoAxesCombined,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

const pageTitle = "Industry GPS Tracking Solutions India | Fleet Use Cases";
const pageDescription = "Compare GPS tracking workflows for logistics, school transport, company cars and mixed fleets. Plan devices, user access, reports and a NAVII GPS pilot.";
const workflowGuide = [
  {
    "title": "Logistics and delivery vehicles",
    "task": "Review depot departures, warehouse stops and completed journeys alongside dispatch records.",
    "checks": "Confirm report times, depot boundaries and the records needed to investigate a delayed stop.",
    "href": "/logistics-fleet-gps",
    "label": "Logistics fleet guide"
  },
  {
    "title": "School and institutional transport",
    "task": "Help the transport team review bus movement, route history and configured boundary events.",
    "checks": "Agree authorised access, route changes and who follows up on alerts with the transport office.",
    "href": "/school-bus-gps",
    "label": "School bus tracking guide"
  },
  {
    "title": "Company cars and cab fleets",
    "task": "Review vehicle locations and recorded trips for assigned business journeys.",
    "checks": "Confirm vehicle assignments, permitted users, installation and the history required for trip reviews.",
    "href": "/gps-tracker-for-car",
    "label": "Car tracker setup guide"
  },
  {
    "title": "Mixed commercial operations",
    "task": "Bring suitable connected vehicles into a shared operational view.",
    "checks": "Match hardware to each vehicle type and agree reports and user access before expanding the fleet.",
    "href": "/commercial-vehicle-tracking",
    "label": "Commercial fleet guide"
  }
];
const faqs = [
  {
    "question": "How do we choose GPS tracking for our industry?",
    "answer": "Start with the decisions your team needs to make, such as reviewing depot departures, school bus routes or business journeys. List the vehicle types, routes, required reports and authorised users, then assess the device and software setup against those tasks."
  },
  {
    "question": "Can the same GPS tracking setup be used for every vehicle?",
    "answer": "A shared platform may support several compatible vehicle types, but device choice, power requirements and installation must be assessed for each one. Include any hired vehicles or equipment with different power arrangements in the review."
  },
  {
    "question": "What should an industry fleet pilot include?",
    "answer": "Choose representative vehicles and operating routes. Agree how to check location timestamps, recorded trips, configured alerts and user access. Compare the available data with normal operating records and resolve reporting gaps before a wider rollout."
  },
  {
    "question": "Does vehicle tracking confirm that a delivery or pickup is complete?",
    "answer": "A recorded location or geofence event helps review vehicle movement around a site. Use delivery records, pickup confirmations or the relevant operating process to establish that the task was completed."
  },
  {
    "question": "Is fuel monitoring included in an industry GPS tracking package?",
    "answer": "Confirm fuel monitoring separately in the proposed scope. It requires a compatible fuel-data source and any necessary sensor installation, tank calibration and software integration. Ask which readings and reports will be available for the actual vehicle setup."
  },
  {
    "question": "What details are needed for an industry fleet quote?",
    "answer": "Share fleet size, vehicle types, operating locations, existing hardware, required users and the tasks or reports you need. Ask for hardware, installation, connectivity, software, renewals and optional equipment to be itemised, with support and handover arrangements confirmed."
  }
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: uniqueKeywords([
    "GPS tracking for industries",
    "fleet tracking solutions India",
    "bus GPS tracking system",
    "public transport GPS tracking",
    "school bus GPS tracking",
    "commercial vehicle tracking system",
    "logistics fleet tracking",
    "AIS-140 GPS tracking",
    "vehicle tracking system India",
  ]),
  alternates: {
    canonical: "https://naviigps.com/industries",
  },
  openGraph: {
    title: `${pageTitle} | NAVII GPS INDIA`,
    description: pageDescription,
    url: "https://naviigps.com/industries",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Industries served by NAVII GPS INDIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | NAVII GPS INDIA`,
    description: pageDescription,
    images: ["/og-image.jpg"],
  },
};

const industries = [
  {
    title: "Logistics & Transport",
    description: "Track vehicles, delivery progress and route performance across logistics operations.",
    icon: Truck,
    highlights: ["Live fleet visibility", "Route history", "Operational alerts"],
  },
  {
    title: "Manufacturing",
    description: "Monitor company vehicles, material movement and field operations from one platform.",
    icon: Factory,
    highlights: ["Vehicle utilization", "Trip monitoring", "Centralized reports"],
  },
  {
    title: "Schools & Colleges",
    description: "Improve student transport visibility with live bus tracking and configurable alerts.",
    icon: School,
    highlights: ["School bus tracking", "Geofence alerts", "Route monitoring"],
  },
  {
    title: "Hospitals & Ambulances",
    description: "Review reported ambulance locations and trip records to support fleet coordination.",
    icon: Hospital,
    highlights: ["Live ambulance location", "Trip history", "Fleet availability"],
  },
  {
    title: "Taxi & Cab Fleets",
    description: "Manage commercial cabs with location monitoring, driver activity and trip records.",
    icon: Car,
    highlights: ["Cab visibility", "Speed alerts", "Daily trip reports"],
  },
  {
    title: "Bus Operators",
    description: "Track passenger, staff and contract buses across scheduled transport routes.",
    icon: Bus,
    highlights: ["Route playback", "Arrival visibility", "Fleet status"],
  },
  {
    title: "Agriculture",
    description: "Track tractors, harvesters and mobile agricultural equipment across field operations.",
    icon: Tractor,
    highlights: ["Equipment tracking", "Movement history", "Usage visibility"],
  },
  {
    title: "Fleet Owners",
    description: "Control mixed commercial fleets using real-time status, alerts and performance reports.",
    icon: Gauge,
    highlights: ["Fleet dashboard", "Vehicle alerts", "Performance reports"],
  },
  {
    title: "Corporate Mobility",
    description: "Manage employee transportation and company-owned vehicles through secure fleet tools.",
    icon: Building2,
    highlights: ["Employee transport", "Vehicle history", "Access control"],
  },
  {
    title: "E-Commerce Delivery",
    description: "Improve last-mile delivery visibility with vehicle tracking and route intelligence.",
    icon: PackageCheck,
    highlights: ["Delivery fleet tracking", "Route visibility", "Trip analytics"],
  },
  {
    title: "Oil & Gas",
    description: "Monitor tankers and industrial transport with location, movement and safety alerts.",
    icon: Fuel,
    highlights: ["Tanker tracking", "Geofence monitoring", "Movement alerts"],
  },
  {
    title: "Emergency Services",
    description: "Review the latest reported vehicle locations alongside existing response coordination procedures.",
    icon: Siren,
    highlights: ["Rapid fleet location", "Status monitoring", "Response history"],
  },
];

const capabilities = [
  {
    title: "Real-Time Visibility",
    description: "View connected vehicles and their latest operational status through the NAVII GPS platform.",
    icon: RadioTower,
  },
  {
    title: "Geofences & Alerts",
    description: "Configure location boundaries and receive important movement and vehicle alerts.",
    icon: MapPinned,
  },
  {
    title: "Reports & Analytics",
    description: "Use trip history and fleet reports to improve control, safety and operational planning.",
    icon: ChartNoAxesCombined,
  },
];

export default function IndustriesPage() {
  return (
    <>
      <PageSchema path="/industries" name="GPS and Fleet Solutions for Industries" type="CollectionPage" description={metadata.description} /><Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "@id": "https://naviigps.com/industries#faq", mainEntity: faqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }).replace(/</g, "\\u003c") }} />
        <section className="relative overflow-clip bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-4xl">
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-cyan-200">INDUSTRY SOLUTIONS</span>
              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                GPS & Fleet Solutions
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">for Different Fleet Operations</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">NAVII GPS helps organizations monitor vehicles, improve operational visibility and manage connected fleets through one secure platform.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400">Discuss Your Requirement <ArrowRight size={19} /></Link>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">Explore Products</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">INDUSTRIES WE SERVE</span>
              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">One Platform, Multiple Operations</h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">Flexible GPS tracking and fleet management capabilities for commercial, institutional and specialized transport needs.</p>
            </div>

            <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {industries.map((industry) => {
                const Icon = industry.icon;
                const isSchool = industry.title === "Schools & Colleges";
                const isLogistics = industry.title === "Logistics & Transport";
                return (
                  <article key={industry.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={31} /></div>
                    <h3 className="mt-6 text-2xl font-bold text-slate-900">{industry.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{industry.description}</p>
                    <ul className="mt-6 space-y-3">
                      {industry.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 size={17} className="shrink-0 text-emerald-500" />{highlight}</li>
                      ))}
                    </ul>
                    {isSchool && (
                      <Link href="/school-bus-gps" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">
                        School Bus GPS Tracking <ArrowRight size={16} />
                      </Link>
                    )}
                    {isLogistics && (
                      <Link href="/logistics-fleet-gps" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">
                        Logistics Fleet Tracking <ArrowRight size={16} />
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#06142E] py-24 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-300">PLATFORM CAPABILITIES</span>
              <h2 className="mt-5 text-4xl font-extrabold md:text-5xl">Tools That Support Daily Operations</h2>
            </div>
            <div className="mt-14 grid gap-7 md:grid-cols-3">
              {capabilities.map((capability) => {
                const Icon = capability.icon;
                return (
                  <div key={capability.title} className="rounded-3xl border border-cyan-300/20 bg-white/5 p-8">
                    <Icon size={34} className="text-cyan-300" />
                    <h3 className="mt-6 text-2xl font-bold">{capability.title}</h3>
                    <p className="mt-4 leading-7 text-slate-300">{capability.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Match GPS tracking to your daily workflow</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Use your operating tasks to define the tracking requirement. Review the available data alongside the records your team already keeps.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {workflowGuide.map((workflow) => (
                <article key={workflow.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                  <h3 className="text-xl font-bold text-slate-900">{workflow.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{workflow.task}</p>
                  <p className="mt-4 leading-7 text-slate-600"><span className="font-semibold text-slate-900">Before rollout: </span>{workflow.checks}</p>
                  <Link href={workflow.href} className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-700 underline underline-offset-4">{workflow.label}<ArrowRight size={17} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
            <p className="mt-8 leading-8 text-slate-600">Need more than location data? <Link href="/fuel-monitoring-system" className="font-semibold text-blue-700 underline underline-offset-4">Review fuel monitoring requirements</Link> and confirm the reports you need in a <Link href="/software" className="font-semibold text-blue-700 underline underline-offset-4">fleet software demonstration</Link>.</p>
          </div>
        </section>
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Industry fleet tracking questions</h2>
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

        <section className="bg-cyan-50 py-12">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">AIS-140 GPS Tracking for Public Transport</h2>
            <p className="mx-auto mt-3 max-w-3xl text-slate-600">Explore our dedicated AIS-140 GPS tracking solution for buses and public transport fleets.</p>
            <Link href="/ais-140-gps" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">View AIS-140 GPS Solution <ArrowRight size={18} /></Link>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white shadow-2xl md:p-14">
              <h2 className="text-4xl font-extrabold">Need a Solution for Your Industry?</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">Tell our team about your vehicles and operational requirements. We will help you select the appropriate NAVII GPS solution.</p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <a href="https://wa.me/918899729705" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-4 font-semibold text-white transition hover:bg-emerald-400"><MessageCircle size={20} />WhatsApp Enquiry</a>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-slate-100">Contact NAVII GPS <ArrowRight size={19} /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
