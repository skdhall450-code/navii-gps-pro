"use client";

import { motion } from "framer-motion";
import DashboardCard from "./DashboardCard";
import FeatureList from "./FeatureList";
import { softwareFeatures } from "./softwareData";

export default function Software() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06142E] via-[#081C3D] to-[#07152E] py-28">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />

      {/* Animated Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
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
            Cloud based GPS tracking software with
            Live Tracking, Analytics, Fuel Monitoring,
            Driver Behaviour, Alerts and Reports.
          </p>

        </motion.div>

        {/* Main Layout */}

        <div className="mt-20 grid items-center gap-20 lg:grid-cols-2">

          {/* Left */}

          <FeatureList features={softwareFeatures} />

          {/* Right */}

          <DashboardCard />

        </div>

      </div>

    </section>
  );
}