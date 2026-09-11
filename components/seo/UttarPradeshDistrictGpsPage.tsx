import { TrackingSolutionLinks } from "@/components/seo/TrackingSolutionLinks";
import Link from "next/link";
import { ArrowRight, BellRing, CheckCircle2, MapPin, RadioTower, Route } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import type { UttarPradeshDistrictSeo } from "@/lib/seo/uttarPradeshDistricts";

const districtFaqs = (district: UttarPradeshDistrictSeo) => [
  {
    question: `Which vehicles can use GPS tracking in ${district.name} district?`,
    answer: `Compatible GPS solutions can support cars, trucks, buses, school vehicles and commercial fleets operating across ${district.name}, subject to device, network and installation requirements.`,
  },
  {
    question: `Which locations are covered around ${district.name}?`,
    answer: `Planning can include ${district.cities.join(", ")} and connected routes across ${district.division} division and Uttar Pradesh. Actual network and installation availability are confirmed before deployment.`,
  },
  {
    question: `Which fleet tracking features are available for ${district.name} operations?`,
    answer: "Typical requirements include latest vehicle location, trip history, geofences, supported alerts and fleet reports for authorized users.",
  },
];

export function UttarPradeshDistrictGpsPage({ district }: { district: UttarPradeshDistrictSeo }) {
  const url = `https://naviigps.com/gps-tracker/uttar-pradesh/${district.slug}`;
  const faqs = districtFaqs(district);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `GPS Tracker in ${district.name} District, Uttar Pradesh | NAVII GPS`,
        description: `Vehicle GPS tracking and fleet management planning for ${district.name} district in Uttar Pradesh.`,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        name: `GPS Tracking Solutions in ${district.name} District, Uttar Pradesh`,
        serviceType: "Vehicle GPS Tracking and Fleet Management",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: {
          "@type": "AdministrativeArea",
          name: `${district.name} District`,
          containedInPlace: { "@type": "State", name: "Uttar Pradesh" },
        },
        url,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "GPS Tracker India", item: "https://naviigps.com/gps-tracker-india" },
          { "@type": "ListItem", position: 3, name: "Uttar Pradesh", item: "https://naviigps.com/gps-tracker/uttar-pradesh" },
          { "@type": "ListItem", position: 4, name: district.name, item: url },
        ],
      },
    ],
  };

  return <><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6"><nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-3 text-sm text-cyan-200"><Link href="/">Home</Link><span>/</span><Link href="/gps-tracker-india">India</Link><span>/</span><Link href="/gps-tracker/uttar-pradesh">Uttar Pradesh</Link><span>/</span><span>{district.name}</span></nav><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.12em] text-cyan-200"><MapPin size={17} /> UTTAR PRADESH DISTRICT COVERAGE</span><h1 className="mt-7 max-w-5xl text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracker in {district.name} District, Uttar Pradesh</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Vehicle tracking devices and fleet software planning for cars, trucks, buses and commercial operations around {district.cities.join(", ")}.</p><div className="mt-10 flex flex-wrap gap-4"><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold">Request a Consultation <ArrowRight size={19} /></Link><Link href="/products" className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold">Compare GPS Devices</Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">{[
      { title: "Latest Vehicle Location", text: `Review the latest position reported by compatible devices operating in ${district.name} district.`, icon: RadioTower },
      { title: "Routes and Trip History", text: "Use available journey records to support dispatch, route review and operational coordination.", icon: Route },
      { title: "Geofences and Alerts", text: "Monitor supported location boundaries, movement, ignition and fleet events.", icon: BellRing },
    ].map((feature) => { const Icon = feature.icon; return <article key={feature.title} className="rounded-3xl border border-slate-200 p-8 shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h2 className="mt-5 text-2xl font-bold text-slate-900">{feature.title}</h2><p className="mt-3 leading-7 text-slate-600">{feature.text}</p></article>; })}</div></section>
    <section className="bg-slate-50 py-24"><div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2"><div><p className="text-sm font-semibold tracking-[0.16em] text-blue-700">{district.division.toUpperCase()} DIVISION FLEET PLANNING</p><h2 className="mt-4 text-4xl font-extrabold text-slate-900">Vehicle Tracking Across {district.name}</h2><p className="mt-6 text-lg leading-8 text-slate-600">{district.localContext}</p><p className="mt-4 leading-8 text-slate-600">{district.planningNote}</p><ul className="mt-8 space-y-4">{district.sectors.map((sector) => <li key={sector} className="flex items-start gap-3 capitalize text-slate-700"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />{sector}</li>)}</ul></div><div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-xl"><h2 className="text-3xl font-bold">Locations Around {district.name}</h2><p className="mt-5 leading-8 text-slate-300">District-level route and installation planning can include these locations and connected operating corridors.</p><div className="mt-7 flex flex-wrap gap-3">{district.cities.map((city) => <span key={city} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-cyan-100">GPS Tracker in {city}</span>)}</div><Link href="/gps-tracker/uttar-pradesh" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold">View All UP Districts <ArrowRight size={17} /></Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-center text-4xl font-extrabold text-slate-900">GPS Tracking in {district.name}: FAQs</h2><div className="mt-10 space-y-4">{faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900">{faq.question}</h3><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p></article>)}</div></div></section>
  <TrackingSolutionLinks location={district.name} sectors={district.sectors} />
  </main><Footer /></>;
}
