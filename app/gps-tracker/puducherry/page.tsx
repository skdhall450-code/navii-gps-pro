import type { Metadata } from "next";
import Link from "next/link";
import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const url = "https://naviigps.com/gps-tracker/puducherry";
const title = "GPS Tracker in Puducherry | Vehicle Tracking System";
const description = "Plan vehicle GPS tracking across Puducherry, Karaikal, Mahe and Yanam with separate operating-base, route handover and connectivity checks for each region.";

const regions = [
  {
    name: "Puducherry region",
    geography: "The largest east-coast region includes Puducherry town and 12 scattered areas interspersed with parts of Villupuram and Cuddalore districts of Tamil Nadu.",
    planning: "Group vehicles by their actual parking or dispatch base. For collections and deliveries that cross into Tamil Nadu, record the receiving team, route legs and vehicle handover separately instead of treating every destination as a Puducherry-based vehicle.",
  },
  {
    name: "Karaikal region",
    geography: "Karaikal is a separate east-coast region south of Puducherry, surrounded by Tamil Nadu.",
    planning: "Keep Karaikal-based vehicles in their own location list. For a route that also serves Puducherry or another Tamil Nadu destination, confirm the planned stops, dispatch ownership and device reporting expectations for the complete journey.",
  },
  {
    name: "Mahe region",
    geography: "Mahe is on the Malabar coast and is geographically surrounded by Kerala, away from the east-coast Puducherry and Karaikal regions.",
    planning: "Treat a Mahe vehicle base as a distinct operating location. Confirm the chosen device, SIM and network behaviour for the actual Kerala-side routes rather than assuming the same coverage or fitting arrangement as the east-coast regions.",
  },
  {
    name: "Yanam region",
    geography: "Yanam is an east-coast enclave adjoining the Andhra Pradesh region.",
    planning: "Identify whether a vehicle is based in Yanam or only visits it. For movements involving Andhra Pradesh, assign each route leg and receiving contact, and verify the device's update behaviour on a representative trip.",
  },
];

const faqs = [
  {
    question: "Why should Puducherry GPS tracking be planned by region?",
    answer: "The Union Territory has four geographically separate regions: Puducherry, Karaikal, Mahe and Yanam. They are surrounded by different parts of Tamil Nadu, Kerala and Andhra Pradesh, so the vehicle's actual base and route matter when checking fitting arrangements, SIM connectivity and handovers.",
  },
  {
    question: "Can one fleet dashboard manage vehicles in all four regions?",
    answer: "A fleet can be organised by vehicle and operating location in a shared tracking setup, subject to the selected platform, account configuration and device compatibility. Confirm the required users, reporting and alert rules, SIM arrangements and service scope for each vehicle group before rollout.",
  },
  {
    question: "Does this guide confirm GPS installation or network availability in every region?",
    answer: "No. This is a planning guide, not confirmation of a local office, installation appointment, network coverage or continuous live reporting. Share the exact vehicle locations and routes with NAVII GPS so device compatibility, fitting arrangements, connectivity and charges can be checked individually.",
  },
  {
    question: "What information should I share for a multi-region fleet quotation?",
    answer: "Provide the vehicle list grouped by Puducherry, Karaikal, Mahe and Yanam, along with vehicle types, parking locations, operating routes, existing devices and SIMs, required users and alert needs. Ask for hardware, platform, SIM, fitting, travel and renewal items to be identified separately.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: uniqueKeywords([
    "GPS tracker in Puducherry",
    "vehicle tracking system Puducherry",
    "GPS tracker Karaikal",
    "GPS tracking Mahe Puducherry",
    "GPS tracker Yanam",
    "fleet management Puducherry",
    "commercial vehicle GPS Puducherry",
    "Pondicherry vehicle tracking",
    "GPS tracking across Puducherry regions",
  ]),
  alternates: { canonical: url },
  openGraph: {
    title: "GPS Tracker in Puducherry | NAVII GPS",
    description,
    url,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS vehicle tracking in Puducherry" }],
  },
  twitter: { card: "summary_large_image", title: "GPS Tracker in Puducherry | NAVII GPS", description, images: ["/og-image.jpg"] },
};

export default function PuducherryGpsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: title, description, inLanguage: "en-IN" },
      {
        "@type": "Service",
        name: "Vehicle GPS Tracking and Fleet Management in Puducherry",
        serviceType: "Vehicle GPS Tracking and Fleet Management",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "AdministrativeArea", name: "Puducherry" },
        url,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com" },
          { "@type": "ListItem", position: 2, name: "GPS Tracker India", item: "https://naviigps.com/gps-tracker-india" },
          { "@type": "ListItem", position: 3, name: "Puducherry", item: url },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-20 text-white md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">SOUTH INDIA · UNION TERRITORY</span>
            <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">GPS Tracker in Puducherry for Cars and Commercial Fleets</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">Plan vehicle tracking around four separate operating regions. Start with where each vehicle is based, then confirm its route, device, SIM and handover requirements.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-slate-950">Discuss Your Fleet</Link>
              <Link href="/gps-tracker-india" className="rounded-xl border border-white/30 px-7 py-4 font-semibold text-white">View India Coverage</Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">One Union Territory, four separate operating regions</h2>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">Official Government of Puducherry information describes Puducherry, Karaikal, Mahe and Yanam as geographically separated regions. A fleet plan should therefore distinguish the vehicle&apos;s home base from the places it visits. See the <a className="font-semibold text-blue-700 underline" href="https://www.py.gov.in/about-puducherry" target="_blank" rel="noreferrer">official Puducherry overview</a> and <a className="font-semibold text-blue-700 underline" href="https://www.py.gov.in/districts" target="_blank" rel="noreferrer">district and administrative-unit directory</a>, plus the <a className="font-semibold text-blue-700 underline" href="https://drda.py.gov.in/district-profile" target="_blank" rel="noreferrer">Government district profile</a> for the region boundaries.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {regions.map((region, index) => (
                <article key={region.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                  <p className="text-sm font-bold tracking-wide text-cyan-700">REGION {index + 1}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{region.name}</h3>
                  <p className="mt-4 leading-7 text-slate-700">{region.geography}</p>
                  <h4 className="mt-5 font-bold text-slate-900">Fleet planning focus</h4>
                  <p className="mt-2 leading-7 text-slate-600">{region.planning}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Prepare a multi-region tracking rollout</h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              <li className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">01 · INVENTORY</span><h3 className="mt-3 text-xl font-bold text-slate-900">Group vehicles by actual base</h3><p className="mt-3 leading-7 text-slate-600">Record each vehicle, parking location, current tracker and SIM, operating routes and local fitting contact. Separate vehicles based in a region from vehicles that only visit it.</p></li>
              <li className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">02 · VERIFY</span><h3 className="mt-3 text-xl font-bold text-slate-900">Check each route and device</h3><p className="mt-3 leading-7 text-slate-600">Confirm device compatibility, SIM/network behaviour, update expectations and fitting arrangements for the actual vehicle and route. Test a representative journey before expanding.</p></li>
              <li className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">03 · HAND OVER</span><h3 className="mt-3 text-xl font-bold text-slate-900">Assign dispatch ownership</h3><p className="mt-3 leading-7 text-slate-600">Name who monitors each route leg, receives alerts and follows up when a location update is stale. Keep delivery confirmation separate from the map&apos;s last reported position.</p></li>
            </ol>
            <p className="mt-7 text-sm leading-6 text-slate-500">Device compatibility, connectivity, installation availability, service scope and pricing are confirmed for the actual vehicle and location. A guide does not promise a local office or continuous live reporting.</p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Puducherry GPS tracking FAQs</h2>
            <div className="mt-8 space-y-4">
              {faqs.map(({ question, answer }) => (
                <details key={question} className="rounded-xl border border-slate-200 p-5">
                  <summary className="cursor-pointer font-semibold text-slate-900">{question}</summary>
                  <p className="mt-3 leading-7 text-slate-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
