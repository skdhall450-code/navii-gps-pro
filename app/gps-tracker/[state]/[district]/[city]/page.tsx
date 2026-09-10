import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HaryanaCityGpsPage } from "@/components/seo/HaryanaCityGpsPage";
import {
  generateHaryanaCityMetadata,
  getHaryanaCity,
  haryanaCities,
} from "@/lib/seo/haryanaCities";

type PageProps = {
  params: Promise<{ state: string; district: string; city: string }>;
};

export function generateStaticParams() {
  return haryanaCities.map((city) => ({
    state: "haryana",
    district: city.districtSlug,
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, district, city: citySlug } = await params;
  if (state !== "haryana") return {};
  const city = getHaryanaCity(district, citySlug);
  return city ? generateHaryanaCityMetadata(city) : {};
}

export default async function HaryanaCityPage({ params }: PageProps) {
  const { state, district, city: citySlug } = await params;
  if (state !== "haryana") notFound();
  const city = getHaryanaCity(district, citySlug);
  if (!city) notFound();
  return <HaryanaCityGpsPage city={city} />;
}
