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
            Use the web dashboard to review your assigned vehicles, history, geofences, alerts and reports. Choose the Android app that matches your assigned NAVII GPS account role. Installing an app does not create an account or grant another role.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { role: "Customer", id: "com.naviigps.customer", description: "For customers monitoring their assigned vehicles." },
              { role: "Dealer", id: "com.naviigps.dealer", description: "For authorised dealer accounts." },
              { role: "Admin", id: "com.naviigps.app", description: "For authorised administration accounts." },
            ].map((app) => (
              <a key={app.id} href={`https://play.google.com/store/apps/details?id=${app.id}`} target="_blank" rel="noopener noreferrer" data-ga-event="android_app_click" data-ga-channel="google_play" className="rounded-2xl border border-cyan-200 bg-white p-5 text-slate-800 transition hover:border-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
                <span className="block font-bold text-cyan-800">{app.role} Android app ↗</span>
                <span className="mt-2 block text-sm leading-6">{app.description}</span>
              </a>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">Using an older app or an iPhone? Ask us to confirm which app and sign-in route support your account before switching.</p>
          <Link href="/contact?intent=mobile-access&source=software#contact-form" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-6 py-4 font-semibold text-white transition hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
            Ask about mobile access
            <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
