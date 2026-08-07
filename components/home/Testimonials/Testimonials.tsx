"use client";

import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonialsData";

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#07152E] via-[#081C3D] to-[#06142E] py-28">
      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />

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

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur">
            CUSTOMER TESTIMONIALS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            What Our
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Thousands of businesses across India trust NAVII GPS
            for GPS Tracking, Fleet Management,
            AI Dashcam and IoT Solutions.
          </p>
        </motion.div>

        {/* Auto Slider */}

        <div className="mt-20 overflow-hidden">
          <motion.div
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-8"
          >
            {[...testimonials, ...testimonials].map((item, index) => (
              <div
                key={index}
                className="min-w-[380px] max-w-[380px] flex-shrink-0"
              >
                <TestimonialCard
                  testimonial={item}
                  index={index}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}