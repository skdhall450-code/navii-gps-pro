"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Smartphone,
  Monitor,
  Download,
  QrCode,
} from "lucide-react";

export default function MobileApps() {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            MOBILE APPLICATIONS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Access Your Fleet Anywhere
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Monitor your vehicles from Android, iPhone or Desktop using
            the NAVII GPS Fleet Management Platform.
          </p>

        </div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            <div className="space-y-6">

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">

                <div className="rounded-xl bg-cyan-100 p-3 text-cyan-700">
                  <Smartphone size={28} />
                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    Android & iOS App
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Track vehicles, receive alerts and manage your fleet
                    directly from your mobile phone.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">

                <div className="rounded-xl bg-cyan-100 p-3 text-cyan-700">
                  <Monitor size={28} />
                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    Web Dashboard
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Complete fleet management with reports, analytics,
                    live tracking and administration tools.
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-10 flex flex-wrap gap-4">

              <button className="flex items-center gap-2 rounded-xl bg-cyan-600 px-7 py-4 font-semibold text-white transition hover:bg-cyan-700">

                <Download size={18} />

                Download App

              </button>

              <button className="flex items-center gap-2 rounded-xl border border-cyan-300 px-7 py-4 font-semibold text-cyan-700 transition hover:bg-cyan-50">

                <QrCode size={18} />

                Scan QR

              </button>

            </div>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            <div className="rounded-[36px] border border-slate-200 bg-slate-50 p-10 shadow-xl">

              <Image
                src="/assets/software/mobile/mobile-app.png"
                alt="NAVII GPS Mobile App"
                width={500}
                height={700}
                className="mx-auto h-auto w-full max-w-sm"
              />

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}