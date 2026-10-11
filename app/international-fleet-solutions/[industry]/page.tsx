import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";
import { PageSchema } from "@/components/seo/PageSchema";
import { TrackingSolutionLinks } from "@/components/seo/TrackingSolutionLinks";
import { internationalIndustries } from "@/lib/seo/internationalIndustries";
import { getInternationalCountry } from "@/lib/seo/internationalCountries";
import { internationalRobots } from "@/lib/seo/internationalStatus";
type Props = { params: Promise<{ industry: string }> };
export function generateStaticParams() { return internationalIndustries.map(item => ({ industry: item.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params; const item = internationalIndustries.find(x => x.slug === industry); if (!item) return {};
  const title = `International GPS Tracking for ${item.name}`; const url = `https://naviigps.com/international-fleet-solutions/${item.slug}`;
  return { title, description: item.description, robots: internationalRobots, alternates: { canonical: url }, openGraph: { title, description: item.description, url, type: "website", images: ["/og-image.jpg"] }, twitter: { title, description: item.description, card: "summary_large_image", images: ["/og-image.jpg"] } };
}
export default async function Page({ params }: Props) {
  const { industry } = await params; const item = internationalIndustries.find(x => x.slug === industry); if (!item) notFound();
  return <><Header /><main><PageSchema path={`/international-fleet-solutions/${item.slug}`} name={`International ${item.name} GPS Tracking`} description={item.description} />
    <section className="bg-[#06142E] py-24 text-white"><div className="mx-auto max-w-7xl px-6"><Link href="/international-fleet-solutions" className="text-cyan-200 underline">International industry guides</Link><h1 className="mt-6 max-w-4xl text-4xl font-extrabold md:text-6xl">International GPS tracking for {item.name.toLowerCase()}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{item.description}</p></div></section>
    <section className="mx-auto max-w-5xl px-6 py-20"><h2 className="text-3xl font-bold text-slate-900">Plan and test the fleet workflow</h2><ol className="mt-8 list-decimal space-y-6 pl-6 leading-8 text-slate-700">{item.steps.map(step => <li key={step}>{step}</li>)}</ol><h2 className="mt-12 text-3xl font-bold text-slate-900">Related country planning guides</h2><div className="mt-6 flex flex-wrap gap-5">{item.countries.map(slug => <Link key={slug} href={`/gps-tracker/${slug}`} className="font-semibold text-blue-700 underline">{getInternationalCountry(slug).name}</Link>)}</div><h2 className="mt-12 text-3xl font-bold text-slate-900">Confirm the proposed setup before rollout</h2><p className="mt-5 leading-8 text-slate-600">Share the country, fleet size, vehicle models, routes and desired reports. Confirm device and SIM compatibility, installation responsibility, available platform features and the full initial and renewal costs. Start with a representative vehicle and agree acceptance checks before expanding.</p><Link href="/contact" className="mt-7 inline-block rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white">Discuss international fleet requirements</Link></section>
    <TrackingSolutionLinks location="your international fleet" sectors={item.sectors} />
  </main><Footer /></>;
}
