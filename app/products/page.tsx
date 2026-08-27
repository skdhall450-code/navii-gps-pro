import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "GPS Tracking Devices & IoT Products",
  description:
    "Explore NAVII GPS vehicle trackers, asset trackers, AI dash cameras, fuel monitoring sensors, smart e-locks and connected fleet products.",
  alternates: {
    canonical:
      "https://naviigps.com/products",
  },
  openGraph: {
    title:
      "GPS Tracking Devices & IoT Products | NAVII GPS INDIA",
    description:
      "Explore professional GPS tracking devices, vehicle security and connected IoT products.",
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
      "GPS Tracking Devices & IoT Products | NAVII GPS INDIA",
    description:
      "Professional GPS tracking, vehicle security and IoT products.",
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