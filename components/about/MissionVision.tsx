"use client";

import { motion } from "framer-motion";

const cards = [
  {
    id: 1,
    icon: "🎯",
    title: "Our Mission",
    description:
      "To empower businesses with intelligent GPS tracking, AI-driven fleet management and IoT solutions that improve safety, productivity and operational efficiency across India.",
  },
  {
    id: 2,
    icon: "🚀",
    title: "Our Vision",
    description:
      "To become India's most trusted GPS and IoT technology company by delivering innovative, reliable and scalable mobility solutions for every business.",
  },
];

export default function MissionVision() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06142E] via-[#081C3D] to-[#07152E] py-28">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]" />

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
          className="text-center"
        >

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur">
            MISSION & VISION
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">
            Driven By Purpose
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Inspired By Innovation
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Everything we build is focused on making fleet
            management smarter, safer and more efficient.
          </p>

        </motion.div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 lg:grid-cols-2">

          {cards.map((card, index) => (

            <motion.div
              key={card.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-10 backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/40"
            >

              {/* Glow */}

              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-500/20 blur-[90px]" />

              <div className="relative z-10">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/20 text-5xl transition-transform duration-300 group-hover:scale-110">
                  {card.icon}
                </div>

                <h3 className="mt-8 text-3xl font-bold text-white">
                  {card.title}
                </h3>

                <p className="mt-6 text-lg leading-9 text-slate-300">
                  {card.description}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}