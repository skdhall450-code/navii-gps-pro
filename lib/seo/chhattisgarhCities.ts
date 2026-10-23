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
    return {
      slug,
      name,
      districtSlug: district.slug,
      districtName: district.name,
      nearbyLocations: district.cities.filter((location) => location !== name),
      sectors: district.sectors,
      focus: `${name} fleet assignments, route testing and journey review`,
      sourceUrl: district.sourceUrl,
      localContext: `For fleets based in ${name}, list the vehicles, responsible drivers and planned stops in ${district.name} district and on onward routes. Match each trip to its job record and authorised contact. GPS reports support journey review; delivery receipts and signed handovers confirm the underlying work.`,
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
  const description = `Compare GPS trackers for ${city.name}, ${city.districtName}. Plan vehicle fitting, route tests, fleet reports and ongoing costs.`;
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
