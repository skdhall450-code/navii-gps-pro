"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#07152E] via-[#081C3D] to-[#06142E] py-24">

      {/* Glow */}

      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
          className="rounded-[40px] border border-cyan-400/20 bg-white/5 p-12 text-center backdrop-blur-xl"
        >

          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            NAVII GPS SOLUTIONS
          </span>

          <h2 className="mt-8 text-5xl font-extrabold text-white">
            Need Help Choosing
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              The Right GPS Tracker?
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-300">
            Our experts can help you select the best GPS tracking,
            AI dashcam or IoT solution for your business.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition hover:bg-cyan-400"
            >
              Contact Us

              <ArrowRight size={18} />
            </Link>

            <a
              href="https://wa.me/917717394007"
              target="_blank"
              className="flex items-center gap-2 rounded-xl border border-cyan-400/20 px-8 py-4 font-semibold text-white hover:bg-white/10"
            >
              <MessageCircle size={18} />

              WhatsApp
            </a>

            <a
              href="tel:+917717394007"
              className="flex items-center gap-2 rounded-xl border border-cyan-400/20 px-8 py-4 font-semibold text-white hover:bg-white/10"
            >
              <Phone size={18} />

              Call Now
            </a>

          </div>

        </motion.div>

      </div>

    </section>
  );
}