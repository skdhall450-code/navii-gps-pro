import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, MapPin, MessageCircle, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { PageSchema } from "@/components/seo/PageSchema";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { products } from "@/components/products/data/productsData";

export const metadata: Metadata = {
  title: "Shop GPS Trackers Online | G17 Offer",
  description:
    "Shop NAVII GPS vehicle trackers with transparent device, annual Airtel SIM, platform and shipping prices. G17 is the first model available.",
  alternates: { canonical: "https://naviigps.com/shop-now" },
  openGraph: {
    title: "Shop NAVII GPS Trackers | G17 Offer",
    description:
      "See the G17 first-year package price, annual SIM and platform charges, shipping rates and product catalog.",
    url: "https://naviigps.com/shop-now",
    type: "website",
    images: [{ url: "/posters/NAVII_GPS_G17_Offer_Status_Poster.jpg", width: 1080, height: 1920, alt: "NAVII GPS G17 first-year offer poster" }],
  },
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export default function ShopNowPage() {
  const product = products.find((item) => item.slug === "g17-gps-tracker");
  if (!product?.pricing) notFound();

  const pricing = product.pricing;
  const gstRate = pricing.gstRatePercent / 100;
  const deviceGst = pricing.deviceSaleInr * gstRate;
  const simBeforeGst = pricing.airtelSimMonthlyInr * 12;
  const simGst = simBeforeGst * gstRate;
  const platformGst = pricing.platformAnnualInr * gstRate;
  const deviceTotal = pricing.deviceSaleInr + deviceGst;
  const simTotal = simBeforeGst + simGst;
  const platformTotal = pricing.platformAnnualInr + platformGst;
  const firstYearTotal = deviceTotal + simTotal + platformTotal;
  const renewalTotal = simTotal + platformTotal;
  const orderMessage = encodeURIComponent(
    "Hello NAVII GPS, I would like to order the G17 GPS Tracker. Please confirm availability and the shipping charge from Dera Bassi for my delivery PIN code. I understand the first-year package is Rs 1,463.20 before shipping.",
  );
  const orderUrl = `https://wa.me/${product.whatsapp}?text=${orderMessage}`;

  return (
    <>
      <PageSchema
        path="/shop-now"
        name="Shop NAVII GPS Devices"
        type="CollectionPage"
        description={metadata.description ?? ""}
      />
      <Header />
      <main className="min-h-screen bg-slate-50">
        <section className="overflow-hidden bg-[#06142E] text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-20">
            <div>
              <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold tracking-wide text-cyan-200">
                NAVII GPS STORE
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
                Shop Now
                <span className="block text-cyan-300">Clear prices. Connected tracking.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Product-wise pricing includes the tracker, first 12 months of Airtel IoT SIM service, and annual NAVII GPS platform access. Models will be added as their prices are confirmed.
              </p>
              <a href="#g17" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500">
                See G17 offer <ArrowRight size={18} />
              </a>
            </div>
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white p-5 shadow-2xl shadow-blue-950/50">
              <Image
                src={product.image}
                alt="NAVII G17 wired GPS tracker"
                width={640}
                height={640}
                priority
                className="h-[320px] w-full object-contain sm:h-[380px]"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute left-8 top-8 rounded-full bg-blue-700 px-4 py-2 text-xs font-extrabold tracking-wider text-white shadow-lg">
                G17 GPS TRACKER
              </div>
            </div>
          </div>
        </section>

        <section id="g17" className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Featured product</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-950 md:text-4xl">G17 GPS Tracker</h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">{product.shortDescription}</p>
            </div>
            <Link href="/products/g17-gps-tracker" className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900">
              Full product specifications <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-7 lg:grid-cols-[.9fr_1.1fr]">
            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">{product.category}</span>
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">{product.badge}</span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-slate-950">G17 device offer</h3>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-4xl font-extrabold text-blue-700">{money(pricing.deviceSaleInr)}</span>
                <span className="font-semibold text-slate-600">+ {pricing.gstRatePercent}% GST</span>
                <span className="text-sm text-slate-500 line-through">MRP {money(pricing.deviceMrpInr)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">Device price before GST; taxes are shown in the breakdown.</p>

              <div className="mt-7 space-y-4">
                {product.features.slice(0, 5).map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-slate-700">
                    <ShieldCheck size={19} className="mt-0.5 shrink-0 text-blue-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={orderUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700">
                  <MessageCircle size={18} /> Order on WhatsApp
                </a>
                <a href="/catalogs/NAVII_GPS_G17_Product_Catalogue.pdf" download className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-bold text-blue-800 transition hover:bg-blue-100">
                  <Download size={18} /> Product PDF
                </a>
              </div>
              <a href="/posters/NAVII_GPS_G17_Offer_Status_Poster.jpg" download className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
                <Download size={16} /> Download Facebook / WhatsApp Status poster
              </a>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">First 12 months</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-950">Complete price breakdown</h3>
                </div>
                <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-blue-600">Year-one total before shipping</span>
                  <span className="text-2xl font-extrabold">{money(firstYearTotal)}</span>
                </div>
              </div>

              <div className="mt-5 divide-y divide-slate-100">
                <PriceRow label="G17 GPS tracker" detail={`${money(pricing.deviceSaleInr)} + ${money(deviceGst)} GST`} amount={deviceTotal} />
                <PriceRow label="Airtel IoT SIM - 12 months" detail={`${money(simBeforeGst)} + ${money(simGst)} GST (${money(pricing.airtelSimMonthlyInr)} / month)`} amount={simTotal} />
                <PriceRow label="NAVII GPS platform - 12 months" detail={`${money(pricing.platformAnnualInr)} + ${money(platformGst)} GST`} amount={platformTotal} />
              </div>

              <div className="mt-6 grid gap-4 rounded-2xl bg-slate-950 p-5 text-white sm:grid-cols-2">
                <div className="flex gap-3">
                  <Truck size={20} className="mt-0.5 shrink-0 text-cyan-300" />
                  <div>
                    <p className="font-bold">Shipping from Dera Bassi</p>
                    <p className="mt-1 text-sm text-slate-300">Up to 500 km: {money(pricing.shippingUpTo500KmInr)}</p>
                    <p className="text-sm text-slate-300">Over 500 km: {money(pricing.shippingOver500KmInr)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <PackageCheck size={20} className="mt-0.5 shrink-0 text-cyan-300" />
                  <div>
                    <p className="font-bold">Annual renewal</p>
                    <p className="mt-1 text-sm text-slate-300">From year two, SIM + platform: {money(renewalTotal)} / year.</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 flex gap-2 text-sm leading-6 text-slate-500">
                <MapPin size={17} className="mt-0.5 shrink-0 text-blue-600" />
                Shipping distance is measured from Dera Bassi. Share your delivery PIN code on WhatsApp to confirm the distance and charge. The first-year total above includes 18% GST on the device, SIM and platform lines; shipping is additional.
              </p>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-sm font-semibold text-slate-700">Included in first-year total</p>
                <p className="mt-1 text-sm text-slate-500">G17 hardware + 12-month Airtel IoT SIM plan + 12-month NAVII GPS platform access.</p>
              </div>
            </article>
          </div>

          <div className="mt-12 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-7 md:flex md:items-center md:justify-between md:p-9">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">More models coming</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-950">Model-wise offers will be added here</h3>
              <p className="mt-2 max-w-2xl text-slate-600">Each listing will show its own hardware price, annual SIM and platform charges, taxes, shipping and renewal details.</p>
            </div>
            <Link href="/contact" className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800 md:mt-0">
              Ask NAVII GPS <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PriceRow({ label, detail, amount }: { label: string; detail: string; amount: number }) {
  return (
    <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-bold text-slate-900">{label}</p>
        <p className="mt-1 text-sm text-slate-500">{detail}</p>
      </div>
      <p className="text-lg font-extrabold text-slate-950">{money(amount)}</p>
    </div>
  );
}
