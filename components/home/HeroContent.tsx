"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Badge */}

      <div className="inline-flex rounded-full border border-cyan-300/30 bg-white/10 px-5 py-2 backdrop-blur">
        🚀 India&apos;s Trusted GPS Tracking Company
      </div>

      {/* Heading */}

      <h1 className="mt-8 text-5xl font-extrabold leading-tight lg:text-7xl">
        Smart GPS Tracker
        <br />
        & Tracking
        <span className="block text-cyan-300">
          Solutions
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
          href="/products"
          className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:scale-105"
        >
          Explore Products
        </Link>

        <Link
          href="/contact"
          className="rounded-xl border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-blue-700"
        >
          Book Demo
        </Link>

      </div>

      {/* Statistics */}

      <div className="mt-14 grid grid-cols-3 gap-6">

        <div>
          <h2 className="text-4xl font-bold text-cyan-300">
            25K+
          </h2>

          <p className="mt-2 text-sm text-blue-100">
            Vehicles Tracked
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-cyan-300">
            500+
          </h2>

          <p className="mt-2 text-sm text-blue-100">
            Business Clients
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-cyan-300">
            98%
          </h2>

          <p className="mt-2 text-sm text-blue-100">
            Satisfaction
          </p>
        </div>

      </div>

      {/* Badges */}

      <div className="mt-10 flex flex-wrap gap-3">

        <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
          🇮🇳 Made in India
        </span>

        <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
          ✔ AIS-140 Certified
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
