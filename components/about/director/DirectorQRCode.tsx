"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { director } from "./directorData";

export default function DirectorQRCode() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      viewport={{ once: true }}
      className="mt-12 rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl"
    >
      <div className="flex flex-col items-center gap-8 lg:flex-row">

        {/* QR */}

        <div className="flex flex-col items-center">

          <div className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-white p-3 shadow-xl">

            <Image
              src={director.qrImage}
              alt="Website QR"
              width={170}
              height={170}
              className="rounded-lg"
            />

          </div>

          <p className="mt-4 text-sm text-slate-300">
            Scan to Visit Website
          </p>

        </div>

        {/* Contact Details */}

        <div className="flex-1 space-y-5">

          <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-widest text-cyan-300">
              Website
            </p>

            <a
              href={director.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-lg font-semibold text-white hover:text-cyan-300"
            >
              {director.website}
            </a>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-widest text-cyan-300">
              Email
            </p>

            <a
              href={`mailto:${director.email}`}
              className="mt-2 block text-lg font-semibold text-white hover:text-cyan-300"
            >
              {director.email}
            </a>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-widest text-cyan-300">
              Phone
            </p>

            <a
              href={`tel:${director.phone}`}
              className="mt-2 block text-lg font-semibold text-white hover:text-cyan-300"
            >
              {director.phone}
            </a>
          </div>

        </div>

      </div>
    </motion.div>
  );
}