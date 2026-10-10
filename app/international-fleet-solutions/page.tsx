import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { PageSchema } from "@/components/seo/PageSchema";
import { internationalIndustries } from "@/lib/seo/internationalIndustries";
import { internationalRobots } from "@/lib/seo/internationalStatus";
const url = "https://naviigps.com/international-fleet-solutions";
const title = "International Fleet GPS Tracking by Industry";
const description = "Compare international GPS tracking workflows for freight, delivery, passenger and rental fleets. Plan devices, reporting, installation and deployment reviews.";
export const metadata: Metadata = { title, description, robots: internationalRobots, alternates: { canonical: url }, openGraph: { title, description, url, type: "website", images: ["/og-image.jpg"] }, twitter: { title, description, card: "summary_large_image", images: ["/og-image.jpg"] } };
export default function Page() { return <><Header /><main><PageSchema path="/international-fleet-solutions" name={title} description={description} type="CollectionPage" /><section className="bg-[#06142E] py-24 text-white"><div className="mx-auto max-w-7xl px-6"><h1 className="text-4xl font-extrabold md:text-6xl">International GPS tracking by fleet industry</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Select the workflow your dispatchers need to manage, then review the target country, vehicle compatibility, mobile network and installation arrangements with NAVII GPS.</p><Link href="/gps-tracker-international" className="mt-6 inline-block text-cyan-200 underline">Browse all country guides</Link></div></section><section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-2">{internationalIndustries.map(item => <article key={item.slug} className="rounded-2xl border border-slate-200 p-8"><h2 className="text-2xl font-bold text-slate-900"><Link href={`/international-fleet-solutions/${item.slug}`}>{item.name}</Link></h2><p className="mt-4 leading-7 text-slate-600">{item.description}</p><Link href={`/international-fleet-solutions/${item.slug}`} className="mt-6 inline-block font-semibold text-blue-700 underline">Review deployment workflow</Link></article>)}</section></main><Footer /></>; }
