import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";

export type PunjabDistrictSeo = {
  slug: string;
  name: string;
  cities: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
};

type PunjabDistrictSeed = [
  slug: string,
  name: string,
  cities: string[],
  sectors: string[],
  routeProfile: string,
  planningFocus: string,
];

const punjabDistrictSeeds: PunjabDistrictSeed[] = [
  ["amritsar", "Amritsar", ["Amritsar", "Ajnala", "Majitha", "Jandiala Guru", "Attari"], ["tourism transport", "commercial delivery", "agricultural logistics"], "Amritsar city distribution, tourism and hospitality vehicles, wholesale markets, airport movements and routes toward Attari and the wider Majha region", "dense city traffic, border-area operating procedures, mobile-network availability and secure fleet-data access"],
  ["barnala", "Barnala", ["Barnala", "Tapa", "Bhadaur", "Dhanaula"], ["agricultural logistics", "textile transport", "regional distribution"], "Barnala town services, agricultural market movements, textile-related transport and central Malwa connections toward Sangrur, Moga and Bathinda", "town-to-rural coverage, seasonal fleet activity, device fitting quality and alert ownership"],
  ["bathinda", "Bathinda", ["Bathinda", "Rampura Phul", "Maur", "Talwandi Sabo", "Goniana"], ["industrial logistics", "agricultural transport", "commercial fleets"], "Bathinda urban distribution, refinery and industrial routes, agricultural markets and long-distance movements across southern Malwa", "industrial-site procedures, heat and dust conditions, compatible hardware and dependable support"],
  ["faridkot", "Faridkot", ["Faridkot", "Kotkapura", "Jaitu", "Sadiq"], ["regional distribution", "institutional fleets", "agricultural logistics"], "Faridkot city services, Kotkapura commercial routes, institutional vehicles and agricultural movements connecting nearby Malwa districts", "urban-to-rural network coverage, installation responsibility, driver communication and data-retention settings"],
  ["fatehgarh-sahib", "Fatehgarh Sahib", ["Sirhind", "Mandi Gobindgarh", "Amloh", "Bassi Pathana", "Khamanon"], ["steel logistics", "industrial transport", "commercial delivery"], "Sirhind services, Mandi Gobindgarh steel movements, industrial deliveries and highway connections toward Ludhiana, Patiala and Chandigarh", "industrial environments, highway connectivity, rugged installation and authorized tracking policies"],
  ["fazilka", "Fazilka", ["Fazilka", "Abohar", "Jalalabad", "Arniwala"], ["agricultural logistics", "cold-chain transport", "regional distribution"], "Fazilka and Abohar market routes, agricultural produce and cold-chain movements, and longer operations near the Rajasthan and international borders", "border-region network coverage, seasonal produce routes, compatible SIM plans and support response"],
  ["ferozepur", "Ferozepur", ["Ferozepur", "Zira", "Guru Har Sahai", "Talwandi Bhai", "Makhu"], ["agricultural transport", "interstate logistics", "service fleets"], "Ferozepur city services, agricultural market routes, Zira and Makhu connections and district operations near western Punjab corridors", "border-area procedures, rural carrier coverage, professional fitting and secure alert management"],
  ["gurdaspur", "Gurdaspur", ["Gurdaspur", "Batala", "Dinanagar", "Qadian", "Dera Baba Nanak"], ["industrial transport", "agricultural logistics", "tourism vehicles"], "Gurdaspur and Batala industry, agricultural movements, pilgrimage transport and routes connecting Pathankot, Amritsar and border areas", "intercity coverage, border-route procedures, device durability and authorized location-data access"],
  ["hoshiarpur", "Hoshiarpur", ["Hoshiarpur", "Mukerian", "Dasuya", "Garhshankar", "Tanda"], ["agricultural logistics", "manufacturing transport", "regional delivery"], "Hoshiarpur city distribution, manufacturing and agricultural routes, and mixed plains-to-foothill journeys toward Himachal Pradesh", "hill-edge and rural coverage, device compatibility, installation standards and maintenance responsibility"],
  ["jalandhar", "Jalandhar", ["Jalandhar", "Nakodar", "Phillaur", "Shahkot", "Kartarpur"], ["sports-goods logistics", "commercial delivery", "employee transport"], "Jalandhar urban distribution, sports-goods and manufacturing routes, employee transport and highway connections across Doaba", "high-density city operations, highway connectivity, scalable installation and secure workforce policies"],
  ["kapurthala", "Kapurthala", ["Kapurthala", "Phagwara", "Sultanpur Lodhi", "Bholath"], ["industrial logistics", "tourism transport", "regional distribution"], "Kapurthala services, Phagwara industrial movements, tourism routes around Sultanpur Lodhi and Doaba connections toward Jalandhar", "mixed urban-rural coverage, industrial fitting requirements, route alerts and data access"],
  ["ludhiana", "Ludhiana", ["Ludhiana", "Khanna", "Jagraon", "Samrala", "Raikot"], ["manufacturing logistics", "commercial fleets", "employee transportation"], "dense Ludhiana distribution, hosiery and cycle-parts manufacturing, Khanna freight, employee transport and high-volume highway routes", "urban network performance, industrial-site installation, scalable fleet reporting and driver policies"],
  ["malerkotla", "Malerkotla", ["Malerkotla", "Ahmedgarh", "Amargarh", "Sandaur"], ["commercial distribution", "agricultural logistics", "service fleets"], "Malerkotla city deliveries, Ahmedgarh commercial movements, agricultural routes and connections across the central Malwa region", "newer district operating boundaries, town-to-rural coverage, fitting responsibility and support availability"],
  ["mansa", "Mansa", ["Mansa", "Budhlada", "Sardulgarh", "Bareta"], ["agricultural transport", "regional logistics", "service vehicles"], "Mansa market operations, cotton and grain movements, town-to-village routes and connections toward Bathinda and Haryana", "rural network coverage, heat and dust conditions, compatible SIM plans and alert escalation"],
  ["moga", "Moga", ["Moga", "Baghapurana", "Dharamkot", "Nihal Singh Wala"], ["agricultural logistics", "dairy transport", "commercial distribution"], "Moga urban distribution, dairy and agricultural supply routes, market movements and central Punjab road connections", "seasonal route demand, town and village coverage, professional installation and maintenance ownership"],
  ["pathankot", "Pathankot", ["Pathankot", "Sujanpur", "Dhar Kalan", "Narot Jaimal Singh"], ["interstate logistics", "hill-route transport", "commercial delivery"], "Pathankot logistics, defence-support and commercial vehicles, hill approaches and interstate routes toward Jammu and Himachal Pradesh", "interstate and hill coverage, route-specific alerts, device placement and secure fleet access"],
  ["patiala", "Patiala", ["Patiala", "Rajpura", "Nabha", "Samana", "Patran"], ["commercial transport", "industrial logistics", "institutional fleets"], "Patiala city services, Rajpura industry and warehousing, institutional vehicles and routes connecting Chandigarh, Haryana and Malwa", "urban and highway connectivity, industrial installation, authorized user roles and fleet reporting"],
  ["rupnagar", "Rupnagar", ["Rupnagar", "Sri Anandpur Sahib", "Nangal", "Morinda", "Chamkaur Sahib"], ["tourism transport", "industrial fleets", "hill-route logistics"], "Rupnagar services, Nangal industrial movements, pilgrimage routes around Sri Anandpur Sahib and foothill connections toward Himachal Pradesh", "hill-route network availability, seasonal tourism traffic, device compatibility and installation quality"],
  ["sahibzada-ajit-singh-nagar", "Sahibzada Ajit Singh Nagar", ["Mohali", "Kharar", "Zirakpur", "Dera Bassi", "Kurali"], ["NCR-linked logistics", "employee transportation", "commercial delivery"], "Mohali technology and corporate fleets, Zirakpur and Dera Bassi warehousing, airport movements and Tricity distribution routes", "dense urban connectivity, workplace tracking policies, scalable installations and secure data access"],
  ["sangrur", "Sangrur", ["Sangrur", "Sunam", "Dhuri", "Lehragaga", "Moonak"], ["agricultural logistics", "commercial distribution", "service fleets"], "Sangrur city services, grain-market movements, Dhuri and Sunam commercial routes and operations across central and southern Malwa", "town-to-rural coverage, seasonal operations, compatible hardware and driver alert workflows"],
  ["shaheed-bhagat-singh-nagar", "Shaheed Bhagat Singh Nagar", ["Nawanshahr", "Balachaur", "Banga", "Rahon"], ["regional logistics", "agricultural transport", "commercial delivery"], "Nawanshahr distribution, Balachaur and Banga market routes, agricultural movements and Doaba connections toward Chandigarh and Jalandhar", "rural and intercity connectivity, device fitting, route alerts and authorized tracking use"],
  ["sri-muktsar-sahib", "Sri Muktsar Sahib", ["Sri Muktsar Sahib", "Malout", "Gidderbaha", "Lambi"], ["agricultural logistics", "commercial transport", "regional distribution"], "Sri Muktsar Sahib services, Malout and Gidderbaha market routes, agricultural movements and Rajasthan-border connections", "long rural routes, border-area mobile coverage, heat and dust resilience and support response"],
  ["tarn-taran", "Tarn Taran", ["Tarn Taran", "Patti", "Khadoor Sahib", "Bhikhiwind"], ["agricultural transport", "tourism vehicles", "regional distribution"], "Tarn Taran services, pilgrimage transport, agricultural markets and district routes connecting Amritsar, Ferozepur and border areas", "border-route procedures, rural connectivity, installation quality and secure location-data handling"],
];

export const punjabDistricts: PunjabDistrictSeo[] = punjabDistrictSeeds.map(
  ([slug, name, cities, sectors, routeProfile, planningFocus]) => ({
    slug,
    name,
    cities,
    sectors,
    localContext: `${name} district fleet operations connect ${routeProfile}, where vehicle location, trip history and supported alerts can help authorized teams coordinate daily routes.`,
    planningNote: `Before deployment in ${name} district, confirm ${planningFocus}, device and SIM compatibility, installation responsibility, data retention and ongoing NAVII GPS platform support.`,
  }),
);

export function getPunjabDistrict(slug: string) {
  return punjabDistricts.find((district) => district.slug === slug);
}

export function generatePunjabDistrictKeywords(district: PunjabDistrictSeo) {
  const nameVariants = district.slug === "ferozepur" ? [district.name, "Firozpur"] : [district.name];
  return [...new Set([
    ...nameVariants.flatMap((name) => [
      `GPS tracker in ${name}`,
      `GPS tracker ${name} Punjab`,
      `vehicle tracking system ${name}`,
    ]),
    `car GPS tracker ${district.name}`,
    `truck GPS tracking ${district.name}`,
    `fleet management software ${district.name}`,
    `commercial vehicle tracking ${district.name}`,
    `school bus GPS tracking ${district.name}`,
    ...district.cities.flatMap((city) => [
      `GPS tracker ${city}`,
      `vehicle tracking system ${city}`,
    ]),
  ])];
}

export function generatePunjabDistrictMetadata(district: PunjabDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/punjab/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Punjab, including ${district.cities.slice(0, 3).join(", ")} and nearby operating routes.`;

  return {
    title: `GPS Tracker in ${district.name} District, Punjab`,
    description,
    keywords: uniqueKeywords([...new Set([...generatePunjabDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)])]),
    alternates: { canonical: url },
    openGraph: {
      title: `GPS Tracker in ${district.name} District | NAVII GPS`,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}
