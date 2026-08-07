"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Car,
  MapPinned,
  Bell,
  Fuel,
  Activity,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPreview() {
  const stats = [
    {
      title: "Active Vehicles",
      value: "248",
      icon: Car,
    },
    {
      title: "Live Trips",
      value: "132",
      icon: MapPinned,
    },
    {
      title: "Alerts",
      value: "06",
      icon: Bell,
    },
    {
      title: "Fuel Status",
      value: "91%",
      icon: Fuel,
    },
  ];

  return (
    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            LIVE DASHBOARD
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Intelligent Fleet Dashboard
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Monitor vehicles, trips, alerts and reports from a
            single cloud-based fleet management platform.
          </p>

        </div>

        {/* KPI Cards */}

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {item.value}
                    </h3>

                  </div>

                  <div className="rounded-2xl bg-cyan-100 p-4 text-cyan-700">
                    <Icon size={28} />
                  </div>

                </div>

              </motion.div>
            );
          })}

        </div>

        {/* Dashboard Preview */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-2xl"
        >

          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-6 py-4">

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                NAVII Fleet Dashboard
              </h3>

              <p className="text-sm text-slate-500">
                Real-Time Monitoring
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

              <Activity size={16} />

              LIVE

            </div>

          </div>

          <div className="bg-white p-8">

            <Image
              src="/assets/software/dashboard/dashboard.png"
              alt="Dashboard Preview"
              width={1400}
              height={800}
              className="w-full rounded-2xl border border-slate-200"
            />

          </div>

        </motion.div>

        {/* Bottom Cards */}

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-8 shadow-lg">

            <ShieldCheck className="text-cyan-600" size={34} />

            <h3 className="mt-5 text-xl font-bold">
              Secure Cloud Platform
            </h3>

            <p className="mt-3 text-slate-600">
              Enterprise-grade cloud infrastructure with secure
              real-time data synchronization.
            </p>

          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">

            <MapPinned className="text-cyan-600" size={34} />

            <h3 className="mt-5 text-xl font-bold">
              Live Location
            </h3>

            <p className="mt-3 text-slate-600">
              View accurate GPS locations, trip history and
              geo-fence events instantly.
            </p>

          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">

            <Bell className="text-cyan-600" size={34} />

            <h3 className="mt-5 text-xl font-bold">
              Instant Alerts
            </h3>

            <p className="mt-3 text-slate-600">
              Get overspeed, ignition, power cut and SOS alerts
              in real time.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}