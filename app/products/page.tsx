import type { Metadata } from "next";

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
      <Header />

      <main>
        <ProductSection />
      </main>

      <Footer />
    </>
  );
}
