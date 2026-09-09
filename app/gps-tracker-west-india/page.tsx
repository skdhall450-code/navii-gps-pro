import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { indiaStates } from "@/lib/seo/indiaStates";
import { westIndiaCities, westIndiaStateSlugs } from "@/lib/seo/westIndiaCities";

const url = "https://naviigps.com/gps-tracker-west-india";
export const metadata: Metadata = {
  title: { absolute: "West India GPS Tracking: State & City Guides | NAVII GPS" },
  description: "Explore 100 city and town GPS tracking guides in Maharashtra, Gujarat, Rajasthan, Goa, and Dadra and Nagar Haveli and Daman and Diu.",
  alternates: { canonical: url },
  openGraph: { title: "West India GPS Tracking | NAVII GPS", description: "State, union territory and city guides for vehicle tracking and fleet planning.", url, type: "website", images: ["/og-image.jpg"] },
};
const regionalNotes: Record<string, string> = {
  maharashtra: "Compare metropolitan deliveries, factory visits and longer regional journeys. Keep pickup schedules and goods dispatch in separate reporting groups.",
  gujarat: "Plan the complete collection-to-delivery journey, including yard waiting and onward dispatch. Test alerts at actual receiving locations.",
  rajasthan: "Include longer outstation journeys in your pilot. Confirm update timestamps, network recovery and journey retention before relying on live alerts.",
  goa: "Coordinate scheduled passenger pickups and local service rounds with destination-specific boundaries. Review waiting time against the planned itinerary.",
  "dadra-nagar-haveli-daman-diu": "Plan Daman, Diu and Dadra and Nagar Haveli operations as distinct locations. Confirm installation logistics and cross-boundary routes for each vehicle group.",
};
export default function WestIndiaGpsPage() {
  const regions = westIndiaStateSlugs.map((slug) => indiaStates.find((state) => state.slug === slug)!);
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": url + "#webpage", url, name: "West India GPS Tracking Guides", inLanguage: "en-IN", hasPart: regions.map((state) => ({ "@type": "WebPage", name: state.name, url: "https://naviigps.com/gps-tracker/" + state.slug })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" }, { "@type": "ListItem", position: 2, name: "India", item: "https://naviigps.com/gps-tracker-india" }, { "@type": "ListItem", position: 3, name: "West India", item: url }] },
  ] };
  return <><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-3 text-sm text-cyan-200"><Link href="/">Home</Link><span>/</span><Link href="/gps-tracker-india">India</Link><span>/</span><span>West India</span></nav>
      <p className="font-semibold uppercase tracking-widest text-cyan-200">Regional fleet planning</p>
      <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">GPS Tracking Across West India</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">Explore vehicle tracking for cars, commercial vehicles and scheduled transport across four states and one union territory. Choose a city to review local routes, hardware options and practical setup questions.</p>
      <div className="mt-8 flex flex-wrap gap-3">{regions.map((state) => <a key={state.slug} href={"#" + state.slug} className="rounded-full border border-cyan-200/40 px-5 py-3">{state.name}</a>)}</div>
    </div></section>
    <section className="bg-slate-50 py-12"><div className="mx-auto max-w-7xl px-6"><h2 className="text-2xl font-bold text-slate-900">Choose Your Operating Location</h2><p className="mt-4 max-w-4xl leading-7 text-slate-600">These {westIndiaCities.length} guides cover selected cities and towns, including Rajasthan for western-route planning. Installation availability, charges and timing are confirmed against your location and vehicles. For a town not listed here, use its state guide and share the operating PIN code.</p></div></section>
    {regions.map((state) => { const cities = westIndiaCities.filter((city) => city.stateSlug === state.slug); return <section key={state.slug} id={state.slug} className="scroll-mt-28 border-b border-slate-200 bg-white py-16"><div className="mx-auto max-w-7xl px-6">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-semibold uppercase tracking-widest text-blue-700">{state.unionTerritory ? "Union territory" : "State"} · {cities.length} city and town guides</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900">{state.name}</h2></div><Link href={"/gps-tracker/" + state.slug} className="font-semibold text-blue-700 underline">View {state.unionTerritory ? "territory" : "state"} guide</Link></div>
      <p className="mt-5 max-w-4xl leading-8 text-slate-600">{regionalNotes[state.slug]}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cities.map((city) => <Link key={city.slug} href={"/gps-tracker/" + city.slug} className="rounded-2xl border border-slate-200 p-6 transition hover:border-cyan-500 hover:shadow-md"><h3 className="text-xl font-bold text-slate-900">{city.name}</h3><p className="mt-3 leading-7 text-slate-600">{city.areas.slice(0, 2).join(" · ")}</p><span className="mt-4 inline-block font-semibold text-blue-700">View tracking guide</span></Link>)}</div>
    </div></section>; })}
    <section className="bg-[#06142E] py-16 text-white"><div className="mx-auto max-w-6xl px-6"><h2 className="text-3xl font-bold">Plan a Fleet Setup Across Several Locations</h2><p className="mt-5 max-w-3xl leading-8 text-slate-300">Share vehicle types, fleet size, pickup points and operating states. Discuss compatible devices, network requirements, installation and ongoing subscription costs with NAVII GPS.</p><div className="mt-7 flex flex-wrap gap-4"><Link href="/contact" className="rounded-xl bg-cyan-500 px-6 py-4 font-semibold">Discuss your routes</Link><Link href="/products" className="rounded-xl border border-white/30 px-6 py-4">Compare devices</Link></div></div></section>
  </main><Footer /></>;
}
