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

export default function StatsCard({
  stat,
  index,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl"
    >
      {/* Background Glow */}

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-[70px]" />

      <div className="relative text-center">        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-3xl">
          {stat.icon}
        </div>

        <h3 className="mt-6 text-4xl font-extrabold text-cyan-300">
          {stat.value}
        </h3>

        <p className="mt-3 text-base text-slate-300">
          {stat.label}
        </p>

      </div>

      {/* Hover Border */}

      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition duration-500 group-hover:border-cyan-400/40" />

    </motion.div>
  );
}