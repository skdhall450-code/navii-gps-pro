import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Sales & Support",
  description:
    "Contact NAVII GPS INDIA for GPS tracking devices, fleet software, product enquiries, installation, sales and customer support.",
  alternates: {
    canonical:
      "https://www.naviigps.com/contact",
  },
  openGraph: {
    title:
      "Contact NAVII GPS INDIA Sales & Support",
    description:
      "Speak with NAVII GPS INDIA about GPS tracking, fleet management and connected IoT solutions.",
    url:
      "https://www.naviigps.com/contact",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt:
          "Contact NAVII GPS INDIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Contact NAVII GPS INDIA Sales & Support",
    description:
      "GPS tracking, fleet management and IoT product enquiries.",
    images: ["/og-image.jpg"],
  },
};

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