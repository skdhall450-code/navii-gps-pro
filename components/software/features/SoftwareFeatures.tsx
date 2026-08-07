"use client";

import { motion } from "framer-motion";
import {
  MapPinned,
  Route,
  Fuel,
  Bell,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Users,
  Lock,
  Clock3,
  Cloud,
  Database,
} from "lucide-react";

const features = [
  {
    title: "Real-Time Tracking",
    description: "Monitor every vehicle with live GPS location updates.",
    icon: MapPinned,
  },
  {
    title: "Trip Playback",
    description: "Replay complete journey history with timeline.",
    icon: Route,
  },
  {
    title: "Fuel Monitoring",
    description: "Track fuel level, consumption and theft alerts.",
    icon: Fuel,
  },
  {
    title: "Instant Alerts",
    description: "Overspeed, ACC, Power Cut, SOS and Geo Fence alerts.",
    icon: Bell,
  },
  {
    title: "Geo Fence",
    description: "Create virtual boundaries and receive notifications.",
    icon: ShieldCheck,
  },
  {
    title: "Mobile Apps",
    description: "Android & iOS apps for fleet monitoring anywhere.",
    icon: Smartphone,
  },
  {
    title: "Advanced Reports",
    description: "Mileage, trips, idle time and driver reports.",
    icon: BarChart3,
  },
  {
    title: "Multi User Access",
    description: "Create unlimited users with different permissions.",
    icon: Users,
  },
  {
    title: "Remote Engine Lock",
    description: "Immobilize vehicles remotely whenever required.",
    icon: Lock,
  },
  {
    title: "24×7 Monitoring",
    description: "Continuous monitoring with cloud synchronization.",
    icon: Clock3,
  },
  {
    title: "Cloud Platform",
    description: "Secure cloud-based infrastructure with fast access.",
    icon: Cloud,
  },
  {
    title: "API Integration",
    description: "Integrate GPS data with ERP and third-party systems.",
    icon: Database,
  },
];

export default function SoftwareFeatures() {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            SOFTWARE FEATURES
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Everything You Need to Manage Your Fleet
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            NAVII GPS software combines intelligent vehicle tracking,
            analytics, alerts and cloud technology into one platform.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                viewport={{ once: true }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 transition group-hover:bg-cyan-600 group-hover:text-white">

                  <Icon size={30} />

                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>

              </motion.div>
            );
          })}

        </div>

      </div>

    </section>
  );
}