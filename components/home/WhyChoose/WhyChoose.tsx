"use client";

import PremiumReveal from "../PremiumReveal";
import styles from "../sections-premium.module.css";

import FeatureCard from "./FeatureCard";
import StatsCard from "./StatsCard";
import { features, stats } from "./featuresData";

export default function WhyChoose() {
  return (
    <section className={`${styles.section} relative overflow-hidden py-20 sm:py-24`}>

      {/* Background Glow */}

      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" />

      {/* Grid Overlay */}

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
        >          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-blue-300 backdrop-blur">
            WHY CHOOSE NAVII GPS
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Trusted GPS &
            <span className="block text-blue-300">
              Fleet Management Partner
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            NAVII GPS INDIA provides complete GPS Tracking,
            Fleet Management, AI Dashcam, Fuel Monitoring,
            IoT Solutions and Cloud Software trusted by
            businesses across India.
          </p>

        </PremiumReveal>

        {/* Main Layout */}

        <div className="mt-12 sm:mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Left Side */}

          <div>

            <div className="grid gap-6 sm:grid-cols-2">

              {features.map((item, index) => (

                <FeatureCard
                  key={item.id}
                  feature={item}
                  index={index}
                />

              ))}

            </div>

          </div>

          {/* Right Side */}

          <div className="grid grid-cols-2 gap-3 sm:gap-6">

            {stats.map((item, index) => (

              <StatsCard
                key={item.id}
                stat={item}
                index={index}
              />

            ))}

          </div>

        </div>      </div>
    </section>
  );
}