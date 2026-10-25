"use client";

import PremiumReveal from "../PremiumReveal";
import styles from "../sections-premium.module.css";

import { industries } from "./industriesData";

export default function Clients() {
  return (
    <section className={`${styles.section} relative overflow-hidden py-20 sm:py-24`}>

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[100px]" />

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

        <PremiumReveal
          className="text-center"
        >

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-blue-300 backdrop-blur">
            TRUSTED ACROSS INDUSTRIES
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Industries We
            <span className="block text-blue-300">
              Empower Every Day
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            NAVII GPS delivers advanced GPS tracking and fleet
            management solutions across multiple industries
            throughout India.
          </p>

        </PremiumReveal>

        {/* Industries Grid */}

        <div className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {industries.map((industry) => (

            <div
              key={industry.id}
              className={`${styles.card} group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6  transition-all duration-500 hover:border-cyan-400/40`}
            >

              {/* Glow */}

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-[80px]" />

              <div className="relative z-10">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-500/10 text-3xl motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110">
                  {industry.icon}
                </div>

                <h3 className="mt-6 text-center text-xl font-semibold text-white">
                  {industry.title}
                </h3>

                <p className="mt-4 text-center leading-7 text-slate-300">
                  {industry.description}
                </p>

              </div>

              {/* Hover Border */}

              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition-all duration-500 group-hover:border-cyan-400/40" />

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}