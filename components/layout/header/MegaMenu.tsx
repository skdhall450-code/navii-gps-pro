"use client";

import Link from "next/link";

const productLinkClass = "block transition hover:text-cyan-600";

export default function MegaMenu() {
  return (
    <div className="absolute left-1/2 top-full z-50 hidden w-[820px] -translate-x-1/2 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl group-hover:block">
      <div className="grid grid-cols-3 gap-10">
        <div>
          <h3 className="mb-5 text-lg font-bold text-cyan-700">Vehicle GPS</h3>

          <div className="space-y-3">
            <Link href="/products/g17-gps-tracker" className={productLinkClass}>
              G17 GPS Tracker
            </Link>

            <Link
              href="/products/gs900-4g-gps-tracker"
              className={productLinkClass}
            >
              GS900 4G GPS Tracker
            </Link>

            <Link
              href="/products/bt50-vehicle-gps-tracker"
              className={productLinkClass}
            >
              BT50 Vehicle GPS
            </Link>

            <Link
              href="/products/ev02-gps-tracker"
              className={productLinkClass}
            >
              EV02 GPS Tracker
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold text-cyan-700">Safety & IoT</h3>

          <div className="space-y-3">
            <Link href="/products/ai-dash-camera" className={productLinkClass}>
              AI Dash Camera
            </Link>

            <Link
              href="/products/fuel-monitoring-sensor"
              className={productLinkClass}
            >
              Fuel Monitoring Sensor
            </Link>

            <Link href="/products/smart-e-lock" className={productLinkClass}>
              Smart E-Lock
            </Link>

            <Link
              href="/products"
              className="block font-semibold text-cyan-700 transition hover:text-cyan-500"
            >
              View All Products
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold text-cyan-700">
            Software Platform
          </h3>

          <div className="space-y-3">
            <Link href="/software" className={productLinkClass}>
              Fleet Management
            </Link>

            <Link href="/software" className={productLinkClass}>
              Live Tracking
            </Link>

            <Link href="/software" className={productLinkClass}>
              Reports & Analytics
            </Link>

            <Link href="/software" className={productLinkClass}>
              Mobile Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
