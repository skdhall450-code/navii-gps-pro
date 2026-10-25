"use client";

import PremiumReveal from "../PremiumReveal";
import styles from "../sections-premium.module.css";

import Link from "next/link";
import DashboardCard from "./DashboardCard";
import FeatureList from "./FeatureList";
import { softwareFeatures } from "./softwareData";

export default function Software() {
  return (
    <section className={`${styles.section} relative overflow-hidden py-20 sm:py-24`}>
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[100px]" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <PremiumReveal
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-blue-300 backdrop-blur">
            GPS SOFTWARE PLATFORM
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Powerful Fleet
            <span className="block text-blue-300">
              Management Dashboard
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Cloud based GPS fleet management software with live vehicle
            tracking, route history, fuel monitoring, driver behaviour, alerts,
            analytics and reports.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Connect your vehicle GPS trackers with the NAVII platform for
            centralized fleet visibility and monitoring. Learn more about our{" "}
            <Link
              href="/software"
              className="font-semibold text-blue-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
            >
              GPS tracking and fleet management software
            </Link>{" "}
            or explore our{" "}
            <Link
              href="/products"
              className="font-semibold text-blue-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
            >
              GPS tracking devices
            </Link>
            .
          </p>
        </PremiumReveal>

        <div className="mt-12 sm:mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FeatureList features={softwareFeatures} />
          <DashboardCard />
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/software"
            className="rounded-2xl bg-[#245ac4] px-8 py-4 font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-[#2f6de0]"
          >
            Explore Fleet Management Software →
          </Link>
        </div>
      </div>
    </section>
  );
}
