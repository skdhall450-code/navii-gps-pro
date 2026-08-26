"use client";

import Link from "next/link";
import Image from "next/image";

import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

export default function FooterV2() {
  return (
    <footer className="relative overflow-clip bg-gradient-to-br from-[#06142E] via-[#081C3D] to-[#0B254F] text-white">
      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-20">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Company */}
          <div>
            <div className="flex items-center gap-4">
              <Image
                src="/assets/logo/logo.png"
                alt="NAVII GPS"
                width={60}
                height={60}
              />

              <div>
                <h2 className="text-2xl font-bold">NAVII GPS</h2>

                <p className="text-sm text-slate-300">INDIA (OPC) PVT LTD</p>
              </div>
            </div>

            <p className="mt-6 leading-8 text-slate-300">
              NAVII GPS delivers intelligent GPS Tracking, Fleet Management, AI
              Dashcams, Fuel Monitoring and IoT solutions for businesses across
              India.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {["AIS 140", "ISO Certified", "MSME", "Startup India"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-xs font-semibold text-cyan-300"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-xl font-bold">Quick Links</h3>

            <div className="space-y-4">
              <Link
                href="/"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                About Us
              </Link>

              <Link
                href="/products"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                Products
              </Link>

              <Link
                href="/software"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                Software
              </Link>

              <Link
                href="/industries"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                Industries
              </Link>

              <Link
                href="/contact"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                Contact
              </Link>
            </div>
          </div>
          {/* Products */}
          <div>
            <h3 className="mb-6 text-xl font-bold">Products</h3>

            <div className="space-y-4">
              <Link
                href="/products/g17-gps-tracker"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                G17 GPS Tracker
              </Link>

              <Link
                href="/products/gs900-4g-gps-tracker"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                GS900 4G GPS Tracker
              </Link>

              <Link
                href="/products/bt50-vehicle-gps-tracker"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                BT50 Vehicle GPS
              </Link>

              <Link
                href="/products/ev02-gps-tracker"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                EV02 GPS Tracker
              </Link>

              <Link
                href="/products/ai-dash-camera"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                AI Dash Camera
              </Link>

              <Link
                href="/products/fuel-monitoring-sensor"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                Fuel Monitoring Sensor
              </Link>

              <Link
                href="/products/smart-e-lock"
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                Smart E-Lock
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-bold">Contact Us</h3>

            <div className="space-y-5">
              <a
                href="tel:+918899729705"
                className="flex items-start gap-3 text-slate-300 transition hover:text-cyan-300"
              >
                <Phone size={20} className="mt-1 text-cyan-400" />

                <span>+91 88997 29705</span>
              </a>

              <a
                href="mailto:helpline@naviigps.com"
                className="flex items-start gap-3 text-slate-300 transition hover:text-cyan-300"
              >
                <Mail size={20} className="mt-1 text-cyan-400" />

                <span>helpline@naviigps.com</span>
              </a>

              <div className="flex items-start gap-3 text-slate-300">
                <MapPin size={20} className="mt-1 text-cyan-400" />

                <span>
                  NAVII GPS INDIA (OPC) PVT LTD
                  <br />
                  SCO 46, 2nd Floor, GBP Business Square
                  <br />
                  Near GBP Rosewood Gate No. 1, Barwala Road
                  <br />
                  Dera Bassi, Punjab - 140507, India
                </span>
              </div>
            </div>

            {/* Verified contact channel */}

            <a
              href="https://wa.me/917717394007"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact NAVII GPS on WhatsApp"
              className="mt-8 inline-flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-300 transition-all duration-300 hover:scale-105 hover:bg-emerald-500 hover:text-white"
            >
              <MessageCircle size={19} />
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* Divider */}

        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        {/* Bottom Footer */}

        <div className="flex flex-col items-center justify-between gap-6 py-8 text-sm md:flex-row">
          <p className="text-slate-400">
            © {new Date().getFullYear()} NAVII GPS INDIA (OPC) PVT LTD. All
            Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-slate-400 transition hover:text-cyan-300"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-slate-400 transition hover:text-cyan-300"
            >
              Terms & Conditions
            </Link>

            <div className="flex items-center gap-2 text-cyan-300">
              <ShieldCheck size={16} />
              Made in India 🇮🇳
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
