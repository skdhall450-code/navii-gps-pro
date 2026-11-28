import type { Metadata } from "next";
import Link from "next/link";
import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const url = "https://naviigps.com/gps-tracker/jammu-and-kashmir";
const title = "GPS Tracker in Jammu and Kashmir | Vehicle Tracking System";
const description = "Plan vehicle GPS tracking across Jammu and Kashmir's Jammu and Kashmir divisions with district-based fleet groups, route handovers and location-specific connectivity checks.";

const divisions = [
  {
    name: "Jammu Division",
    districts: ["Kathua", "Jammu", "Samba", "Udhampur", "Reasi", "Rajouri", "Poonch", "Doda", "Ramban", "Kishtwar"],
    planning: "Group vehicles by their actual depot or regular parking base, then record the districts and stops served by each route. A vehicle that visits another district should remain assigned to its real operating base, with the receiving team and handover recorded separately.",
  },
  {
    name: "Kashmir Division",
    districts: ["Anantnag", "Kulgam", "Pulwama", "Shopian", "Budgam", "Srinagar", "Ganderbal", "Bandipore", "Baramulla", "Kupwara"],
    planning: "Keep vehicle groups tied to their home base and dispatcher rather than treating every destination as a new base. For journeys connecting district centres, agree who reviews trip history, receives alerts and follows up when a location update becomes stale.",
  },
];

const faqs = [
  {
    question: "Why should Jammu and Kashmir fleet tracking be planned by division and district?",
    answer: "The official district directory lists 20 districts across the Jammu and Kashmir Union Territory, while the divisional administrations describe ten districts in each division. Grouping vehicles by their actual operating base helps dispatchers assign route ownership, handovers and reporting checks without confusing a destination with a vehicle's home location.",
  },
  {
    question: "Can one fleet dashboard manage vehicles in both divisions?",
    answer: "Vehicles in different districts can be organised in a shared fleet setup when the selected platform, account permissions and device compatibility support the required arrangement. Confirm vehicle groups, users, reports, alerts, SIMs and service scope before rollout, then test representative routes from each operating base.",
  },
  {
    question: "Does this guide confirm GPS installation or mobile-network availability in every district?",
    answer: "No. This is a planning guide, not confirmation of a local NAVII office, installation appointment, network coverage or continuous live reporting. Share the exact vehicle locations and routes so device compatibility, fitting arrangements, connectivity and charges can be checked for the proposed deployment.",
  },
  {
    question: "What information should I share for a Jammu and Kashmir fleet quotation?",
    answer: "Provide the vehicle list grouped by Jammu Division or Kashmir Division and by its actual district base. Include vehicle types, parking locations, operating routes, existing trackers and SIMs, required users, reports and alerts. Ask for hardware, platform, SIM, fitting, travel and renewal items to be identified separately.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: uniqueKeywords([
    "GPS tracker in Jammu and Kashmir",
    "vehicle tracking system Jammu and Kashmir",
    "GPS tracker Jammu",
    "GPS tracker Srinagar",
    "fleet management Jammu Kashmir",
    "commercial vehicle GPS Jammu",
    "GPS tracking Udhampur",
    "GPS tracker Kathua",
    "GPS tracking Baramulla",
    "GPS tracker Anantnag",
  ]),
  alternates: { canonical: url },
  openGraph: {
    title: "GPS Tracker in Jammu and Kashmir | NAVII GPS",
    description,
    url,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS vehicle tracking in Jammu and Kashmir" }],
  },
  twitter: { card: "summary_large_image", title: "GPS Tracker in Jammu and Kashmir | NAVII GPS", description, images: ["/og-image.jpg"] },
};

export default function JammuKashmirGpsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: title, description, inLanguage: "en-IN" },
      {
        "@type": "Service",
        name: "Vehicle GPS Tracking and Fleet Management in Jammu and Kashmir",
        serviceType: "Vehicle GPS Tracking and Fleet Management",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "AdministrativeArea", name: "Jammu and Kashmir" },
        url,
      },
      {
        "@type": "FAQPage",
        "@id": url + "#faq",
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
          { "@type": "ListItem", position: 3, name: "Jammu and Kashmir", item: url },
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
            <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">NORTH INDIA · UNION TERRITORY</span>
            <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">GPS Tracker in Jammu and Kashmir for Cars and Commercial Fleets</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">Plan vehicle tracking around the actual operating base across two administrative divisions. Start with the district, then confirm the route, device, SIM and handover requirements for each vehicle group.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-slate-950">Discuss Your Fleet</Link>
              <Link href="/gps-tracker-india" className="rounded-xl border border-white/30 px-7 py-4 font-semibold text-white">View India Coverage</Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Two administrative divisions, 20 district references</h2>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">The Government of Jammu and Kashmir district portal links the district administrations, while the Divisional Commissioner offices publish the two-division administrative structure. Use these district groups to organise vehicles by their real operating base; they are not claims of NAVII offices or local installation availability. See the <a className="font-semibold text-blue-700 underline" href="https://jammukashmir.s3waas.gov.in/" target="_blank" rel="noreferrer">official district portal</a>, the <a className="font-semibold text-blue-700 underline" href="https://jkgad.nic.in/En/Useful_Links.aspx" target="_blank" rel="noreferrer">General Administration Department district directory</a>, <a className="font-semibold text-blue-700 underline" href="https://divcomjammu.gov.in/" target="_blank" rel="noreferrer">Divisional Commissioner Jammu</a> and <a className="font-semibold text-blue-700 underline" href="https://divcomkashmir.jk.gov.in/" target="_blank" rel="noreferrer">Divisional Commissioner Kashmir</a>.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {divisions.map((division) => (
                <article key={division.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                  <h3 className="text-2xl font-bold text-slate-900">{division.name}</h3>
                  <p className="mt-4 leading-7 text-slate-700">{division.planning}</p>
                  <h4 className="mt-5 font-bold text-slate-900">Districts in this division</h4>
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm leading-6 text-slate-600">
                    {division.districts.map((district) => <li key={district}>{district}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Prepare a district-based tracking rollout</h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              <li className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">01 · INVENTORY</span><h3 className="mt-3 text-xl font-bold text-slate-900">Group vehicles by actual base</h3><p className="mt-3 leading-7 text-slate-600">Record each vehicle, its regular parking location, current tracker and SIM, operating districts and the person responsible for fitting access. Keep vehicles that only visit a district separate from vehicles based there.</p></li>
              <li className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">02 · VERIFY</span><h3 className="mt-3 text-xl font-bold text-slate-900">Test the real route and device</h3><p className="mt-3 leading-7 text-slate-600">Confirm device compatibility, SIM and network behaviour, update expectations and fitting arrangements for the actual vehicle. Test a representative journey from each operating base before expanding the fleet.</p></li>
              <li className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">03 · HAND OVER</span><h3 className="mt-3 text-xl font-bold text-slate-900">Assign alert and dispatch ownership</h3><p className="mt-3 leading-7 text-slate-600">Name who monitors each route leg, receives alerts and follows up when a location update is stale. Keep delivery confirmation separate from the map&apos;s last reported position.</p></li>
            </ol>
            <p className="mt-7 text-sm leading-6 text-slate-500">Device compatibility, connectivity, installation availability, service scope and pricing are confirmed for the actual vehicle and location. This guide does not promise a local office or continuous live reporting.</p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Jammu and Kashmir GPS tracking FAQs</h2>
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

        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">Connected northern fleet guides</h2>
            <p className="mt-3 leading-7 text-slate-600">For vehicles travelling beyond Jammu and Kashmir, compare the existing neighbouring and northern fleet guides and confirm route requirements for each operating location.</p>
            <nav aria-label="Related northern fleet guides" className="mt-5 flex flex-wrap gap-3">
              <Link href="/gps-tracker/punjab" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-blue-700">Punjab</Link>
              <Link href="/gps-tracker/himachal-pradesh" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-blue-700">Himachal Pradesh</Link>
              <Link href="/gps-tracker/chandigarh" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-blue-700">Chandigarh</Link>
              <Link href="/gps-tracker-india" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-blue-700">All India Guides</Link>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
