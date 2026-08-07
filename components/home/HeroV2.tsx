"use client";

import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";

export default function HeroV2() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061642] via-[#0B2D7A] to-[#0A8ACF] text-white">

      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]" />

        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[150px]" />

      </div>

      {/* Main Hero */}

      <div className="relative mx-auto grid min-h-[90vh] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2">

        <HeroContent />

        <HeroVisual />

      </div>

      {/* Bottom Divider */}

      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40" />

    </section>
  );
}