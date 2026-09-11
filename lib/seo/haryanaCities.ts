import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";

import { haryanaDistricts } from "@/lib/seo/haryanaDistricts";

export type HaryanaCitySeo = {
  slug: string;
  name: string;
  districtSlug: string;
  districtName: string;
  nearbyLocations: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
};

const operatingProfiles = [
  "daily dispatch, customer-service vehicles and town-to-district movements",
  "commercial deliveries, return trips and mixed urban-rural operations",
  "scheduled fleet routes, field teams and time-sensitive vehicle movements",
  "local distribution, institutional vehicles and connections to regional roads",
  "industrial journeys, staff transport and multi-stop fleet operations",
];

export function toHaryanaCitySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const haryanaCities: HaryanaCitySeo[] = haryanaDistricts.flatMap(
  (district, districtIndex) => district.cities.map((name, cityIndex) => {
    const nearbyLocations = district.cities.filter((city) => city !== name);
    const operatingProfile = operatingProfiles[(districtIndex + cityIndex) % operatingProfiles.length];

    return {
      slug: toHaryanaCitySlug(name),
      name,
      districtSlug: district.slug,
      districtName: district.name,
      nearbyLocations,
      sectors: district.sectors,
      localContext: `${name} vehicle operations in ${district.name} district can include ${operatingProfile}. Connected planning may also cover ${nearbyLocations.slice(0, 3).join(", ")} and wider Haryana routes.`,
      planningNote: `For GPS tracking around ${name}, confirm the actual vehicle routes, mobile-network availability, compatible hardware and SIM, professional installation, authorized user access and alert responsibilities before deployment.`,
    };
  }),
);

export function getHaryanaCity(districtSlug: string, citySlug: string) {
  return haryanaCities.find(
    (city) => city.districtSlug === districtSlug && city.slug === citySlug,
  );
}

export function getHaryanaCitiesForDistrict(districtSlug: string) {
  return haryanaCities.filter((city) => city.districtSlug === districtSlug);
}

export function generateHaryanaCityKeywords(city: HaryanaCitySeo) {
  return [...new Set([
    `GPS tracker in ${city.name}`,
    `GPS tracker ${city.name} Haryana`,
    `GPS tracker ${city.name} ${city.districtName}`,
    `vehicle tracking system ${city.name}`,
    `car GPS tracker ${city.name}`,
    `truck GPS tracking ${city.name}`,
    `fleet management software ${city.name}`,
    `commercial vehicle tracking ${city.name}`,
    `school bus GPS tracking ${city.name}`,
    `GPS tracking company ${city.name}`,
  ])];
}

export function generateHaryanaCityMetadata(city: HaryanaCitySeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/haryana/${city.districtSlug}/${city.slug}`;
  const description = `GPS trackers and fleet management software in ${city.name}, ${city.districtName} district, Haryana, for cars, trucks, buses and commercial vehicles.`;

  return {
    title: `GPS Tracker in ${city.name}, ${city.districtName}`,
    description,
    keywords: uniqueKeywords([...new Set([...generateHaryanaCityKeywords(city), ...generateLocalKeywords(city.name, city.sectors)])]),
    alternates: { canonical: url },
    openGraph: {
      title: `GPS Tracker in ${city.name}, Haryana | NAVII GPS`,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}
