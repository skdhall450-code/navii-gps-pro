import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";
import Link from "next/link";

const pageTitle = "Fuel Monitoring System in India | Fleet Fuel Tracking";
const pageDescription = "Review fleet fuel levels, refills and unusual fuel changes with NAVII GPS. Discuss sensor compatibility, tank calibration and fuel monitoring for your vehicles.";

const faqs = [
  {
    question: "How does a GPS fuel monitoring system work?",
    answer: "A compatible fuel sensor provides calibrated tank-level readings to a connected GPS device and tracking platform. Fleet teams can review the available readings alongside vehicle location and trip records. The sensor, tracker interface and software reporting must be checked as one setup.",
  },
  {
    question: "Can a GPS tracker alone measure fuel consumption?",
    answer: "Location and distance data alone do not measure the fuel in a tank. Fuel-level monitoring needs a compatible fuel-data source, such as an installed and calibrated sensor. Confirm which readings and reports the proposed hardware and software can provide before ordering.",
  },
  {
    question: "Can fuel monitoring detect fuel theft?",
    answer: "A reported fuel-level drop can flag an event for investigation, but it is not proof of theft. Compare the time, vehicle location, operating conditions and available records. Tank movement, installation issues or calibration problems may also affect readings.",
  },
  {
    question: "Why does the fuel sensor need tank calibration?",
    answer: "Tank shape and sensor installation affect how a level reading relates to fuel volume. Calibration is specific to the tank and setup. Ask for a validation procedure using known fuel quantities and agree how readings will be checked during normal vehicle operation; no single accuracy figure applies to every installation.",
  },
  {
    question: "Can fuel monitoring be added to an existing truck GPS system?",
    answer: "It may be possible after checking the existing tracker model, supported sensor interface, tank layout and software integration. Share these details with NAVII GPS for a compatibility assessment. A second tank or a different vehicle configuration needs its own installation and reporting review.",
  },
  {
    question: "What determines the cost of a fleet fuel monitoring system?",
    answer: "The quote depends on the sensor and tracker configuration, number of tanks and vehicles, installation, calibration, connectivity and software services. Request an itemised quote that separates initial setup from recurring charges and explains support and recalibration arrangements.",
  },
];

const rolloutSteps = [
  ["Share the vehicle and tank details", "Provide vehicle models, fleet size, fuel type, tank count and capacity, and any existing GPS device details. Confirm installation access and whether each tank needs separate monitoring."],
  ["Confirm the complete connection", "Check the sensor interface, tracker compatibility, power supply, connectivity and the fuel reports available in the proposed software. Agree which users receive and review configured alerts."],
  ["Install and calibrate the tank setup", "Arrange suitable installation and tank-specific calibration. Agree a validation method with known fuel quantities and record the baseline before relying on operational reports."],
  ["Pilot on a representative vehicle", "Review a normal route, refuelling event and parked period. Compare readings with available receipts and operating records, then resolve unexplained differences before a wider rollout."],
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: uniqueKeywords([
    "fuel monitoring system for vehicles",
    "fuel monitoring system India",
    "vehicle fuel monitoring system",
    "fuel monitoring system for fleet",
    "fuel monitoring sensor",
    "fuel level monitoring system",
    "vehicle fuel level sensor",
    "fleet fuel monitoring",
    "fuel consumption monitoring system",
    "fuel theft monitoring system",
    "GPS fuel monitoring system",
    "fuel management system for vehicles",
  ]),
  alternates: { canonical: "https://naviigps.com/fuel-monitoring-system" },
  openGraph: {
    title: `${pageTitle} | NAVII GPS`,
    description: pageDescription,
    url: "https://naviigps.com/fuel-monitoring-system",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS fuel monitoring system" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | NAVII GPS`,
    description: pageDescription,
    images: ["/og-image.jpg"],
  },
};

export default function FuelMonitoringSystemPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "FAQPage", "@id": "https://naviigps.com/fuel-monitoring-system#faq", mainEntity: faqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
      { "@type": "WebPage", "@id": "https://naviigps.com/fuel-monitoring-system#webpage", url: "https://naviigps.com/fuel-monitoring-system", name: pageTitle, description: pageDescription, inLanguage: "en-IN" },
      { "@type": "Service", "@id": "https://naviigps.com/fuel-monitoring-system#service", name: "Fuel Monitoring System for Vehicles", serviceType: "Vehicle Fuel Monitoring", provider: { "@id": "https://naviigps.com/#organization" }, areaServed: { "@type": "Country", name: "India" }, url: "https://naviigps.com/fuel-monitoring-system" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
        { "@type": "ListItem", position: 2, name: "Fuel Monitoring System", item: "https://naviigps.com/fuel-monitoring-system" },
      ] },
    ],
  };

  return (
    <>
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <section className="bg-slate-950 py-24 text-white md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-4xl">
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-300">FLEET FUEL MONITORING</span>
              <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-6xl">Fuel Monitoring System for Fleets in India</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">Review fuel levels, refills and unexpected fuel changes alongside vehicle tracking. NAVII GPS can help assess a compatible sensor, GPS device and software setup for your commercial fleet, with installation and calibration matched to the tank.</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/contact" className="rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white hover:bg-cyan-400">Discuss Fuel Monitoring</Link>
                <Link href="/products/fuel-monitoring-sensor" className="rounded-xl border border-white/20 px-7 py-4 font-semibold text-white hover:bg-white/10">View Fuel Monitoring Sensor</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-4xl font-extrabold text-slate-900">Vehicle Fuel Monitoring Features</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                ["Review Tank-Level Readings", "View available calibrated fuel-level information for connected vehicles. Check the reporting time and connection status before treating a reading as current."],
                ["Reconcile Refuelling Events", "Compare reported fuel-level increases with receipt times and vehicle locations. Review differences with the operating team rather than assuming every increase is a verified purchase."],
                ["Investigate Unexpected Drops", "Use configured fuel-change alerts to prioritise a review of the vehicle, time and location. A drop needs investigation and does not establish theft by itself."],
                ["Review Fuel Usage Patterns", "Use available fuel reports alongside trip and operating records to compare usage over a suitable period. Confirm how the proposed system calculates consumption."],
                ["Connect Fuel and Trip Reviews", "Bring available fuel data into fleet tracking workflows so dispatch and operations teams can review the same vehicle and reporting period."],
                ["Check Data Quality", "Review missing readings and implausible changes with the installer. Sensor fit, tank calibration and connectivity affect how useful the reports are."],
              ].map(([title, description]) => (
                <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                  <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-extrabold md:text-4xl">Plan your fuel monitoring installation</h2>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300">Start with the actual vehicle and tank configuration. A small pilot helps establish which readings, reports and alert settings are useful for your operation.</p>
            <ol className="mt-10 grid gap-6 md:grid-cols-2">
              {rolloutSteps.map(([title, description], index) => (
                <li key={title} className="rounded-3xl border border-white/15 bg-white/5 p-7">
                  <span className="text-sm font-semibold text-cyan-300">STEP {index + 1}</span>
                  <h3 className="mt-3 text-xl font-bold">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{description}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 leading-7 text-slate-300">Planning tracking for your vehicles too? <Link href="/truck-gps" className="font-semibold text-cyan-300 underline underline-offset-4">Explore truck GPS options</Link> and <Link href="/software" className="font-semibold text-cyan-300 underline underline-offset-4">fleet management software</Link>.</p>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-[32px] bg-white p-9 shadow-sm md:p-12">
              <h2 className="text-3xl font-extrabold text-slate-900">Where fuel monitoring can help</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {["Trucks and heavy commercial vehicles", "Logistics and delivery fleets", "School and institutional transport", "Bus and passenger transport fleets", "Construction and industrial vehicles", "Multi-vehicle commercial operations"].map((item) => <div key={item} className="rounded-2xl border border-slate-200 p-4 font-medium text-slate-700">{item}</div>)}
              </div>
              <div className="mt-10 flex flex-wrap gap-5 text-sm font-semibold">
                <Link href="/software" className="text-blue-700 hover:underline">GPS Fleet Management Software</Link>
                <Link href="/logistics-fleet-gps" className="text-blue-700 hover:underline">Logistics Fleet Tracking</Link>
                <Link href="/commercial-vehicle-tracking" className="text-blue-700 hover:underline">Commercial Vehicle Tracking</Link>
                <Link href="/products/fuel-monitoring-sensor" className="text-blue-700 hover:underline">Fuel Monitoring Sensor</Link>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Fuel monitoring questions</h2>
            <div className="mt-10 space-y-6">
              {faqs.map(({ question, answer }) => (
                <article key={question} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                  <h3 className="text-xl font-bold text-slate-900">{question}</h3>
                  <p className="mt-4 leading-8 text-slate-600">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-extrabold">Discuss fuel monitoring for your fleet</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">Share your vehicle count, tank details, existing GPS hardware and the fuel reports you need. Request a compatibility review and an itemised setup and service quote.</p>
            <Link href="/contact" className="mt-8 inline-flex rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-slate-950 hover:bg-cyan-400">Request a Fuel Monitoring Assessment</Link>
          </div>
        </section>
      </main>
    </>
  );
}
