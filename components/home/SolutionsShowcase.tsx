import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BusFront,
  CarFront,
  Factory,
  Globe2,
  MapPinned,
  RadioTower,
  Route,
  School,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";
import Link from "next/link";

type Solution = {
  title: string;
  description: string;
  href: string;
  cta: string;
  badge: string;
  icon: LucideIcon;
};

const solutions: Solution[] = [
  {
    title: "AIS-140 GPS Tracking for Public Transport",
    description:
      "Explore deployment-focused AIS-140 GPS tracking solutions for buses and public transport fleets, including live visibility, routes, alerts and reports.",
    href: "/ais-140-gps",
    cta: "Explore AIS-140 Solutions",
    badge: "Government compliant",
    icon: BusFront,
  },
  {
    title: "School Bus GPS Tracking System",
    description:
      "Explore GPS tracking for school buses with live location visibility, route monitoring, geofence alerts and student transport oversight.",
    href: "/school-bus-gps",
    cta: "Explore School Bus Tracking",
    badge: "Student safety",
    icon: School,
  },
  {
    title: "Truck GPS Tracking System in India",
    description:
      "Track trucks and commercial fleets with live location, route history, geofencing, vehicle alerts and fleet visibility.",
    href: "/truck-gps",
    cta: "Explore Truck Tracking",
    badge: "Transport fleets",
    icon: Truck,
  },
  {
    title: "Logistics Fleet Tracking System",
    description:
      "Track logistics and delivery fleets with live vehicle location, route history, geofencing, alerts and fleet reports across India.",
    href: "/logistics-fleet-gps",
    cta: "Explore Logistics Tracking",
    badge: "Logistics visibility",
    icon: Warehouse,
  },
  {
    title: "Commercial Vehicle Tracking System",
    description:
      "Track commercial vehicles with live location, route history, geofencing, alerts and fleet reports for smarter transport operations.",
    href: "/commercial-vehicle-tracking",
    cta: "Explore Commercial Tracking",
    badge: "Business operations",
    icon: Factory,
  },
  {
    title: "GPS Tracker for Car in India",
    description:
      "Explore car GPS tracking devices with live location, route history, geofencing and vehicle alerts for personal and business vehicles.",
    href: "/gps-tracker-for-car",
    cta: "Explore Car GPS Trackers",
    badge: "Personal & business",
    icon: CarFront,
  },
  {
    title: "4G GPS Tracker for Vehicle",
    description:
      "Explore connected 4G GPS tracking for cars, trucks and fleets with live location, route history, geofencing and configurable alerts.",
    href: "/4g-gps-tracker",
    cta: "Explore 4G GPS Trackers",
    badge: "Fast connectivity",
    icon: RadioTower,
  },
  {
    title: "Vehicle Tracking System in India",
    description:
      "Track cars, trucks and commercial fleets with live GPS location, route history, geofencing, alerts and fleet reports.",
    href: "/vehicle-tracking-system",
    cta: "Explore Vehicle Tracking",
    badge: "Live intelligence",
    icon: Route,
  },
  {
    title: "GPS Tracking Company in India",
    description:
      "Explore NAVII GPS vehicle tracking devices and fleet management solutions for cars, trucks, buses and commercial fleets across India.",
    href: "/gps-tracking-company-india",
    cta: "Explore NAVII GPS Solutions",
    badge: "Trusted nationwide",
    icon: ShieldCheck,
  },
  {
    title: "GPS Tracker Coverage Across India",
    description:
      "Explore state-wise GPS tracking solutions across India, with dedicated coverage for South India, North India, West India, East India, Central India and Northeast India.",
    href: "/gps-tracker-india",
    cta: "View India-wide Coverage",
    badge: "Pan-India network",
    icon: Globe2,
  },
];

export default function SolutionsShowcase() {
  return (
    <section className="relative isolate overflow-hidden bg-[#06142e] py-20 sm:py-24">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_15%,rgba(6,182,212,0.18),transparent_31%),radial-gradient(circle_at_85%_75%,rgba(37,99,235,0.22),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            <MapPinned size={15} aria-hidden="true" />
            Solutions for every journey
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            GPS Tracking System in India
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            NAVII GPS provides GPS tracking systems for cars, trucks, buses and commercial fleets, combining live vehicle location, route history, geofencing, alerts and fleet management software for operations across India.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/vehicle-tracking-system"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:border-cyan-300/60 hover:bg-white/15"
            >
              Vehicle Tracking System
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/software"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:from-cyan-400 hover:to-blue-500"
            >
              GPS Fleet Management Software
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => {
            const Icon = solution.icon;

            return (
              <article
                key={solution.href}
                className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.065] p-6 shadow-2xl shadow-slate-950/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-400/35 hover:bg-white/[0.095] sm:p-7"
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-cyan-400/20" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300 shadow-inner shadow-white/5">
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300">
                    {solution.badge}
                  </span>
                </div>

                <h2 className="relative mt-6 text-xl font-bold leading-snug text-white sm:text-2xl">
                  {solution.title}
                </h2>
                <p className="relative mt-3 flex-1 text-sm leading-6 text-slate-300">
                  {solution.description}
                </p>
                <Link
                  href={solution.href}
                  className="relative mt-6 inline-flex items-center gap-2 self-start text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
                >
                  {solution.cta}
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
