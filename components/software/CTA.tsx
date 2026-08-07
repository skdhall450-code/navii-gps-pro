"use client";

import Link from "next/link";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-[#06142E] via-[#081C3D] to-[#0B254F] py-24">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="text-5xl font-extrabold text-white">
          Ready to Transform Your Fleet?
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Experience intelligent GPS tracking, analytics and fleet
          management with NAVII GPS Software Platform.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white hover:bg-cyan-600"
          >
            Request Demo

            <ArrowRight size={18} />
          </Link>

          <a
            href="tel:+917717394007"
            className="flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-white hover:bg-white/10"
          >
            <Phone size={18} />

            Call Us
          </a>

          <a
            href="https://wa.me/917717394007"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-4 text-white hover:bg-green-700"
          >
            <MessageCircle size={18} />

            WhatsApp
          </a>

        </div>

      </div>

    </section>
  );
}