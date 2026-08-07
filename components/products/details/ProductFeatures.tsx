"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  MapPinned,
  BellRing,
  Smartphone,
  RadioTower,
} from "lucide-react";

import type { Product } from "../data/productsData";

interface ProductFeaturesProps {
  product: Product;
}

const icons = [
  MapPinned,
  RadioTower,
  ShieldCheck,
  BellRing,
  Smartphone,
  CheckCircle2,
];

export default function ProductFeatures({
  product,
}: ProductFeaturesProps) {
  return (
    <section className="bg-slate-50 py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            PRODUCT FEATURES
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Powerful Features
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Advanced GPS tracking features designed for
            intelligent fleet management, vehicle security,
            and real-time monitoring.
          </p>

        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {product.features.map((feature, index) => {

            const Icon =
              icons[index % icons.length];

            return (

              <motion.div
                key={feature}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{
                  once: true,
                }}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-2xl"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 transition-all duration-300 group-hover:bg-cyan-600 group-hover:text-white">

                  <Icon size={28} />

                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {feature}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Built for reliability, real-time monitoring,
                  and enterprise fleet operations.
                </p>

              </motion.div>

            );

          })}        </div>

        {/* Bottom Banner */}

        <div className="mt-20 rounded-[32px] bg-gradient-to-r from-cyan-600 to-blue-700 p-10 text-center text-white shadow-2xl">

          <h3 className="text-3xl font-bold">
            Ready to Upgrade Your Fleet?
          </h3>

          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-cyan-100">
            NAVII GPS helps businesses improve fleet visibility,
            driver safety, asset security and operational efficiency
            with advanced GPS tracking and IoT technology.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <a
              href={`https://wa.me/${product.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white px-7 py-4 font-semibold text-cyan-700 transition hover:bg-slate-100"
            >
              Get Free Consultation
            </a>

            <a
              href="tel:+917717394007"
              className="rounded-xl border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Call Sales Team
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}