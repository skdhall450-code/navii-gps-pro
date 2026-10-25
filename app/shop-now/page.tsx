import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { PageSchema } from "@/components/seo/PageSchema";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShopOffers from "@/components/shop/ShopOffers";
import { SHOP_WHATSAPP } from "@/lib/shop-offers";

export const metadata: Metadata = {
  title: "Shop GPS Devices | Model-wise Prices",
  description: "Explore NAVII GPS model-wise device prices, GST, Airtel SIM, platform and shipping charges, with AIS 140 validity options.",
  alternates: { canonical: "https://naviigps.com/shop-now" },
  openGraph: {
    title: "Shop NAVII GPS Devices | Model-wise Prices",
    description: "Compare BT-50, GX03, GS900 and S-15 prices and AIS 140 validity options with clear GST and service-charge breakdowns.",
    url: "https://naviigps.com/shop-now",
    type: "website",
  },
};

export default function ShopNowPage() {
  const g17Enquiry = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent("Hello NAVII GPS, please share the current G17 device price, GST, Airtel SIM, software platform, shipping/handling and installation charges, with the final payable total and package inclusions.")}`;
  return (
    <>
      <PageSchema path="/shop-now" name="Shop NAVII GPS Devices" type="CollectionPage" description={metadata.description ?? ""} />
      <Header />
      <main className="min-h-screen bg-[#080f1b]">
        <section className="overflow-hidden border-b border-slate-700/60 bg-[#0b192e] text-white">
          <div className="mx-auto grid max-w-7xl gap-9 px-6 py-14 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-20">
            <div>
              <p className="inline-flex rounded-full border-blue-300/30 border bg-blue-300/10 px-4 py-2 text-xs font-bold tracking-[.18em] text-blue-200">NAVII GPS STORE</p>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Shop Now<span className="mt-2 block text-blue-300">Choose your connection.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">Model-wise prices, transparent GST and clearly separated service charges. Explore GPS devices and AIS 140 validity options, then confirm your order details with our team.</p>
              <a href="#device-offers" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200">Explore model prices <ArrowRight size={18} /></a>
              <p className="mt-4 text-xs leading-6 text-slate-400">Enquiry-based ordering. No payment is collected on this page.</p>
            </div>
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white p-5 shadow-2xl shadow-blue-950/50">
              <Image src="/assets/products/bt50/main.png" alt="NAVII BT-50 GPS tracker" width={640} height={640} priority className="h-[260px] w-full object-contain sm:h-[330px]" sizes="(max-width: 768px) 100vw, 40vw" />
              <div className="absolute left-7 top-7 rounded-full bg-blue-800 px-4 py-2 text-xs font-bold tracking-wider text-white">BT-50 GPS DEVICE</div>
            </div>
          </div>
        </section>
        <ShopOffers />
        <section id="g17" className="mx-auto max-w-7xl px-6 pb-16 text-white">
          <div className="rounded-3xl border border-slate-600 bg-[#122138] p-7 md:flex md:items-center md:justify-between md:gap-8 md:p-9">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-300">G17 GPS Tracker</p>
              <h2 className="mt-3 text-2xl font-extrabold">Request the current G17 quote</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">G17 package pricing is being updated. Confirm the current device price, service inclusions, GST and final total with NAVII GPS before ordering.</p>
              <Link href="/products/g17-gps-tracker" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-200 hover:text-white">G17 product specifications <ArrowRight size={16} /></Link>
            </div>
            <a href={g17Enquiry} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 md:mt-0"><MessageCircle size={18} /> Request G17 quote</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
