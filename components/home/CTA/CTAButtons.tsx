"use client";

import { motion } from "framer-motion";

export default function CTAButtons() {
  return (
    <div className="flex flex-wrap gap-5">

      {/* Get Demo */}

      <motion.a
        href="/contact"
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.97,
        }}
        className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-[0_0_40px_rgba(34,211,238,.35)] transition-all duration-300"
      >
        🚀 Get Free Demo
      </motion.a>

      {/* Call */}

      <motion.a
        href="tel:+918899729705"
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.97,
        }}
        className="rounded-2xl border border-cyan-400/30 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-xl transition hover:border-cyan-300 hover:bg-cyan-400/10"
      >
        📞 Call Now
      </motion.a>

      {/* WhatsApp */}      <motion.a
        href="https://wa.me/917717394007"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.97,
        }}
        className="rounded-2xl border border-green-400/30 bg-green-500/10 px-8 py-4 text-lg font-semibold text-green-300 backdrop-blur-xl transition hover:bg-green-500/20 hover:border-green-300"
      >
        💬 WhatsApp
      </motion.a>

    </div>
  );
}