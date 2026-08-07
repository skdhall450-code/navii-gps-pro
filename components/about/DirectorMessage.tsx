"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DirectorMessage() {
  return (
    <section className="relative overflow-hidden bg-[#07152E] py-28">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Director Image */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">

              <div className="absolute -inset-4 rounded-[40px] bg-cyan-500/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[40px] border border-cyan-400/20 bg-white/5 backdrop-blur-xl">

                <Image
                  src="/director.png"
                  alt="Navpreet Kaur Dhall"
                  width={420}
                  height={520}
                  priority
                  className="h-[520px] w-[400px] object-cover"
                />

              </div>

            </div>
          </motion.div>

          {/* Content */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >

            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
              Director&apos;s
            </span>

            <h2 className="mt-6 text-5xl font-extrabold text-white">
              Navpreet Kaur Dhall
            </h2>

            <p className="mt-3 text-xl font-medium text-cyan-300">
              Director
            </p>

            <p className="mt-8 text-lg leading-9 text-slate-300">
              At NAVII GPS INDIA (OPC) PVT LTD, our mission is to
              empower businesses with intelligent GPS Tracking,
              Fleet Management and IoT solutions that improve
              safety, efficiency and complete operational visibility.
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-300">
              We believe technology should simplify business
              operations, reduce operational costs and provide
              real-time insights that help organizations make
              smarter decisions every day.
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-300">
              Our commitment to innovation, customer satisfaction
              and nationwide service continues to drive us toward
              becoming one of India most trusted GPS technology
              companies.
            </p>

            {/* Signature */}

            <div className="mt-10">

              <Image
                src="/signature.png"
                alt="Signature"
                width={220}
                height={90}
                className="object-contain"
              />

              <h3 className="mt-4 text-2xl font-bold text-white">
                Navpreet Kaur Dhall
              </h3>

              <p className="mt-2 text-cyan-300">
                Director, NAVII GPS INDIA (OPC) PVT LTD
              </p>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}