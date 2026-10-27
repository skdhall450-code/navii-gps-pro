import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

const guide = {
  "name": "Kangra district",
  "title": "GPS Tracker in Kangra District | Dharamshala Transfers & Fleets",
  "description": "Plan GPS tracking for Kangra district fleets and Dharamshala transfers. Review vehicle reassignment, airport waiting, district rounds and installation checks.",
  "intro": "Kangra district includes varied hill terrain and journeys connecting Kangra town, Dharamshala and other destinations. This guide helps dispatch teams manage shared vehicles across transfer bookings and district service rounds. Confirm fitting and reporting for the actual locations you operate.",
  "source": "https://hpkangra.nic.in/about-district/",
  "cases": [
    [
      "Define town, district and booking destinations",
      "Write the exact destination in each job: Kangra town is not a substitute for an address elsewhere in Kangra district. Record the operating base, customer stop and final return point. Keep transfer bookings separate from multi-stop service work so a district-wide map view does not hide a missed appointment."
    ],
    [
      "Assign a vehicle to each leg",
      "For journeys connecting Dharamshala with other district destinations, record outbound and return bookings separately. If a different vehicle takes the return leg, preserve both vehicle assignments and the change time in the booking record. Do not rely on the current vehicle name alone when reconciling yesterday's trip."
    ],
    [
      "Reconcile a district service round",
      "Give each visit a job reference, planned stop and completion record. Compare available trip exports with the job sheet at the end of the round, recording cancelled visits and extra stops. Vehicle dwell time can help investigate a delay but cannot establish the work performed, passenger count or goods carried."
    ],
    [
      "Pilot the routes your team actually uses",
      "Test a representative transfer and service round with the selected device and SIM. Include recurring pickup points, a reassigned vehicle and the return to base. Check timestamps, supported trip records, access permissions and any recovery of records after a reporting gap. Agree who handles an overdue update before expanding the setup."
    ]
  ],
  "faqs": [
    [
      "Does this page cover Kangra town or Kangra district?",
      "This is a district planning guide, including a focused Dharamshala transfer section. Supply the exact town, pickup point and fitting address when requesting a quotation; the guide does not establish installation availability at every district location."
    ],
    [
      "Can vehicle GPS tell me whether a flight has landed?",
      "No. Confirm flight status through the airline or airport information. Vehicle GPS can help review the assigned vehicle journey and supported waiting records, but does not establish aircraft arrival or passenger readiness."
    ],
    [
      "How should I review a transfer when the assigned vehicle changes?",
      "Keep the old and new vehicle assignments with their effective times in the booking record. Review the appropriate trip for each leg rather than assuming the current assignment performed the entire booking."
    ],
    [
      "What should I confirm before installation in Kangra district?",
      "Share the exact fitting location, vehicle models and operating routes with NAVII GPS. Confirm installation arrangements, hardware compatibility, SIM, platform access, supported reports, complete costs and renewal responsibilities before booking."
    ]
  ]
};
const url = "https://naviigps.com/gps-tracker/himachal-pradesh/kangra";
export const metadata: Metadata = {
  title: guide.title, description: guide.description,
  alternates: { canonical: url },
  openGraph: { title: guide.title, description: guide.description, url, type: "website", images: ["/og-image.jpg"] },
  twitter: { card: "summary_large_image", title: guide.title, description: guide.description, images: ["/og-image.jpg"] },
};
const schema = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebPage", "@id": `${url}#webpage`, url, name: guide.title, description: guide.description, inLanguage: "en-IN", isPartOf: { "@id": "https://naviigps.com/#website" } },
  { "@type": "Service", url, name: `Vehicle GPS tracking in ${guide.name}`, serviceType: "Vehicle tracking and fleet management", provider: { "@id": "https://naviigps.com/#organization" }, areaServed: { "@type": "AdministrativeArea", name: guide.name, containedInPlace: { "@type": "State", name: "Himachal Pradesh" } } },
  { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" }, { "@type": "ListItem", position: 2, name: "Himachal Pradesh", item: "https://naviigps.com/gps-tracker/himachal-pradesh" }, { "@type": "ListItem", position: 3, name: guide.name, item: url }] },
  { "@type": "FAQPage", mainEntity: guide.faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
] };
export default function Page() {
  return <><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6">
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap gap-3 text-sm text-cyan-200"><Link href="/">Home</Link><span>/</span><Link href="/gps-tracker/himachal-pradesh">Himachal Pradesh</Link><span>/ {guide.name}</span></nav>
      <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">{guide.title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">{guide.intro}</p>
      <a href="#dharamshala" className="mt-6 block text-cyan-200 underline">Dharamshala transfer checklist</a><Link href="/contact" className="mt-8 inline-block rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950">Discuss your {guide.name} fleet</Link>
    </div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold text-slate-900">Plan your {guide.name} vehicle operations</h2><div className="mt-8 grid gap-6 md:grid-cols-2">{guide.cases.map(([heading, text]) => <article key={heading} className="rounded-2xl border border-slate-200 bg-slate-50 p-7"><h3 className="text-xl font-bold text-slate-900">{heading}</h3><p className="mt-4 leading-7 text-slate-600">{text}</p></article>)}</div><p className="mt-6 text-sm text-slate-500">Local geography reference: <a href={guide.source} className="underline">Kangra district administration</a>.</p></div></section>
    <section id="dharamshala" className="scroll-mt-28 bg-slate-50 py-16"><div className="mx-auto max-w-7xl px-6">
      <h2 className="text-3xl font-bold text-slate-900">Dharamshala and Gaggal airport transfer checklist</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-700">The district administration identifies Gaggal as the airport serving journeys to Dharamshala and Kangra town. For an airport transfer, keep the flight booking and the vehicle dispatch record separate.</p>
      <ol className="mt-6 max-w-4xl list-decimal space-y-4 pl-5 leading-7 text-slate-700">
        <li>Confirm current arrival information with the airline or airport, then agree the passenger meeting point and permitted vehicle waiting arrangement. Do not dispatch solely from an old flight time saved in a booking.</li>
        <li>Record when the vehicle is assigned, when it reaches the agreed waiting point and when the passenger confirms readiness. Review supported GPS events alongside these milestones; airport geofence entry alone is not a passenger pickup.</li>
        <li>If a delayed arrival affects the next booking, record the replacement vehicle and notify the responsible dispatcher through your normal process. Keep an explicit handover record so the next driver does not inherit an unexplained overdue job.</li>
        <li>Close the transfer using the booking acknowledgement and review the onward or return assignment separately. Retain only the passenger details needed for coordination and restrict fleet access to authorised staff.</li>
      </ol>
      <p className="mt-6 text-sm text-slate-600">Geography reference: <a className="underline" href="https://hpkangra.nic.in/how-to-reach/">Kangra district travel information</a>. Confirm current schedules and local access arrangements directly before travel.</p>
    </div></section>
    <section className="bg-[#06142E] py-16 text-white"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold">Compare the setup before booking</h2><p className="mt-5 max-w-3xl leading-8 text-slate-300">Share your fleet size, vehicle models, regular stops and fitting location with the NAVII GPS team in Dera Bassi. Confirm installation arrangements and complete costs for your actual location.</p><div className="mt-7 flex flex-wrap gap-6 text-cyan-200"><Link className="underline" href="/products">Compare GPS devices</Link><Link className="underline" href="/software">Fleet software</Link><Link className="underline" href="/gps-tracker/himachal-pradesh">Himachal Pradesh planning</Link><Link className="underline" href="/gps-tracker/himachal-pradesh/baddi">Baddi tracking guide</Link><Link className="underline" href="/gps-tracker/chandigarh">Chandigarh routes</Link></div></div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-bold text-slate-900">{guide.name} GPS tracker questions</h2><div className="mt-8 space-y-5">{guide.faqs.map(([question, answer]) => <article key={question} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900">{question}</h3><p className="mt-3 leading-7 text-slate-600">{answer}</p></article>)}</div></div></section>
  </main><Footer /></>;
}
