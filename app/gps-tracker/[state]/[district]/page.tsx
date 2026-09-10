import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HaryanaDistrictGpsPage } from "@/components/seo/HaryanaDistrictGpsPage";
import {
  generateHaryanaDistrictMetadata,
  getHaryanaDistrict,
  haryanaDistricts,
} from "@/lib/seo/haryanaDistricts";
import { PunjabDistrictGpsPage } from "@/components/seo/PunjabDistrictGpsPage";
import {
  generatePunjabDistrictMetadata,
  getPunjabDistrict,
  punjabDistricts,
} from "@/lib/seo/punjabDistricts";

type PageProps = {
  params: Promise<{ state: string; district: string }>;
};

export function generateStaticParams() {
  return [
    ...haryanaDistricts.map((district) => ({ state: "haryana", district: district.slug })),
    ...punjabDistricts.map((district) => ({ state: "punjab", district: district.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, district: slug } = await params;
  if (state === "haryana") {
    const district = getHaryanaDistrict(slug);
    return district ? generateHaryanaDistrictMetadata(district) : {};
  }
  if (state === "punjab") {
    const district = getPunjabDistrict(slug);
    return district ? generatePunjabDistrictMetadata(district) : {};
  }
  return {};
}

export default async function DistrictGpsTrackerPage({ params }: PageProps) {
  const { state, district: slug } = await params;
  if (state === "haryana") {
    const district = getHaryanaDistrict(slug);
    if (!district) notFound();
    return <HaryanaDistrictGpsPage district={district} />;
  }
  if (state === "punjab") {
    const district = getPunjabDistrict(slug);
    if (!district) notFound();
    return <PunjabDistrictGpsPage district={district} />;
  }
  notFound();
}
