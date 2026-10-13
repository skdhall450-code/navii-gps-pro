import Link from "next/link";

const workflows = [
  { title: "Dispatch with current vehicle information", text: "Check a vehicle's latest reported location and update time before assigning a journey. Review reporting gaps with the operations team so a stale position is not mistaken for the current truck or bus location.", href: "/truck-gps", link: "Truck dispatch and tracking" },
  { title: "Review trips and location events", text: "Use recorded trip history and depot or warehouse geofences to review arrivals, departures and route activity. Compare the available events with your dispatch records when investigating a long stop or a changed route.", href: "/logistics-fleet-gps", link: "Logistics fleet workflows" },
  { title: "Assign access and alert responsibilities", text: "Agree which vehicles each authorized user needs to see and who follows up on supported alerts. A fleet manager, dispatcher and vehicle operator may need different views of the same operation.", href: "/commercial-vehicle-tracking", link: "Commercial vehicle tracking" },
];

const setupSteps = [
  "Share your vehicle count, vehicle types, operating routes and required reports.",
  "Review device compatibility, power supply, installation and SIM connectivity for those routes.",
  "Name vehicles clearly, agree authorized access and configure the required geofences and supported alerts.",
  "Pilot the setup on representative vehicles. Check update times, recorded trips and alert delivery before expanding to the fleet.",
];

const faqs = [
  { question: "What does NAVII GPS fleet management software help me monitor?", answer: "The connected platform supports vehicle location, recorded trips, geofences, available alerts and fleet reports. Choose the required functions with NAVII GPS and demonstrate them using the device and installation proposed for your vehicles." },
  { question: "Do I need a GPS device as well as fleet tracking software?", answer: "Vehicle tracking needs a compatible device sending data to the connected platform. Confirm hardware, installation, SIM or data connectivity and platform access together. Existing devices need a compatibility review before they are added." },
  { question: "Can a dispatcher review fleet vehicles from the web and mobile app?", answer: "NAVII GPS provides web and mobile access for supported tracking deployments. Agree which vehicles and functions each authorized user needs, and check the proposed views during a demonstration." },
  { question: "Does fleet software include fuel monitoring for every vehicle?", answer: "Fuel-level monitoring depends on a compatible sensor, device integration, tank suitability and calibrated installation. Request a separate assessment if fuel monitoring is needed alongside the base tracking setup." },
  { question: "How is fleet management software priced?", answer: "Request an itemised quote for your vehicle count and required functions. Confirm device costs, installation, SIM or data charges, platform subscription duration, renewal charges and any optional sensor or integration work." },
];

export default function FleetSoftwareGuide() {
  const url = "https://naviigps.com/software";
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", "@id": `${url}#service`, name: "NAVII GPS Fleet Management Software", serviceType: "GPS Vehicle Tracking and Fleet Management Software", url, provider: { "@id": "https://naviigps.com/#organization" }, areaServed: { "@type": "Country", name: "India" } },
    { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="bg-white py-20"><div className="mx-auto max-w-7xl px-6">
      <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Use fleet tracking software in your daily operations</h2>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Start with the decisions your transport team makes each day. These workflows connect reported GPS data with dispatch, trip review and team responsibilities.</p>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">{workflows.map((workflow) => <article key={workflow.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><h3 className="text-xl font-bold text-slate-900">{workflow.title}</h3><p className="mt-4 leading-7 text-slate-600">{workflow.text}</p><Link href={workflow.href} className="mt-5 inline-block font-semibold text-blue-700 underline underline-offset-4">{workflow.link}</Link></article>)}</div>
    </div></section>
    <section className="bg-slate-50 py-16"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-extrabold text-slate-900">Plan a fleet software rollout</h2><ol className="mt-8 list-decimal space-y-4 pl-6 text-lg leading-8 text-slate-700">{setupSteps.map((step) => <li key={step} className="pl-2">{step}</li>)}</ol><Link href="/contact" className="mt-8 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">Request a Fleet Software Demo</Link></div></section>
    <section className="bg-white py-16"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-extrabold text-slate-900">Fleet management software questions</h2><div className="mt-8 space-y-4">{faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-slate-200 p-6"><h3 className="text-xl font-bold text-slate-900">{faq.question}</h3><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p></article>)}</div></div></section>
  </>;
}
