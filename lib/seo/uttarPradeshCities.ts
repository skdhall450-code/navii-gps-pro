import type { Metadata } from "next";
import seeds from "@/lib/seo/uttarPradeshCitySeeds.json";
import { getUttarPradeshDistrict } from "@/lib/seo/uttarPradeshDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type UttarPradeshCitySeo = (typeof seeds)[number] & {
  districtName: string;
  nearbyLocations: string[];
};

// Curated priority towns only: district membership is sourced, and each record
// has an authored operating scenario. Do not auto-expand every district label.
export const uttarPradeshCities: UttarPradeshCitySeo[] = seeds.map((seed) => {
  const district = getUttarPradeshDistrict(seed.districtSlug);
  if (!district || !district.cities.includes(seed.name)) {
    throw new Error(`Invalid Uttar Pradesh city mapping: ${seed.districtSlug}/${seed.slug}`);
  }
  return {
    ...seed,
    districtName: district.name,
    nearbyLocations: district.cities.filter((name) => name !== seed.name),
  };
});

export function getUttarPradeshCity(districtSlug: string, citySlug: string) {
  return uttarPradeshCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug);
}

export function getUttarPradeshCitiesForDistrict(districtSlug: string) {
  return uttarPradeshCities.filter((city) => city.districtSlug === districtSlug);
}

export function getUttarPradeshCityPath(city: Pick<UttarPradeshCitySeo, "districtSlug" | "slug">) {
  return `/gps-tracker/uttar-pradesh/${city.districtSlug}/${city.slug}`;
}

export function generateUttarPradeshCityMetadata(city: UttarPradeshCitySeo): Metadata {
  const url = `https://naviigps.com${getUttarPradeshCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, route reports and installation needs.`;
  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Uttar Pradesh`,
      `vehicle GPS installation ${city.name} ${city.districtName}`,
    ]),
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
