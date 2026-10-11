"use client";

import { motion } from "framer-motion";

const stats = [
  {
    id: 1,
    value: "Devices",
    label: "GPS tracking hardware",
    icon: "🚗",
  },
  {
    id: 2,
    value: "Software",
    label: "Fleet visibility dashboard",
    icon: "🏢",
  },
  {
    id: 3,
    value: "Reports",
    label: "Trips and vehicle activity",
    icon: "📊",
  },
  {
    id: 4,
    value: "Office Hours",
    label: "Mon–Sat, 09:30–18:30 IST",
    icon: "🛠️",
  },
];

export default function CTAStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.15,
          }}
          viewport={{ once: true }}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          className="group rounded-2xl border border-cyan-400/20 bg-white/5 p-6 text-center backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-3xl">
            {item.icon}
          </div>

          <h3 className="mt-5 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-2xl font-extrabold text-transparent">
            {item.value}
          </h3>

          <p className="mt-3 text-sm text-slate-300">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
