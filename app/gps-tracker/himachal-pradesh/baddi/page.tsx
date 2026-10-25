import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const guide = {
  "name": "Baddi",
  "title": "GPS Tracker in Baddi | Factory Dispatch & Staff Fleets",
  "description": "Plan GPS tracking in Baddi for factory dispatches and staff transport. Review gate geofences, loading records, vehicle access and installation checks.",
  "intro": "Baddi is part of the Baddi–Barotiwala–Nalagarh industrial cluster. This guide helps fleet teams separate goods dispatches from staff journeys and agree what vehicle records they need before choosing a tracker.",
  "source": "https://hpsolan.nic.in/baddi-barotiwala-nalagarh-development-authority/",
  "cases": [
    [
      "Factory gates and loading bays",
      "Record the actual factory entrance, loading point and return depot for each dispatch. Use separate geofences where operationally useful and compare the recorded arrival with the loading register. Waiting outside a gate and loading inside the premises are different activities; a position alone cannot explain the delay."
    ],
    [
      "Dispatch proof and cargo requirements",
      "Match trip history with the dispatch note and customer acknowledgement. GPS location does not prove delivery or measure cargo temperature. If a shipment needs additional sensors or records, confirm the exact hardware and supported platform functions separately before ordering."
    ],
    [
      "Staff vehicles between shifts",
      "Keep employee pickup stops and shift windows separate from goods routes. Agree which dispatcher can see each vehicle and who investigates a missed update. Check supported alerts on one representative shift before adding more vehicles."
    ],
    [
      "BBN route acceptance trial",
      "For journeys involving Baddi, Barotiwala or Nalagarh, test the actual outward and return route after fitting. Check reporting at factory gates, recurring stops and the depot. Record how the selected device behaves during a network gap and verify recovered journey records rather than assuming they are available."
    ]
  ],
  "faqs": [
    [
      "Can GPS tracking confirm that a Baddi shipment was delivered?",
      "Trip records and supported geofence events help review vehicle movements. Confirm delivery using the receiver acknowledgement or delivery record; location data alone does not establish receipt or cargo condition."
    ],
    [
      "Can staff transport and goods vehicles use the same fleet setup?",
      "Discuss vehicle grouping and authorised access with NAVII GPS. Define separate pickup, factory and customer stops, then confirm the reports and alerts supported by the chosen device and platform."
    ],
    [
      "How do I arrange GPS installation in Baddi?",
      "Share the vehicle models, fleet size, factory access requirements and fitting location with the NAVII GPS Dera Bassi team. Confirm installation availability, hardware, SIM, subscription, accessories and renewal charges before booking."
    ]
  ]
};
const url = "https://naviigps.com/gps-tracker/himachal-pradesh/baddi";
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
    <section className="bg-white py-20"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold text-slate-900">Plan your {guide.name} vehicle operations</h2><div className="mt-8 grid gap-6 md:grid-cols-2">{guide.cases.map(([heading, text]) => <article key={heading} className="rounded-2xl border border-slate-200 bg-slate-50 p-7"><h3 className="text-xl font-bold text-slate-900">{heading}</h3><p className="mt-4 leading-7 text-slate-600">{text}</p></article>)}</div><p className="mt-6 text-sm text-slate-500">Local geography reference: <a href={guide.source} className="underline">Solan district administration</a>.</p></div></section>
    <section className="bg-[#06142E] py-16 text-white"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold">Compare the setup before booking</h2><p className="mt-5 max-w-3xl leading-8 text-slate-300">Share your fleet size, vehicle models, regular stops and fitting location with the NAVII GPS team in Dera Bassi. Confirm installation arrangements and complete costs for your actual location.</p><div className="mt-7 flex flex-wrap gap-6 text-cyan-200"><Link className="underline" href="/products">Compare GPS devices</Link><Link className="underline" href="/software">Fleet software</Link><Link className="underline" href="/gps-tracker/himachal-pradesh">Himachal Pradesh planning</Link><Link className="underline" href="/gps-tracker/himachal-pradesh/solan">Solan tracking guide</Link><Link className="underline" href="/gps-tracker/chandigarh">Chandigarh routes</Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-bold text-slate-900">{guide.name} GPS tracker questions</h2><div className="mt-8 space-y-5">{guide.faqs.map(([question, answer]) => <article key={question} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900">{question}</h3><p className="mt-3 leading-7 text-slate-600">{answer}</p></article>)}</div></div></section>
  </main><Footer /></>;
}
