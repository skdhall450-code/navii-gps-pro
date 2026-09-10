import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HaryanaDistrictGpsPage } from "@/components/seo/HaryanaDistrictGpsPage";
import {
  generateHaryanaDistrictMetadata,
  getHaryanaDistrict,
  haryanaDistricts,
} from "@/lib/seo/haryanaDistricts";

type PageProps = {
  params: Promise<{ state: string; district: string }>;
};

export function generateStaticParams() {
  return haryanaDistricts.map((district) => ({
    state: "haryana",
    district: district.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, district: slug } = await params;
  if (state !== "haryana") return {};
  const district = getHaryanaDistrict(slug);
  return district ? generateHaryanaDistrictMetadata(district) : {};
}

export default async function DistrictGpsTrackerPage({ params }: PageProps) {
  const { state, district: slug } = await params;
  if (state !== "haryana") notFound();
  const district = getHaryanaDistrict(slug);
  if (!district) notFound();
  return <HaryanaDistrictGpsPage district={district} />;
}
