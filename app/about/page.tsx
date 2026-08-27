import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about NAVII GPS INDIA, our mission and our GPS tracking, fleet management, vehicle security and IoT technology solutions.",
  alternates: {
    canonical:
      "https://naviigps.com/about",
  },
  openGraph: {
    title: "About NAVII GPS INDIA",
    description:
      "Discover NAVII GPS INDIA and our commitment to smart, secure and reliable connected fleet technology.",
    url:
      "https://naviigps.com/about",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About NAVII GPS INDIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About NAVII GPS INDIA",
    description:
      "Smart GPS tracking, fleet management and connected vehicle technology.",
    images: ["/og-image.jpg"],
  },
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import MissionVision from "@/components/about/MissionVision";
import DirectorMessage from "@/components/about/director/DirectorMessage";
import Certifications from "@/components/about/Certifications";
import Timeline from "@/components/about/Timeline";
import WhyNavii from "@/components/about/WhyNavii";
import CTA from "@/components/about/CTA";

export default function AboutPage() {
  return (
    <>
      <Header />

      <AboutHero />

      <CompanyStory />

      <MissionVision />

      <DirectorMessage />

      <Certifications />

      <Timeline />

      <WhyNavii />

      <CTA />

      <Footer />
    </>
  );
}