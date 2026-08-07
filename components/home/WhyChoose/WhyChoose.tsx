"use client";

import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import StatsCard from "./StatsCard";
import { features, stats } from "./featuresData";

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#07152E] via-[#081C3D] to-[#06142E] py-28">

      {/* Background Glow */}

      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

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

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
          className="text-center"
        >          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur">
            WHY CHOOSE NAVII GPS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Trusted GPS &
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Fleet Management Partner
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            NAVII GPS INDIA provides complete GPS Tracking,
            Fleet Management, AI Dashcam, Fuel Monitoring,
            IoT Solutions and Cloud Software trusted by
            businesses across India.
          </p>

        </motion.div>

        {/* Main Layout */}

        <div className="mt-20 grid gap-16 lg:grid-cols-2">

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

          <div className="grid grid-cols-2 gap-6">

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