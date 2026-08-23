"use client";

import { Phone, Mail, BadgeCheck } from "lucide-react";

export default function TopBar() {
  return (
    <div className="hidden border-b border-cyan-400/10 bg-[#031126] text-white lg:block">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6">
        {/* Left */}

        <div className="flex items-center gap-6 text-sm">
          <a
            href="tel:+918899729705"
            className="flex items-center gap-2 hover:text-cyan-300"
          >
            <Phone size={14} />
            +91 88997 29705
          </a>

          <a
            href="mailto:info@naviigps.com"
            className="flex items-center gap-2 hover:text-cyan-300"
          >
            <Mail size={14} />
            info@naviigps.com
          </a>
        </div>

        {/* Right */}

        <div className="flex items-center gap-5 text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <BadgeCheck size={14} />
            AIS 140
          </span>

          <span>ISO Certified</span>

          <span>MSME</span>

          <span>Startup India</span>
        </div>
      </div>
    </div>
  );
}
