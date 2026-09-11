import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";

import { delhiDistricts } from "@/lib/seo/delhiDistricts";

export type DelhiAreaSeo = {
  slug: string;
  name: string;
  districtSlug: string;
  districtName: string;
  nearbyAreas: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
};

const operatingProfiles = [
  "daily dispatch, customer-service vehicles and multi-stop local movements",
  "commercial deliveries, return trips and connections to major Delhi corridors",
  "scheduled fleet routes, field teams and time-sensitive vehicle movements",
  "local distribution, institutional vehicles and district-to-district journeys",
  "industrial operations, staff transport and high-frequency fleet activity",
  "market supply routes, last-mile delivery and mixed neighbourhood traffic",
];

export function toDelhiAreaSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const delhiAreas: DelhiAreaSeo[] = delhiDistricts.flatMap(
  (district, districtIndex) => district.areas.map((name, areaIndex) => {
    const nearbyAreas = district.areas.filter((area) => area !== name);
    const operatingProfile = operatingProfiles[(districtIndex + areaIndex) % operatingProfiles.length];

    return {
      slug: toDelhiAreaSlug(name),
      name,
      districtSlug: district.slug,
      districtName: district.name,
      nearbyAreas,
      sectors: district.sectors,
      localContext: `${name} vehicle operations in ${district.name} district can include ${operatingProfile}. Connected planning may also cover ${nearbyAreas.slice(0, 3).join(", ")} and wider Delhi NCR routes.`,
      planningNote: `For GPS tracking around ${name}, confirm actual vehicle routes, mobile-network availability, compatible hardware and SIM, professional installation, authorized user access, data retention and alert responsibilities before deployment.`,
    };
  }),
);

export function getDelhiArea(districtSlug: string, areaSlug: string) {
  return delhiAreas.find(
    (area) => area.districtSlug === districtSlug && area.slug === areaSlug,
  );
}

export function getDelhiAreasForDistrict(districtSlug: string) {
  return delhiAreas.filter((area) => area.districtSlug === districtSlug);
}

export function generateDelhiAreaKeywords(area: DelhiAreaSeo) {
  return [...new Set([
    `GPS tracker in ${area.name}`,
    `GPS tracker ${area.name} Delhi`,
    `GPS tracker ${area.name} ${area.districtName} district`,
    `vehicle tracking system ${area.name}`,
    `car GPS tracker ${area.name}`,
    `truck GPS tracking ${area.name}`,
    `fleet management software ${area.name}`,
    `commercial vehicle tracking ${area.name}`,
    `school bus GPS tracking ${area.name}`,
    `GPS tracking company ${area.name}`,
  ])];
}

export function generateDelhiAreaMetadata(area: DelhiAreaSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/delhi/${area.districtSlug}/${area.slug}`;
  const description = `GPS trackers and fleet management software in ${area.name}, ${area.districtName} district, Delhi, for cars, trucks, buses and commercial vehicles.`;

  return {
    title: `GPS Tracker in ${area.name}, Delhi`,
    description,
    keywords: uniqueKeywords([...new Set([...generateDelhiAreaKeywords(area), ...generateLocalKeywords(area.name, area.sectors)])]),
    alternates: { canonical: url },
    openGraph: {
      title: `GPS Tracker in ${area.name}, Delhi | NAVII GPS`,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}
