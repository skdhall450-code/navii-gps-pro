import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { TrackingSolutionLinks } from "@/components/seo/TrackingSolutionLinks";
import {
  getUttarPradeshCitiesForDistrict,
  getUttarPradeshCityPath,
  type UttarPradeshCitySeo,
} from "@/lib/seo/uttarPradeshCities";

export function UttarPradeshCityGpsPage({ city }: { city: UttarPradeshCitySeo }) {
  const districtPath = `/gps-tracker/uttar-pradesh/${city.districtSlug}`;
  const url = `https://naviigps.com${getUttarPradeshCityPath(city)}`;
  const siblings = getUttarPradeshCitiesForDistrict(city.districtSlug).filter((entry) => entry.slug !== city.slug);
  const faqs = [
    {
      question: `What should I test before installing GPS trackers in ${city.name}?`,
      answer: `Start with ${city.focus}. ${city.routeChecks[0]} Confirm device compatibility, reporting frequency and the person responsible for following up alerts.`,
    },
    {
      question: `Can the same fleet account cover ${city.name} and other UP locations?`,
      answer: `Discuss vehicle groups and authorised users for ${city.name}, ${city.nearbyLocations.slice(0, 2).join(" and ")} and your onward routes. Availability of reporting depends on compatible devices, the selected platform and network connectivity along the actual journey.`,
    },
    {
      question: `What does a GPS installation quote for ${city.name} include?`,
      answer: "Ask for separate device, installation, SIM/data and platform subscription costs, plus any optional sensors. Share the vehicle type, quantity and operating routes. Installation arrangements, ongoing support and the chosen features are confirmed before booking.",
    },
  ];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "India", path: "/gps-tracker-india" },
    { name: "Uttar Pradesh", path: "/gps-tracker/uttar-pradesh" },
    { name: `${city.districtName} District`, path: districtPath },
    { name: city.name, path: getUttarPradeshCityPath(city) },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url,
        name: `GPS Tracker in ${city.name}, ${city.districtName} | NAVII GPS`,
        description: city.localContext,
        isPartOf: { "@id": "https://naviigps.com/#website" }, inLanguage: "en-IN",
      },
      {
        "@type": "Service", "@id": `${url}#service`, url,
        name: `Vehicle GPS Tracking in ${city.name}, ${city.districtName}`,
        serviceType: "Vehicle GPS Tracking and Fleet Management",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: {
          "@type": "Place", name: city.name,
          containedInPlace: {
            "@type": "AdministrativeArea", name: `${city.districtName} District`,
            containedInPlace: { "@type": "State", name: "Uttar Pradesh" },
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem", position: index + 1, name: crumb.name, item: `https://naviigps.com${crumb.path}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
      },
    ],
  };

  return <><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-cyan-200">
            {crumbs.map((crumb, index) => <li key={crumb.path} className="flex items-center gap-3">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === crumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.path} className="hover:underline">{crumb.name}</Link>}
            </li>)}
          </ol>
        </nav>
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200"><MapPin size={17} aria-hidden="true" />{city.districtName} District · Uttar Pradesh</p>
        <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">GPS Tracker in {city.name}, {city.districtName}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">Plan vehicle tracking for {city.focus}. Compare suitable devices, fleet software and installation requirements for your routes in {city.name}.</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-6 py-4 font-semibold text-slate-950 hover:bg-cyan-200">Discuss Your Fleet <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link href="/products" className="rounded-xl border border-white/30 px-6 py-4 font-semibold hover:bg-white/10">Compare GPS Devices</Link>
        </div>
      </div>
    </section>

    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Plan the operating workflow</p>
          <h2 className="mt-4 text-3xl font-bold capitalize text-slate-900">{city.focus}</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">{city.localContext}</p>
          <p className="mt-5 leading-7 text-slate-600">These are planning examples for fleet operators. Share your actual stops, vehicle types and reporting needs so the proposed setup can be checked against your operation.</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Relevant fleet uses">
            {city.sectors.map((sector) => <li key={sector} className="rounded-full bg-blue-50 px-4 py-2 text-sm capitalize text-blue-800">{sector}</li>)}
          </ul>
        </div>
        <div className="rounded-3xl bg-[#06142E] p-7 text-white md:p-9">
          <h2 className="text-2xl font-bold">Before your first trip in {city.name}</h2>
          <ol className="mt-7 space-y-6">
            {city.routeChecks.map((check) => <li key={check} className="flex gap-3 leading-7 text-slate-200"><CheckCircle2 size={22} className="mt-1 shrink-0 text-cyan-300" aria-hidden="true" /><span>{check}</span></li>)}
          </ol>
        </div>
      </div>
    </section>

    <TrackingSolutionLinks location={city.name} sectors={city.sectors} />

    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-slate-900">Choose the device and support together</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { title: "Vehicle and installation", text: "Confirm vehicle voltage, wiring access and the proposed mounting position. Ask the installer to demonstrate location reporting and supported ignition or movement alerts on the actual vehicle." },
            { title: "Connectivity and software", text: "Test the proposed SIM on the full operating route. Confirm reporting intervals, trip-history retention, user permissions and what the device does when it cannot upload a location immediately." },
            { title: "Quote and ongoing support", text: "Request a written breakdown of hardware, fitting, connectivity and recurring platform charges. Agree support contacts and renewal arrangements before rolling out to the rest of the fleet." },
          ].map((item) => <article key={item.title} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-xl font-bold text-slate-900">{item.title}</h3><p className="mt-4 leading-7 text-slate-600">{item.text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-slate-900">Explore {city.districtName} district</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">District planning also includes {city.nearbyLocations.join(", ")}. Confirm the full operating route and installation arrangements when requesting a quote.</p>
        <div className="mt-7 flex flex-wrap gap-4">
          <Link href={districtPath} className="rounded-xl border border-blue-200 bg-white px-5 py-3 font-semibold text-blue-800 hover:border-blue-500">{city.districtName} district guide</Link>
          {siblings.map((entry) => <Link key={entry.slug} href={getUttarPradeshCityPath(entry)} className="rounded-xl border border-blue-200 bg-white px-5 py-3 font-semibold text-blue-800 hover:border-blue-500">GPS tracking in {entry.name}</Link>)}
          <Link href="/gps-tracker/uttar-pradesh" className="rounded-xl border border-blue-200 bg-white px-5 py-3 font-semibold text-blue-800 hover:border-blue-500">All Uttar Pradesh districts</Link>
        </div>
        <p className="mt-6 text-sm text-slate-600">Location reference: <a href={city.sourceUrl} className="text-blue-700 underline">{city.districtName} district administration</a>. Installation availability is confirmed separately for your vehicle and location.</p>
      </div>
    </section>

    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-bold text-slate-900">GPS tracking in {city.name}: questions</h2>
        <div className="mt-8 space-y-4">{faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900">{faq.question}</h3><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p></article>)}</div>
      </div>
    </section>
  </main><Footer /></>;
}
