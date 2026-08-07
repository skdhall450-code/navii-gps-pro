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