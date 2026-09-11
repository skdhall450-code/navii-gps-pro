import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import { PageSchema } from "@/components/seo/PageSchema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { products } from "@/components/products/data/productsData";
import ProductHero from "@/components/products/details/ProductHero";
import ProductGallery from "@/components/products/details/ProductGallery";
import ProductFeatures from "@/components/products/details/ProductFeatures";
import ProductSpecifications from "@/components/products/details/ProductSpecifications";
import ProductDownloads from "@/components/products/details/ProductDownloads";
import RelatedProducts from "@/components/products/details/RelatedProducts";
import ProductCTA from "@/components/products/details/ProductCTA";

interface PageProps { params: Promise<{ slug: string }>; }
export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return { title: "Product Not Found", robots: { index: false, follow: false } };
  const productUrl = `https://naviigps.com/products/${product.slug}`;
  const productImage = `https://naviigps.com${product.image}`;
  const isG17 = product.slug === "g17-gps-tracker";
  const isBT50 = product.slug === "bt50-vehicle-gps-tracker";
  const isAIDashCamera = product.slug === "ai-dash-camera";
  const isFuelSensor = product.slug === "fuel-monitoring-sensor";
  const isSmartELock = product.slug === "smart-e-lock";
  const isVehicleGps = product.category === "Vehicle GPS";
  const seoTitle = isG17
    ? "G17 GPS Tracker for Cars & Fleets"
    : isBT50
      ? "BT50 Vehicle GPS Tracker | 9V-90V"
      : isAIDashCamera
        ? "AI Dash Camera for Vehicles & Fleets"
        : isFuelSensor
          ? "Fuel Monitoring Sensor for Fleets"
          : isSmartELock
            ? "Smart E-Lock for Cargo & Fleet Security"
            : isVehicleGps ? `${product.name} - GPS Tracking Device` : product.name;
  const seoDescription = isG17
    ? "G17 GPS Tracker for cars, trucks, buses and commercial fleets with real-time GPS tracking, ignition monitoring, route history, geofencing and fleet alerts."
    : isBT50
      ? "BT50 vehicle GPS tracker with 9V-90V input for location monitoring, route history, geofencing and fleet tracking with NAVII GPS."
      : isAIDashCamera
        ? "AI dash camera for commercial vehicles and fleets with journey recording, event review, video telematics and driver-safety monitoring from NAVII GPS."
        : isFuelSensor
          ? "Fuel monitoring sensor for fleets with fuel-level visibility, refill monitoring, consumption reports and fuel-theft alert support from NAVII GPS."
          : isSmartELock
            ? "Smart E-Lock for cargo and logistics security with tamper monitoring, access history and configurable alerts from NAVII GPS."
            : product.shortDescription;
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: uniqueKeywords(isG17
      ? ["G17 GPS Tracker", "G17 GPS tracker for car", "G17 vehicle GPS tracker", "GPS tracker for cars", "GPS tracker for commercial vehicles", "vehicle tracking device", "real-time vehicle tracking", "commercial vehicle GPS tracking", "fleet GPS tracker", "GPS tracking device India"]
      : isBT50
        ? ["BT50 GPS Tracker", "BT50 vehicle GPS tracker", "BT50 GPS tracking device", "GPS tracker for vehicle", "vehicle GPS tracker India", "9V-90V GPS tracker", "commercial vehicle GPS tracker", "real-time vehicle tracking", "fleet GPS tracking device", "vehicle tracking system"]
        : isAIDashCamera
          ? ["AI dash camera for vehicles", "AI dash camera India", "AI dash camera for commercial vehicles", "vehicle dash camera", "fleet dash camera", "AI camera for fleet management", "video telematics camera", "driver safety camera", "fleet video monitoring", "AI dashcam India", "dash camera for trucks", "commercial vehicle dash camera"]
          : isFuelSensor
            ? ["fuel monitoring sensor", "fuel monitoring system for vehicles", "vehicle fuel monitoring system", "fuel level sensor for vehicles", "fuel monitoring system India", "fuel theft monitoring system", "fleet fuel monitoring", "fuel level monitoring for trucks", "fuel consumption monitoring", "GPS fuel monitoring system"]
            : isSmartELock
              ? ["Smart E-Lock", "smart e-lock for vehicles", "electronic cargo lock", "vehicle smart lock", "cargo security lock", "fleet cargo security", "electronic lock for trucks", "tamper monitoring system", "logistics security solution", "smart e-lock India"]
              : undefined),
    alternates: { canonical: productUrl },
    openGraph: { title: seoTitle, description: seoDescription, url: productUrl, siteName: "NAVII GPS INDIA", type: "website", images: [{ url: productImage, alt: product.name }] },
    twitter: { card: "summary_large_image", title: seoTitle, description: seoDescription, images: [productImage] },
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const productUrl = `https://naviigps.com/products/${product.slug}`;
  const isG17 = product.slug === "g17-gps-tracker";
  const breadcrumbStructuredData = { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${productUrl}#breadcrumb`, itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://naviigps.com/" },
    { "@type": "ListItem", position: 2, name: "Products", item: "https://naviigps.com/products" },
    { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
  ] };
  const g17Faq = isG17 ? [
    { "@type": "Question", name: "What is the G17 GPS Tracker?", acceptedAnswer: { "@type": "Answer", text: "The G17 is a wired vehicle GPS tracker for cars, trucks, buses and commercial fleets, with real-time location monitoring and configurable vehicle tracking functions." } },
    { "@type": "Question", name: "Can the G17 track commercial vehicles?", acceptedAnswer: { "@type": "Answer", text: "Yes. The G17 is positioned for commercial vehicle and fleet deployments, including cars, trucks and buses, subject to the selected installation and platform configuration." } },
    { "@type": "Question", name: "What tracking features does the G17 support?", acceptedAnswer: { "@type": "Answer", text: "Supported deployments can include real-time location, ignition status, route history, trip playback, geofencing and overspeed alerts through a compatible GPS tracking platform." } },
    { "@type": "Question", name: "How can I monitor a G17 GPS Tracker?", acceptedAnswer: { "@type": "Answer", text: "Supported G17 deployments can be monitored through the NAVII GPS web and mobile tracking platform after the device is installed and configured." } },
  ] : [];
  const structuredData = [breadcrumbStructuredData, ...(isG17 ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g17Faq }] : [])];
  return (<><PageSchema path={`/products/${product.slug}`} name={product.name} description={product.shortDescription} type="ItemPage" /><Header /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><ProductHero product={product} /><ProductGallery product={product} /><ProductFeatures product={product} /><ProductSpecifications product={product} /><ProductDownloads product={product} />{isG17 && <section className="bg-slate-50 py-14"><div className="mx-auto max-w-5xl px-6"><div className="text-center"><h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">G17 GPS Tracker for Cars, Trucks & Fleets</h2><p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">The NAVII G17 GPS Tracker is designed for vehicle tracking and fleet visibility, helping businesses monitor connected cars, trucks, buses and commercial vehicles from a centralized GPS tracking platform.</p></div><div className="mt-10 grid gap-6 md:grid-cols-2">{g17Faq.map((faq) => <div key={faq.name} className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-bold text-slate-900">{faq.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{faq.acceptedAnswer.text}</p></div>)}</div></div></section>}<RelatedProducts product={product} /><ProductCTA product={product} /></main><Footer /></>);
}
