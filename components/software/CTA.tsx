import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-[#06142E] via-[#081C3D] to-[#0B254F] py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl font-extrabold text-white md:text-5xl">
          See the software with your fleet requirements
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Tell us how many vehicles you need to monitor and which daily checks matter to your team. Request a demo of the relevant tracking, history, alerts and report screens, with a setup and subscription review.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Link href="/contact?intent=software-demo&source=software#contact-form" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
            Request a software demo
            <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
          </Link>
          <Link href="/products" className="rounded-xl border border-white/20 px-6 py-4 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
            Compare GPS trackers
          </Link>
        </div>
      </div>
    </section>
  );
}
