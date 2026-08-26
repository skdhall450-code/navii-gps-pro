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

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "GPS tracking, fleet management, vehicle safety and IoT solutions for logistics, schools, healthcare, manufacturing, transport, agriculture and corporate fleets.",
  alternates: {
    canonical:
      "https://www.naviigps.com/industries",
  },
  openGraph: {
    title:
      "Industries We Serve | NAVII GPS INDIA",
    description:
      "Smart GPS tracking and fleet management solutions for businesses and transport operations across India.",
    url:
      "https://www.naviigps.com/industries",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt:
          "Industries served by NAVII GPS INDIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Industries We Serve | NAVII GPS INDIA",
    description:
      "GPS tracking and fleet management solutions for businesses across India.",
    images: ["/og-image.jpg"],
  },
};

const industries = [
  {
    title: "Logistics & Transport",
    description:
      "Track vehicles, delivery progress and route performance across logistics operations.",
    icon: Truck,
    highlights: [
      "Live fleet visibility",
      "Route history",
      "Operational alerts",
    ],
  },
  {
    title: "Manufacturing",
    description:
      "Monitor company vehicles, material movement and field operations from one platform.",
    icon: Factory,
    highlights: [
      "Vehicle utilization",
      "Trip monitoring",
      "Centralized reports",
    ],
  },
  {
    title: "Schools & Colleges",
    description:
      "Improve student transport visibility with live bus tracking and configurable alerts.",
    icon: School,
    highlights: ["School bus tracking", "Geofence alerts", "Route monitoring"],
  },
  {
    title: "Hospitals & Ambulances",
    description:
      "Monitor ambulances and emergency fleets for faster operational coordination.",
    icon: Hospital,
    highlights: [
      "Live ambulance location",
      "Trip history",
      "Fleet availability",
    ],
  },
  {
    title: "Taxi & Cab Fleets",
    description:
      "Manage commercial cabs with location monitoring, driver activity and trip records.",
    icon: Car,
    highlights: ["Cab visibility", "Speed alerts", "Daily trip reports"],
  },
  {
    title: "Bus Operators",
    description:
      "Track passenger, staff and contract buses across scheduled transport routes.",
    icon: Bus,
    highlights: ["Route playback", "Arrival visibility", "Fleet status"],
  },
  {
    title: "Agriculture",
    description:
      "Track tractors, harvesters and mobile agricultural equipment across field operations.",
    icon: Tractor,
    highlights: ["Equipment tracking", "Movement history", "Usage visibility"],
  },
  {
    title: "Fleet Owners",
    description:
      "Control mixed commercial fleets using real-time status, alerts and performance reports.",
    icon: Gauge,
    highlights: ["Fleet dashboard", "Vehicle alerts", "Performance reports"],
  },
  {
    title: "Corporate Mobility",
    description:
      "Manage employee transportation and company-owned vehicles through secure fleet tools.",
    icon: Building2,
    highlights: ["Employee transport", "Vehicle history", "Access control"],
  },
  {
    title: "E-Commerce Delivery",
    description:
      "Improve last-mile delivery visibility with vehicle tracking and route intelligence.",
    icon: PackageCheck,
    highlights: [
      "Delivery fleet tracking",
      "Route visibility",
      "Trip analytics",
    ],
  },
  {
    title: "Oil & Gas",
    description:
      "Monitor tankers and industrial transport with location, movement and safety alerts.",
    icon: Fuel,
    highlights: ["Tanker tracking", "Geofence monitoring", "Movement alerts"],
  },
  {
    title: "Emergency Services",
    description:
      "Support rescue and response fleets with dependable real-time vehicle visibility.",
    icon: Siren,
    highlights: [
      "Rapid fleet location",
      "Status monitoring",
      "Response history",
    ],
  },
];

const capabilities = [
  {
    title: "Real-Time Visibility",
    description:
      "View connected vehicles and their latest operational status through the NAVII GPS platform.",
    icon: RadioTower,
  },
  {
    title: "Geofences & Alerts",
    description:
      "Configure location boundaries and receive important movement and vehicle alerts.",
    icon: MapPinned,
  },
  {
    title: "Reports & Analytics",
    description:
      "Use trip history and fleet reports to improve control, safety and operational planning.",
    icon: ChartNoAxesCombined,
  },
];

export default function IndustriesPage() {
  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-clip bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-4xl">
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-cyan-200">
                INDUSTRY SOLUTIONS
              </span>

              <h1 className="mt-7 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                GPS & Fleet Solutions
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Built for Every Industry
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                NAVII GPS helps organizations monitor vehicles, improve
                operational visibility and manage connected fleets through one
                secure platform.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400"
                >
                  Discuss Your Requirement
                  <ArrowRight size={19} />
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
                INDUSTRIES WE SERVE
              </span>

              <h2 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">
                One Platform, Multiple Operations
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Flexible GPS tracking and fleet management capabilities for
                commercial, institutional and specialized transport needs.
              </p>
            </div>

            <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {industries.map((industry) => {
                const Icon = industry.icon;

                return (
                  <article
                    key={industry.title}
                    className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-xl"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                      <Icon size={31} />
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-slate-900">
                      {industry.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {industry.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {industry.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-center gap-3 text-sm font-medium text-slate-700"
                        >
                          <CheckCircle2
                            size={17}
                            className="shrink-0 text-emerald-500"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#06142E] py-24 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-300">
                PLATFORM CAPABILITIES
              </span>

              <h2 className="mt-5 text-4xl font-extrabold md:text-5xl">
                Tools That Support Daily Operations
              </h2>
            </div>

            <div className="mt-14 grid gap-7 md:grid-cols-3">
              {capabilities.map((capability) => {
                const Icon = capability.icon;

                return (
                  <div
                    key={capability.title}
                    className="rounded-3xl border border-cyan-300/20 bg-white/5 p-8"
                  >
                    <Icon size={34} className="text-cyan-300" />

                    <h3 className="mt-6 text-2xl font-bold">
                      {capability.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-300">
                      {capability.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-700 p-10 text-center text-white shadow-2xl md:p-14">
              <h2 className="text-4xl font-extrabold">
                Need a Solution for Your Industry?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">
                Tell our team about your vehicles and operational requirements.
                We will help you select the appropriate NAVII GPS solution.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/917717394007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-4 font-semibold text-white transition hover:bg-emerald-400"
                >
                  <MessageCircle size={20} />
                  WhatsApp Enquiry
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-slate-100"
                >
                  Contact NAVII GPS
                  <ArrowRight size={19} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
