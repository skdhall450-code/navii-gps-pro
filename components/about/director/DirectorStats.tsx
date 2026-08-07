"use client";

import { motion } from "framer-motion";
import { directorStats } from "./directorData";

export default function DirectorStats() {
  return (
    <section className="mt-20">

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {directorStats.map((item, index) => (

          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
            }}
            viewport={{ once: true }}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20"
          >

            {/* Glow */}

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/20 blur-[70px]" />

            <div className="relative z-10">

              {/* Icon */}

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-4xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              {/* Value */}

              <h3 className="mt-6 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-5xl font-extrabold text-transparent">
                {item.value}
              </h3>

              {/* Label */}

              <p className="mt-3 text-base font-medium leading-7 text-slate-300">
                {item.label}
              </p>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
}