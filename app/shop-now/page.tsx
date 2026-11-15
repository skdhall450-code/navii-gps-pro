import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageSchema } from "@/components/seo/PageSchema";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { NAVII_SHOP_URL } from "@/lib/shop-destination";

export const metadata: Metadata = {
  title: "Shop GPS Devices & Dash Cams | Official Store",
  description: "Visit the official NAVII GPS store for current GPS devices, dash cams, package details and availability.",
  alternates: { canonical: "https://naviigps.com/shop-now" },
  openGraph: {
    title: "Shop NAVII GPS Devices | Official Store",
    description: "Visit our official store for current GPS device and dash cam offers and package details.",
    url: "https://naviigps.com/shop-now",
    type: "website",
    images: [{ url: "/assets/products/bt50/main.png", alt: "NAVII BT-50 GPS device" }],
  },
};

export default function ShopNowPage() {
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
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">Our storefront has moved to shop.naviigps.com. Browse the current catalogue there and confirm pricing, package inclusions and availability before ordering.</p>
              <a href={NAVII_SHOP_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200">Open NAVII Shop <ArrowRight size={18} /></a>
              <p className="mt-4 text-xs leading-6 text-slate-400">Opens the official store in a new tab. No payment is collected on this page.</p>
            </div>
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white p-5 shadow-2xl shadow-blue-950/50">
              <Image src="/assets/products/bt50/main.png" alt="NAVII BT-50 GPS tracker" width={640} height={640} priority className="h-[260px] w-full object-contain sm:h-[330px]" sizes="(max-width: 768px) 100vw, 40vw" />
              <div className="absolute left-7 top-7 rounded-full bg-blue-800 px-4 py-2 text-xs font-bold tracking-wider text-white">BT-50 GPS DEVICE</div>
            </div>
          </div>
        </section>


      </main>
      <Footer />
    </>
  );
}
