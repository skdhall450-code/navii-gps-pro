import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import ScrollProgress from "@/components/common/ScrollProgress";
import BackToTop from "@/components/common/BackToTop";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.naviigps.com"),

  title: {
    default: "NAVII GPS INDIA (OPC) PVT LTD",
    template: "%s | NAVII GPS INDIA",
  },

  description:
    "NAVII GPS INDIA provides GPS Tracking Systems, Fleet Management Software, AIS 140 GPS Devices, AI Dashcams, Fuel Monitoring and IoT Solutions across India.",

  keywords: [
    "GPS Tracking",
    "Vehicle Tracking",
    "Fleet Management",
    "NAVII GPS",
    "AIS 140 GPS",
    "AI Dashcam",
    "Fuel Monitoring",
    "Asset Tracking",
    "IoT Solutions",
    "GPS Software",
  ],

  authors: [
    {
      name: "NAVII GPS INDIA (OPC) PVT LTD",
    },
  ],

  creator: "NAVII GPS INDIA",

  publisher: "NAVII GPS INDIA",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title: "NAVII GPS INDIA",
    description:
      "Professional GPS Tracking, Fleet Management and IoT Solutions.",

    url: "https://www.naviigps.com",

    siteName: "NAVII GPS",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "NAVII GPS INDIA",

    description:
      "GPS Tracking, Fleet Management & IoT Solutions",

    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <ScrollProgress />

        {children}

        <BackToTop />

        <FloatingWhatsApp />

      </body>

    </html>
  );
}