import Link from "next/link";
import { ArrowRight, BellRing, CheckCircle2, MapPin, RadioTower, Route } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { delhiDistricts } from "@/lib/seo/delhiDistricts";

export function DelhiGpsPage() {
  const url = "https://naviigps.com/gps-tracker/delhi";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: "GPS Tracker in Delhi | NAVII GPS", description: "Vehicle GPS tracking and fleet management planning across Delhi's current 13 revenue districts.", isPartOf: { "@id": "https://naviigps.com/#website" }, inLanguage: "en-IN" },
      { "@type": "Service", name: "GPS Tracking Solutions in Delhi", serviceType: "Vehicle GPS Tracking and Fleet Management", provider: { "@id": "https://naviigps.com/#organization" }, areaServed: { "@type": "AdministrativeArea", name: "Delhi" }, url },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
        { "@type": "ListItem", position: 2, name: "GPS Tracker India", item: "https://naviigps.com/gps-tracker-india" },
        { "@type": "ListItem", position: 3, name: "Delhi", item: url },
      ] },
    ],
  };

  return <><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6"><nav aria-label="Breadcrumb" className="mb-8 flex gap-3 text-sm text-cyan-200"><Link href="/">Home</Link><span>/</span><Link href="/gps-tracker-india">India</Link><span>/</span><span>Delhi</span></nav><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.12em] text-cyan-200"><MapPin size={17} /> DELHI NCR COVERAGE</span><h1 className="mt-7 max-w-5xl text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracker in Delhi for Cars and Commercial Fleets</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">NAVII GPS vehicle tracking devices and fleet management software planning across all {delhiDistricts.length} current Delhi revenue districts.</p><div className="mt-10 flex flex-wrap gap-4"><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold">Request a Consultation <ArrowRight size={19} /></Link><Link href="/products" className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold">View GPS Devices</Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">{[
      { title: "Live Vehicle Visibility", text: "Review the latest positions reported by compatible devices operating across Delhi NCR.", icon: RadioTower },
      { title: "Routes and Trip History", text: "Support dispatch, journey review and multi-district fleet coordination.", icon: Route },
      { title: "Geofences and Alerts", text: "Monitor supported location boundaries, movement, ignition and fleet events.", icon: BellRing },
    ].map((feature) => { const Icon = feature.icon; return <article key={feature.title} className="rounded-3xl border border-slate-200 p-8 shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h2 className="mt-5 text-2xl font-bold text-slate-900">{feature.title}</h2><p className="mt-3 leading-7 text-slate-600">{feature.text}</p></article>; })}</div></section>
    <section className="bg-slate-50 py-24"><div className="mx-auto max-w-7xl px-6"><p className="text-sm font-semibold tracking-[0.16em] text-blue-700">DISTRICT-WISE COVERAGE</p><h2 className="mt-3 text-4xl font-extrabold text-slate-900">GPS Tracker Guides for All {delhiDistricts.length} Delhi Districts</h2><p className="mt-5 max-w-3xl leading-8 text-slate-600">Choose a current revenue district to review local areas, fleet use cases, route context and deployment considerations.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{delhiDistricts.map((district) => <Link key={district.slug} href={`/gps-tracker/delhi/${district.slug}`} className="rounded-2xl border border-slate-200 bg-white p-6 text-blue-800 shadow-sm transition hover:border-cyan-500 hover:shadow-md"><h3 className="text-lg font-bold">{district.name} District</h3><p className="mt-3 text-sm leading-6 text-slate-600">{district.areas.slice(0, 4).join(", ")}</p><span className="mt-5 inline-flex items-center gap-2 font-semibold">View district guide <ArrowRight size={16} /></span></Link>)}</div></div></section>
    <section className="bg-white py-20"><div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2"><div><h2 className="text-4xl font-extrabold text-slate-900">Fleet Planning Across Delhi NCR</h2><p className="mt-6 text-lg leading-8 text-slate-600">GPS tracking can support commercial deliveries, employee transport, institutional vehicles, logistics fleets and field-service operations across dense city and peripheral routes.</p></div><ul className="space-y-4">{["Compatible GPS hardware and SIM planning", "Professional device installation", "Authorized platform access and data retention", "Route, geofence and alert responsibility"].map((item) => <li key={item} className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />{item}</li>)}</ul></div></section>
  </main><Footer /></>;
}
