"use client";


export default function CTAButtons() {
  return (
    <div className="flex flex-wrap gap-5">

      {/* Get Demo */}

      <a
        href="/contact"
        className="rounded-2xl bg-[#245ac4] hover:bg-[#2f6de0] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-950/25 transition-colors duration-200"
      >
        🚀 Get Free Demo
      </a>

      {/* Call */}

      <a
        href="tel:+917717394007"
        className="rounded-2xl border border-cyan-400/30 bg-white/5 px-6 py-4 text-base font-semibold text-white  transition hover:border-cyan-300 hover:bg-cyan-400/10"
      >
        📞 Call Now
      </a>

      {/* WhatsApp */}      <a
        href="https://wa.me/918899729705"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-2xl border border-green-400/30 bg-green-500/10 px-6 py-4 text-base font-semibold text-green-300  transition hover:bg-green-500/20 hover:border-green-300"
      >
        💬 WhatsApp
      </a>

    </div>
  );
}