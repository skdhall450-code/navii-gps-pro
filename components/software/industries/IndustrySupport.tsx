"use client";

import { motion } from "framer-motion";
import {
  Truck,
  School,
  Hospital,
  Factory,
  Building2,
  Bus,
} from "lucide-react";

const industries = [
  {
    title: "Logistics",
    icon: Truck,
    desc: "Track fleets, deliveries and optimize routes.",
  },
  {
    title: "School Transport",
    icon: School,
    desc: "Ensure student safety with live bus tracking.",
  },
  {
    title: "Healthcare",
    icon: Hospital,
    desc: "Real-time ambulance and medical fleet monitoring.",
  },
  {
    title: "Manufacturing",
    icon: Factory,
    desc: "Monitor company vehicles and field operations.",
  },
  {
    title: "Corporate",
    icon: Building2,
    desc: "Manage employee transportation efficiently.",
  },
  {
    title: "Public Transport",
    icon: Bus,
    desc: "Track buses and improve passenger information.",
  },
];

export default function IndustrySupport() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            INDUSTRIES
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Trusted Across Industries
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
            NAVII GPS software is designed for businesses of every size.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-slate-600">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}