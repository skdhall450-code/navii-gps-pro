"use client";

import { motion } from "framer-motion";

const highlights = [
  {
    id: 1,
    icon: "🚗",
    title: "25K+ Vehicles",
    description: "Successfully connected and monitored across India.",
  },
  {
    id: 2,
    icon: "🏢",
    title: "500+ Clients",
    description: "Trusted by businesses, schools and fleet operators.",
  },
  {
    id: 3,
    icon: "🛰️",
    title: "Smart GPS Technology",
    description: "Real-time tracking powered by cloud and IoT.",
  },
  {
    id: 4,
    icon: "🇮🇳",
    title: "PAN India Support",
    description: "Installation and technical support across India.",
  },
];

export default function CompanyStory() {
  return (
    <section className="relative overflow-hidden bg-[#07152E] py-28">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >

            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
              OUR STORY
            </span>

            <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">
              Empowering Businesses
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Through Smart Mobility
              </span>
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-300">
              NAVII GPS INDIA (OPC) PVT LTD was established with
              a vision to transform fleet management using
              advanced GPS tracking, IoT technology and AI-powered
              monitoring solutions.
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-300">
              Today we help transport companies, logistics
              businesses, schools, hospitals and enterprises
              improve safety, operational efficiency and
              complete vehicle visibility through our
              intelligent cloud platform.
            </p>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2"
          >

            {highlights.map((item) => (

              <div
                key={item.id}
                className="group rounded-3xl border border-cyan-400/20 bg-white/5 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/40"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-4xl">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-300">
                  {item.description}
                </p>

              </div>

            ))}

          </motion.div>

        </div>

      </div>

    </section>
  );
}