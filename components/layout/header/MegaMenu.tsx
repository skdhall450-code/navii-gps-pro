"use client";

import Link from "next/link";

export default function MegaMenu() {
  return (
    <div className="absolute left-1/2 top-full z-50 hidden w-[820px] -translate-x-1/2 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl group-hover:block">

      <div className="grid grid-cols-3 gap-10">

        {/* Vehicle GPS */}

        <div>

          <h3 className="mb-5 text-lg font-bold text-cyan-700">
            Vehicle GPS
          </h3>

          <div className="space-y-3">

            <Link href="/products/g17-gps-tracker" className="block hover:text-cyan-600">
              G17 GPS Tracker
            </Link>

            <Link href="/products/gs900-gps-tracker" className="block hover:text-cyan-600">
              GS900 4G
            </Link>

            <Link href="/products/gs149-gps-tracker" className="block hover:text-cyan-600">
              GS149
            </Link>

            <Link href="/products/gs33-gps-tracker" className="block hover:text-cyan-600">
              GS33
            </Link>

          </div>

        </div>

        {/* Asset & AI */}

        <div>

          <h3 className="mb-5 text-lg font-bold text-cyan-700">
            Asset & AI
          </h3>

          <div className="space-y-3">

            <Link href="/products/bt50-magnetic-gps" className="block hover:text-cyan-600">
              BT50 Magnetic GPS
            </Link>

            <Link href="/products/ai-dashcam" className="block hover:text-cyan-600">
              AI Dash Camera
            </Link>

            <Link href="/products/fuel-sensor" className="block hover:text-cyan-600">
              Fuel Sensor
            </Link>

            <Link href="/products/rfid" className="block hover:text-cyan-600">
              RFID
            </Link>

          </div>

        </div>

        {/* Platform */}

        <div>

          <h3 className="mb-5 text-lg font-bold text-cyan-700">
            Software Platform
          </h3>

          <div className="space-y-3">

            <Link href="/software" className="block hover:text-cyan-600">
              Fleet Management
            </Link>

            <Link href="/software" className="block hover:text-cyan-600">
              Live Tracking
            </Link>

            <Link href="/software" className="block hover:text-cyan-600">
              Reports
            </Link>

            <Link href="/software" className="block hover:text-cyan-600">
              Mobile Apps
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}