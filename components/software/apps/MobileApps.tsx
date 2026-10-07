import Link from "next/link";
import { ArrowRight, MonitorSmartphone } from "lucide-react";

export default function MobileApps() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
            <MonitorSmartphone size={30} aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Web access and mobile setup
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Use the web dashboard to review your assigned vehicles, history, geofences, alerts and reports. For mobile access, ask NAVII GPS for the currently supported app, installation route and sign-in instructions for your account.
          </p>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-6 py-4 font-semibold text-white transition hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
            Ask about mobile access
            <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
