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