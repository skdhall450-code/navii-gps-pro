import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fuel Monitoring System for Fleets",
  description: "Monitor fuel levels, consumption and unusual fuel activity across commercial vehicles with NAVII GPS fuel monitoring solutions for fleets in India.",
  keywords: [
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
  ],
  alternates: { canonical: "https://naviigps.com/fuel-monitoring-system" },
  openGraph: {
    title: "Fuel Monitoring System for Vehicles & Fleets | NAVII GPS",
    description: "Monitor vehicle fuel levels and fleet fuel activity with NAVII GPS fuel monitoring solutions.",
    url: "https://naviigps.com/fuel-monitoring-system",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS fuel monitoring system" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuel Monitoring System for Vehicles & Fleets | NAVII GPS",
    description: "Fuel visibility and monitoring for commercial vehicles and fleets.",
    images: ["/og-image.jpg"],
  },
};

export default function FuelMonitoringSystemPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": "https://naviigps.com/fuel-monitoring-system#webpage", url: "https://naviigps.com/fuel-monitoring-system", name: "Fuel Monitoring System for Vehicles & Fleets | NAVII GPS", description: metadata.description, inLanguage: "en-IN" },
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
              <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-6xl">Fuel Monitoring System for Vehicles & Fleets</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">Improve fuel visibility across commercial vehicles and fleets with connected fuel monitoring solutions from NAVII GPS.</p>
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
                ["Fuel Level Visibility", "Monitor available fuel information for connected vehicles through the tracking and monitoring setup."],
                ["Fuel Consumption Monitoring", "Use fuel data to support operational reviews and understand vehicle fuel usage patterns."],
                ["Unusual Fuel Activity", "Identify unexpected changes in fuel information and investigate potential operational issues."],
                ["Fleet-Level Monitoring", "Bring fuel visibility into commercial fleet operations alongside vehicle tracking workflows."],
                ["Operational Reporting", "Use available fuel and vehicle information to support fleet reviews and management decisions."],
                ["Connected GPS Workflows", "Combine fuel monitoring with GPS fleet tracking software for broader vehicle visibility."],
              ].map(([title, description]) => (
                <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                  <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
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
      </main>
    </>
  );
}
