import type { Metadata } from "next";
import Link from "next/link";

import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import { PageSchema } from "@/components/seo/PageSchema";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import SoftwareHero from "@/components/software/hero/SoftwareHero";
import SoftwareFeatures from "@/components/software/features/SoftwareFeatures";
import MobileApps from "@/components/software/apps/MobileApps";
import CTA from "@/components/software/CTA";

const pageTitle = "Fleet Management Software India";
const fullTitle = `${pageTitle} | NAVII GPS INDIA`;
const pageHeading = "Vehicle Tracking and Fleet Management Software in India";
const pageDescription =
  "View vehicle locations, route history, alerts and reports with NAVII GPS fleet management software in India. Request a demo for your fleet.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: uniqueKeywords([
    "fleet management software India",
    "GPS fleet management software",
    "GPS fleet management software India",
    "fleet management system India",
    "fleet tracking software India",
    "GPS tracking software India",
    "vehicle tracking software India",
    "fleet GPS tracking software",
    "vehicle tracking system software",
    "real-time fleet tracking software",
    "commercial fleet management software",
    "GPS tracking system India",
    "fleet tracking system India",
  ]),
  alternates: { canonical: "https://naviigps.com/software" },
  openGraph: {
    title: fullTitle,
    description: pageDescription,
    url: "https://naviigps.com/software",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NAVII GPS fleet management software in India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: fullTitle,
    description: pageDescription,
    images: ["/og-image.jpg"],
  },
};

const setupChecks = [
  {
    title: "Hardware and connectivity",
    description: "Share your tracker model, installation details and operating areas so NAVII GPS can check compatibility.",
  },
  {
    title: "Access and subscription",
    description: "Confirm the vehicles, account roles and active subscriptions needed for your team. Customer access does not include every administration function.",
  },
  {
    title: "Optional requirements",
    description: "Ask whether fuel monitoring or relay-based controls are supported for your proposed setup. Confirm equipment, installation, permissions and commercial terms before choosing these options.",
  },
];

const faqs = [
  {
    question: "Do I need a GPS device to use vehicle tracking software?",
    answer: <>Yes. Vehicle tracking needs a compatible installed GPS device sending data to the platform. If you already have trackers, share their model details so NAVII GPS can check compatibility before you choose a setup.</>,
  },
  {
    question: "Can I review route history and download reports?",
    answer: <>You can review recorded vehicle history and playback, subject to your account access and active subscription. The web reports page supports CSV export of recorded trip data. Confirm the history period and report fields you need during your demo.</>,
  },
  {
    question: "Can customer accounts create geofences?",
    answer: <>Customer accounts can view configured geofences and their vehicle alerts. Geofence creation and changes are handled by authorised management roles. Ask how your team’s locations and access will be configured.</>,
  },
  {
    question: "Are fuel monitoring and remote engine controls included?",
    answer: <>Confirm these options separately for your proposed setup. Fuel monitoring needs a <Link href="/products/fuel-monitoring-sensor" className="font-semibold text-cyan-800 underline underline-offset-4 hover:text-cyan-900">compatible sensor and calibration</Link>; relay-based controls need suitable hardware and a safe, authorised setup. Ask NAVII GPS to confirm what is supported and included in your quotation.</>,
  },
  {
    question: "How do I get a demo and a quote?",
    answer: <>Send your vehicle count, tracker models if known, and the reports or alerts you need. Ask the team to demonstrate the relevant customer screens and confirm hardware, subscription, access and support arrangements before you proceed.</>,
  },
];

export default function SoftwarePage() {
  return (
    <>
      <PageSchema path="/software" name={pageHeading} type="WebPage" description={pageDescription} />
      <Header />
      <main>
        <SoftwareHero />
        <SoftwareFeatures />

        <section className="bg-slate-50 py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-extrabold text-slate-900 md:text-4xl">
              Check your software setup before you choose
            </h2>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {setupChecks.map((check) => (
                <div key={check.title} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-slate-900">{check.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{check.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MobileApps />

        <section className="bg-slate-50 py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Fleet management software questions
            </h2>
            <div className="mt-10 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-slate-900">{faq.question}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Explore vehicle specific tracking
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              For hardware and operating requirements, see our{" "}
              <Link href="/truck-gps" className="font-semibold text-cyan-800 underline underline-offset-4 hover:text-cyan-900">truck GPS tracking</Link>{" "}
              and{" "}
              <Link href="/logistics-fleet-gps" className="font-semibold text-cyan-800 underline underline-offset-4 hover:text-cyan-900">logistics fleet tracking</Link>{" "}
              pages. Use this page to compare software workflows and account access.
            </p>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
