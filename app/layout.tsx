import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import "leaflet/dist/leaflet.css";

import ScrollProgress from "@/components/common/ScrollProgress";
import BackToTop from "@/components/common/BackToTop";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#06142E",
  colorScheme: "light",
};

export const metadata: Metadata = {
  applicationName: "NAVII GPS INDIA",
  category: "technology",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL("https://naviigps.com"),

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

  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },

  openGraph: {
    title: "NAVII GPS INDIA",
    description:
      "Professional GPS Tracking, Fleet Management and IoT Solutions.",

    url: "https://naviigps.com",

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

    description: "GPS Tracking, Fleet Management & IoT Solutions",

    images: ["/og-image.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "https://naviigps.com/#organization",
      name: "NAVII GPS INDIA (OPC) PVT LTD",
      alternateName: "NAVII GPS INDIA",
      url: "https://naviigps.com",
      logo: {
        "@type": "ImageObject",
        url: "https://naviigps.com/assets/logo/logo.png",
        width: 1254,
        height: 1254,
      },
      image: "https://naviigps.com/og-image.jpg",
      description:
        "NAVII GPS INDIA provides GPS tracking devices, fleet management software, vehicle security, fuel monitoring and connected IoT solutions across India.",
      telephone: "+918899729705",
      email: "helpline@naviigps.com",
      priceRange: "Contact for pricing",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "SCO 46, 2nd Floor, GBP Business Square, Near GBP Rosewood Gate No. 1, Barwala Road",
        addressLocality: "Dera Bassi",
        addressRegion: "Punjab",
        postalCode: "140507",
        addressCountry: "IN",
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:30",
          closes: "18:30",
        },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: "+918899729705",
          email: "info@naviigps.com",
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN",
        },
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: "+917717394007",
          email: "helpline@naviigps.com",
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://naviigps.com/#website",
      url: "https://naviigps.com",
      name: "NAVII GPS INDIA",
      description:
        "GPS tracking, fleet management and connected IoT solutions.",
      publisher: {
        "@id": "https://naviigps.com/#organization",
      },
      inLanguage: "en-IN",
    },
  ],
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
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function () {
              window.dataLayer.push(arguments);
            };

            window.gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <ScrollProgress />

        {children}

        <BackToTop />

        <FloatingWhatsApp />

        <GoogleAnalytics />
      </body>
    </html>
  );
}
