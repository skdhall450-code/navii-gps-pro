import { PageSchema } from "@/components/seo/PageSchema";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "GPS Tracking Devices for Cars & Fleets",
  description:
    "Explore GPS tracking devices and car GPS trackers for live vehicle monitoring, plus AI dash cameras, fuel sensors, smart e-locks and fleet IoT products.",
  alternates: {
    canonical:
      "https://naviigps.com/products",
  },
  openGraph: {
    title:
      "GPS Tracking Devices for Cars & Fleets | NAVII GPS INDIA",
    description:
      "Explore GPS tracking devices, car GPS trackers, vehicle security and connected fleet IoT products.",
    url:
      "https://naviigps.com/products",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt:
          "NAVII GPS tracking devices and IoT products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "GPS Tracking Devices for Cars & Fleets | NAVII GPS INDIA",
    description:
      "GPS tracking devices, car GPS trackers, vehicle security and fleet IoT products.",
    images: ["/og-image.jpg"],
  },
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import ProductSection from "@/components/products/ProductSection";

export default function ProductsPage() {
  return (
    <>
      <PageSchema path="/products" name="GPS Tracking Devices" type="CollectionPage" description={metadata.description} /><Header />

      <main>
        <ProductSection />

        <section className="border-t border-slate-200 bg-slate-50 py-10">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              AIS-140 GPS Tracking Solutions
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-slate-600">
              Looking for AIS-140 GPS tracking for buses or public transport? Explore our dedicated solution page for live tracking, route history, alerts and fleet monitoring.
            </p>
            <Link
              href="/ais-140-gps"
              className="mt-5 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              View AIS-140 GPS Solution
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
