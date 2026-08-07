"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Phone,
  Mail,
  Clock3,
  MessageCircle,
} from "lucide-react";

const cards = [
  {
    title: "Corporate Office",
    value: "Delhi NCR, India",
    description:
      "NAVII GPS INDIA (OPC) PVT LTD",
    icon: Building2,
  },
  {
    title: "Sales & Support",
    value: "+91 77173 94007",
    description:
      "Call us for product consultation",
    icon: Phone,
  },
  {
    title: "Email Support",
    value: "info@naviigps.com",
    description:
      "24×7 Email Assistance",
    icon: Mail,
  },
  {
    title: "Business Hours",
    value: "Mon - Sat",
    description:
      "09:30 AM - 06:30 PM",
    icon: Clock3,
  },
];

export default function OfficeInfo() {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            CONTACT INFORMATION
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            We are Ready To Help
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Contact our sales and support team for GPS tracking,
            fleet management and enterprise IoT solutions.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {cards.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-2xl"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">

                  <Icon size={30} />

                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">

                  {item.title}

                </h3>

                <p className="mt-3 font-semibold text-cyan-700">

                  {item.value}

                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">

                  {item.description}

                </p>

              </motion.div>

            );

          })}

        </div>

        {/* WhatsApp CTA */}

        <div className="mt-16 flex justify-center">

          <a
            href="https://wa.me/917717394007"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-green-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
          >
            <MessageCircle size={24} />

            Chat on WhatsApp

          </a>

        </div>

      </div>

    </section>
  );
}