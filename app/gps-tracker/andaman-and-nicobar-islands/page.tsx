import type { Metadata } from "next";
import Link from "next/link";
import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const url = "https://naviigps.com/gps-tracker/andaman-and-nicobar-islands";
const title = "GPS Tracker in Andaman and Nicobar Islands | NAVII GPS";
const description = "Plan vehicle tracking across South Andaman, North & Middle Andaman and Nicobar with island-specific route, ferry handover, AIS-140 and device-connectivity checks.";

const districts = [
  {
    name: "South Andaman",
    headquarters: "Sri Vijaya Puram",
    operatingAreas: "Sri Vijaya Puram, Ferrargunj and Little Andaman",
    planning: "Group vehicles by their actual parking and dispatch base. For journeys to Little Andaman or other separated locations, record the sea-transfer leg, receiving contact and the point at which the vehicle is expected to report again.",
  },
  {
    name: "North & Middle Andaman",
    headquarters: "Mayabunder",
    operatingAreas: "Diglipur, Mayabunder and Rangat",
    planning: "Separate vehicles based in North Andaman, Mayabunder and Middle Andaman. For long island road journeys, test the tracker and SIM on the representative route and define how dispatch handles delayed or stale updates.",
  },
  {
    name: "Nicobar",
    headquarters: "Car Nicobar",
    operatingAreas: "Car Nicobar, Nancowry group and Campbell Bay",
    planning: "Do not treat Nicobar as one continuous road fleet. Official transport authority records describe separate islands connected by maritime transport and island-specific commercial vehicle permits. Record the exact island, vehicle parking location, permit scope and sea handover before planning tracking.",
  },
];

const faqs = [
  {
    question: "How many districts are in Andaman and Nicobar Islands?",
    answer: "The Andaman & Nicobar Administration lists three districts: South Andaman, North & Middle Andaman, and Nicobar. The vehicle's actual island and operating base still matter because district boundaries do not mean every island is connected by road.",
  },
  {
    question: "Can a GPS tracker follow vehicles across all the islands?",
    answer: "A platform can organise compatible devices into fleet groups, but a map cannot make a vehicle travel between islands or guarantee uninterrupted data. Confirm the vehicle's actual island, permitted route, ferry or vessel handover, device power and SIM/network behaviour. A last reported location should not be treated as proof of arrival after a sea transfer.",
  },
  {
    question: "Is AIS-140 GPS/VLTD required for public service vehicles?",
    answer: "The Andaman & Nicobar State Transport Department's VLT & EAS portal describes its AIS-140 certified solution and states the applicable public-service-vehicle fitment requirements, including vehicles registered on or after 1 January 2019. Confirm the vehicle category, current rule, device approval and local vendor enlistment directly with the Transport Department before purchase or installation. This page does not claim that NAVII GPS or any particular device is enlisted or approved by the UT.",
  },
  {
    question: "Does NAVII GPS guarantee live tracking or mobile coverage on every island?",
    answer: "No. This guide does not promise continuous mobile coverage, satellite visibility, installation availability or uninterrupted reporting. Actual updates depend on the tracker, power, sky visibility, SIM/network availability, local conditions and any sea-transfer period. Test the actual device and route before relying on alerts.",
  },
  {
    question: "What should I share for a fleet quotation?",
    answer: "Share the vehicle list, registration category, exact island and parking base, planned road routes, sea-transfer legs, existing tracker and SIM details, required reports and alerts. For public service vehicles, include the applicable AIS-140/VLTD status and any Transport Department approval or enlistment requirements. Ask for hardware, platform, SIM, fitting, travel and renewal charges separately.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: uniqueKeywords([
    "GPS tracker in Andaman and Nicobar Islands",
    "vehicle tracking system Andaman",
    "GPS tracker Sri Vijaya Puram",
    "GPS tracking Port Blair",
    "GPS tracker South Andaman",
    "GPS tracker North and Middle Andaman",
    "GPS tracking Nicobar",
    "AIS 140 VLTD Andaman",
    "fleet management Andaman Islands",
    "commercial vehicle GPS Nicobar",
  ]),
  alternates: { canonical: url },
  openGraph: {
    title: "GPS Tracker in Andaman and Nicobar Islands | NAVII GPS",
    description,
    url,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS vehicle tracking in Andaman and Nicobar Islands" }],
  },
  twitter: { card: "summary_large_image", title: "GPS Tracker in Andaman and Nicobar Islands | NAVII GPS", description, images: ["/og-image.jpg"] },
};

export default function AndamanNicobarGpsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: title, description, inLanguage: "en-IN" },
      {
        "@type": "Service",
        name: "Vehicle GPS Tracking and Fleet Management in Andaman and Nicobar Islands",
        serviceType: "Vehicle GPS Tracking and Fleet Management",
        provider: { "@id": "https://naviigps.com/#organization" },
        areaServed: { "@type": "AdministrativeArea", name: "Andaman and Nicobar Islands" },
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
          { "@type": "ListItem", position: 3, name: "Andaman and Nicobar Islands", item: url },
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
            <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">ISLANDS · UNION TERRITORY</span>
            <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">GPS Tracker in Andaman and Nicobar Islands for Cars and Commercial Fleets</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">Plan tracking around the vehicle's actual island, parking base and permitted route. Keep road journeys, ferry transfers, device reporting and dispatch handovers distinct.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-slate-950">Discuss Your Fleet</Link>
              <Link href="/gps-tracker-india" className="rounded-xl border border-white/30 px-7 py-4 font-semibold text-white">View India Coverage</Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Three districts, two very different transport realities</h2>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">The UT Administration lists South Andaman, North &amp; Middle Andaman and Nicobar as its three districts. The State Transport Authority explains that road infrastructure connects the three Andaman districts, while Nicobar consists of separate islands connected by maritime transport, with permits handled island by island. See the <a className="font-semibold text-blue-700 underline" href="https://andamannicobar.gov.in/" target="_blank" rel="noreferrer">UT Administration</a>, <a className="font-semibold text-blue-700 underline" href="https://transport.and.nic.in/announce/STA04-06-2025.pdf" target="_blank" rel="noreferrer">State Transport Authority minutes</a> and <a className="font-semibold text-blue-700 underline" href="https://nicobars.andaman.nic.in/" target="_blank" rel="noreferrer">Nicobar District Administration</a>.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {districts.map((district, index) => (
                <article key={district.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                  <p className="text-sm font-bold tracking-wide text-cyan-700">DISTRICT {index + 1}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{district.name}</h3>
                  <p className="mt-3 text-sm font-semibold text-slate-700">Headquarters: {district.headquarters}</p>
                  <p className="mt-3 leading-7 text-slate-700">Administrative areas: {district.operatingAreas}</p>
                  <h4 className="mt-5 font-bold text-slate-900">Fleet planning focus</h4>
                  <p className="mt-2 leading-7 text-slate-600">{district.planning}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Plan the road route, sea transfer and device status separately</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">01 · INVENTORY</span><h3 className="mt-3 text-xl font-bold text-slate-900">Record the exact island base</h3><p className="mt-3 leading-7 text-slate-600">Capture registration category, vehicle parking location, current tracker, SIM, operating island, road routes and any island-specific permit details.</p></article>
              <article className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">02 · VERIFY</span><h3 className="mt-3 text-xl font-bold text-slate-900">Test route and AIS-140 status</h3><p className="mt-3 leading-7 text-slate-600">Check device compatibility, SIM behaviour, power, expected reporting and current VLTD approval or enlistment requirements with the Transport Department where applicable.</p></article>
              <article className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-sm font-bold text-cyan-700">03 · HAND OVER</span><h3 className="mt-3 text-xl font-bold text-slate-900">Separate ferry and road legs</h3><p className="mt-3 leading-7 text-slate-600">Assign a dispatcher and receiving contact for each leg. Record vessel departure and arrival independently; do not interpret a stale map position as proof of delivery.</p></article>
            </div>
            <p className="mt-7 text-sm leading-6 text-slate-500">The UT operates an AIS-140 Vehicle Location Tracking &amp; Emergency Alert System and a device enlistment process. See the <a className="font-semibold text-blue-700 underline" href="https://vlts.and.nic.in/" target="_blank" rel="noreferrer">official VLT &amp; EAS portal</a>. NAVII GPS does not claim UT vendor enlistment, AIS-140 approval or installation availability through this informational page. Confirm applicable rules and approved suppliers with the Transport Department.</p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Andaman and Nicobar GPS tracking FAQs</h2>
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
