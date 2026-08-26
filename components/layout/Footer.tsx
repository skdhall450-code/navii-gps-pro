"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { quickLinks, products, contactInfo } from "./footerData";

export default function Footer() {
  return (
    <footer className="relative overflow-clip border-t border-cyan-400/20 bg-gradient-to-b from-[#06142E] via-[#081C3D] to-[#04101F]">
      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Company */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold text-white">
              NAVII
              <span className="text-cyan-300"> GPS</span>
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              Smart GPS Tracking, Fleet Management, AI Dashcams, Fuel Monitoring
              and Complete IoT Solutions for businesses across India.
            </p>

            <a
              href="https://wa.me/917717394007"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact NAVII GPS on WhatsApp"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-500 hover:text-white"
            >
              <span aria-hidden="true">💬</span>
              WhatsApp Support
            </a>
          </motion.div>

          {/* Quick Links */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white">Quick Links</h3>

            <div className="mt-6 space-y-4">
              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-slate-300 transition hover:text-cyan-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Products */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white">Products</h3>

            <div className="mt-6 space-y-4">
              {products.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-slate-300 transition hover:text-cyan-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white">Contact Us</h3>

            <div className="mt-6 space-y-5 text-slate-300">
              <p>📍 {contactInfo.address}</p>

              <p>📞 {contactInfo.phone}</p>

              <p>💬 {contactInfo.whatsapp}</p>

              <p>✉ {contactInfo.email}</p>

              <p>🌐 {contactInfo.website}</p>
            </div>
          </motion.div>
        </div>

        {/* Newsletter */}

        <div className="mt-16 rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold text-white">Stay Updated</h3>

              <p className="mt-3 text-slate-300">
                Subscribe to receive product updates, offers and GPS technology
                news.
              </p>
            </div>

            <form className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-cyan-400/20 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 font-semibold text-white transition hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-slate-400">
          © 2026 NAVII GPS INDIA (OPC) PVT LTD. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
