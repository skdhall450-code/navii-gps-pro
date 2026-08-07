"use client";

import { motion } from "framer-motion";
import CTAButtons from "./CTAButtons";
import CTAStats from "./CTAStats";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06142E] via-[#0B2452] to-[#07152E] py-28">

      {/* Background Glow */}

      <div className="absolute -left-32 top-10 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[140px]" />

      {/* Grid */}

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
          className="overflow-hidden rounded-[40px] border border-cyan-400/20 bg-white/5 p-12 backdrop-blur-2xl"
        >

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            READY TO GROW?
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Transform Your Fleet With
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              NAVII GPS Platform
            </span>
          </h2>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            Experience real-time GPS tracking, AI fleet monitoring,
            fuel analytics, cloud dashboard and complete vehicle
            management from one powerful platform.
          </p>          {/* Buttons */}

          <div className="mt-12">
            <CTAButtons />
          </div>

          {/* Stats */}

          <div className="mt-14">
            <CTAStats />
          </div>

        </motion.div>

      </div>

    </section>
  );
}