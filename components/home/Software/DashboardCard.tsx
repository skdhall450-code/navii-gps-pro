"use client";

import { motion } from "framer-motion";

export default function DashboardCard() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 60,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.8,
      }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[40px] border border-cyan-400/20 bg-gradient-to-br from-[#0B244F] to-[#07152E] p-8 shadow-[0_0_90px_rgba(34,211,238,.15)]"
    >
      {/* Background Glow */}

      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-[120px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "35px 35px",
        }}
      />

      {/* Window */}

      <div className="relative z-20 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">

        {/* Top Bar */}

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">

          <div className="flex gap-2">

            <div className="h-3 w-3 rounded-full bg-red-400" />

            <div className="h-3 w-3 rounded-full bg-yellow-400" />

            <div className="h-3 w-3 rounded-full bg-green-400" />

          </div>

          <span className="text-sm font-medium text-cyan-300">
            NAVII Dashboard
          </span>

        </div>

        {/* Dashboard */}

        <div className="p-6">

          {/* Live Counter */}

          <div className="flex items-center justify-between rounded-2xl bg-cyan-500/10 p-5">

            <div>

              <p className="text-sm text-slate-300">
                Active Vehicles
              </p>

              <h3 className="mt-2 text-4xl font-bold text-white">
                25,486
              </h3>

            </div>

            <motion.div
              animate={{
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"
            >

              <div className="h-5 w-5 rounded-full bg-green-400" />

            </motion.div>

          </div>

          {/* Analytics */}

          <div className="mt-8">

            <p className="mb-4 text-sm text-cyan-300">
              Weekly Analytics
            </p>

            <div className="flex h-40 items-end gap-3">              {[45, 80, 60, 95, 75, 110, 90].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 20 }}
                  animate={{
                    height: [height - 20, height, height - 10],
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-cyan-500 via-sky-400 to-blue-300"
                  style={{ height }}
                />
              ))}
            </div>

          </div>

          {/* Live Map */}

          <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-white/5 p-5">

            <div className="mb-4 flex items-center justify-between">

              <span className="text-sm font-medium text-cyan-300">
                Live GPS Tracking
              </span>

              <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                LIVE
              </span>

            </div>

            <div className="relative h-44 overflow-hidden rounded-2xl bg-[#081C3D]">

              {/* Grid */}

              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Route */}

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 200"
              >
                <motion.path
                  d="M40 150 C120 70 220 150 340 60"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </svg>

              {/* Moving GPS Dot */}

              <motion.div
                animate={{
                  x: [30, 300],
                  y: [140, 50],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute h-4 w-4 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]"
              />

              {/* Radar Ping */}

              <motion.div
                animate={{
                  scale: [1, 2.8, 1],
                  opacity: [1, 0.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300"
              />

            </div>

          </div>

          {/* Bottom Stats */}

          <div className="mt-6 grid grid-cols-3 gap-4">

            <div className="rounded-2xl bg-white/5 p-4 text-center">
              <p className="text-xs text-slate-400">
                Alerts
              </p>

              <h4 className="mt-2 text-2xl font-bold text-red-400">
                18
              </h4>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 text-center">
              <p className="text-xs text-slate-400">
                Fuel
              </p>

              <h4 className="mt-2 text-2xl font-bold text-green-400">
                72%
              </h4>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 text-center">
              <p className="text-xs text-slate-400">
                Drivers
              </p>

              <h4 className="mt-2 text-2xl font-bold text-cyan-300">
                542
              </h4>
            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}