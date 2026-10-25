"use client";

import PremiumReveal from "../PremiumReveal";
import styles from "../sections-premium.module.css";

import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonialsData";

export default function Testimonials() {
  return (
    <section className={`${styles.section} relative overflow-hidden py-20 sm:py-24`}>
      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[100px]" />

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
        {/* Heading */}

        <PremiumReveal
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-blue-300 backdrop-blur">
            CUSTOMER TESTIMONIALS
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            What Our
            <span className="block text-blue-300">
              Clients Say
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Thousands of businesses across India trust NAVII GPS
            for GPS Tracking, Fleet Management,
            AI Dashcam and IoT Solutions.
          </p>
        </PremiumReveal>

        {/* Testimonials */}

        <div className="mt-12 sm:mt-16">
          <div
            className="grid gap-8 lg:grid-cols-3"
          >
            {testimonials.map((item, index) => (
              <div
                key={item.id}
                className="min-w-0"
              >
                <TestimonialCard
                  testimonial={item}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
