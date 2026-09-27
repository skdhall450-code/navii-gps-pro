import type { Metadata } from "next";

import { keralaDistricts } from "@/lib/seo/keralaDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type KeralaCitySeo = {
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

type CitySeed = [districtSlug: string, slug: string, name: string, focus: string];

// Phase 2 publishes two curated locations within each Kerala district.
// It does not automatically generate pages for every locality.
const keralaCitySeeds: CitySeed[] = [
  ["thiruvananthapuram", "neyyattinkara", "Neyyattinkara", "Tamil Nadu corridor, local delivery and passenger trips coordinated with vehicle assignments, scheduled stops and trip closure records"],
  ["thiruvananthapuram", "attingal", "Attingal", "capital-region distribution and service fleets planned through dispatch windows, authorised contacts and completed-job records"],
  ["kollam", "punalur", "Punalur", "hill-corridor freight, plantation supply and passenger journeys coordinated with route notes, driver check-ins and receiving confirmation"],
  ["kollam", "karunagappally", "Karunagappally", "coastal commercial and industrial trips managed with loading records, planned stops and destination acknowledgements"],
  ["pathanamthitta", "adoor", "Adoor", "regional distribution and passenger operations organised through route rosters, vehicle assignments and documented journey closure"],
  ["pathanamthitta", "thiruvalla", "Thiruvalla", "interdistrict commercial and passenger movements coordinated with dispatch timing, authorised stops and service records"],
  ["alappuzha", "cherthala", "Cherthala", "coastal distribution, tourism support and manufacturing trips matched with schedules, route plans and receiving records"],
  ["alappuzha", "kayamkulam", "Kayamkulam", "highway-linked retail, service and passenger journeys coordinated through job sheets, planned stops and trip completion"],
  ["kottayam", "changanassery", "Changanassery", "regional wholesale and passenger fleets managed with dispatch lists, scheduled calls and customer acknowledgements"],
  ["kottayam", "pala", "Pala", "rubber-belt agricultural collection and service routes planned through supplier contacts, pickup records and receiving confirmation"],
  ["idukki", "thodupuzha", "Thodupuzha", "hill-district commercial and agricultural trips coordinated with route conditions, driver assignments and delivery records"],
  ["idukki", "munnar", "Munnar", "tourism and plantation vehicles planned around approved itineraries, hill-route checks and completed-service records"],
  ["ernakulam", "perumbavoor", "Perumbavoor", "industrial, timber-market and regional distribution fleets coordinated through dispatch windows, gate schedules and receiving records"],
  ["ernakulam", "aluva", "Aluva", "airport-corridor, industrial and employee transport managed with shift rosters, planned stops and journey records"],
  ["thrissur", "chalakudy", "Chalakudy", "highway, tourism and commercial distribution trips planned through vehicle assignments, scheduled calls and receiving records"],
  ["thrissur", "irinjalakuda", "Irinjalakuda", "regional wholesale and service fleets coordinated with dispatch notes, delivery windows and customer handovers"],
  ["palakkad", "ottapalam", "Ottapalam", "regional passenger and agricultural distribution routes managed through route rosters, pickup schedules and job closure"],
  ["palakkad", "shoranur", "Shoranur", "rail-linked commercial, industrial and passenger movements coordinated with dispatch timing, authorised stops and trip records"],
  ["malappuram", "manjeri", "Manjeri", "dense regional delivery and passenger operations organised through shift assignments, route groups and completed-job records"],
  ["malappuram", "perinthalmanna", "Perinthalmanna", "healthcare-support, retail and intercity trips coordinated with time windows, authorised contacts and service completion"],
  ["kozhikode", "vadakara", "Vadakara", "coastal and highway distribution fleets planned with consignment references, scheduled stops and destination receipts"],
  ["kozhikode", "koyilandy", "Koyilandy", "coastal retail, food and passenger routes coordinated through dispatch lists, route plans and receiving confirmation"],
  ["wayanad", "kalpetta", "Kalpetta", "tourism, plantation and district-service fleets managed with hill-route checks, driver contacts and completed-trip records"],
  ["wayanad", "mananthavady", "Mananthavady", "plantation collection and Karnataka-linked rural journeys planned through pickup schedules, route notes and buyer acknowledgements"],
  ["kannur", "thalassery", "Thalassery", "coastal commercial and food-distribution trips coordinated with dispatch records, delivery windows and receiver confirmation"],
  ["kannur", "payyanur", "Payyanur", "north Kerala passenger and regional supply routes managed through vehicle assignments, planned stops and journey closure"],
  ["kasaragod", "kanhangad", "Kanhangad", "Karnataka-border commercial and passenger operations coordinated through route plans, driver relays and completed-trip records"],
  ["kasaragod", "nileshwaram", "Nileshwaram", "coastal, agricultural and regional service journeys planned with collection schedules, authorised contacts and delivery confirmation"],
];

export const keralaCities: KeralaCitySeo[] = keralaCitySeeds.map(([districtSlug, slug, name, focus]) => {
  const district = keralaDistricts.find((entry) => entry.slug === districtSlug);
  if (!district || !district.cities.includes(name) || slug === districtSlug) {
    throw new Error(`Invalid Kerala city mapping: ${districtSlug}/${slug}`);
  }
  return {
    slug,
    name,
    districtSlug,
    districtName: district.name,
    nearbyLocations: district.cities.filter((location) => location !== name),
    sectors: district.sectors,
    focus,
    sourceUrl: district.sourceUrl,
    localContext: `For vehicle operations in ${name}, plan ${focus}. Record the responsible driver, vehicle, route, authorised contact and actual operational outcome. GPS reports support journey review, while job records, passenger checks and signed handovers remain the evidence for the underlying task.`,
    routeChecks: [
      `Confirm the ${name} assignment, responsible driver and authorised contact before dispatch.`,
      `Test device reporting on the actual ${name} route and document network gaps separately from trip delays.`,
      `Reconcile the ${name} job record and receiving acknowledgement with the completed journey before closure.`,
    ],
  };
});

export function getKeralaCity(districtSlug: string, citySlug: string) {
  return keralaCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug);
}

export function getKeralaCitiesForDistrict(districtSlug: string) {
  return keralaCities.filter((city) => city.districtSlug === districtSlug);
}

export function getKeralaCityPath(city: Pick<KeralaCitySeo, "districtSlug" | "slug">) {
  return `/gps-tracker/kerala/${city.districtSlug}/${city.slug}`;
}

export function generateKeralaCityMetadata(city: KeralaCitySeo): Metadata {
  const url = `https://naviigps.com${getKeralaCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, fleet software and installation needs.`;
  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Kerala`,
      `vehicle tracking system ${city.name}`,
      `vehicle GPS installation ${city.name} ${city.districtName}`,
      `fleet management software ${city.name}`,
      `വാഹന GPS ട്രാക്കർ ${city.name}`,
      `ജിപിഎസ് ട്രാക്കർ ${city.name}`,
    ]),
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
