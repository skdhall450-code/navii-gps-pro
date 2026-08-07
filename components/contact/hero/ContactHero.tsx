"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06142E] via-[#081C3D] to-[#0B254F] py-24">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >

          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            CONTACT NAVII GPS
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">
            Let Build a
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Smarter Fleet
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-300">
            Looking for GPS tracking, fleet management, AI dashcams,
            fuel monitoring or enterprise IoT solutions?
            Our experts are ready to help.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <Link
              href="#contact-form"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition hover:bg-cyan-600"
            >
              Get Free Consultation

              <ArrowRight size={18} />
            </Link>

            <a
              href="tel:+917717394007"
              className="flex items-center gap-2 rounded-xl border border-cyan-400/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              <Phone size={18} />

              Call Now
            </a>

            <a
              href="mailto:info@naviigps.com"
              className="flex items-center gap-2 rounded-xl border border-cyan-400/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              <Mail size={18} />

              Email Us
            </a>

          </div>

        </motion.div>

      </div>

    </section>
  );
}