import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { HaryanaCityGpsPage } from "@/components/seo/HaryanaCityGpsPage";
import { PunjabCityGpsPage } from "@/components/seo/PunjabCityGpsPage";
import { DelhiAreaGpsPage } from "@/components/seo/DelhiAreaGpsPage";
import { UttarPradeshCityGpsPage } from "@/components/seo/UttarPradeshCityGpsPage";
import { TamilNaduCityGpsPage } from "@/components/seo/TamilNaduCityGpsPage";
import { KarnatakaCityGpsPage } from "@/components/seo/KarnatakaCityGpsPage";
import { uttarPradeshCities, getUttarPradeshCity, generateUttarPradeshCityMetadata } from "@/lib/seo/uttarPradeshCities";
import { tamilNaduCities, getTamilNaduCity, generateTamilNaduCityMetadata } from "@/lib/seo/tamilNaduCities";
import { karnatakaCities, getKarnatakaCity, generateKarnatakaCityMetadata } from "@/lib/seo/karnatakaCities";
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
    ...uttarPradeshCities.map((city) => ({
      state: "uttar-pradesh",
      district: city.districtSlug,
      city: city.slug,
    })),
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
    ...tamilNaduCities.map((city) => ({
      state: "tamil-nadu",
      district: city.districtSlug,
      city: city.slug,
    })),
    ...karnatakaCities.map((city) => ({
      state: "karnataka",
      district: city.districtSlug,
      city: city.slug,
    })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, district, city: citySlug } = await params;
  if (state === "uttar-pradesh") {
    const city = getUttarPradeshCity(district, citySlug);
    if (!city) notFound();
    return generateUttarPradeshCityMetadata(city);
  }
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
  if (state === "tamil-nadu") {
    const city = getTamilNaduCity(district, citySlug);
    return city ? generateTamilNaduCityMetadata(city) : {};
  }
  if (state === "karnataka") {
    const city = getKarnatakaCity(district, citySlug);
    return city ? generateKarnatakaCityMetadata(city) : {};
  }
  return {};
}

export default async function CityGpsTrackerPage({ params }: PageProps) {
  const { state, district, city: citySlug } = await params;
  if (citySlug === district) {
    permanentRedirect(`/gps-tracker/${state}/${district}`);
  }
  if (state === "uttar-pradesh") {
    const city = getUttarPradeshCity(district, citySlug);
    if (!city) notFound();
    return <UttarPradeshCityGpsPage city={city} />;
  }
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
  if (state === "tamil-nadu") {
    const city = getTamilNaduCity(district, citySlug);
    if (!city) notFound();
    return <TamilNaduCityGpsPage city={city} />;
  }
  if (state === "karnataka") {
    const city = getKarnatakaCity(district, citySlug);
    if (!city) notFound();
    return <KarnatakaCityGpsPage city={city} />;
  }
  notFound();
}
