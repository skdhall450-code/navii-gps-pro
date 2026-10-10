"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroContent() {
  return (
    <motion.div
      className="relative z-30"
    >
      {/* Badge */}

      <div className="inline-flex rounded-full border border-cyan-300/30 bg-white/10 px-5 py-2 backdrop-blur">
        GPS TRACKERS & FLEET SOFTWARE
      </div>

      {/* Heading */}

      <h1 className="mt-8 text-5xl font-extrabold leading-[1.08] sm:text-6xl lg:text-6xl xl:text-7xl">
        <span className="block">Smart GPS Tracker</span>
        <span className="block text-cyan-300">
          &amp; Tracking Solutions
        </span>
      </h1>

      {/* Description */}

      <p className="mt-8 max-w-xl text-lg leading-8 text-blue-100">
        GPS tracking devices for cars and commercial fleets with live
        vehicle tracking, fleet management, AIS-140 GPS, dash cameras,
        fuel monitoring and connected IoT solutions across India.
      </p>

      {/* Buttons */}

      <div className="mt-10 flex flex-wrap gap-5">

        <Link
          href="/shop-now#g17"
          className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:scale-105"
        >
          See G17 Price & Order
        </Link>

        <Link
          href="/contact?intent=software-demo&source=home#contact-form"
          aria-label="Request a NAVII GPS product and software demo"
          className="rounded-xl border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-blue-700"
        >
          Book Demo
        </Link>

      </div>

      <div className="mt-10 flex flex-wrap gap-5 text-sm">
        <Link href="/products" className="font-semibold text-cyan-200 underline underline-offset-4">Compare GPS trackers</Link>
        <Link href="/contact?intent=fleet-quote&source=home#contact-form" className="font-semibold text-cyan-200 underline underline-offset-4">Fleet or dealer? Request a quote</Link>
      </div>

      {/* Badges */}

      <div className="mt-10 flex flex-wrap gap-3">

        <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
          Vehicle GPS Trackers
        </span>

        <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
          Model-specific Setup
        </span>

        <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
          🚚 Fleet Management
        </span>

        <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
          📡 Live GPS Tracking
        </span>

      </div>

    </motion.div>
  );
}
