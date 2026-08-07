import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

import ContactHero from "@/components/contact/hero/ContactHero";
import OfficeInfo from "@/components/contact/office/OfficeInfo";
import ContactForm from "@/components/contact/form/ContactForm";
import GoogleMap from "@/components/contact/map/GoogleMap";
import ContactFAQ from "@/components/contact/faq/ContactFAQ";

export default function ContactPage() {
  return (
    <>
      <Header />

      <main>

        <ContactHero />

        <OfficeInfo />

        <ContactForm />

        <GoogleMap />

        <ContactFAQ />

      </main>

      <Footer />

    </>
  );
}