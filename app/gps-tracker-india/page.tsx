import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { indiaStates, southIndiaStates } from "@/lib/seo/indiaStates";
import { priorityCities } from "@/lib/seo/priorityCities";

export const metadata: Metadata = {
  title: "GPS Tracker Across India | State-wise Vehicle Tracking | NAVII GPS",
  description: "Explore NAVII GPS vehicle tracking systems state by state across India, with dedicated GPS tracker and fleet-management information for South, North, West, East, Central and Northeast India.",
  keywords: ["GPS tracker India", "vehicle tracking system India", "GPS tracker all states India", "fleet management software India", "GPS tracking company India", "South India GPS tracker"],
  alternates: { canonical: "https://naviigps.com/gps-tracker-india" },
  openGraph: { title: "GPS Tracker Across India | NAVII GPS", description: "State-wise vehicle tracking and fleet management solutions across India.", url: "https://naviigps.com/gps-tracker-india", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS service coverage across India" }] },
};

function StateGrid({ states }: { states: typeof indiaStates }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{states.map((state) => <Link key={state.slug} href={`/gps-tracker/${state.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg"><h3 className="font-bold text-slate-900 group-hover:text-blue-700">GPS Tracker in {state.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{state.cities.slice(0, 3).join(", ")} and statewide fleet support.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">View state page <ArrowRight size={15} /></span></Link>)}</div>;
}

export default function GPSTrackerIndiaPage() {
  const remainingStates = indiaStates.filter((state) => !state.southPriority);
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": "https://naviigps.com/gps-tracker-india#webpage", url: "https://naviigps.com/gps-tracker-india", name: "GPS Tracker Across India", description: "State-wise NAVII GPS vehicle tracking coverage across India.", isPartOf: { "@id": "https://naviigps.com/#website" }, inLanguage: "en-IN" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" }, { "@type": "ListItem", position: 2, name: "GPS Tracker India", item: "https://naviigps.com/gps-tracker-india" }] },
  ] };

  return <><Header /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6"><MapPinned className="text-cyan-300" size={42} /><h1 className="mt-6 max-w-4xl text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracker and Vehicle Tracking Across India</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Explore state-wise GPS tracking devices and fleet management solutions for cars, trucks, buses and commercial operations across India.</p><Link href="/contact" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white">Discuss Your Fleet <ArrowRight size={19} /></Link></div></section>
    <section className="bg-slate-50 py-20"><div className="mx-auto max-w-7xl px-6"><span className="text-sm font-semibold tracking-[0.18em] text-blue-700">SOUTH INDIA PRIORITY COVERAGE</span><h2 className="mt-3 text-4xl font-extrabold text-slate-900">GPS Tracking in South India</h2><p className="mb-9 mt-4 max-w-3xl leading-7 text-slate-600">Dedicated information for Tamil Nadu, Karnataka, Telangana, Andhra Pradesh and Kerala, including major commercial centres and important fleet use cases.</p><StateGrid states={southIndiaStates} /><h3 className="mt-14 text-2xl font-extrabold text-slate-900">Priority South India Cities</h3><div className="mt-6 grid gap-4 md:grid-cols-3">{priorityCities.map((city) => <Link key={city.slug} href={`/gps-tracker/${city.slug}`} className="rounded-2xl bg-[#06142E] p-6 text-white shadow-lg transition hover:-translate-y-1"><span className="text-sm font-semibold text-cyan-300">{city.state}</span><h4 className="mt-2 text-xl font-bold">GPS Tracker in {city.name}</h4><p className="mt-3 text-sm leading-6 text-slate-300">Local fleet tracking information for {city.areas.slice(0, 3).join(", ")} and nearby routes.</p></Link>)}</div></div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-7xl px-6"><h2 className="text-4xl font-extrabold text-slate-900">All Indian States</h2><p className="mb-9 mt-4 max-w-3xl leading-7 text-slate-600">Select a state to view local GPS tracker, vehicle tracking and fleet management information.</p><StateGrid states={remainingStates} /></div></section>
  </main><Footer /></>;
}
