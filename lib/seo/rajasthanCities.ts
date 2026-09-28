import type { Metadata } from "next";

import { rajasthanDistricts } from "@/lib/seo/rajasthanDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type RajasthanCitySeo = {
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

// Phase 2 publishes two curated priority locations within every Rajasthan district.
const rajasthanCitySeeds: CitySeed[] = [
  ["ajmer", "kishangarh", "Kishangarh", "Kishangarh commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["ajmer", "kekri", "Kekri", "Kekri commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["bhilwara", "shahpura", "Shahpura", "Shahpura commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["bhilwara", "jahazpur", "Jahazpur", "Jahazpur commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["beawar", "masuda", "Masuda", "Masuda commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["beawar", "jaitaran", "Jaitaran", "Jaitaran commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["didwana-kuchaman", "didwana", "Didwana", "Didwana commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["didwana-kuchaman", "makrana", "Makrana", "Makrana commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["nagaur", "merta-city", "Merta City", "Merta City commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["nagaur", "parbatsar", "Parbatsar", "Parbatsar commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["tonk", "niwai", "Niwai", "Niwai commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["tonk", "malpura", "Malpura", "Malpura commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["bikaner", "nokha", "Nokha", "Nokha commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["bikaner", "kolayat", "Kolayat", "Kolayat commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["churu", "ratangarh", "Ratangarh", "Ratangarh commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["churu", "sujangarh", "Sujangarh", "Sujangarh commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["hanumangarh", "sangaria", "Sangaria", "Sangaria commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["hanumangarh", "pilibanga", "Pilibanga", "Pilibanga commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["sri-ganganagar", "anupgarh", "Anupgarh", "Anupgarh commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["sri-ganganagar", "suratgarh", "Suratgarh", "Suratgarh commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["bharatpur", "bayana", "Bayana", "Bayana commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["bharatpur", "nadbai", "Nadbai", "Nadbai commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["deeg", "kaman", "Kaman", "Kaman commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["deeg", "nagar", "Nagar", "Nagar commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["dholpur", "bari", "Bari", "Bari commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["dholpur", "rajakhera", "Rajakhera", "Rajakhera commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["karauli", "hindaun", "Hindaun", "Hindaun commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["karauli", "todabhim", "Todabhim", "Todabhim commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["sawai-madhopur", "gangapur-city", "Gangapur City", "Gangapur City commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["sawai-madhopur", "bamanwas", "Bamanwas", "Bamanwas commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jaipur", "chomu", "Chomu", "Chomu commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jaipur", "sanganer", "Sanganer", "Sanganer commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["alwar", "rajgarh", "Rajgarh", "Rajgarh commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["alwar", "thanagazi", "Thanagazi", "Thanagazi commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["dausa", "bandikui", "Bandikui", "Bandikui commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["dausa", "lalsot", "Lalsot", "Lalsot commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["kotputli-behror", "kotputli", "Kotputli", "Kotputli commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["kotputli-behror", "behror", "Behror", "Behror commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["khairthal-tijara", "khairthal", "Khairthal", "Khairthal commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["khairthal-tijara", "bhiwadi", "Bhiwadi", "Bhiwadi commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jhunjhunu", "pilani", "Pilani", "Pilani commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jhunjhunu", "nawalgarh", "Nawalgarh", "Nawalgarh commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["sikar", "fatehpur", "Fatehpur", "Fatehpur commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["sikar", "neem-ka-thana", "Neem Ka Thana", "Neem Ka Thana commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jodhpur", "bilara", "Bilara", "Bilara commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jodhpur", "osian", "Osian", "Osian commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["barmer", "baytu", "Baytu", "Baytu commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["barmer", "chohtan", "Chohtan", "Chohtan commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["balotra", "pachpadra", "Pachpadra", "Pachpadra commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["balotra", "siwana", "Siwana", "Siwana commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jaisalmer", "pokaran", "Pokaran", "Pokaran commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jaisalmer", "sam", "Sam", "Sam commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jalore", "bhinmal", "Bhinmal", "Bhinmal commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jalore", "sanchore", "Sanchore", "Sanchore commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["pali", "sojat", "Sojat", "Sojat commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["pali", "sumerpur", "Sumerpur", "Sumerpur commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["phalodi", "lohawat", "Lohawat", "Lohawat commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["phalodi", "bap", "Bap", "Bap commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["sirohi", "abu-road", "Abu Road", "Abu Road commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["sirohi", "mount-abu", "Mount Abu", "Mount Abu commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["kota", "ramganj-mandi", "Ramganj Mandi", "Ramganj Mandi commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["kota", "sangod", "Sangod", "Sangod commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["baran", "anta", "Anta", "Anta commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["baran", "chhabra", "Chhabra", "Chhabra commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["bundi", "lakheri", "Lakheri", "Lakheri commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["bundi", "keshoraipatan", "Keshoraipatan", "Keshoraipatan commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jhalawar", "bhawani-mandi", "Bhawani Mandi", "Bhawani Mandi commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["jhalawar", "aklera", "Aklera", "Aklera commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["udaipur", "gogunda", "Gogunda", "Gogunda commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["udaipur", "kherwara", "Kherwara", "Kherwara commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["banswara", "kushalgarh", "Kushalgarh", "Kushalgarh commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["banswara", "bagidora", "Bagidora", "Bagidora commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["chittorgarh", "nimbahera", "Nimbahera", "Nimbahera commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["chittorgarh", "kapasan", "Kapasan", "Kapasan commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["dungarpur", "sagwara", "Sagwara", "Sagwara commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["dungarpur", "aspur", "Aspur", "Aspur commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["pratapgarh", "chhoti-sadri", "Chhoti Sadri", "Chhoti Sadri commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["pratapgarh", "dhariawad", "Dhariawad", "Dhariawad commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["rajsamand", "nathdwara", "Nathdwara", "Nathdwara commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["rajsamand", "deogarh", "Deogarh", "Deogarh commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["salumbar", "sarada", "Sarada", "Sarada commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
  ["salumbar", "semari", "Semari", "Semari commercial, tourism, passenger and regional fleet operations coordinated through verified vehicle assignments, planned route windows and completed delivery or journey records"],
];

export const rajasthanCities: RajasthanCitySeo[] = rajasthanCitySeeds.map(([districtSlug, slug, name, focus]) => {
  const district = rajasthanDistricts.find((entry) => entry.slug === districtSlug);
  if (!district || !district.cities.includes(name) || slug === districtSlug) throw new Error(`Invalid Rajasthan city mapping: ${districtSlug}/${slug}`);
  return {
    slug, name, districtSlug, districtName: district.name,
    nearbyLocations: district.cities.filter((location) => location !== name),
    sectors: district.sectors, focus, sourceUrl: district.sourceUrl,
    localContext: `For vehicle operations in ${name}, plan ${focus}. Record the responsible driver, vehicle, route, authorised contact and actual operational outcome. GPS reports support journey review, while job records and signed handovers remain the evidence for the underlying task.`,
    routeChecks: [
      `Confirm the ${name} assignment, responsible driver and authorised contact before dispatch.`,
      `Test device reporting on the actual ${name} route and record network gaps separately from operational delays.`,
      `Reconcile the ${name} job record and receiving acknowledgement with the completed journey before closure.`,
    ],
  };
});

export function getRajasthanCity(districtSlug: string, citySlug: string) { return rajasthanCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug); }
export function getRajasthanCitiesForDistrict(districtSlug: string) { return rajasthanCities.filter((city) => city.districtSlug === districtSlug); }
export function getRajasthanCityPath(city: Pick<RajasthanCitySeo, "districtSlug" | "slug">) { return `/gps-tracker/rajasthan/${city.districtSlug}/${city.slug}`; }

export function generateRajasthanCityMetadata(city: RajasthanCitySeo): Metadata {
  const url = `https://naviigps.com${getRajasthanCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, fleet software and installation needs.`;
  return {
    title, description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Rajasthan`, `vehicle tracking system ${city.name}`,
      `vehicle GPS installation ${city.name} ${city.districtName}`, `fleet management software ${city.name}`,
      `वाहन GPS ट्रैकर ${city.name}`, `जीपीएस ट्रैकर ${city.name}`,
    ]),
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}

