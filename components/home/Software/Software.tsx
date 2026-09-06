"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DashboardCard from "./DashboardCard";
import FeatureList from "./FeatureList";
import { softwareFeatures } from "./softwareData";

export default function Software() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06142E] via-[#081C3D] to-[#07152E] py-28">
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />
      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur">
            GPS SOFTWARE PLATFORM
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Powerful Fleet
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Management Dashboard
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Cloud based GPS fleet management software with live vehicle
            tracking, route history, fuel monitoring, driver behaviour, alerts,
            analytics and reports.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Connect your vehicle GPS trackers with the NAVII platform for
            centralized fleet visibility and monitoring. Learn more about our{" "}
            <Link
              href="/software"
              className="font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
            >
              GPS tracking and fleet management software
            </Link>{" "}
            or explore our{" "}
            <Link
              href="/products"
              className="font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
            >
              GPS tracking devices
            </Link>
            .
          </p>
        </motion.div>

        <div className="mt-20 grid items-center gap-20 lg:grid-cols-2">
          <FeatureList features={softwareFeatures} />
          <DashboardCard />
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/software"
            className="rounded-2xl bg-cyan-500 px-8 py-4 font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,.35)] transition hover:bg-cyan-400"
          >
            Explore Fleet Management Software →
          </Link>
        </div>
      </div>
    </section>
  );
}
