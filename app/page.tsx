import type { Metadata } from "next";

import { faqs } from "@/components/home/FAQ/faqData";

export const metadata: Metadata = {
  title: {
    absolute: "GPS Tracker & GPS Tracking Devices | NAVII GPS INDIA",
  },
  description:
    "Explore GPS trackers and GPS tracking devices for cars and commercial fleets, with live tracking, fleet software, AI dash cameras and IoT solutions across India.",
  alternates: {
    canonical: "https://naviigps.com",
  },
  openGraph: {
    title: "GPS Tracker & Tracking Devices | NAVII GPS INDIA",
    description:
      "GPS trackers and real-time tracking devices for cars, commercial vehicles and fleet operations across India.",
    url: "https://naviigps.com",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NAVII GPS INDIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPS Tracker & Tracking Devices | NAVII GPS INDIA",
    description:
      "GPS trackers, real-time tracking devices and fleet management solutions across India.",
    images: ["/og-image.jpg"],
  },
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

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://naviigps.com/#webpage",
      url: "https://naviigps.com/",
      name: "GPS Tracker & GPS Tracking Devices | NAVII GPS INDIA",
      description:
        "GPS trackers and real-time GPS tracking devices for cars and commercial fleets, with fleet software and connected IoT solutions across India.",
      isPartOf: {
        "@id": "https://naviigps.com/#website",
      },
      about: {
        "@id": "https://naviigps.com/#organization",
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "FAQPage",
      "@id": "https://naviigps.com/#faq",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c"),
          }}
        />

        <HeroV2 />

        <Stats />

        <ProductsSection />

        <WhyChoose />

        <Software />

        <Clients />

        <CTA />

        <FAQ />

        <Testimonials />
      </main>

      <Footer />
    </>
  );
}
