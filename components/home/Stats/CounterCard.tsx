"use client";

import { motion } from "framer-motion";

type Stat = {
  id: number;
  icon: string;
  value: string;
  label: string;
};

type Props = {
  stat: Stat;
  index: number;
};

export default function CounterCard({
  stat,
  index,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
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
        y: -10,
        scale: 1.03,
      }}
      className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500"
    >
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-[70px]" />

      <div className="relative z-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/20 text-4xl">
          {stat.icon}
        </div>

        <h3 className="mt-6 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-5xl font-extrabold text-transparent">
          {stat.value}
        </h3>

        <p className="mt-4 text-lg font-medium text-slate-300">
          {stat.label}
        </p>
      </div>

      {/* Hover Border */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition-all duration-500 group-hover:border-cyan-400/40" />
    </motion.div>
  );
}