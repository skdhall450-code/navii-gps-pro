"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#07152E] via-[#081C3D] to-[#04101F] py-28">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[150px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[40px] border border-cyan-400/20 bg-white/5 px-8 py-16 text-center backdrop-blur-xl md:px-16"
        >

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            Let&apos;s
          </span>

          <h2 className="mt-8 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Ready to Transform
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Your Fleet?
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-300">
            Discover how NAVII GPS can improve fleet visibility,
            increase safety, reduce operational costs and
            streamline your business with intelligent GPS and IoT
            solutions.
          </p>

          {/* Buttons */}

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <Link
              href="/contact"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition duration-300 hover:scale-105"
            >
              📞 Contact Us
            </Link>

            <a
              href="https://wa.me/917717394007"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-cyan-400/30 bg-white/5 px-8 py-4 text-lg font-semibold text-cyan-300 backdrop-blur transition duration-300 hover:border-cyan-400 hover:bg-cyan-400/10"
            >
              💬 WhatsApp
            </a>

            <a
              href="mailto:helpline@naviigps.com"
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition duration-300 hover:border-cyan-400 hover:text-cyan-300"
            >
              ✉️ Email Us
            </a>

          </div>

        </motion.div>

      </div>

    </section>
  );
}