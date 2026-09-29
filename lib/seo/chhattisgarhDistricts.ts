import type { Metadata } from "next";

import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type ChhattisgarhDistrictSeo = {
  slug: string;
  name: string;
  division: string;
  cities: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
  sourceUrl: string;
};

type Seed = [slug: string, name: string, cities: string[], profile: string];

// Division labels organise navigation; the 33-district inventory follows the current Government of Chhattisgarh listing.
const divisionSeeds: { division: string; sectors: string[]; districts: Seed[] }[] = [
  { division: "Raipur Division", sectors: ["urban and commercial logistics", "agricultural distribution", "interstate fleet operations"], districts: [
    ["baloda-bazar-bhatapara", "Baloda Bazar-Bhatapara", ["Baloda Bazar", "Bhatapara", "Kasdol", "Palari"], "cement, agricultural markets, industrial supply and Raipur-linked freight routes"],
    ["dhamtari", "Dhamtari", ["Dhamtari", "Kurud", "Nagri", "Magarlod"], "rice trade, forest-edge services, tourism and Raipur-Jagdalpur corridor traffic"],
    ["gariaband", "Gariaband", ["Gariaband", "Rajim", "Chhura", "Deobhog"], "agriculture, pilgrimage, forest-produce and Odisha-linked rural routes"],
    ["mahasamund", "Mahasamund", ["Mahasamund", "Bagbahara", "Saraipali", "Basna"], "agriculture, warehousing, highway freight and Odisha-border commercial movement"],
    ["raipur", "Raipur", ["Raipur", "Arang", "Abhanpur", "Tilda Newra"], "capital-region delivery, steel trade, warehousing and high-frequency commercial fleets"],
  ]},
  { division: "Durg Division", sectors: ["industrial and mineral logistics", "agricultural distribution", "passenger and employee transport"], districts: [
    ["balod", "Balod", ["Balod", "Dalli Rajhara", "Gunderdehi", "Gurur"], "iron-ore support, agriculture, rural distribution and Durg-linked transport"],
    ["bemetara", "Bemetara", ["Bemetara", "Saja", "Nawagarh", "Berla"], "grain markets, agricultural inputs, rural services and Raipur-Durg corridor routes"],
    ["durg", "Durg", ["Durg", "Bhilai", "Patan", "Dhamdha"], "steel, manufacturing, urban delivery and employee transport operations"],
    ["kabirdham", "Kabirdham", ["Kawardha", "Pandariya", "Bodla", "Sahaspur Lohara"], "agriculture, forest-produce, tourism and Madhya Pradesh-linked routes"],
    ["khairagarh-chhuikhadan-gandai", "Khairagarh-Chhuikhadan-Gandai", ["Khairagarh", "Chhuikhadan", "Gandai", "Salhewara"], "agriculture, education, rural markets and Madhya Pradesh-border movement"],
    ["mohla-manpur-ambagarh-chowki", "Mohla-Manpur-Ambagarh Chowki", ["Mohla", "Manpur", "Ambagarh Chowki", "Aundhi"], "forest-area services, agriculture, mining-support and Maharashtra-linked routes"],
    ["rajnandgaon", "Rajnandgaon", ["Rajnandgaon", "Dongargarh", "Dongargaon", "Chhuriya"], "industrial trade, pilgrimage, agriculture and Maharashtra corridor fleets"],
  ]},
  { division: "Bilaspur Division", sectors: ["industrial and energy logistics", "agricultural distribution", "rail and highway freight"], districts: [
    ["bilaspur", "Bilaspur", ["Bilaspur", "Takhatpur", "Bilha", "Kota"], "rail-linked distribution, urban delivery, education and industrial fleet movement"],
    ["gaurela-pendra-marwahi", "Gaurela-Pendra-Marwahi", ["Gaurela", "Pendra", "Marwahi", "Kotmi"], "forest-produce, tourism, agriculture and Madhya Pradesh-border routes"],
    ["janjgir-champa", "Janjgir-Champa", ["Janjgir", "Champa", "Akaltara", "Pamgarh"], "power-sector support, cement, agriculture and industrial freight operations"],
    ["korba", "Korba", ["Korba", "Katghora", "Pali", "Dipka"], "coal, power generation, heavy equipment and project logistics"],
    ["mungeli", "Mungeli", ["Mungeli", "Lormi", "Patharia", "Sargaon"], "agriculture, rural distribution, forest-edge services and Bilaspur-linked routes"],
    ["raigarh", "Raigarh", ["Raigarh", "Kharsia", "Gharghoda", "Dharamjaigarh"], "steel, coal, industrial freight and Odisha-linked commercial traffic"],
    ["sakti", "Sakti", ["Sakti", "Jaijaipur", "Malkharoda", "Dabhra"], "agriculture, power-sector supply, highway trade and Odisha-linked movement"],
    ["sarangarh-bilaigarh", "Sarangarh-Bilaigarh", ["Sarangarh", "Bilaigarh", "Baramkela", "Sarsiwa"], "agriculture, rural markets, mineral-support and Odisha-border routes"],
  ]},
  { division: "Bastar Division", sectors: ["mineral and project logistics", "forest-produce distribution", "rural passenger fleets"], districts: [
    ["bastar", "Bastar", ["Jagdalpur", "Bastar", "Bakawand", "Tokapal"], "regional distribution, tourism, forest-produce and Odisha corridor operations"],
    ["bijapur", "Bijapur", ["Bijapur", "Bhairamgarh", "Bhopalpattanam", "Usoor"], "forest-area services, project supply, rural transport and Telangana-linked routes"],
    ["dantewada", "Dantewada", ["Dantewada", "Geedam", "Kirandul", "Bacheli"], "iron-ore mining, heavy equipment, project supply and passenger transport"],
    ["kanker", "Kanker", ["Kanker", "Bhanupratappur", "Charama", "Antagarh"], "mining-support, agriculture, forest-produce and Raipur-Jagdalpur traffic"],
    ["kondagaon", "Kondagaon", ["Kondagaon", "Keskal", "Makdi", "Farasgaon"], "handicrafts, agriculture, forest-produce and highway passenger routes"],
    ["narayanpur", "Narayanpur", ["Narayanpur", "Orchha", "Benur", "Chhotedongar"], "forest-area services, mining-support, project supply and rural mobility"],
    ["sukma", "Sukma", ["Sukma", "Konta", "Chhindgarh", "Dornapal"], "interstate project supply, forest-area services and Telangana-Odisha corridor routes"],
  ]},
  { division: "Surguja Division", sectors: ["mineral and energy logistics", "agricultural and forest-produce distribution", "interstate transport"], districts: [
    ["balrampur-ramanujganj", "Balrampur-Ramanujganj", ["Balrampur", "Ramanujganj", "Wadrafnagar", "Rajpur"], "agriculture, forest-area services and Uttar Pradesh-Jharkhand border traffic"],
    ["jashpur", "Jashpur", ["Jashpur Nagar", "Kunkuri", "Pathalgaon", "Bagicha"], "agriculture, forest-produce, tourism and Jharkhand-Odisha corridor movement"],
    ["koriya", "Koriya", ["Baikunthpur", "Sonhat", "Patna", "Pondi Bachra"], "coal-support, agriculture, forest services and Madhya Pradesh-linked routes"],
    ["manendragarh-chirmiri-bharatpur", "Manendragarh-Chirmiri-Bharatpur", ["Manendragarh", "Chirmiri", "Janakpur", "Kelhari"], "coal, rail-linked trade, forest-area services and Madhya Pradesh routes"],
    ["surajpur", "Surajpur", ["Surajpur", "Bishrampur", "Pratappur", "Bhaiyathan"], "coal-support, agriculture, power-sector supply and regional distribution"],
    ["surguja", "Surguja", ["Ambikapur", "Sitapur", "Lakhanpur", "Lundra"], "regional trade, agriculture, tourism and northern interstate fleet operations"],
  ]},
];

const officialSource = "https://erojgar.cg.gov.in/LandingSite/en/Dist_Recruitments.aspx";

export const chhattisgarhDistricts: ChhattisgarhDistrictSeo[] = divisionSeeds.flatMap(({ division, sectors, districts }) =>
  districts.map(([slug, name, cities, profile]) => ({
    slug, name, division, cities, sectors, sourceUrl: officialSource,
    localContext: `${name} district in ${division} includes ${profile}. Compatible GPS devices and fleet software can support authorised teams reviewing reported location, trip history and supported alerts across these routes.`,
    planningNote: `Before deployment in ${name}, confirm vehicle and route requirements, device compatibility, network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.`,
  })),
);

export function getChhattisgarhDistrict(slug: string) {
  return chhattisgarhDistricts.find((district) => district.slug === slug);
}

export function generateChhattisgarhDistrictKeywords(district: ChhattisgarhDistrictSeo) {
  return uniqueKeywords([
    `GPS tracker in ${district.name}`, `GPS tracker ${district.name} Chhattisgarh`, `vehicle tracking system ${district.name}`,
    `car GPS tracker ${district.name}`, `truck GPS tracking ${district.name}`, `fleet management software ${district.name}`,
    `commercial vehicle tracking ${district.name}`, `school bus GPS tracking ${district.name}`,
    `वाहन GPS ट्रैकर ${district.name}`, `जीपीएस ट्रैकर ${district.name}`,
    ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`]),
  ]);
}

export function generateChhattisgarhDistrictMetadata(district: ChhattisgarhDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/chhattisgarh/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Chhattisgarh, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`;
  return {
    title: `GPS Tracker in ${district.name} District, Chhattisgarh`, description,
    keywords: uniqueKeywords([...generateChhattisgarhDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]),
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${district.name} District, Chhattisgarh | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Chhattisgarh | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
