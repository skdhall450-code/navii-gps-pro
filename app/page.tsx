import type { Metadata } from "next";
import Link from "next/link";

import { faqs } from "@/components/home/FAQ/faqData";

export const metadata: Metadata = {
  title: { absolute: "GPS Tracker & GPS Tracking Devices | NAVII GPS INDIA" },
  description: "Explore GPS trackers and GPS tracking devices for cars and commercial fleets, with live tracking, fleet software, AI dash cameras and IoT solutions across India.",
  keywords: ["GPS tracking system","vehicle tracking system","GPS tracker for car","GPS fleet tracking software","fleet management software India","vehicle tracking software","GPS tracking company in India","GPS tracking company in Punjab","4G GPS tracker for vehicle","AIS-140 GPS tracker","AI dash camera for vehicles","fuel monitoring system for vehicles"],
  alternates: { canonical: "https://naviigps.com" },
  openGraph: { title: "GPS Tracker & Tracking Devices | NAVII GPS INDIA", description: "GPS trackers and real-time tracking devices for cars, commercial vehicles and fleet operations across India.", url: "https://naviigps.com", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS INDIA" }] },
  twitter: { card: "summary_large_image", title: "GPS Tracker & Tracking Devices | NAVII GPS INDIA", description: "GPS trackers, real-time tracking devices and fleet management solutions across India.", images: ["/og-image.jpg"] },
};

import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import HeroV2 from "@/components/home/HeroV2";
import Stats from "@/components/home/Stats";
import ProductsSection from "@/components/home/Products/ProductsSection";
import WhyChoose from "@/components/home/WhyChoose/WhyChoose";
import Software from "@/components/home/Software/Software";
import Clients from "@/components/home/Clients/Clients";
import CTA from "@/components/home/CTA/CTA";
import FAQ from "@/components/home/FAQ/FAQ";
import Testimonials from "@/components/home/Testimonials/Testimonials";

const homeStructuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebPage", "@id": "https://naviigps.com/#webpage", url: "https://naviigps.com/", name: "GPS Tracker & GPS Tracking Devices | NAVII GPS INDIA", description: "GPS trackers and real-time GPS tracking devices for cars and commercial fleets, with fleet software and connected IoT solutions across India.", isPartOf: { "@id": "https://naviigps.com/#website" }, about: { "@id": "https://naviigps.com/#organization" }, inLanguage: "en-IN" },
  { "@type": "FAQPage", "@id": "https://naviigps.com/#faq", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }
] };

export default function HomePage() {
  return (<><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c") }} />
    <HeroV2 /><Stats /><ProductsSection /><WhyChoose /><Software />
    <section className="bg-slate-50 py-10"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-2xl font-bold text-slate-900 md:text-3xl">AIS-140 GPS Tracking for Public Transport</h2><p className="mx-auto mt-3 max-w-3xl text-slate-600">Explore deployment-focused AIS-140 GPS tracking solutions for buses and public transport fleets, including live visibility, routes, alerts and reports.</p><Link href="/ais-140-gps" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore AIS-140 GPS Solutions</Link></div></section>
    <section className="bg-white py-10"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-2xl font-bold text-slate-900 md:text-3xl">School Bus GPS Tracking System</h2><p className="mx-auto mt-3 max-w-3xl text-slate-600">Explore GPS tracking for school buses with live location visibility, route monitoring, geofence alerts and student transport oversight.</p><Link href="/school-bus-gps" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore School Bus GPS Tracking</Link></div></section>
    <section className="bg-slate-50 py-10"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Truck GPS Tracking System in India</h2><p className="mx-auto mt-3 max-w-3xl text-slate-600">Track trucks and commercial fleets with live location, route history, geofencing, vehicle alerts and fleet visibility.</p><Link href="/truck-gps" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore Truck GPS Tracking</Link></div></section>
    <section className="bg-white py-10"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Logistics Fleet Tracking System</h2><p className="mx-auto mt-3 max-w-3xl text-slate-600">Track logistics and delivery fleets with live vehicle location, route history, geofencing, alerts and fleet reports across India.</p><Link href="/logistics-fleet-gps" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore Logistics Fleet Tracking</Link></div></section>
    <section className="bg-slate-50 py-10"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Commercial Vehicle Tracking System</h2><p className="mx-auto mt-3 max-w-3xl text-slate-600">Track commercial vehicles with live location, route history, geofencing, alerts and fleet reports for smarter transport operations.</p><Link href="/commercial-vehicle-tracking" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore Commercial Vehicle Tracking</Link></div></section>
    <section className="bg-white py-10"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-2xl font-bold text-slate-900 md:text-3xl">GPS Tracker for Car in India</h2><p className="mx-auto mt-3 max-w-3xl text-slate-600">Explore car GPS tracking devices with live location, route history, geofencing and vehicle alerts for personal and business vehicles.</p><Link href="/gps-tracker-for-car" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore GPS Tracker for Car</Link></div></section>
    <section className="bg-slate-50 py-10"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-2xl font-bold text-slate-900 md:text-3xl">4G GPS Tracker for Vehicle</h2><p className="mx-auto mt-3 max-w-3xl text-slate-600">Explore connected 4G GPS tracking for cars, trucks and fleets with live location, route history, geofencing and configurable alerts.</p><Link href="/4g-gps-tracker" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore 4G GPS Tracker</Link></div></section>
    <section className="bg-white py-10"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Vehicle Tracking System in India</h2><p className="mx-auto mt-3 max-w-3xl text-slate-600">Track cars, trucks and commercial fleets with live GPS location, route history, geofencing, alerts and fleet reports.</p><Link href="/vehicle-tracking-system" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore Vehicle Tracking System</Link></div></section>
    <section className="bg-slate-50 py-10"><div className="mx-auto max-w-5xl px-6 text-center"><h2 className="text-2xl font-bold text-slate-900 md:text-3xl">GPS Tracking Company in India</h2><p className="mx-auto mt-3 max-w-3xl text-slate-600">Explore NAVII GPS vehicle tracking devices and fleet management solutions for cars, trucks, buses and commercial fleets across India.</p><Link href="/gps-tracking-company-india" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Explore GPS Tracking Solutions</Link></div></section>
    <Clients /><CTA /><FAQ /><Testimonials />
  </main><Footer /></>);
}
