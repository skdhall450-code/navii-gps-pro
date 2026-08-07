"use client";

import { motion } from "framer-motion";
import { industries } from "./industriesData";

export default function Clients() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06142E] via-[#081C3D] to-[#07152E] py-28">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />

      {/* Grid Background */}

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
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur">
            TRUSTED ACROSS INDUSTRIES
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Industries We
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Empower Every Day
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            NAVII GPS delivers advanced GPS tracking and fleet
            management solutions across multiple industries
            throughout India.
          </p>

        </motion.div>

        {/* Industries Grid */}

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {industries.map((industry, index) => (

            <motion.div
              key={industry.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/40"
            >

              {/* Glow */}

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-[80px]" />

              <div className="relative z-10">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/20 text-5xl transition-transform duration-300 group-hover:scale-110">
                  {industry.icon}
                </div>

                <h3 className="mt-6 text-center text-2xl font-bold text-white">
                  {industry.title}
                </h3>

                <p className="mt-4 text-center leading-7 text-slate-300">
                  {industry.description}
                </p>

              </div>

              {/* Hover Border */}

              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition-all duration-500 group-hover:border-cyan-400/40" />

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}