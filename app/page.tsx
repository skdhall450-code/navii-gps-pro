import Link from "next/link";
import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";

import { faqs } from "@/components/home/FAQ/faqData";

export const metadata: Metadata = {
  title: { absolute: "GPS Tracker & GPS Tracking Devices | NAVII GPS INDIA" },
  description: "Explore GPS trackers and GPS tracking devices for cars and commercial fleets, with live tracking, fleet software, AI dash cameras and IoT solutions across India.",
  keywords: uniqueKeywords(["GPS tracking system","vehicle tracking system","GPS tracker for car","GPS fleet tracking software","fleet management software India","vehicle tracking software","GPS tracking company in India","GPS tracking company in Punjab","4G GPS tracker for vehicle","AIS-140 GPS tracker","AI dash camera for vehicles","fuel monitoring system for vehicles"]),
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
import SolutionsShowcase from "@/components/home/SolutionsShowcase";

const homeStructuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebPage", "@id": "https://naviigps.com/#webpage", url: "https://naviigps.com/", name: "GPS Tracker & GPS Tracking Devices | NAVII GPS INDIA", description: "GPS trackers and real-time GPS tracking devices for cars and commercial fleets, with fleet software and connected IoT solutions across India.", isPartOf: { "@id": "https://naviigps.com/#website" }, about: { "@id": "https://naviigps.com/#organization" }, inLanguage: "en-IN" },
  { "@type": "FAQPage", "@id": "https://naviigps.com/#faq", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }
] };

export default function HomePage() {
  return (<><Header /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c") }} />
    <HeroV2 /><Stats /><ProductsSection /><WhyChoose /><Software />
    <SolutionsShowcase />

    <section aria-labelledby="local-gps-heading" className="bg-[#06142E] py-16 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 id="local-gps-heading" className="text-3xl font-bold md:text-4xl">GPS tracking enquiries in Chandigarh and nearby Punjab</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Contact our Dera Bassi office to discuss GPS trackers for your car or fleet. Choose your location for vehicle requirements and local journey planning, then confirm device compatibility, installation arrangements and the complete quotation with our team.</p>
        <nav aria-label="Local GPS tracking guides" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Chandigarh", "/gps-tracker/chandigarh"],
            ["Dera Bassi", "/gps-tracker/punjab/sahibzada-ajit-singh-nagar/dera-bassi"],
            ["Mohali", "/gps-tracker/punjab/sahibzada-ajit-singh-nagar/mohali"],
            ["Zirakpur", "/gps-tracker/punjab/sahibzada-ajit-singh-nagar/zirakpur"],
            ["Kharar", "/gps-tracker/punjab/sahibzada-ajit-singh-nagar/kharar"],
          ].map(([name, href]) => <Link key={href} href={href} className="rounded-xl border border-cyan-300/30 px-5 py-4 text-lg font-semibold text-cyan-100 hover:bg-cyan-300/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">GPS tracker in {name}</Link>)}
        </nav>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/contact" className="rounded-xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950">Request a local GPS quotation</Link>
          <Link href="/products" className="rounded-xl border border-slate-500 px-6 py-4 font-semibold">Compare GPS tracker models</Link>
        </div>
      </div>
    </section>
    <Clients /><CTA /><FAQ /><Testimonials />
  </main><Footer /></>);
}
