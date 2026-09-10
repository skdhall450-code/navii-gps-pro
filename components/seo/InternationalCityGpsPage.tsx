import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Globe2,
  MapPin,
  RadioTower,
  Route,
} from "lucide-react";

import Footer from "@/components/layout/FooterV2";
import Header from "@/components/layout/HeaderV2";
import {
  internationalCities,
  type InternationalCitySeo,
} from "@/lib/seo/internationalCities";
import { getInternationalCountry } from "@/lib/seo/internationalCountries";

export function InternationalCityGpsPage({ city }: { city: InternationalCitySeo }) {
  const country = getInternationalCountry(city.countrySlug);
  const url = `https://naviigps.com/gps-tracker/${city.slug}`;
  const countryUrl = `https://naviigps.com/gps-tracker/${city.countrySlug}`;
  const siblingCities = internationalCities.filter(
    (item) => item.countrySlug === city.countrySlug && item.slug !== city.slug,
  );
  const faqs = [
    {
      question: `Can NAVII GPS devices be evaluated for fleets in ${city.name}?`,
      answer: `Yes. Device, mobile-network, installation and regulatory compatibility must be confirmed for the intended vehicles and routes in ${city.name}, ${city.countryName}.`,
    },
    {
      question: `Which vehicles can use GPS tracking in ${city.name}?`,
      answer: "Suitable cars, trucks, buses, delivery vehicles and commercial fleets may use compatible tracking devices based on installation and operating requirements.",
    },
    {
      question: `Which details are needed for a ${city.name} deployment review?`,
      answer: `Share the fleet size, vehicle types, routes around ${city.areas.slice(0, 2).join(" and ")}, required alerts, mobile-network plan and installation responsibility.`,
    },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `GPS Tracker in ${city.name}, ${city.countryName} | NAVII GPS`,
        description: `Vehicle GPS tracking and fleet software planning for ${city.name}, ${city.countryName}.`,
        isPartOf: { "@id": "https://naviigps.com/#website" },
        inLanguage: "en",
      },
      {
        "@type": "Service",
        name: `GPS Tracking Solutions for ${city.name}`,
        serviceType: "Vehicle GPS Tracking and Fleet Management",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: { "@type": "Country", name: city.countryName },
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
          { "@type": "ListItem", position: 2, name: "International GPS Tracking", item: "https://naviigps.com/gps-tracker-international" },
          { "@type": "ListItem", position: 3, name: city.countryName, item: countryUrl },
          { "@type": "ListItem", position: 4, name: city.name, item: url },
        ],
      },
    ],
  };

  return <><Header /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6"><nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-3 text-sm text-cyan-200"><Link href="/">Home</Link><span>/</span><Link href="/gps-tracker-international">International</Link><span>/</span><Link href={`/gps-tracker/${city.countrySlug}`}>{city.countryName}</Link><span>/</span><span>{city.name}</span></nav><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.12em] text-cyan-200"><Globe2 size={17} /> INTERNATIONAL CITY GUIDE</span><h1 className="mt-7 max-w-5xl text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracker in {city.name} for Commercial Fleets</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Explore NAVII GPS vehicle tracking devices and fleet software for operators evaluating routes in {city.name}, {city.countryName}. Compatibility and availability are confirmed before deployment.</p><div className="mt-10 flex flex-wrap gap-4"><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold">Discuss City Requirements <ArrowRight size={19} /></Link><Link href="/products" className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold">Compare GPS Devices</Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">{[{ title: "Latest Vehicle Location", text: `Review the latest position reported by compatible vehicles operating across ${city.name}.`, icon: RadioTower }, { title: "Routes and Trip Records", text: "Use available journey history to support dispatch, service and route review.", icon: Route }, { title: "Geofences and Alerts", text: "Plan supported location boundaries and vehicle-event workflows for authorized teams.", icon: BellRing }].map((feature) => { const Icon = feature.icon; return <article key={feature.title} className="rounded-3xl border border-slate-200 p-8 shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h2 className="mt-5 text-2xl font-bold text-slate-900">{feature.title}</h2><p className="mt-3 leading-7 text-slate-600">{feature.text}</p></article>; })}</div></section>
    <section className="bg-slate-50 py-24"><div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2"><div><p className="text-sm font-semibold tracking-[0.16em] text-blue-700">LOCAL FLEET PLANNING</p><h2 className="mt-4 text-4xl font-extrabold text-slate-900">Vehicle Tracking for {city.name} Operations</h2><p className="mt-6 text-lg leading-8 text-slate-600">{city.localContext}</p><p className="mt-4 leading-8 text-slate-600">{city.planningNote}</p><ul className="mt-8 space-y-4">{country.sectors.map((sector) => <li key={sector} className="flex items-start gap-3 capitalize text-slate-700"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />{sector}</li>)}</ul></div><div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-xl"><div className="flex items-center gap-3"><MapPin className="text-cyan-300" /><h3 className="text-3xl font-bold">Key {city.name} Areas</h3></div><p className="mt-5 leading-8 text-slate-300">Discuss tracking requirements for routes around {city.areas.join(", ")} and connected locations.</p><div className="mt-7 flex flex-wrap gap-2">{city.areas.map((area) => <span key={area} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">{area}</span>)}</div><Link href={`/gps-tracker/${city.countrySlug}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold">View {city.countryName} Coverage <ArrowRight size={17} /></Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-6xl px-6"><h2 className="text-center text-4xl font-extrabold text-slate-900">Other City Guides in {city.countryName}</h2><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{siblingCities.map((sibling) => <Link key={sibling.slug} href={`/gps-tracker/${sibling.slug}`} className="rounded-2xl border border-slate-200 p-5 font-semibold text-blue-800 hover:border-cyan-500">GPS Tracker in {sibling.name}</Link>)}</div></div></section>
    <section className="bg-slate-50 py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-center text-4xl font-extrabold text-slate-900">GPS Tracking in {city.name}: FAQs</h2><div className="mt-10 space-y-4">{faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-bold text-slate-900">{faq.question}</h3><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p></article>)}</div></div></section>
    <section className="bg-[#06142E] py-16 text-white"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-4xl font-extrabold">Plan a Compatible {city.name} Fleet Setup</h2><p className="mx-auto mt-4 max-w-3xl leading-7 text-slate-300">Share your fleet size, vehicle types, mobile-network requirements and operating routes for a compatibility review.</p><Link href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold">Contact NAVII GPS <ArrowRight size={19} /></Link></div></section>
  </main><Footer /></>;
}
