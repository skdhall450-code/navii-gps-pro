import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HaryanaCityGpsPage } from "@/components/seo/HaryanaCityGpsPage";
import { PunjabCityGpsPage } from "@/components/seo/PunjabCityGpsPage";
import { DelhiAreaGpsPage } from "@/components/seo/DelhiAreaGpsPage";
import {
  generateHaryanaCityMetadata,
  getHaryanaCity,
  haryanaCities,
} from "@/lib/seo/haryanaCities";
import {
  generatePunjabCityMetadata,
  getPunjabCity,
  punjabCities,
} from "@/lib/seo/punjabCities";
import {
  delhiAreas,
  generateDelhiAreaMetadata,
  getDelhiArea,
} from "@/lib/seo/delhiAreas";

type PageProps = {
  params: Promise<{ state: string; district: string; city: string }>;
};

export function generateStaticParams() {
  return [
    ...haryanaCities.map((city) => ({
      state: "haryana",
      district: city.districtSlug,
      city: city.slug,
    })),
    ...punjabCities.map((city) => ({
      state: "punjab",
      district: city.districtSlug,
      city: city.slug,
    })),
    ...delhiAreas.map((area) => ({
      state: "delhi",
      district: area.districtSlug,
      city: area.slug,
    })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, district, city: citySlug } = await params;
  if (state === "haryana") {
    const city = getHaryanaCity(district, citySlug);
    return city ? generateHaryanaCityMetadata(city) : {};
  }
  if (state === "punjab") {
    const city = getPunjabCity(district, citySlug);
    return city ? generatePunjabCityMetadata(city) : {};
  }
  if (state === "delhi") {
    const area = getDelhiArea(district, citySlug);
    return area ? generateDelhiAreaMetadata(area) : {};
  }
  return {};
}

export default async function CityGpsTrackerPage({ params }: PageProps) {
  const { state, district, city: citySlug } = await params;
  if (state === "haryana") {
    const city = getHaryanaCity(district, citySlug);
    if (!city) notFound();
    return <HaryanaCityGpsPage city={city} />;
  }
  if (state === "punjab") {
    const city = getPunjabCity(district, citySlug);
    if (!city) notFound();
    return <PunjabCityGpsPage city={city} />;
  }
  if (state === "delhi") {
    const area = getDelhiArea(district, citySlug);
    if (!area) notFound();
    return <DelhiAreaGpsPage area={area} />;
  }
  notFound();
}
