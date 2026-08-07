"use client";

import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    icon: "🚗",
    title: "25K+ Vehicles",
    description:
      "Trusted GPS tracking platform monitoring thousands of vehicles every day.",
  },
  {
    id: 2,
    icon: "🏢",
    title: "500+ Business Clients",
    description:
      "Serving logistics, transport, schools, healthcare and enterprise customers.",
  },
  {
    id: 3,
    icon: "🛠️",
    title: "24×7 Technical Support",
    description:
      "Dedicated support team available for installation, troubleshooting and assistance.",
  },
  {
    id: 4,
    icon: "🌍",
    title: "PAN India Installation",
    description:
      "Professional installation and service network across India.",
  },
  {
    id: 5,
    icon: "🛰️",
    title: "AI & IoT Technology",
    description:
      "Advanced GPS tracking powered by AI analytics and cloud-based IoT solutions.",
  },
  {
    id: 6,
    icon: "🔒",
    title: "Secure Cloud Platform",
    description:
      "Reliable infrastructure with secure access, real-time monitoring and business reports.",
  },
];

export default function WhyNavii() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06142E] via-[#081C3D] to-[#07152E] py-28">

      {/* Glow */}

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            WHY NAVII GPS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">
            Why Businesses
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Choose NAVII GPS
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            We combine innovative technology, nationwide support and reliable
            service to help businesses manage fleets with confidence.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="group rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/40"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/20 text-5xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              <h3 className="mt-8 text-2xl font-bold text-white">
                {item.title}
              </h3>

              <p className="mt-5 leading-8 text-slate-300">
                {item.description}
              </p>
            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}