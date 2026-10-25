"use client";

import PremiumReveal from "../PremiumReveal";
import styles from "../sections-premium.module.css";

import FAQItem from "./FAQItem";
import { faqs } from "./faqData";

export default function FAQ() {
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

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Heading */}

        <PremiumReveal
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-blue-300 backdrop-blur">
            FREQUENTLY ASKED QUESTIONS
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Got Questions?
            <span className="block text-blue-300">
              {"We've Got Answers"}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Everything you need to know about NAVII GPS,
            vehicle tracking, fleet management and our
            intelligent IoT solutions.
          </p>
        </PremiumReveal>

        {/* FAQ List */}

        <div className="mt-16 space-y-6">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
            />
          ))}
        </div>
      </div>
    </section>
  );
}