import type { Metadata } from "next";

import { punjabDistricts } from "@/lib/seo/punjabDistricts";

export type PunjabCitySeo = {
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
  "agricultural supply routes, market movements and seasonal fleet activity",
];

export function toPunjabCitySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const punjabCities: PunjabCitySeo[] = punjabDistricts.flatMap(
  (district, districtIndex) => district.cities.map((name, cityIndex) => {
    const nearbyLocations = district.cities.filter((city) => city !== name);
    const operatingProfile = operatingProfiles[(districtIndex + cityIndex) % operatingProfiles.length];

    return {
      slug: toPunjabCitySlug(name),
      name,
      districtSlug: district.slug,
      districtName: district.name,
      nearbyLocations,
      sectors: district.sectors,
      localContext: `${name} vehicle operations in ${district.name} district can include ${operatingProfile}. Connected planning may also cover ${nearbyLocations.slice(0, 3).join(", ")} and wider Punjab routes.`,
      planningNote: `For GPS tracking around ${name}, confirm the actual vehicle routes, mobile-network availability, compatible hardware and SIM, professional installation, authorized user access and alert responsibilities before deployment.`,
    };
  }),
);

export function getPunjabCity(districtSlug: string, citySlug: string) {
  return punjabCities.find(
    (city) => city.districtSlug === districtSlug && city.slug === citySlug,
  );
}

export function getPunjabCitiesForDistrict(districtSlug: string) {
  return punjabCities.filter((city) => city.districtSlug === districtSlug);
}

export function generatePunjabCityKeywords(city: PunjabCitySeo) {
  const cityVariants = city.name === "Ferozepur" ? [city.name, "Firozpur"] : [city.name];
  return [...new Set([
    ...cityVariants.flatMap((name) => [
      `GPS tracker in ${name}`,
      `GPS tracker ${name} Punjab`,
      `vehicle tracking system ${name}`,
    ]),
    `GPS tracker ${city.name} ${city.districtName}`,
    `car GPS tracker ${city.name}`,
    `truck GPS tracking ${city.name}`,
    `fleet management software ${city.name}`,
    `commercial vehicle tracking ${city.name}`,
    `school bus GPS tracking ${city.name}`,
    `GPS tracking company ${city.name}`,
  ])];
}

export function generatePunjabCityMetadata(city: PunjabCitySeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/punjab/${city.districtSlug}/${city.slug}`;
  const description = `GPS trackers and fleet management software in ${city.name}, ${city.districtName} district, Punjab, for cars, trucks, buses and commercial vehicles.`;

  return {
    title: `GPS Tracker in ${city.name}, ${city.districtName}`,
    description,
    keywords: generatePunjabCityKeywords(city),
    alternates: { canonical: url },
    openGraph: {
      title: `GPS Tracker in ${city.name}, Punjab | NAVII GPS`,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}
