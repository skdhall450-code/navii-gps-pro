import type { Metadata } from "next";
import Link from "next/link";
import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const url = "https://naviigps.com/gps-tracker/ladakh";
const title = "GPS Tracker in Ladakh | Vehicle Tracking System";
const description = "Plan fleet GPS tracking across Ladakh's eight notified districts with vehicle-base records, route handovers, device checks and location-specific connectivity validation.";

const districts = [
  { name: "Leh", headquarters: "Leh", origin: "Existing Leh district", planning: "Record the vehicle's regular base and the actual destinations it serves. Separate a town-based vehicle from one that only visits a remote route, and confirm update expectations for the complete journey." },
  { name: "Nubra", headquarters: "Diskit", origin: "Created from the former Leh district", planning: "Keep Nubra-based vehicles in a distinct fleet group. Verify the device and SIM on the actual route before relying on scheduled reporting or alert delivery." },
  { name: "Changthang", headquarters: "Nyoma", origin: "Created from the former Leh district", planning: "Record the real operating base, route plan and responsible dispatcher. Do not assume continuous mobile data or live location updates in remote stretches; agree how stale reports are reviewed." },
  { name: "Sham", headquarters: "Khaltse", origin: "Created from the former Leh district", planning: "Separate vehicles based in Sham from vehicles passing through. Test representative routes and document the last successful device report and escalation contact." },
  { name: "Kargil", headquarters: "Kargil", origin: "Existing Kargil district, redefined after new districts", planning: "Keep Kargil-based fleet records distinct from vehicles assigned to the newly notified neighbouring districts. Confirm each vehicle's registration, tracker and SIM before grouping." },
  { name: "Drass", headquarters: "Drass-Ranbirpura", origin: "Created from the former Kargil district", planning: "For journeys involving Drass, agree route handovers and check reporting on the vehicle's real operating schedule. Do not treat a map's last position as proof that a vehicle has reached its destination." },
  { name: "Zanskar", headquarters: "Padum", origin: "Created from the former Kargil district", planning: "Use a separate Zanskar operating group where it matches the vehicle's actual base. Verify the chosen tracker, power supply and network behaviour on a representative trip before rollout." },
  { name: "Sankoo", headquarters: "Sankoo", origin: "Notified in October 2026 from the former Kargil district", planning: "Use the current notified district boundary for fleet records. The district notification lists Sankoo, GM Pore, TSG and Taisuru tehsils; confirm the vehicle's exact base and route with the local operator." },
];

const faqs = [
  {
    question: "How many districts are currently notified in Ladakh?",
    answer: "The Ladakh Administration's April 2026 notification created five districts—Sham, Nubra, Changthang, Zanskar and Drass—taking the total to seven. A further notification dated 16 October 2026 created Sankoo district from the Kargil district area. This guide therefore uses eight notified district names and links to the official notifications.",
  },
  {
    question: "Can one fleet dashboard manage vehicles across all Ladakh districts?",
    answer: "Vehicles can be organised into district or operating-base groups when the selected platform, account permissions and device compatibility support the arrangement. Confirm the vehicle list, users, reporting needs, SIMs and alert rules, then test representative routes before a wider rollout.",
  },
  {
    question: "Does NAVII GPS guarantee continuous live tracking or mobile coverage on every Ladakh route?",
    answer: "No. This page is a fleet-planning guide, not a network-coverage map or a guarantee of uninterrupted reporting. Actual updates depend on the installed device, power, satellite visibility, SIM/network availability and route conditions. Verify the exact vehicle and route before relying on alerts or live updates.",
  },
  {
    question: "What should I share to get a Ladakh fleet quotation?",
    answer: "Share the vehicle list, actual operating district and base, planned routes, vehicle types, existing trackers and SIMs, required users, reports and alerts. Ask for hardware, platform, SIM, fitting, travel and renewal costs to be stated separately and confirmed for the actual deployment.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: uniqueKeywords([
    "GPS tracker in Ladakh",
    "vehicle tracking system Ladakh",
    "GPS tracker Leh",
    "GPS tracker Kargil",
    "GPS tracking Nubra",
    "GPS tracker Zanskar",
    "GPS tracker Drass",
    "fleet management Ladakh",
    "commercial vehicle GPS Ladakh",
    "GPS tracking Sankoo",
  ]),
  alternates: { canonical: url },
  openGraph: {
    title: "GPS Tracker in Ladakh | NAVII GPS",
    description,
    url,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS vehicle tracking in Ladakh" }],
  },
  twitter: { card: "summary_large_image", title: "GPS Tracker in Ladakh | NAVII GPS", description, images: ["/og-image.jpg"] },
};

export default function LadakhGpsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: title, description, inLanguage: "en-IN" },
      {
        "@type": "Service",
        name: "Vehicle GPS Tracking and Fleet Management in Ladakh",
        serviceType: "Vehicle GPS Tracking and Fleet Management",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "AdministrativeArea", name: "Ladakh" },
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
          { "@type": "ListItem", position: 3, name: "Ladakh", item: url },
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
            <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">GPS Tracker in Ladakh for Cars and Commercial Fleets</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">Plan fleet tracking around the vehicle's actual operating base across eight notified districts. Verify the device, power, SIM and route reporting before depending on live updates or alerts.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-slate-950">Discuss Your Fleet</Link>
              <Link href="/gps-tracker-india" className="rounded-xl border border-white/30 px-7 py-4 font-semibold text-white">View India Coverage</Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Eight notified districts, one practical fleet plan</h2>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">The UT Administration notified five new districts in April 2026 and later notified Sankoo district in October 2026. The district list and headquarters below follow those notifications. See the <a className="font-semibold text-blue-700 underline" href="https://ladakh.gov.in/ladakh-administration-notifies-creation-of-sankoo-as-new-district-of-ut-ladakh/" target="_blank" rel="noreferrer">Sankoo district notification summary</a>, the <a className="font-semibold text-blue-700 underline" href="https://ladakh.gov.in/document-category/revenue/" target="_blank" rel="noreferrer">Revenue Department notification archive</a> and the <a className="font-semibold text-blue-700 underline" href="https://lokniwas.ladakh.gov.in/press-details/242" target="_blank" rel="noreferrer">Lieutenant Governor's Secretariat district announcement</a>.</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {districts.map((district) => (
                <article key={district.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-bold tracking-wide text-cyan-700">{district.origin}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{district.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-500">Headquarters: {district.headquarters}</p>
                  <p className="mt-4 leading-7 text-slate-600">{district.planning}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Check the real route before rollout</h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              <li className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">01 · INVENTORY</span><h3 className="mt-3 text-xl font-bold text-slate-900">Record vehicle base and equipment</h3><p className="mt-3 leading-7 text-slate-600">List the vehicle, regular parking location, current tracker, SIM, power arrangement and the person responsible for access. Do not infer a vehicle's base from a single map position.</p></li>
              <li className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">02 · TEST</span><h3 className="mt-3 text-xl font-bold text-slate-900">Validate a representative journey</h3><p className="mt-3 leading-7 text-slate-600">Check satellite visibility, power stability, SIM/network behaviour, update intervals and device compatibility on the actual route. Record gaps rather than assuming a missing report means a vehicle has stopped.</p></li>
              <li className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">03 · HAND OVER</span><h3 className="mt-3 text-xl font-bold text-slate-900">Assign alert follow-up</h3><p className="mt-3 leading-7 text-slate-600">Name who monitors each route, receives alerts and contacts the driver when a report is stale. Keep a confirmed arrival or delivery record separate from the last GPS position.</p></li>
            </ol>
            <p className="mt-7 text-sm leading-6 text-slate-500">Device compatibility, connectivity, installation availability, service scope and pricing are confirmed for the actual vehicle and location. This guide does not promise a local office or continuous live reporting.</p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Ladakh GPS tracking FAQs</h2>
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
            <nav aria-label="Related northern fleet guides" className="mt-5 flex flex-wrap gap-3">
              <Link href="/gps-tracker/jammu-and-kashmir" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-blue-700">Jammu and Kashmir</Link>
              <Link href="/gps-tracker/himachal-pradesh" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-blue-700">Himachal Pradesh</Link>
              <Link href="/gps-tracker/punjab" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-blue-700">Punjab</Link>
              <Link href="/gps-tracker-india" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-blue-700">All India Guides</Link>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
