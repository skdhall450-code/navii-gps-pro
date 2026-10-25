"use client";

import styles from "../sections-premium.module.css";
import PremiumReveal from "../PremiumReveal";


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
}: Props) {
  return (
    <PremiumReveal
      className={`${styles.card} group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 `}
    >
      {/* Background Glow */}

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-[70px]" />

      <div className="relative text-center">        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
          {stat.icon}
        </div>

        <h3 className="mt-6 text-3xl font-semibold sm:text-4xl text-blue-300">
          {stat.value}
        </h3>

        <p className="mt-3 text-base text-slate-300">
          {stat.label}
        </p>

      </div>

      {/* Hover Border */}

      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition duration-500 group-hover:border-cyan-400/40" />

    </PremiumReveal>
  );
}