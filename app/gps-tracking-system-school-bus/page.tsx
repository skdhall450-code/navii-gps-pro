import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GPS Tracking System for School Bus in India | NAVII GPS",
  description: "GPS tracking system for school buses with live vehicle location, route monitoring, trip history, geofencing, alerts and fleet visibility for schools and student transport operators.",
  keywords: [
    "GPS tracking system for school bus",
    "GPS tracking for school bus",
    "school bus GPS tracking system",
    "school bus GPS tracker India",
    "GPS tracker for school bus",
    "school bus tracking software",
    "student transport GPS tracking",
    "school vehicle tracking system",
    "school fleet management software",
    "bus GPS tracking system India",
    "school bus live tracking",
    "GPS tracking for schools India",
  ],
  alternates: { canonical: "https://naviigps.com/gps-tracking-system-school-bus" },
  openGraph: {
    title: "GPS Tracking System for School Bus in India | NAVII GPS",
    description: "Track school buses with live location, routes, geofencing, trip history and configurable alerts using NAVII GPS.",
    url: "https://naviigps.com/gps-tracking-system-school-bus",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS tracking system for school buses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPS Tracking System for School Bus | NAVII GPS",
    description: "School bus GPS tracking with live location, route monitoring, geofencing and fleet alerts.",
    images: ["/og-image.jpg"],
  },
};

export default function SchoolBusTrackingSystemPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://naviigps.com/gps-tracking-system-school-bus#webpage",
        url: "https://naviigps.com/gps-tracking-system-school-bus",
        name: "GPS Tracking System for School Bus in India | NAVII GPS",
        description: metadata.description,
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": "https://naviigps.com/gps-tracking-system-school-bus#service",
        name: "GPS Tracking System for School Bus",
        serviceType: "School Bus GPS Tracking",
        provider: { "@type": "Organization", name: "NAVII GPS INDIA" },
        areaServed: { "@type": "Country", name: "India" },
        url: "https://naviigps.com/gps-tracking-system-school-bus",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
          { "@type": "ListItem", position: 2, name: "School Bus GPS", item: "https://naviigps.com/school-bus-gps" },
          { "@type": "ListItem", position: 3, name: "GPS Tracking System for School Bus", item: "https://naviigps.com/gps-tracking-system-school-bus" },
        ],
      },
    ],
  };

  return (
    <>
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <section className="bg-slate-950 py-24 text-white md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-4xl">
              <span className="text-sm font-semibold tracking-[0.2em] text-cyan-300">SCHOOL TRANSPORT GPS</span>
              <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-6xl">GPS Tracking System for School Bus</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">Monitor school buses with live location visibility, route history, geofencing and configurable alerts through the NAVII GPS platform.</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/contact" className="rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white hover:bg-cyan-400">Discuss School Bus Tracking</Link>
                <Link href="/school-bus-gps" className="rounded-xl border border-white/20 px-7 py-4 font-semibold text-white hover:bg-white/10">School Bus GPS Solutions</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-4xl font-extrabold text-slate-900">School Bus GPS Tracking Features</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                ["Live Bus Location", "See the latest location of connected school buses through the NAVII GPS tracking platform."],
                ["Route & Trip History", "Review routes and trip activity to support school transport planning and operational monitoring."],
                ["Geofencing & Alerts", "Configure location boundaries and vehicle alerts for day-to-day transport oversight."],
                ["Fleet Visibility", "Monitor multiple school buses and institutional vehicles from connected GPS software tools."],
                ["Mobile Access", "Give authorized transport teams convenient access to vehicle and trip information."],
                ["Operational Reports", "Use available fleet and trip information to support transport reviews and management decisions."],
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
              <h2 className="text-3xl font-extrabold text-slate-900">Who can use a school bus GPS tracking system?</h2>
              <ul className="mt-7 grid gap-4 md:grid-cols-2">
                {[
                  "Schools and colleges with dedicated bus fleets",
                  "Student transport operators",
                  "Private school bus services",
                  "Staff and institutional transport fleets",
                  "Multi-route school transport operations",
                  "Contracted bus operators",
                ].map((item) => <li key={item} className="rounded-2xl border border-slate-200 p-4 font-medium text-slate-700">{item}</li>)}
              </ul>
              <div className="mt-10 flex flex-wrap gap-5 text-sm font-semibold">
                <Link href="/software" className="text-blue-700 hover:underline">GPS Fleet Management Software</Link>
                <Link href="/ais-140-gps" className="text-blue-700 hover:underline">AIS-140 GPS Tracking</Link>
                <Link href="/products" className="text-blue-700 hover:underline">GPS Tracking Devices</Link>
                <Link href="/contact" className="text-blue-700 hover:underline">Contact NAVII GPS</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
