import Link from "next/link";
import { ArrowRight, MonitorSmartphone } from "lucide-react";

export default function SoftwareHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06142E] via-[#081C3D] to-[#0B254F] py-20 md:py-24">
      <div aria-hidden="true" className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-[140px]" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[140px]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 sm:px-5 sm:text-sm">
          <MonitorSmartphone size={16} aria-hidden="true" className="shrink-0" />
          NAVII GPS SOFTWARE PLATFORM
        </span>

        <h1 className="mt-8 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          Vehicle Tracking and{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Fleet Management Software in India
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
          See where your connected vehicles are, review past routes, and check vehicle alerts and reports from one NAVII GPS account. Our fleet management software helps businesses in India follow day-to-day vehicle activity. Available features depend on compatible GPS hardware, an active vehicle subscription and your account permissions.
        </p>

        <div className="mt-10 flex flex-wrap gap-5">
          <Link href="/contact?intent=software-demo&source=software#contact-form" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
            Request a software demo
            <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
          </Link>
          <Link href="/products" className="rounded-xl border border-cyan-400/30 px-6 py-4 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
            Compare GPS trackers
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {["Live vehicle view", "Route history", "Geofence alerts", "Fleet reports"].map((label) => (
            <li key={label} className="rounded-2xl border border-cyan-400/20 bg-white/5 p-5 font-semibold text-cyan-200 backdrop-blur-xl">
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
