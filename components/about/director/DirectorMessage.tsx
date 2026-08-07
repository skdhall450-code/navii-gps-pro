"use client";

import { motion } from "framer-motion";

import DirectorProfile from "./DirectorProfile";
import DirectorContent from "./DirectorContent";
import DirectorStats from "./DirectorStats";

export default function DirectorMessage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06142E] via-[#081C3D] to-[#07152E] py-28">

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

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            LEADERSHIP
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Meet Our
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Leadership
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Strong leadership, innovation and customer commitment
            drive NAVII GPS towards building India most trusted
            GPS Tracking and IoT technology platform.
          </p>
        </motion.div>

        {/* Main Section */}

        <div className="grid items-center gap-20 lg:grid-cols-[460px_1fr]">

          {/* Left */}

          <DirectorProfile />

          {/* Right */}

          <DirectorContent />

        </div>

        {/* Stats */}

        <div className="mt-20">

          <DirectorStats />

        </div>

      </div>

    </section>
  );
}