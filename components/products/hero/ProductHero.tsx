"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Package,
} from "lucide-react";

export default function ProductHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06142E] via-[#081C3D] to-[#0B254F] py-24">

      {/* Background Glow */}

      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

      {/* Grid Pattern */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300">

            <Package size={16} />

            NAVII GPS PRODUCT RANGE

          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">

            GPS Tracking Devices

            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              for Cars & Fleets
            </span>

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-300">

            Explore GPS trackers for cars and commercial vehicles,
            plus AI dash cameras, fuel sensors, smart e-locks and
            connected IoT solutions for intelligent fleet management.

          </p>

          {/* Search */}

          <div className="mt-10 flex max-w-xl items-center rounded-2xl border border-cyan-400/20 bg-white/5 px-5 py-4 backdrop-blur-xl">

            <Search
              size={22}
              className="text-cyan-300"
            />

            <input
              type="text"
              placeholder="Search GPS products..."
              className="ml-4 w-full bg-transparent text-white outline-none placeholder:text-slate-400"
            />

          </div>

          {/* Buttons */}

          <div className="mt-10 flex flex-wrap gap-5">

            <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition hover:bg-cyan-400">

              Browse Products

              <ArrowRight size={18} />

            </button>

            <button className="flex items-center gap-2 rounded-xl border border-cyan-400/20 px-8 py-4 font-semibold text-white hover:bg-white/10">

              <ShieldCheck size={18} />

              AIS 140 Certified

            </button>

          </div>          {/* Hero Stats */}

          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4">

            {[
              ["20+", "Products"],
              ["500+", "Clients"],
              ["25K+", "Vehicles"],
              ["24×7", "Support"],
            ].map(([value, label], index) => (

              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                }}
                className="rounded-2xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-xl"
              >

                <h3 className="text-3xl font-extrabold text-cyan-300">
                  {value}
                </h3>

                <p className="mt-2 text-sm text-slate-300">
                  {label}
                </p>

              </motion.div>

            ))}

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
          }}
          className="relative flex justify-center"
        >

          {/* Glow */}

          <div className="absolute h-[430px] w-[430px] rounded-full bg-cyan-500/20 blur-[120px]" />

          {/* Ring */}

          <div className="absolute h-[380px] w-[380px] rounded-full border border-cyan-400/20" />

          {/* Product Card */}

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="relative z-10 rounded-[40px] border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl"
          >

            <Image
              src="/assets/products/g17/main.png"
              alt="G17 GPS Tracker"
              width={500}
              height={500}
              priority
              className="h-auto w-[360px] object-contain"
            />

          </motion.div>

          {/* Floating Badge */}

          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute left-0 top-10 hidden rounded-2xl border border-cyan-400/20 bg-[#0B1F42]/90 px-5 py-4 shadow-xl backdrop-blur-xl lg:block"
          >

            <p className="text-3xl font-extrabold text-cyan-300">
              AIS 140
            </p>

            <p className="text-sm text-white">
              Certified Device
            </p>

          </motion.div>

          {/* Floating Card */}

          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="absolute bottom-10 right-0 hidden rounded-2xl border border-cyan-400/20 bg-[#0B1F42]/90 px-5 py-4 shadow-xl backdrop-blur-xl lg:block"
          >

            <p className="text-3xl font-extrabold text-cyan-300">
              4G
            </p>

            <p className="text-sm text-white">
              LTE Tracking
            </p>

          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}
