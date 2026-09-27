import type { Metadata } from "next";

import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type KeralaDistrictSeo = {
  slug: string;
  name: string;
  region: string;
  cities: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
  sourceUrl: string;
};

type DistrictSeed = [slug: string, name: string, cities: string[], routeProfile: string, sourceUrl: string];
type RegionSeed = { region: string; sectors: string[]; districts: DistrictSeed[] };

// Kerala has 14 revenue districts. Regions are editorial groupings for navigation.
// Location labels support district-level discovery and do not imply a local office.
const regionSeeds: RegionSeed[] = [
  {
    region: "South Kerala",
    sectors: ["urban delivery and passenger transport", "tourism and hospitality fleets", "port, construction and commercial logistics"],
    districts: [
      ["thiruvananthapuram", "Thiruvananthapuram", ["Thiruvananthapuram", "Neyyattinkara", "Attingal", "Nedumangad"], "capital-region delivery, employee transport, tourism operations and Tamil Nadu corridor movement", "https://trivandrum.nic.in/"],
      ["kollam", "Kollam", ["Kollam", "Punalur", "Karunagappally", "Kottarakkara"], "coastal commerce, cashew-industry trips, port-linked logistics and interdistrict passenger routes", "https://kollam.nic.in/"],
      ["pathanamthitta", "Pathanamthitta", ["Pathanamthitta", "Adoor", "Thiruvalla", "Ranni"], "pilgrimage transport, plantation routes, rural distribution and interdistrict passenger operations", "https://pathanamthitta.nic.in/"],
      ["alappuzha", "Alappuzha", ["Alappuzha", "Cherthala", "Kayamkulam", "Haripad"], "coastal distribution, tourism and backwater operations, seafood logistics and highway passenger traffic", "https://alappuzha.nic.in/"],
    ],
  },
  {
    region: "Central Kerala",
    sectors: ["industrial and warehouse fleets", "agricultural and plantation logistics", "urban, tourism and passenger transport"],
    districts: [
      ["kottayam", "Kottayam", ["Kottayam", "Changanassery", "Pala", "Ettumanoor"], "rubber and agricultural logistics, education transport, regional distribution and passenger movement", "https://kottayam.nic.in/"],
      ["idukki", "Idukki", ["Painavu", "Thodupuzha", "Munnar", "Kattappana"], "plantation collections, hill-route tourism, utility support and long-distance goods movement", "https://idukki.nic.in/"],
      ["ernakulam", "Ernakulam", ["Kochi", "Aluva", "Perumbavoor", "Muvattupuzha"], "port and container logistics, dense urban delivery, industrial transport and airport-linked fleet operations", "https://ernakulam.nic.in/"],
      ["thrissur", "Thrissur", ["Thrissur", "Chalakudy", "Irinjalakuda", "Kunnamkulam"], "wholesale distribution, manufacturing support, tourism traffic and statewide commercial routes", "https://thrissur.nic.in/"],
      ["palakkad", "Palakkad", ["Palakkad", "Ottapalam", "Shoranur", "Mannarkkad"], "Tamil Nadu gateway freight, industrial-corridor trips, agricultural collections and regional passenger services", "https://palakkad.nic.in/"],
    ],
  },
  {
    region: "North Kerala",
    sectors: ["interstate and coastal logistics", "agricultural and food distribution", "urban delivery and passenger fleets"],
    districts: [
      ["malappuram", "Malappuram", ["Malappuram", "Manjeri", "Perinthalmanna", "Tirur"], "high-volume passenger movement, retail distribution, airport corridor trips and agricultural logistics", "https://malappuram.nic.in/"],
      ["kozhikode", "Kozhikode", ["Kozhikode", "Vadakara", "Koyilandy", "Ramanattukara"], "coastal commerce, urban delivery, food distribution and north Kerala passenger operations", "https://kozhikode.nic.in/"],
      ["wayanad", "Wayanad", ["Kalpetta", "Mananthavady", "Sulthan Bathery", "Vythiri"], "plantation and farm collections, tourism vehicles, Karnataka corridor traffic and hill-route services", "https://wayanad.nic.in/"],
      ["kannur", "Kannur", ["Kannur", "Thalassery", "Payyanur", "Taliparamba"], "coastal distribution, airport-linked traffic, textile and food logistics and intercity passenger fleets", "https://kannur.nic.in/"],
      ["kasaragod", "Kasaragod", ["Kasaragod", "Kanhangad", "Nileshwaram", "Uppala"], "Karnataka-border freight, coastal commerce, agricultural movement and long intercity passenger routes", "https://kasaragod.nic.in/"],
    ],
  },
];

export const keralaDistricts: KeralaDistrictSeo[] = regionSeeds.flatMap(
  ({ region, sectors, districts }) => districts.map(([slug, name, cities, routeProfile, sourceUrl]) => ({
    slug,
    name,
    region,
    cities,
    sectors,
    sourceUrl,
    localContext: `${name} district in the ${region} operating region includes ${routeProfile}. Compatible GPS devices and fleet software can help authorised teams review reported vehicle location, trip history and supported alerts across these routes.`,
    planningNote: `Before deployment in ${name}, confirm the vehicle and route requirements, device compatibility, mobile-network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.`,
  })),
);

export function getKeralaDistrict(slug: string) {
  return keralaDistricts.find((district) => district.slug === slug);
}

export function generateKeralaDistrictKeywords(district: KeralaDistrictSeo) {
  return uniqueKeywords([
    `GPS tracker in ${district.name}`,
    `GPS tracker ${district.name} Kerala`,
    `vehicle tracking system ${district.name}`,
    `car GPS tracker ${district.name}`,
    `truck GPS tracking ${district.name}`,
    `fleet management software ${district.name}`,
    `commercial vehicle tracking ${district.name}`,
    `school bus GPS tracking ${district.name}`,
    `GPS tracker dealer ${district.name}`,
    `വാഹന GPS ട്രാക്കർ ${district.name}`,
    `ജിപിഎസ് ട്രാക്കർ ${district.name}`,
    ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`]),
  ]);
}

export function generateKeralaDistrictMetadata(district: KeralaDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/kerala/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Kerala, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`;
  return {
    title: `GPS Tracker in ${district.name} District, Kerala`,
    description,
    keywords: uniqueKeywords([...generateKeralaDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]),
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${district.name} District, Kerala | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Kerala | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
