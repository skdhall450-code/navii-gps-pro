"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { director } from "./directorData";

export default function DirectorProfile() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative mx-auto max-w-lg"
    >
      {/* Background Glow */}

      <div className="absolute -inset-8 rounded-[50px] bg-cyan-500/20 blur-3xl" />

      {/* Premium Border */}

      <div className="relative rounded-[36px] bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-300 p-[2px] shadow-2xl shadow-cyan-500/20">

        <div className="overflow-hidden rounded-[34px] bg-[#081C3D]">

          <Image
            src={director.image}
            alt={director.name}
            width={500}
            height={650}
            priority
            className="h-[520px] w-full object-cover transition-all duration-700 hover:scale-105"
          />

        </div>

      </div>

      {/* Bottom Badge */}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="absolute left-1/2 bottom-6 hidden -translate-x-1/2 rounded-full border border-cyan-400/20 bg-[#0B1F42]/90 px-6 py-3 backdrop-blur-xl lg:flex items-center gap-2"
      >
        <span className="text-xl">🇮🇳</span>

        <span className="text-sm font-medium text-white">
          GPS & IoT Solutions
        </span>

      </motion.div>

    </motion.div>
  );
}
