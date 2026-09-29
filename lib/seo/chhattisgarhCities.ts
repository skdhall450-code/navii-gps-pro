import type { Metadata } from "next";

import { chhattisgarhDistricts } from "@/lib/seo/chhattisgarhDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type ChhattisgarhCitySeo = {
  slug: string;
  name: string;
  districtSlug: string;
  districtName: string;
  nearbyLocations: string[];
  sectors: string[];
  focus: string;
  localContext: string;
  routeChecks: string[];
  sourceUrl: string;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Phase 2 publishes two reviewed priority locations from every Phase 1 district record.
export const chhattisgarhCities: ChhattisgarhCitySeo[] = chhattisgarhDistricts.flatMap((district) =>
  district.cities.filter((name) => slugify(name) !== district.slug).slice(0, 2).map((name) => {
    const slug = slugify(name);
    const focus = `${name} and ${district.name} district commercial, agricultural, industrial, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records`;
    return {
      slug,
      name,
      districtSlug: district.slug,
      districtName: district.name,
      nearbyLocations: district.cities.filter((location) => location !== name),
      sectors: district.sectors,
      focus,
      sourceUrl: district.sourceUrl,
      localContext: `For vehicle operations in ${name}, plan ${focus}. Record the responsible driver, vehicle, route, authorised contact and actual operational outcome. GPS reports support journey review, while job records and signed handovers remain the evidence for the underlying task.`,
      routeChecks: [
        `Confirm the ${name} assignment, responsible driver and authorised contact before dispatch.`,
        `Test device reporting on the actual ${name} route and record network gaps separately from operational delays.`,
        `Reconcile the ${name} job record and receiving acknowledgement with the completed journey before closure.`,
      ],
    };
  }),
);

export function getChhattisgarhCity(districtSlug: string, citySlug: string) {
  return chhattisgarhCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug);
}

export function getChhattisgarhCitiesForDistrict(districtSlug: string) {
  return chhattisgarhCities.filter((city) => city.districtSlug === districtSlug);
}

export function getChhattisgarhCityPath(city: Pick<ChhattisgarhCitySeo, "districtSlug" | "slug">) {
  return `/gps-tracker/chhattisgarh/${city.districtSlug}/${city.slug}`;
}

export function generateChhattisgarhCityMetadata(city: ChhattisgarhCitySeo): Metadata {
  const url = `https://naviigps.com${getChhattisgarhCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, fleet software and installation needs.`;
  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Chhattisgarh`,
      `vehicle tracking system ${city.name}`,
      `vehicle GPS installation ${city.name} ${city.districtName}`,
      `fleet management software ${city.name}`,
      `वाहन GPS ट्रैकर ${city.name}`,
      `जीपीएस ट्रैकर ${city.name}`,
    ]),
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
