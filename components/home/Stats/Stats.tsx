"use client";

import { motion } from "framer-motion";
import CounterCard from "./CounterCard";
import { stats } from "./statsData";

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#06142E] py-28">

      {/* Background Glow */}

      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

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
          className="text-center"
        >

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur">
            OUR ACHIEVEMENTS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Trusted by
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Thousands Across India
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            NAVII GPS delivers reliable GPS Tracking,
            Fleet Management and IoT Solutions trusted by
            businesses, transporters and enterprises nationwide.
          </p>

        </motion.div>        {/* Stats Grid */}

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((item, index) => (

            <CounterCard
              key={item.id}
              stat={item}
              index={index}
            />

          ))}

        </div>

      </div>

    </section>
  );
}