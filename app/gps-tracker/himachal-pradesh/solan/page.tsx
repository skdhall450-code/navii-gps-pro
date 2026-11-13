import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const guide = {
  "name": "Solan",
  "title": "GPS Tracker in Solan | Local Delivery & Hill Journey Planning",
  "description": "Plan GPS tracking in Solan for produce-market deliveries and hill journeys. Match lot receipts to vehicle visits, review rejected loads and check reporting gaps.",
  "intro": "Solan is the district headquarters. This guide focuses on vehicles working in Solan town and making onward journeys, with a practical plan for reviewing stops, location timestamps and the return trip.",
  "source": "https://hpsolan.nic.in/about-district/",
  "cases": [
    [
      "Town visits and onward journeys",
      "List local Solan customer visits separately from an onward supply or passenger journey. Record the planned stop order and return destination. Compare actual trip history with the operating plan, and confirm completed work through the service record rather than a passing geofence event."
    ],
    [
      "A fresh location versus an old marker",
      "Check the position timestamp before interpreting a vehicle as stopped. A stale marker can reflect a reporting gap. Agree who contacts the driver when an update is overdue and keep a separate communication plan for routes where mobile updates are unavailable."
    ],
    [
      "Outward and return route review",
      "Test a complete working route, including recurring stops and the final return to base. If journeys continue toward Shimla or Parwanoo, include those legs in the trial. Confirm whether the chosen device stores records during gaps and verify what appears in trip history after reconnection."
    ],
    [
      "Installation and handover checks",
      "Provide the installer with the vehicle model, power details and a suitable fitting location. After installation, verify the vehicle-to-device assignment, authorised account access and supported alerts. Keep the agreed reporting settings and renewal responsibilities with the fleet handover record."
    ],
    [
      "Give each Solan market load a lot reference",
      "The Himachal Pradesh State Agricultural Marketing Board lists the Solan principal market yard and produce including tomatoes and peas. For a delivery there, record the yard, receiving trader, lot reference, agreed quantity unit and unloading contact. Confirm the current receiving arrangement before dispatch. Keep the vehicle arrival separate from unloading and acceptance; a market geofence cannot identify which trader received a particular lot."
    ],
    [
      "Record partial acceptance before the onward journey",
      "Where a receiver accepts only part of a produce load in Solan, keep the accepted quantity, rejected quantity and agreed destination for the remaining goods under the lot reference. Preserve the receipt and any condition note alongside the trip review. Vehicle GPS does not weigh produce, grade it or confirm temperature. Test a journey with a partial handover and onward leg, using supported trip records to explain movement while the receiving record explains what happened to the goods."
    ]
  ],
  "faqs": [
    [
      "Will a GPS tracker update continuously on journeys beyond Solan?",
      "Fresh reporting depends on device operation, installation, satellite reception and mobile connectivity. Test the actual route and inspect timestamps; continuous updates cannot be assumed for every location."
    ],
    [
      "Does this guide cover Solan town or the whole district?",
      "This page focuses on Solan town operations and connected journeys. Use the Himachal Pradesh guide for broader district planning and the Baddi guide for factory dispatch workflows in the BBN area."
    ],
    [
      "What should a Solan installation quotation include?",
      "Ask NAVII GPS to confirm compatible hardware, SIM plan, platform subscription, fitting arrangements, accessories and renewal costs for your actual vehicle location. Confirm the appointment and included features before booking."
    ],
    [
      "Can a Solan market GPS stop prove that a produce lot was accepted?",
      "No. Match the stop with the named receiver, lot reference and receiving receipt. Arrival, unloading and accepted quantity are separate events; vehicle location alone cannot establish produce weight or quality."
    ],
    [
      "How should a partially rejected Solan delivery be recorded?",
      "Keep accepted and rejected quantities in the agreed unit, record the receiver acknowledgement and confirm where the remaining goods should go. Review the onward vehicle trip against that instruction rather than treating departure from the market as complete acceptance."
    ]
  ]
};
const url = "https://naviigps.com/gps-tracker/himachal-pradesh/solan";
export const metadata: Metadata = {
  title: guide.title, description: guide.description,
  alternates: { canonical: url },
  openGraph: { title: guide.title, description: guide.description, url, type: "website", images: ["/og-image.jpg"] },
  twitter: { card: "summary_large_image", title: guide.title, description: guide.description, images: ["/og-image.jpg"] },
};
const schema = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebPage", "@id": `${url}#webpage`, url, name: guide.title, description: guide.description, inLanguage: "en-IN", isPartOf: { "@id": "https://naviigps.com/#website" } },
  { "@type": "Service", url, name: `Vehicle GPS tracking in ${guide.name}`, serviceType: "Vehicle tracking and fleet management", provider: { "@id": "https://naviigps.com/#organization" }, areaServed: { "@type": "City", name: guide.name, containedInPlace: { "@type": "State", name: "Himachal Pradesh" } } },
  { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" }, { "@type": "ListItem", position: 2, name: "Himachal Pradesh", item: "https://naviigps.com/gps-tracker/himachal-pradesh" }, { "@type": "ListItem", position: 3, name: guide.name, item: url }] },
  { "@type": "FAQPage", mainEntity: guide.faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
] };
export default function Page() {
  return <><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6">
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap gap-3 text-sm text-cyan-200"><Link href="/">Home</Link><span>/</span><Link href="/gps-tracker/himachal-pradesh">Himachal Pradesh</Link><span>/ {guide.name}</span></nav>
      <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">{guide.title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">{guide.intro}</p>
      <Link href="/contact" className="mt-8 inline-block rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950">Discuss your {guide.name} fleet</Link>
    </div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold text-slate-900">Plan your {guide.name} vehicle operations</h2><div className="mt-8 grid gap-6 md:grid-cols-2">{guide.cases.map(([heading, text]) => <article key={heading} className="rounded-2xl border border-slate-200 bg-slate-50 p-7"><h3 className="text-xl font-bold text-slate-900">{heading}</h3><p className="mt-4 leading-7 text-slate-600">{text}</p></article>)}</div><p className="mt-6 text-sm text-slate-500">Local geography reference: <a href={guide.source} className="underline">Solan district administration</a>. Additional planning reference: <a href="https://hpsamb.hp.gov.in/solan_market" className="underline">Himachal Pradesh State Agricultural Marketing Board: Solan market yard</a>.</p></div></section>
    <section className="bg-[#06142E] py-16 text-white"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold">Compare the setup before booking</h2><p className="mt-5 max-w-3xl leading-8 text-slate-300">Share your fleet size, vehicle models, regular stops and fitting location with the NAVII GPS team in Dera Bassi. Confirm installation arrangements and complete costs for your actual location.</p><div className="mt-7 flex flex-wrap gap-6 text-cyan-200"><Link className="underline" href="/products">Compare GPS devices</Link><Link className="underline" href="/software">Fleet software</Link><Link className="underline" href="/gps-tracker/himachal-pradesh">Himachal Pradesh planning</Link><Link className="underline" href="/gps-tracker/himachal-pradesh/shimla">Shimla terminal and city pickups</Link><Link className="underline" href="/gps-tracker/himachal-pradesh/baddi">Baddi tracking guide</Link><Link className="underline" href="/gps-tracker/chandigarh">Chandigarh routes</Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-bold text-slate-900">{guide.name} GPS tracker questions</h2><div className="mt-8 space-y-5">{guide.faqs.map(([question, answer]) => <article key={question} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900">{question}</h3><p className="mt-3 leading-7 text-slate-600">{answer}</p></article>)}</div></div></section>
  </main><Footer /></>;
}
