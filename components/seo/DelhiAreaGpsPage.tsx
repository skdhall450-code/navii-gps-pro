import Link from "next/link";
import { ArrowRight, BellRing, CheckCircle2, MapPin, RadioTower, Route } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { toDelhiAreaSlug, type DelhiAreaSeo } from "@/lib/seo/delhiAreas";

const areaFaqs = (area: DelhiAreaSeo) => [
  {
    question: `Which vehicles can use GPS tracking in ${area.name}?`,
    answer: `Compatible GPS solutions can support cars, trucks, buses, school vehicles and commercial fleets operating around ${area.name}, subject to device, network and installation requirements.`,
  },
  {
    question: `Can fleet routes outside ${area.name} also be monitored?`,
    answer: `Route planning can include ${area.nearbyAreas.join(", ")} and connected journeys across ${area.districtName} district and Delhi NCR. Actual network and service availability are confirmed before installation.`,
  },
  {
    question: `Which tracking features are available for ${area.name} fleets?`,
    answer: "Typical requirements include latest vehicle location, trip history, geofences, supported alerts and fleet reports for authorized users.",
  },
];

export function DelhiAreaGpsPage({ area }: { area: DelhiAreaSeo }) {
  const url = `https://naviigps.com/gps-tracker/delhi/${area.districtSlug}/${area.slug}`;
  const districtUrl = `https://naviigps.com/gps-tracker/delhi/${area.districtSlug}`;
  const faqs = areaFaqs(area);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `GPS Tracker in ${area.name}, Delhi | NAVII GPS`,
        description: `Vehicle GPS tracking and fleet management planning for ${area.name} in ${area.districtName} district, Delhi.`,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        name: `GPS Tracking Solutions in ${area.name}, Delhi`,
        serviceType: "Vehicle GPS Tracking and Fleet Management",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: {
          "@type": "Place",
          name: area.name,
          containedInPlace: { "@type": "AdministrativeArea", name: `${area.districtName} District, Delhi` },
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
          { "@type": "ListItem", position: 2, name: "Delhi", item: "https://naviigps.com/gps-tracker/delhi" },
          { "@type": "ListItem", position: 3, name: area.districtName, item: districtUrl },
          { "@type": "ListItem", position: 4, name: area.name, item: url },
        ],
      },
    ],
  };

  return <><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6"><nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-3 text-sm text-cyan-200"><Link href="/">Home</Link><span>/</span><Link href="/gps-tracker/delhi">Delhi</Link><span>/</span><Link href={`/gps-tracker/delhi/${area.districtSlug}`}>{area.districtName}</Link><span>/</span><span>{area.name}</span></nav><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.12em] text-cyan-200"><MapPin size={17} /> {area.districtName.toUpperCase()} AREA COVERAGE</span><h1 className="mt-7 max-w-5xl text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracker in {area.name}, Delhi</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Vehicle tracking devices and fleet management software planning for cars, trucks, buses and commercial operations around {area.name} in {area.districtName} district.</p><div className="mt-10 flex flex-wrap gap-4"><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold">Request a Consultation <ArrowRight size={19} /></Link><Link href="/products" className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold">Compare GPS Devices</Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">{[
      { title: "Latest Vehicle Location", text: `Review the latest position reported by compatible devices operating around ${area.name}.`, icon: RadioTower },
      { title: "Routes and Trip History", text: `Support dispatch and journey review for authorized fleet operations in ${area.name}.`, icon: Route },
      { title: "Geofences and Alerts", text: "Monitor supported location boundaries, movement, ignition and fleet events.", icon: BellRing },
    ].map((feature) => { const Icon = feature.icon; return <article key={feature.title} className="rounded-3xl border border-slate-200 p-8 shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h2 className="mt-5 text-2xl font-bold text-slate-900">{feature.title}</h2><p className="mt-3 leading-7 text-slate-600">{feature.text}</p></article>; })}</div></section>
    <section className="bg-slate-50 py-24"><div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2"><div><p className="text-sm font-semibold tracking-[0.16em] text-blue-700">LOCAL FLEET PLANNING</p><h2 className="mt-4 text-4xl font-extrabold text-slate-900">Vehicle Tracking Around {area.name}</h2><p className="mt-6 text-lg leading-8 text-slate-600">{area.localContext}</p><p className="mt-4 leading-8 text-slate-600">{area.planningNote}</p><ul className="mt-8 space-y-4">{area.sectors.map((sector) => <li key={sector} className="flex items-start gap-3 capitalize text-slate-700"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />{sector}</li>)}</ul></div><div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-xl"><h2 className="text-3xl font-bold">Nearby {area.districtName} Areas</h2><p className="mt-5 leading-8 text-slate-300">Explore related local guides for connected fleet routes in the same Delhi district.</p><div className="mt-7 grid gap-3">{area.nearbyAreas.map((nearbyArea) => <Link key={nearbyArea} href={`/gps-tracker/delhi/${area.districtSlug}/${toDelhiAreaSlug(nearbyArea)}`} className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-cyan-100 hover:border-cyan-300">GPS Tracker in {nearbyArea}</Link>)}</div><Link href={`/gps-tracker/delhi/${area.districtSlug}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold">View {area.districtName} District <ArrowRight size={17} /></Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-center text-4xl font-extrabold text-slate-900">GPS Tracking in {area.name}: FAQs</h2><div className="mt-10 space-y-4">{faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900">{faq.question}</h3><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p></article>)}</div></div></section>
  </main><Footer /></>;
}
