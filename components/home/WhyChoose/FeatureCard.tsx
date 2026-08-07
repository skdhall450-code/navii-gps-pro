"use client";

import { motion } from "framer-motion";

type Feature = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

type Props = {
  feature: Feature;
  index: number;
};

export default function FeatureCard({
  feature,
  index,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
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
        y: -8,
      }}
      className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-7 backdrop-blur-xl"
    >
      {/* Glow */}

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-[70px]" />

      <div className="relative">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-3xl">
          {feature.icon}
        </div>

        <h3 className="mt-6 text-2xl font-bold text-white">
          {feature.title}
        </h3>

        <p className="mt-4 leading-7 text-slate-300">
          {feature.description}
        </p>

      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition duration-500 group-hover:border-cyan-400/40" />

    </motion.div>
  );
}