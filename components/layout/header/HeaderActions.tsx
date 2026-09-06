"use client";

import Link from "next/link";
import { MessageCircle, Phone, ArrowRight, Users, Building2, LogIn } from "lucide-react";

const portalLinks = [
  { label: "Customer", icon: Users },
  { label: "Dealer", icon: Building2 },
  { label: "Login", icon: LogIn },
];

export default function HeaderActions() {
  return (
    <div className="hidden items-center gap-2 lg:flex">

      {/* Customer / Dealer / Admin Login Portal */}
      {portalLinks.map(({ label, icon: Icon }) => (
        <Link
          key={label}
          href="/login"
          className="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          aria-label={`${label} login`}
        >
          <Icon size={16} />
          {label}
        </Link>
      ))}

      {/* WhatsApp */}
      <a
        href="https://wa.me/917717394007"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-700 transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:text-white"
        aria-label="WhatsApp NAVII GPS"
      >
        <MessageCircle size={20} />
      </a>

      {/* Call */}
      <a
        href="tel:+917717394007"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 transition-all duration-300 hover:scale-105 hover:bg-cyan-600 hover:text-white"
        aria-label="Call NAVII GPS"
      >
        <Phone size={20} />
      </a>

      {/* Request Demo */}
      <Link
        href="/contact"
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30"
      >
        Request Demo
        <ArrowRight size={18} />
      </Link>

    </div>
  );
}
