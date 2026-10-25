"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Smartphone,
  Monitor,
  Download,
  QrCode,
  LogIn,
} from "lucide-react";

export default function MobileApps() {
  return (
    <section id="app-access" aria-labelledby="app-access-title" className="overflow-hidden bg-white py-24">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            MOBILE APPLICATIONS
          </span>

          <h2 id="app-access-title" className="mt-6 text-4xl font-extrabold text-slate-900">
            Access Your Fleet Anywhere
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Access NAVII GPS from your web browser or download the customer app
            for Android from Google Play.
          </p>

        </div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">

          {/* Left */}

          <div>

            <div className="space-y-6">

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">

                <div className="rounded-xl bg-cyan-100 p-3 text-cyan-700">
                  <Smartphone size={28} />
                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    Android Customer App
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

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="https://naviigps.com/login" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
                <LogIn size={18} aria-hidden="true" /> Web Login
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.naviigps.customer" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-700 px-6 py-3 font-semibold text-white transition hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
                <Download size={18} aria-hidden="true" /> Download App
              </a>
              <a href="#navii-app-qr" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-cyan-300 px-6 py-3 font-semibold text-cyan-800 transition hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
                <QrCode size={18} aria-hidden="true" /> Scan QR
              </a>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Download App opens Google Play in a new tab. An authorized NAVII account and active services may be required.</p>

            <figure id="navii-app-qr" className="mt-8 scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
              <a href="https://play.google.com/store/apps/details?id=com.naviigps.customer" target="_blank" rel="noopener noreferrer" aria-label="Download NAVII GPS: Vehicle Tracking from Google Play (opens in new tab)" className="inline-block rounded-xl bg-white p-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
                <Image src="/assets/software/mobile/navii-gps-customer-qr.svg" alt="Scan to open NAVII GPS customer app on Google Play" width={360} height={360} unoptimized className="h-auto w-[224px] max-w-full" />
              </a>
              <figcaption className="mt-3">
                <p className="font-bold text-slate-900">NAVII GPS: Vehicle Tracking</p>
                <p className="mt-1 text-sm text-slate-600">Android customer app · Scan to download</p>
              </figcaption>
            </figure>
          </div>

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