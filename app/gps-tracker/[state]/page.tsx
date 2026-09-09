import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BellRing, CheckCircle2, MapPin, RadioTower, Route } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { getIndiaState, indiaStates } from "@/lib/seo/indiaStates";

import { priorityCities } from "@/lib/seo/priorityCities";
import { CityGpsPage } from "@/components/seo/CityGpsPage";

const staticCitySlugs = new Set(["chennai", "bengaluru", "hyderabad", "kochi", "coimbatore", "visakhapatnam", "pune", "mumbai", "ahmedabad"]);

type PageProps = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return [...indiaStates.map((state) => ({ state: state.slug })), ...priorityCities.filter((city) => !staticCitySlugs.has(city.slug)).map((city) => ({ state: city.slug }))];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getIndiaState(slug);
  if (!state) {
    const city = priorityCities.find((entry) => entry.slug === slug);
    if (!city) return {};
    const url = `https://naviigps.com/gps-tracker/${city.slug}`;
    const description = `GPS tracking in ${city.name}: vehicle devices, route history and fleet planning for ${city.areas.slice(0, 2).join(" and ")} routes. Discuss installation and pricing.`;
    return {
      title: `GPS Tracker in ${city.name} | NAVII GPS`, description,
      alternates: { canonical: url },
      openGraph: { title: `GPS Tracker in ${city.name} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
      twitter: { card: "summary_large_image", title: `GPS Tracker in ${city.name} | NAVII GPS`, description, images: ["/og-image.jpg"] },
    };
  }
  const url = `https://naviigps.com/gps-tracker/${state.slug}`;
  const cityKeywords = state.cities.slice(0, 4).map((city) => `GPS tracker ${city}`);
  return {
    title: `GPS Tracker in ${state.name} | Vehicle Tracking System | NAVII GPS`,
    description: `GPS trackers and vehicle tracking systems in ${state.name} for cars, trucks, buses and commercial fleets. Coverage includes ${state.cities.slice(0, 4).join(", ")} and statewide operations.`,
    keywords: [`GPS tracker in ${state.name}`, `GPS tracker ${state.name}`, `vehicle tracking system ${state.name}`, `GPS tracking company ${state.name}`, `car GPS tracker ${state.name}`, `truck GPS tracking ${state.name}`, `fleet management software ${state.name}`, ...cityKeywords],
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${state.name} | NAVII GPS`, description: `Vehicle tracking devices and fleet software for ${state.name}.`, url, type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `NAVII GPS tracking solutions in ${state.name}` }] },
    twitter: { card: "summary_large_image", title: `GPS Tracker in ${state.name} | NAVII GPS`, description: `Vehicle GPS tracking and fleet management in ${state.name}.`, images: ["/og-image.jpg"] },
  };
}

export default async function StateGpsTrackerPage({ params }: PageProps) {
  const { state: slug } = await params;
  const state = getIndiaState(slug);
  if (!state) {
    const city = priorityCities.find((entry) => entry.slug === slug);
    if (!city) notFound();
    return <CityGpsPage city={city} />;
  }
  const linkedCities = priorityCities.filter((city) => city.stateSlug === state.slug);
  const url = `https://naviigps.com/gps-tracker/${state.slug}`;
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: `GPS Tracker in ${state.name} | NAVII GPS`, description: `Vehicle GPS tracking and fleet management solutions in ${state.name}.`, isPartOf: { "@id": "https://naviigps.com/#website" }, about: { "@id": "https://naviigps.com/#organization" }, inLanguage: "en-IN" },
    { "@type": "Service", name: `GPS Tracking Solutions in ${state.name}`, serviceType: "Vehicle GPS Tracking and Fleet Management", provider: { "@id": "https://naviigps.com/#organization" }, areaServed: { "@type": state.unionTerritory ? "AdministrativeArea" : "State", name: state.name }, url },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" }, { "@type": "ListItem", position: 2, name: "GPS Tracker India", item: "https://naviigps.com/gps-tracker-india" }, { "@type": "ListItem", position: 3, name: state.name, item: url }] },
  ] };
  const features = [
    { title: "Live Vehicle Visibility", text: `Monitor connected vehicles operating in ${state.name} from a central GPS tracking platform.`, icon: RadioTower },
    { title: "Routes and Trip History", text: `Review available journey records for routes serving ${state.cities.slice(0, 3).join(", ")} and other locations.`, icon: Route },
    { title: "Geofences and Alerts", text: "Create location boundaries and monitor supported movement, ignition and fleet events.", icon: BellRing },
  ];

  return <><Header /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-[0.12em] text-cyan-200"><MapPin size={17} /> {state.region.toUpperCase()}</span><h1 className="mt-7 max-w-5xl text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracker in {state.name} for Cars and Commercial Fleets</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">NAVII GPS provides connected vehicle tracking devices and fleet management software for operations in {state.name}, including {state.cities.slice(0, 4).join(", ")}.</p><div className="mt-10 flex flex-wrap gap-4"><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white">Request a Consultation <ArrowRight size={19} /></Link><Link href="/products" className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold">View GPS Devices</Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">{features.map((feature) => { const Icon = feature.icon; return <article key={feature.title} className="rounded-3xl border border-slate-200 p-8 shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Icon size={28} /></div><h2 className="mt-5 text-2xl font-bold text-slate-900">{feature.title}</h2><p className="mt-3 leading-7 text-slate-600">{feature.text}</p></article>; })}</div></section>
    <section className="bg-slate-50 py-24"><div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2"><div><span className="text-sm font-semibold tracking-[0.16em] text-blue-700">STATE-WIDE FLEET USE CASES</span><h2 className="mt-4 text-4xl font-extrabold text-slate-900">Vehicle Tracking for {state.name}</h2><p className="mt-6 text-lg leading-8 text-slate-600">GPS tracking can support {state.sectors.join(", ")} while giving authorized teams clearer vehicle and route visibility.</p><ul className="mt-8 space-y-4">{state.sectors.map((sector) => <li key={sector} className="flex items-start gap-3 capitalize text-slate-700"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />{sector}</li>)}</ul></div><div className="rounded-[32px] bg-[#06142E] p-9 text-white shadow-xl"><h3 className="text-3xl font-bold">Coverage Across Major Cities</h3><p className="mt-5 leading-8 text-slate-300">Discuss GPS tracking requirements for vehicles operating in {state.cities.join(", ")} and other locations across {state.name}.</p><div className="mt-7 flex flex-wrap gap-2">{state.cities.map((city) => <span key={city} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">{city}</span>)}</div><Link href="/software" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold">Explore Fleet Software <ArrowRight size={17} /></Link></div></div></section>
    {linkedCities.length > 0 && <section className="bg-white py-16"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold text-slate-900">City and Town Guides in {state.name}</h2><p className="mt-4 text-slate-600">Choose a location for route planning, device selection and installation questions. Availability is confirmed for your vehicle and location before booking.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{linkedCities.map((city) => <Link key={city.slug} href={`/gps-tracker/${city.slug}`} className="rounded-2xl border border-slate-200 p-5 text-blue-800 hover:border-cyan-500"><h3 className="font-bold">{city.name}</h3><p className="mt-2 text-sm text-slate-600">Routes around {city.areas.slice(0, 2).join(" and ")}</p></Link>)}</div></div></section>}
    <section className="bg-white py-14"><div className="mx-auto max-w-5xl px-6 text-center"><Link href="/gps-tracker-india" className="inline-flex items-center gap-2 font-semibold text-blue-700">View GPS coverage in all Indian states <ArrowRight size={17} /></Link></div></section>
  </main><Footer /></>;
}
