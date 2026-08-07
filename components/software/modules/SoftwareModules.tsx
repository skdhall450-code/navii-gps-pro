"use client";

import { motion } from "framer-motion";
import {
  Truck,
  School,
  CarTaxiFront,
  Factory,
  Building2,
  Building,
  Landmark,
  Package,
} from "lucide-react";

const modules = [
  {
    title: "Logistics",
    description:
      "Track delivery vehicles, optimize routes and improve fleet efficiency.",
    icon: Truck,
  },
  {
    title: "School Bus",
    description:
      "Real-time school bus tracking with parent notifications and safety alerts.",
    icon: School,
  },
  {
    title: "Taxi & Cab",
    description:
      "Manage taxi fleets with live tracking, trips and driver monitoring.",
    icon: CarTaxiFront,
  },
  {
    title: "Manufacturing",
    description:
      "Monitor factory vehicles, assets and employee transportation.",
    icon: Factory,
  },
  {
    title: "Healthcare",
    description:
      "Track ambulances and medical vehicles with real-time location updates.",
    icon: Building2,
  },
  {
    title: "Corporate Fleet",
    description:
      "Manage company vehicles with reports, alerts and driver analytics.",
    icon: Building,
  },
  {
    title: "Government",
    description:
      "Fleet monitoring solutions for government departments and agencies.",
    icon: Landmark,
  },
  {
    title: "Asset Tracking",
    description:
      "Track valuable assets, equipment and containers anywhere.",
    icon: Package,
  },
];

export default function SoftwareModules() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            INDUSTRY MODULES
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Solutions for Every Industry
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            NAVII GPS software is designed to support multiple industries
            with powerful fleet tracking, automation and reporting.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {modules.map((module, index) => {
            const Icon = module.icon;

            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-2xl"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 transition group-hover:bg-cyan-600 group-hover:text-white">

                  <Icon size={30} />

                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {module.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {module.description}
                </p>

              </motion.div>
            );
          })}

        </div>

      </div>

    </section>
  );
}