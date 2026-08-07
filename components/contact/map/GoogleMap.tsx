"use client";

import { MapPinned } from "lucide-react";

export default function GoogleMap() {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            OUR LOCATION
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Visit Our Office
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
            Meet our team for GPS tracking, fleet management
            and enterprise IoT solutions.
          </p>

        </div>

        <div className="mt-16 overflow-hidden rounded-[32px] border border-slate-200 shadow-2xl">

          <iframe
            src="https://www.google.com/maps?q=Delhi%20India&output=embed"
            width="100%"
            height="500"
            loading="lazy"
            className="border-0"
          />

        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-cyan-700">

          <MapPinned size={22} />

          <span className="font-semibold">
            NAVII GPS INDIA (OPC) PVT LTD • Delhi NCR
          </span>

        </div>

      </div>

    </section>
  );
}