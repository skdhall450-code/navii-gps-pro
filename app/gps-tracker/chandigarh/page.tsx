import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { TrackingSolutionLinks } from "@/components/seo/TrackingSolutionLinks";
import { uniqueKeywords } from "@/lib/seo/trackingSolutions";

const url = "https://naviigps.com/gps-tracker/chandigarh";
const title = "GPS Tracker in Chandigarh | Vehicle & Fleet Tracking";
const description = "Plan GPS tracking for Chandigarh cars, staff vehicles and delivery fleets, with sector routes, Industrial Area, Manimajra and connected Tricity journeys.";
const social = { title, description, images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS vehicle tracking in Chandigarh" }] };
export const metadata: Metadata = {
  title, description,
  keywords: uniqueKeywords(["GPS tracker Chandigarh", "vehicle tracking system Chandigarh", "car GPS tracker Chandigarh", "fleet management Chandigarh", "GPS tracker Manimajra", "GPS tracking Chandigarh Industrial Area", "Tricity vehicle tracking"]),
  alternates: { canonical: url },
  openGraph: { ...social, url, type: "website" },
  twitter: { ...social, card: "summary_large_image" },
};

const areas = [
  { id: "sector-routes", title: "Sector deliveries and service vehicles", text: "For customer visits and multi-stop deliveries around Sectors 17, 22, 34 and 35, review trip history against your planned stops. Use customer-site geofences to identify arrivals and departures, then investigate long stops with the driver instead of treating every delay as a missed delivery." },
  { id: "industrial-area", title: "Industrial Area Phase I and Phase II", text: "For vehicles moving between industrial premises and delivery points, define separate depot and customer geofences. Review departure times, return journeys and trip distances together. Confirm the vehicle power supply and any supported ignition or accessory inputs before selecting a tracker." },
  { id: "manimajra", title: "Manimajra and eastern Chandigarh routes", text: "For field teams and commercial vehicles working around Manimajra and onward toward Panchkula, agree on the stops dispatchers need to see. Test mobile-network reception on the actual route and distinguish the last reported position from a fresh location update when reviewing the map." },
  { id: "staff-transport", title: "Staff transport and school vehicle journeys", text: "For scheduled pickups across Chandigarh sectors, compare planned departure and arrival windows with recorded journeys. Set up authorized dispatcher access and relevant geofences before rollout. Discuss alert support and data-access permissions for the selected device and platform." },
];
const nearby = [
  { name: "Mohali", href: "/gps-tracker/punjab/sahibzada-ajit-singh-nagar/mohali", text: "Review employee transport and commercial journeys on the Punjab side of the Tricity." },
  { name: "Panchkula", href: "/gps-tracker/haryana/panchkula", text: "Plan service routes and onward vehicle movements on the Haryana side." },
  { name: "Zirakpur", href: "/gps-tracker/punjab/sahibzada-ajit-singh-nagar/zirakpur", text: "Discuss delivery stops and journeys connecting Chandigarh with regional routes." },
  { name: "Dera Bassi", href: "/gps-tracker/punjab/sahibzada-ajit-singh-nagar/dera-bassi", text: "Explore fleet requirements near the NAVII GPS enquiry office." },
];
const faqs = [
  { question: "Which GPS tracker should I choose for a Chandigarh vehicle?", answer: "Start with the vehicle type, power supply, daily routes and reporting needs. Review the G17 device specifications with NAVII GPS and confirm platform, SIM, installation and renewal charges before booking." },
  { question: "Can I review Chandigarh, Mohali and Panchkula journeys together?", answer: "Discuss a shared fleet account for vehicles travelling across the Tricity. Confirm the selected hardware, mobile-network coverage, reporting settings and authorized user access, then test reporting on the routes your fleet actually uses." },
  { question: "How do I arrange GPS installation in Chandigarh?", answer: "Share the vehicle count, model, installation location and preferred time with the NAVII GPS team. Contact the Dera Bassi office to confirm installation arrangements and the quotation for your Chandigarh location before booking." },
  { question: "What should a Chandigarh GPS tracker quotation include?", answer: "Ask for the device, SIM connectivity, platform access, installation, applicable taxes and renewal charges. Confirm any accessories and supported alerts separately so you can compare the complete setup for your vehicle." },
];
const structuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, inLanguage: "en-IN", isPartOf: { "@id": "https://naviigps.com/#website" } },
  { "@type": "Service", "@id": `${url}#service`, url, name: "Vehicle GPS tracking in Chandigarh", description, serviceType: "Vehicle tracking and fleet management", areaServed: { "@type": "AdministrativeArea", name: "Chandigarh" }, provider: { "@type": "Organization", "@id": "https://naviigps.com/#organization", name: "NAVII GPS INDIA (OPC) PRIVATE LIMITED", url: "https://naviigps.com" } },
  { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" }, { "@type": "ListItem", position: 2, name: "GPS Tracker India", item: "https://naviigps.com/gps-tracker-india" }, { "@type": "ListItem", position: 3, name: "Chandigarh", item: url }] },
  { "@type": "FAQPage", mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
] };

export default function ChandigarhPage() {
  return <><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <section className="bg-gradient-to-br from-[#041225] via-[#08224A] to-[#103B82] py-24 text-white md:py-32"><div className="mx-auto max-w-7xl px-6">
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap gap-3 text-sm text-cyan-200"><Link href="/">Home</Link><span>/</span><Link href="/gps-tracker-india">GPS Tracker India</Link><span>/ Chandigarh</span></nav>
      <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">GPS Tracker in Chandigarh for Cars and Commercial Fleets</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">Plan vehicle tracking around Chandigarh sectors, Industrial Area and Manimajra, with connected journeys to Mohali, Panchkula, Zirakpur and Dera Bassi. Choose reporting, trip history and supported alerts around your actual fleet routes.</p>
      <Link href="/contact" className="mt-9 inline-block rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-slate-950">Discuss your Chandigarh fleet</Link>
    </div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-7xl px-6">
      <h2 className="text-3xl font-bold text-slate-900">Plan GPS tracking around Chandigarh operations</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-600">Chandigarh is a union territory and the shared capital of Punjab and Haryana. This guide focuses on Chandigarh vehicle operations; the nearby Punjab and Haryana guides help plan journeys beyond the city. Start with your depots, scheduled stops and dispatcher workflow when deciding what to track.</p>
      <div className="mt-6 flex flex-wrap gap-4">{areas.map(area => <a key={area.id} href={`#${area.id}`} className="text-blue-700 underline underline-offset-4">{area.title}</a>)}</div>
      <div className="mt-9 grid gap-6 md:grid-cols-2">{areas.map(area => <article id={area.id} key={area.id} className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-7"><h3 className="text-xl font-bold text-slate-900">{area.title}</h3><p className="mt-4 leading-7 text-slate-600">{area.text}</p></article>)}</div>
      <p className="mt-6 text-sm text-slate-500">Local geography references: <a href="https://chandigarh.gov.in/general-information" className="underline">Chandigarh Administration</a> and <a href="https://chandigarhdistrict.nic.in/subdivision-blocks/" className="underline">Chandigarh district subdivisions</a>.</p>
    </div></section>
    <section className="bg-[#06142E] py-20 text-white"><div className="mx-auto max-w-7xl px-6"><h2 className="text-3xl font-bold">Connected Tricity GPS tracker guides</h2><p className="mt-5 max-w-3xl leading-8 text-slate-300">Record the full journey when vehicles cross between Chandigarh, Punjab and Haryana. Confirm reporting on both city streets and the connecting routes before adding more vehicles.</p><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{nearby.map(place => <article key={place.href} className="rounded-2xl border border-cyan-300/20 p-6"><h3 className="text-xl font-bold"><Link href={place.href} className="text-cyan-200 underline underline-offset-4">GPS tracker in {place.name}</Link></h3><p className="mt-4 leading-7 text-slate-300">{place.text}</p></article>)}</div><div className="mt-7 flex flex-wrap gap-6 text-cyan-200"><Link href="/gps-tracker/punjab" className="underline">Punjab coverage</Link><Link href="/gps-tracker/haryana" className="underline">Haryana coverage</Link><Link href="/gps-tracker/himachal-pradesh" className="underline">Himachal Pradesh hill and industrial fleets</Link></div></div></section>
    <section className="bg-slate-50 py-20"><div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2"><div><h2 className="text-3xl font-bold text-slate-900">Choose hardware and verify the setup</h2><ol className="mt-6 list-decimal space-y-4 pl-5 leading-7 text-slate-700"><li>Share vehicle details, fleet size and the routes you need to monitor.</li><li>Review device compatibility, reporting intervals, supported alerts and any accessory requirements.</li><li>Confirm all device, SIM, software, installation and renewal costs in the quotation.</li><li>After installation, test a real journey, geofence events and dispatcher access before fleet rollout.</li></ol><div className="mt-7 flex flex-wrap gap-5"><Link href="/products/g17-gps-tracker" className="font-semibold text-blue-700 underline">G17 GPS tracker specifications</Link><Link href="/software" className="font-semibold text-blue-700 underline">Fleet tracking software</Link></div></div><aside className="rounded-3xl bg-[#06142E] p-8 text-white"><h2 className="text-2xl font-bold">Chandigarh vehicle tracking enquiries</h2><p className="mt-5 leading-7 text-slate-300">Contact our Dera Bassi office with your Chandigarh installation location to confirm arrangements and product compatibility.</p><p className="mt-5 leading-7 text-slate-300">NAVII GPS INDIA (OPC) PRIVATE LIMITED<br />SCO 46, 2nd Floor, GBP Business Square,<br />Barwala Road, Dera Bassi, Punjab – 140507</p><a href="tel:+918899729705" className="mt-6 inline-block rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Call +91 88997 29705</a><Link href="/contact" className="mt-5 block text-cyan-200 underline">Request a Chandigarh quotation</Link></aside></div></section>
    <TrackingSolutionLinks location="Chandigarh" sectors={["employee transportation", "sector deliveries", "commercial fleets"]} />
    <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-bold text-slate-900">Chandigarh GPS tracker questions</h2><div className="mt-8 space-y-5">{faqs.map(faq => <article key={faq.question} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900">{faq.question}</h3><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p></article>)}</div></div></section>
  </main><Footer /></>;
}
