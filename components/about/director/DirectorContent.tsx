"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { director } from "./directorData";

export default function DirectorContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex h-full flex-col"
    >
      {/* Badge */}

      <span className="inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
        DIRECTOR&apos;S MESSAGE
      </span>

      {/* Name */}

      <h2 className="mt-6 text-4xl font-extrabold text-white lg:text-5xl">
        {director.name}
      </h2>

      <p className="mt-2 text-xl font-medium text-cyan-300">
        {director.designation}
      </p>

      {/* Quote */}

      <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-8 backdrop-blur-xl">

        <p className="text-2xl italic font-semibold leading-10 text-white">
          &ldquo;Technology should empower businesses with visibility,
          efficiency and confidence.&rdquo;
        </p>

      </div>

      {/* Message */}

      <div className="mt-8 space-y-6">

        {director.message.map((item, index) => (
          <p
            key={index}
            className="text-lg leading-9 text-slate-300"
          >
            {item}
          </p>
        ))}

      </div>

      {/* Signature */}

      <div className="mt-10">

        <Image
          src={director.signature}
          alt="Signature"
          width={220}
          height={90}
          className="object-contain"
        />

        <h3 className="mt-4 text-3xl font-bold text-white">
          {director.name}
        </h3>

        <p className="text-cyan-300">
          {director.designation}
        </p>

        <p className="text-slate-400">
          {director.company}
        </p>

      </div>

      {/* Contact Card */}

      <div className="mt-10 rounded-3xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl">

        <div className="grid items-center gap-6 md:grid-cols-[160px_1fr]">

          {/* QR */}

          <div className="flex justify-center">

            <div className="overflow-hidden rounded-2xl bg-white p-3">

              <Image
                src={director.qrImage}
                alt="Website QR"
                width={150}
                height={150}
              />

            </div>

          </div>

          {/* Contact */}

          <div className="space-y-5">

            <div>

              <p className="text-xs uppercase tracking-widest text-cyan-300">
                Website
              </p>

              <a
                href={director.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-lg font-semibold text-white hover:text-cyan-300"
              >
                {director.website}
              </a>

            </div>

            <div>

              <p className="text-xs uppercase tracking-widest text-cyan-300">
                Email
              </p>

              <a
                href={`mailto:${director.email}`}
                className="mt-1 block text-lg font-semibold text-white hover:text-cyan-300"
              >
                {director.email}
              </a>

            </div>

            <div>

              <p className="text-xs uppercase tracking-widest text-cyan-300">
                Phone
              </p>

              <a
                href={`tel:${director.phone}`}
                className="mt-1 block text-lg font-semibold text-white hover:text-cyan-300"
              >
                {director.phone}
              </a>

            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}