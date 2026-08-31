"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MonitorSmartphone,
  MapPinned,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export default function SoftwareHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06142E] via-[#081C3D] to-[#0B254F] py-24">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[140px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300">

            <MonitorSmartphone size={16} />

            NAVII GPS SOFTWARE PLATFORM

          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">

            GPS Tracking &
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Fleet Management Software
            </span>

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-300">

            Manage vehicles, drivers, assets and operations from one GPS
            tracking platform with real-time monitoring, route history,
            alerts, reports and fleet analytics.

          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition hover:bg-cyan-600"
            >
              Request Demo

              <ArrowRight size={18} />
            </Link>

            <Link
              href="/products"
              className="rounded-xl border border-cyan-400/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Products
            </Link>

          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">

            {[
              ["Live", "Tracking"],
              ["Fuel", "Reports"],
              ["Geo", "Fence"],
              ["24×7", "Support"],
            ].map(([value, label]) => (

              <div
                key={label}
                className="rounded-2xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-xl"
              >

                <h3 className="text-2xl font-bold text-cyan-300">
                  {value}
                </h3>

                <p className="mt-2 text-sm text-slate-300">
                  {label}
                </p>

              </div>

            ))}

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >

          <div className="rounded-[36px] border border-cyan-400/20 bg-white/10 p-8 backdrop-blur-xl">

            <div className="mb-8 flex items-center justify-between">

              <div>

                <h3 className="text-2xl font-bold text-white">
                  Fleet Dashboard
                </h3>

                <p className="text-cyan-300">
                  Real-Time Monitoring
                </p>

              </div>

              <ShieldCheck className="text-cyan-400" />

            </div>

            <div className="grid gap-5">

              <div className="rounded-2xl bg-[#0D2B57] p-5">

                <div className="flex items-center gap-3">

                  <MapPinned className="text-cyan-400" />

                  <div>

                    <h4 className="font-semibold text-white">
                      Live GPS Tracking
                    </h4>

                    <p className="text-sm text-slate-300">
                      Monitor every vehicle in real time.
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-[#0D2B57] p-5">

                <div className="flex items-center gap-3">

                  <Smartphone className="text-cyan-400" />

                  <div>

                    <h4 className="font-semibold text-white">
                      Android & iOS App
                    </h4>

                    <p className="text-sm text-slate-300">
                      Track your fleet from anywhere.
                    </p>

                  </div>

                </div>

              </div>

              <div className="h-64 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center">

                <p className="text-lg font-semibold text-cyan-300">
                  Dashboard Preview
                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
