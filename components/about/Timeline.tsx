"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    year: "2022",
    title: "Company Foundation",
    description:
      "NAVII GPS INDIA (OPC) PVT LTD was established with the vision of delivering smart GPS and IoT solutions.",
  },
  {
    year: "2023",
    title: "Fleet Tracking Platform",
    description:
      "Launched our cloud-based GPS tracking platform with real-time monitoring and reporting.",
  },
  {
    year: "2024",
    title: "AI & IoT Expansion",
    description:
      "Expanded into AI Dash Cameras, Fuel Monitoring and advanced IoT solutions.",
  },
  {
    year: "2025",
    title: "Nationwide Services",
    description:
      "Built a PAN India installation and support network serving multiple industries.",
  },
  {
    year: "2026",
    title: "Future Ready",
    description:
      "Focused on AI-powered fleet intelligence, automation and next-generation mobility solutions.",
  },
];

export default function Timeline() {
  return (
    <section className="relative overflow-hidden bg-[#07152E] py-28">
      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            OUR JOURNEY
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">
            Company
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Growth Timeline
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A journey of innovation, growth and customer trust in
            GPS tracking and intelligent mobility solutions.
          </p>
        </motion.div>

        {/* Timeline */}

        <div className="relative mt-20">

          {/* Center Line */}

          <div className="absolute left-6 top-0 h-full w-1 rounded-full bg-cyan-500/30 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
                className={`relative flex ${
                  index % 2 === 0
                    ? "md:justify-start"
                    : "md:justify-end"
                }`}
              >
                {/* Dot */}

                <div className="absolute left-6 top-8 h-5 w-5 rounded-full border-4 border-[#07152E] bg-cyan-400 md:left-1/2 md:-translate-x-1/2" />

                {/* Card */}

                <div className="ml-16 w-full rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl md:ml-0 md:w-[45%]">
                  <span className="text-3xl font-extrabold text-cyan-300">
                    {item.year}
                  </span>

                  <h3 className="mt-4 text-2xl font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}