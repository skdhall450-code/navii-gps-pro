"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06142E] via-[#081C3D] to-[#07152E] py-32">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
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
            ABOUT NAVII GPS
          </span>

          <h1 className="mt-8 text-5xl font-extrabold text-white md:text-6xl lg:text-7xl">
            Building Smarter
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Fleet Management
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
            NAVII GPS INDIA (OPC) PVT LTD delivers advanced GPS Tracking,
            Fleet Management, AI Dashcams, Fuel Monitoring and IoT
            solutions that help businesses improve efficiency,
            safety and operational control across India.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">

            <div className="rounded-full border border-cyan-400/20 bg-white/5 px-6 py-3 text-cyan-300 backdrop-blur">
              🚗 25K+ Vehicles
            </div>

            <div className="rounded-full border border-cyan-400/20 bg-white/5 px-6 py-3 text-cyan-300 backdrop-blur">
              🏢 500+ Clients
            </div>

            <div className="rounded-full border border-cyan-400/20 bg-white/5 px-6 py-3 text-cyan-300 backdrop-blur">
              🇮🇳 PAN India Support
            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}