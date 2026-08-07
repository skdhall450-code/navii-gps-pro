"use client";

import { motion } from "framer-motion";

const certifications = [
  {
    id: 1,
    icon: "🏆",
    title: "Startup India",
    description:
      "Recognized under the Startup India initiative, promoting innovation and technology-driven business growth.",
  },
  {
    id: 2,
    icon: "🏭",
    title: "MSME Registered",
    description:
      "Registered as a Micro, Small & Medium Enterprise to support quality manufacturing and services.",
  },
  {
    id: 3,
    icon: "🛡️",
    title: "ISO Certified",
    description:
      "Committed to international quality standards for products, services and customer satisfaction.",
  },
  {
    id: 4,
    icon: "🇮🇳",
    title: "Make in India",
    description:
      "Supporting the Make in India initiative through innovative GPS and IoT technology solutions.",
  },
  {
    id: 5,
    icon: "📄",
    title: "GST Registered",
    description:
      "Fully compliant with Indian GST regulations for transparent and reliable business operations.",
  },
  {
    id: 6,
    icon: "🌍",
    title: "DUNS Registered",
    description:
      "Globally recognized business identity that enhances trust and credibility with partners worldwide.",
  },
];

export default function Certifications() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06142E] via-[#081C3D] to-[#07152E] py-28">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

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

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            CERTIFICATIONS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">
            Trusted & Certified
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Business Excellence
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Our certifications reflect our commitment to quality,
            innovation, compliance and customer trust.
          </p>

        </motion.div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {certifications.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/40"
            >

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-[80px]" />

              <div className="relative z-10">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/20 text-5xl transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-5 leading-8 text-slate-300">
                  {item.description}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}