"use client";

import Link from "next/link";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";

export default function HeaderActions() {
  return (
    <div className="hidden items-center gap-3 lg:flex">

      {/* WhatsApp */}

      <a
        href="https://wa.me/917717394007"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-700 transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:text-white"
      >
        <MessageCircle size={20} />
      </a>

      {/* Call */}

      <a
        href="tel:+917717394007"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 transition-all duration-300 hover:scale-105 hover:bg-cyan-600 hover:text-white"
      >
        <Phone size={20} />
      </a>

      {/* Request Demo */}

      <Link
        href="/contact"
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30"
      >
        Request Demo

        <ArrowRight size={18} />
      </Link>

    </div>
  );
}