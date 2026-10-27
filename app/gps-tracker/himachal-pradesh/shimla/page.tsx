import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const guide = {
  "name": "Shimla",
  "title": "GPS Tracker in Shimla | Pickups & City Service Fleets",
  "description": "Plan GPS tracking in Shimla for hotel pickups and city service visits. Review parking handovers, road access checks, trip records and fitting arrangements.",
  "intro": "Shimla, the capital of Himachal Pradesh, extends across hills and connecting ridges. This city-focused guide helps passenger and service fleets distinguish the vehicle stopping point from the final customer destination, then agree how each visit will be confirmed.",
  "source": "https://hpshimla.nic.in/history/",
  "cases": [
    [
      "A vehicle stop is not always the destination",
      "Before a Shimla hotel pickup or service visit, agree the accessible vehicle meeting point with the customer. Record the property address and vehicle stopping point separately, with a clear landmark and contact. If the last part of the visit is on foot, a tracker fitted to the vehicle records the vehicle position; it does not establish that a passenger or technician reached the property."
    ],
    [
      "Check road access before assigning the trip",
      "Shimla district administration publishes a restricted-road permit service. Check current official guidance and any permissions applicable to the actual vehicle and route before dispatch. Keep the permitted approach and parking plan with the booking. A route shown on a tracking map is not confirmation of road access, parking permission or current road conditions."
    ],
    [
      "Pickup waiting, boarding and departure",
      "For hotel transfers, record the agreed meeting time, vehicle arrival, passenger confirmation and departure as separate milestones. Compare supported trip events with the booking record instead of treating a geofence entry as boarding. If the meeting point changes, update the dispatcher and passenger instructions before reviewing the trip against the original plan."
    ],
    [
      "City service rounds and a representative trial",
      "For several appointments across Shimla, give each job its own reference and record whether the vehicle waited while work was completed away from it. Test a representative round with a parking handover, a changed appointment and the return to base. Review location timestamps, actual stop records and supported exports with the dispatcher. Confirm device and SIM performance on those routes before extending the setup to the fleet."
    ]
  ],
  "faqs": [
    [
      "Can GPS confirm that a passenger reached a Shimla hotel?",
      "A vehicle tracker can help review the vehicle journey and supported arrival events. Confirm passenger pickup and final handover through the booking process, especially when the vehicle stopping point differs from the hotel entrance."
    ],
    [
      "Does a tracking map confirm permission to use a Shimla road?",
      "No. Check current road-access requirements with the relevant authority and use the district administration restricted-road permit information as a starting point. Tracking history or a suggested map route is not an access permit."
    ],
    [
      "How should a service team record work away from its parked vehicle?",
      "Use the job record to confirm technician arrival and completed work. Vehicle location and parking duration alone cannot establish either. Keep the appointment reference with the trip review rather than treating a vehicle geofence as proof of service."
    ],
    [
      "How do I plan GPS installation for a Shimla fleet?",
      "Share vehicle models, the exact fitting location and typical pickup or service routes with NAVII GPS. Confirm installation availability, compatible hardware, SIM and platform costs, supported reports and renewal responsibilities before booking."
    ]
  ]
};
const url = "https://naviigps.com/gps-tracker/himachal-pradesh/shimla";
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
    <section className="bg-white py-20"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold text-slate-900">Plan your {guide.name} vehicle operations</h2><div className="mt-8 grid gap-6 md:grid-cols-2">{guide.cases.map(([heading, text]) => <article key={heading} className="rounded-2xl border border-slate-200 bg-slate-50 p-7"><h3 className="text-xl font-bold text-slate-900">{heading}</h3><p className="mt-4 leading-7 text-slate-600">{text}</p></article>)}</div><p className="mt-6 text-sm text-slate-500">Local geography reference: <a href={guide.source} className="underline">Shimla district administration</a>. Road access reference: <a href="https://hpshimla.nic.in/service/permit/" className="underline">Restricted-road permit information</a>.</p></div></section>
    <section className="bg-[#06142E] py-16 text-white"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold">Compare the setup before booking</h2><p className="mt-5 max-w-3xl leading-8 text-slate-300">Share your fleet size, vehicle models, regular stops and fitting location with the NAVII GPS team in Dera Bassi. Confirm installation arrangements and complete costs for your actual location.</p><div className="mt-7 flex flex-wrap gap-6 text-cyan-200"><Link className="underline" href="/products">Compare GPS devices</Link><Link className="underline" href="/software">Fleet software</Link><Link className="underline" href="/gps-tracker/himachal-pradesh">Himachal Pradesh planning</Link><Link className="underline" href="/gps-tracker/himachal-pradesh/solan">Solan journey guide</Link><Link className="underline" href="/gps-tracker/chandigarh">Chandigarh routes</Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-bold text-slate-900">{guide.name} GPS tracker questions</h2><div className="mt-8 space-y-5">{guide.faqs.map(([question, answer]) => <article key={question} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900">{question}</h3><p className="mt-3 leading-7 text-slate-600">{answer}</p></article>)}</div></div></section>
  </main><Footer /></>;
}
