import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPS Tracking & Fleet Management Solutions | NAVII GPS INDIA",
  description:
    "NAVII GPS INDIA provides real-time GPS tracking devices, fleet management software, AI dash cameras, fuel monitoring and connected IoT solutions across India.",
  alternates: {
    canonical: "https://www.naviigps.com",
  },
  openGraph: {
    title: "NAVII GPS INDIA | GPS Tracking & Fleet Management",
    description:
      "Real-time GPS tracking, fleet management, vehicle security and connected IoT solutions across India.",
    url: "https://www.naviigps.com",
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
    title: "NAVII GPS INDIA | GPS Tracking & Fleet Management",
    description:
      "Real-time GPS tracking, fleet management and connected IoT solutions.",
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

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
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
