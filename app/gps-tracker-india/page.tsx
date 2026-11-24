import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { indiaStates, southIndiaStates } from "@/lib/seo/indiaStates";
import { priorityCities } from "@/lib/seo/priorityCities";

const pageTitle = "GPS Tracker Across India | State & City Guides";
const pageDescription = "Browse GPS tracking guides across six India regions. Compare state and city routes, multi-depot rollout, connectivity checks and location-specific quotations.";
const faqs = [
  { question: "What should a quotation for several vehicle bases include?", answer: "Request a location-wise breakdown of hardware, SIM, platform, renewals, fitting and any travel or removal charges. Identify the vehicles covered, fitting contact and service start for each base. Confirm availability separately for every location before accepting a rollout schedule." },
  { question: "What happens when an interstate trip has a mobile-network gap?", answer: "Check the age of the latest update before treating a map position as current. Confirm offline storage and later upload behaviour for the chosen device and platform, then test a representative journey. A nationwide guide does not guarantee network coverage or continuous live reporting." },
  {
    "question": "How do I find GPS tracking information for my city?",
    "answer": "Start with the state or union territory guide, then follow its district and city links where available. You can also use the priority city and regional guides on this page. If your location is not listed, share the vehicle location and operating routes through the contact page."
  },
  {
    "question": "Does a city guide confirm local installation availability?",
    "answer": "The guides help plan a tracking requirement; they do not confirm an installation appointment or a local office. Share the installation location, vehicle count and preferred dates with NAVII GPS to confirm availability and any installation or travel charges."
  },
  {
    "question": "What should I check for vehicles travelling between states?",
    "answer": "Provide the main routes, depots and vehicle types when discussing the setup. Confirm device compatibility, connectivity along the routes, reporting expectations and who reviews alerts at each location. Ask for a pilot on a representative journey before a wider rollout."
  },
  {
    "question": "Can I plan one tracking setup for vehicles based in several cities?",
    "answer": "Share a vehicle list grouped by location, the required users and common reports. Confirm suitable hardware for each vehicle, installation arrangements at each base, account access and ongoing service charges in the proposed fleet setup."
  }
];
const additionalRegions = [
  { id: "north-india", name: "North India", text: "Choose a published state guide or the Delhi district directory. For journeys between bases, keep each vehicle assignment and receiving contact tied to the actual city." },
  { id: "east-india", name: "East India", text: "Explore Bihar, Jharkhand, Odisha and West Bengal guides. Separate the vehicle operating base from the delivery destination when describing an interstate collection or distribution round." },
  { id: "central-india", name: "Central India", text: "Use the Madhya Pradesh and Chhattisgarh district and town directories. For a route passing through several districts, record the planned stops and responsible dispatch team for each leg." },
];
const directoryEntries = [...indiaStates.map(({name, slug}) => ({name, href: `/gps-tracker/${slug}`})), {name: "Delhi", href: "/gps-tracker/delhi"}];
const rolloutSteps = [
  { title: "Prepare one vehicle list, grouped by operating base", text: "List the vehicle type, parking location, existing tracker and SIM, and the local person who can provide fitting access. Keep vehicles that only visit a city separate from vehicles based there. Confirm arrangements for every base before scheduling a national rollout." },
  { title: "Compare the complete quotation for each location", text: "Ask for hardware, SIM, platform, renewal, fitting and any travel or removal charges to be listed separately. Record which vehicles and locations each quotation covers, who provides support and when service starts. A published city guide is not a confirmed appointment or a fixed-price offer." },
  { title: "Pilot the handover between dispatch teams", text: "Agree who monitors each leg, who receives alerts and who resolves a missing update. Check the timestamp and connectivity on a representative journey before relying on the displayed position. Confirm whether the chosen device stores and later uploads records during a network gap; do not assume continuous live reporting or automatic recovery." },
];
const guideSections = [
  { href: "#north-india", label: "North India" },
  { href: "#east-india", label: "East India" },
  { href: "#central-india", label: "Central India" },
  { href: "#multi-location-rollout", label: "Multi-location rollout" },
  { href: "#south-india", label: "South India" },
  { href: "#city-guides", label: "Priority cities" },
  { href: "#northeast-india", label: "Northeast India" },
  { href: "#west-india", label: "West India" },
  { href: "#states-and-territories", label: "Other states & territories" },
  { href: "#delhi-ncr", label: "Delhi NCR" },
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: uniqueKeywords(["GPS tracker India", "vehicle tracking system India", "GPS tracker all states India", "fleet management software India", "GPS tracking company India", "South India GPS tracker"]),
  alternates: { canonical: "https://naviigps.com/gps-tracker-india" },
  openGraph: { title: `${pageTitle} | NAVII GPS INDIA`, description: pageDescription, url: "https://naviigps.com/gps-tracker-india", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS state and city tracking guides" }] },
  twitter: { card: "summary_large_image", title: `${pageTitle} | NAVII GPS INDIA`, description: pageDescription, images: ["/og-image.jpg"] },
};

function StateGrid({ states }: { states: typeof indiaStates }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{states.map((state) => <Link key={state.slug} href={`/gps-tracker/${state.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg"><h3 className="font-bold text-slate-900 group-hover:text-blue-700">GPS Tracker in {state.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{state.cities.slice(0, 3).join(", ")} and regional fleet planning.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">View local guide <ArrowRight size={15} /></span></Link>)}</div>;
}

const northeastStateSlugs = ["arunachal-pradesh", "assam", "manipur", "meghalaya", "mizoram", "nagaland", "sikkim", "tripura"];
const northeastCitySlugs = ["dibrugarh", "silchar", "jorhat", "tura", "kohima", "lunglei", "namchi"];

export default function GPSTrackerIndiaPage() {
  const remainingStates = indiaStates.filter((state) => !state.southPriority);
  const nonSouthCities = priorityCities.filter((city) => !southIndiaStates.some((state) => state.slug === city.stateSlug));
  const northeastStates = indiaStates.filter((state) => northeastStateSlugs.includes(state.slug));
  const northeastCities = priorityCities.filter((city) => northeastCitySlugs.includes(city.slug));
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "FAQPage", "@id": "https://naviigps.com/gps-tracker-india#faq", mainEntity: faqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    { "@type": "ItemList", "@id": "https://naviigps.com/gps-tracker-india#published-guides", name: "Published India state and union territory guides", numberOfItems: directoryEntries.length, itemListElement: directoryEntries.map(({name, href}, index) => ({ "@type": "ListItem", position: index + 1, name, url: `https://naviigps.com${href}` })) },
    { "@type": "CollectionPage", "@id": "https://naviigps.com/gps-tracker-india#webpage", url: "https://naviigps.com/gps-tracker-india", name: pageTitle, description: pageDescription, isPartOf: { "@id": "https://naviigps.com/#website" }, inLanguage: "en-IN" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" }, { "@type": "ListItem", position: 2, name: "GPS Tracker India", item: "https://naviigps.com/gps-tracker-india" }] },
  ] };

  return <><Header /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6"><MapPinned className="text-cyan-300" size={42} /><h1 className="mt-6 max-w-4xl text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracker and Vehicle Tracking Across India</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Explore state-wise GPS tracking devices and fleet management solutions for cars, trucks, buses and commercial operations across India.</p><Link href="/contact" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white">Discuss Your Fleet <ArrowRight size={19} /></Link></div></section>
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-slate-900">Find your regional GPS tracking guide</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">Choose a region or browse the state guides below. Confirm installation availability and route connectivity for your actual vehicle locations when making an enquiry.</p>
        <nav aria-label="India tracking guide sections" className="mt-6 flex flex-wrap gap-3">
          {guideSections.map(({ href, label }) => <a key={href} href={href} className="rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50">{label}</a>)}
        </nav>
        <p className="mt-7 leading-7 text-slate-600">Choosing the setup first? Review our <Link href="/vehicle-tracking-system" className="font-semibold text-blue-700 underline underline-offset-4">vehicle tracking system guide</Link> or <Link href="/commercial-vehicle-tracking" className="font-semibold text-blue-700 underline underline-offset-4">commercial fleet planning guide</Link>.</p>
      </div>
    </section>
    {additionalRegions.map((region) => <section key={region.id} id={region.id} className="scroll-mt-28 bg-slate-50 py-16"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold text-slate-900">GPS tracking guides in {region.name}</h2><p className="mb-8 mt-4 max-w-3xl leading-7 text-slate-600">{region.text}</p><StateGrid states={indiaStates.filter((state) => state.region === region.name)} />{region.id === "north-india" && <Link href="/gps-tracker/delhi" className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white">Delhi district and area guides</Link>}</div></section>)}
    <section id="multi-location-rollout" className="scroll-mt-28 bg-white py-16"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold text-slate-900">Plan GPS tracking across several Indian locations</h2><div className="mt-8 grid gap-6 lg:grid-cols-3">{rolloutSteps.map(({title, text}) => <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><h3 className="text-xl font-bold text-slate-900">{title}</h3><p className="mt-4 leading-7 text-slate-600">{text}</p></article>)}</div><p className="mt-6 leading-7 text-slate-600">Regions here organize the published guides for browsing; they are not additional administrative divisions or proof of local offices. District and locality coverage varies. If a guide is missing, share the exact location through our <Link href="/contact" className="font-semibold text-blue-700 underline">fleet enquiry page</Link>.</p></div></section>
    <section id="south-india" className="scroll-mt-28 bg-slate-50 py-20"><div className="mx-auto max-w-7xl px-6"><span className="text-sm font-semibold tracking-[0.18em] text-blue-700">SOUTH INDIA STATE GUIDES</span><h2 className="mt-3 text-4xl font-extrabold text-slate-900">GPS Tracking in South India</h2><p className="mb-9 mt-4 max-w-3xl leading-7 text-slate-600">Dedicated information for Tamil Nadu, Karnataka, Telangana, Andhra Pradesh and Kerala, including major commercial centres and important fleet use cases.</p><StateGrid states={southIndiaStates} /><h3 className="mt-14 text-2xl font-extrabold text-slate-900">Priority South India Cities</h3><div className="mt-6 grid gap-4 md:grid-cols-3">{priorityCities.filter((city) => southIndiaStates.some((state) => state.slug === city.stateSlug)).map((city) => <Link key={city.slug} href={`/gps-tracker/${city.slug}`} className="rounded-2xl bg-[#06142E] p-6 text-white shadow-lg transition hover:-translate-y-1"><span className="text-sm font-semibold text-cyan-300">{city.state}</span><h4 className="mt-2 text-xl font-bold">GPS Tracker in {city.name}</h4><p className="mt-3 text-sm leading-6 text-slate-300">Local fleet tracking information for {city.areas.slice(0, 3).join(", ")} and nearby routes.</p></Link>)}</div></div></section>
    <section id="city-guides" className="scroll-mt-28 bg-white py-20"><div className="mx-auto max-w-7xl px-6"><span className="text-sm font-semibold tracking-[0.18em] text-blue-700">NORTH, EAST & NORTHEAST CITY COVERAGE</span><h2 className="mt-3 text-4xl font-extrabold text-slate-900">Priority GPS Tracker City Guides Across India</h2><p className="mb-9 mt-4 max-w-3xl leading-7 text-slate-600">Browse additional city-level vehicle tracking guides for major commercial, logistics, passenger and regional fleet markets.</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{nonSouthCities.map((city) => <Link key={city.slug} href={`/gps-tracker/${city.slug}`} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-cyan-400 hover:bg-white hover:shadow-lg"><span className="text-sm font-semibold text-blue-700">{city.state}</span><h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-blue-700">GPS Tracker in {city.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{city.areas.slice(0, 3).join(", ")} and nearby routes.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Open city guide <ArrowRight size={15} /></span></Link>)}</div></div></section>
    <section id="northeast-india" className="scroll-mt-28 bg-cyan-50 py-20"><div className="mx-auto max-w-7xl px-6"><span className="text-sm font-semibold tracking-[0.18em] text-blue-700">NORTHEAST INDIA GPS COVERAGE</span><h2 className="mt-3 text-4xl font-extrabold text-slate-900">Northeast India State & City GPS Tracker Guides</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">Explore dedicated GPS tracker pages for all eight Northeast states and priority city guides. Compare local operating routes and vehicle requirements before discussing an installation.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{northeastStates.map((state) => <Link key={state.slug} href={`/gps-tracker/${state.slug}`} className="group rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg"><span className="text-xs font-semibold uppercase tracking-wide text-blue-700">Northeast State</span><h3 className="mt-2 font-bold text-slate-900 group-hover:text-blue-700">GPS Tracker in {state.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{state.cities.slice(0, 4).join(", ")}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">View state guide <ArrowRight size={15} /></span></Link>)}</div><h3 className="mt-12 text-2xl font-extrabold text-slate-900">Northeast City Guides</h3><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{northeastCities.map((city) => <Link key={city.slug} href={`/gps-tracker/${city.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg"><span className="text-sm font-semibold text-blue-700">{city.state}</span><h4 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-blue-700">GPS Tracker in {city.name}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{city.areas.slice(0, 3).join(", ")} and nearby routes.</p></Link>)}</div></div></section>
    <section id="west-india" className="scroll-mt-28 bg-[#06142E] py-16 text-white"><div className="mx-auto max-w-7xl px-6"><h2 className="text-4xl font-extrabold">West India GPS Tracking</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Browse 100 city and town guides across Maharashtra, Gujarat, Goa, Rajasthan and Dadra and Nagar Haveli and Daman and Diu. Compare local route requirements and plan your vehicle tracking setup.</p><Link href="/gps-tracker-west-india" className="mt-7 inline-block rounded-xl bg-cyan-500 px-6 py-4 font-semibold">Explore West India city guides</Link></div></section>
    <section id="states-and-territories" className="scroll-mt-28 bg-white py-20"><div className="mx-auto max-w-7xl px-6"><h2 className="text-4xl font-extrabold text-slate-900">Indian States and Union Territories</h2><p className="mb-9 mt-4 max-w-3xl leading-7 text-slate-600">Select a state or union territory to view local GPS tracker, vehicle tracking and fleet management information.</p><StateGrid states={remainingStates} /></div></section>
  <section id="delhi-ncr" className="scroll-mt-28 bg-slate-50 py-14"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold text-slate-900">Delhi NCR district and area guides</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">Review vehicle tracking requirements for Delhi districts, connected neighbourhoods and NCR journeys.</p><Link href="/gps-tracker/delhi" className="mt-6 inline-block rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white">Explore Delhi coverage</Link></div></section><div className="mx-auto max-w-7xl px-6 pb-12"><Link href="/gps-tracker-international" className="font-semibold text-blue-700 underline">Explore international fleet planning guides</Link></div><section className="bg-slate-50 py-16">
    <div className="mx-auto max-w-5xl px-6">
      <h2 className="text-3xl font-bold text-slate-900">Planning GPS tracking across India</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {faqs.map(({ question, answer }) => <article key={question} className="rounded-3xl border border-slate-200 bg-white p-7"><h3 className="text-xl font-bold text-slate-900">{question}</h3><p className="mt-4 leading-7 text-slate-600">{answer}</p></article>)}
      </div>
      <Link href="/contact" className="mt-8 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white">Discuss locations and fleet requirements</Link>
    </div>
  </section></main><Footer /></>;
}
