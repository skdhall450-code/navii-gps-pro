"use client";

import styles from "../sections-premium.module.css";

import CTAButtons from "./CTAButtons";
import CTAStats from "./CTAStats";

export default function CTA() {
  return (
    <section className={`${styles.section} relative overflow-hidden py-20 sm:py-24`}>

      {/* Background Glow */}

      <div className="absolute -left-32 top-10 h-[450px] w-[450px] rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/5 blur-[100px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">

        <div
          className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-10 lg:p-14 "
        >

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-blue-300">
            READY TO GROW?
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Transform Your Fleet With
            <span className="block text-blue-300">
              NAVII GPS Platform
            </span>
          </h2>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            Experience real-time GPS tracking, AI fleet monitoring,
            fuel analytics, cloud dashboard and complete vehicle
            management from one powerful platform.
          </p>          {/* Buttons */}

          <div className="mt-12">
            <CTAButtons />
          </div>

          {/* Stats */}

          <div className="mt-14">
            <CTAStats />
          </div>

        </div>

      </div>

    </section>
  );
}