"use client";

import styles from "../sections-premium.module.css";
import PremiumReveal from "../PremiumReveal";


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
}: Props) {
  return (
    <PremiumReveal
      className={`${styles.card} group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 `}
    >
      {/* Glow */}

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-[70px]" />

      <div className="relative">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
          {feature.icon}
        </div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          {feature.title}
        </h3>

        <p className="mt-4 leading-7 text-slate-300">
          {feature.description}
        </p>

      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition duration-500 group-hover:border-cyan-400/40" />

    </PremiumReveal>
  );
}