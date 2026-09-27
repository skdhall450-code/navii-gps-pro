import type { Metadata } from "next";

import { gujaratDistricts } from "@/lib/seo/gujaratDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type GujaratCitySeo = {
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

// Phase 2 publishes two curated priority locations within every Gujarat district.
const gujaratCitySeeds: CitySeed[] = [
  ["ahmedabad", "sanand", "Sanand", "Sanand commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["ahmedabad", "dholka", "Dholka", "Dholka commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["gandhinagar", "kalol", "Kalol", "Kalol commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["gandhinagar", "dehgam", "Dehgam", "Dehgam commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["kheda", "nadiad", "Nadiad", "Nadiad commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["kheda", "kapadvanj", "Kapadvanj", "Kapadvanj commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["anand", "khambhat", "Khambhat", "Khambhat commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["anand", "borsad", "Borsad", "Borsad commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["vadodara", "savli", "Savli", "Savli commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["vadodara", "dabhoi", "Dabhoi", "Dabhoi commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["panchmahal", "godhra", "Godhra", "Godhra commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["panchmahal", "halol", "Halol", "Halol commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["dahod", "jhalod", "Jhalod", "Jhalod commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["dahod", "limkheda", "Limkheda", "Limkheda commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["mahisagar", "lunawada", "Lunawada", "Lunawada commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["mahisagar", "balasinor", "Balasinor", "Balasinor commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["chhota-udaipur", "bodeli", "Bodeli", "Bodeli commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["chhota-udaipur", "naswadi", "Naswadi", "Naswadi commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["mehsana", "kadi", "Kadi", "Kadi commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["mehsana", "unjha", "Unjha", "Unjha commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["patan", "sidhpur", "Sidhpur", "Sidhpur commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["patan", "radhanpur", "Radhanpur", "Radhanpur commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["sabarkantha", "himmatnagar", "Himmatnagar", "Himmatnagar commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["sabarkantha", "idar", "Idar", "Idar commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["aravalli", "modasa", "Modasa", "Modasa commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["aravalli", "bayad", "Bayad", "Bayad commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["banaskantha", "palanpur", "Palanpur", "Palanpur commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["banaskantha", "deesa", "Deesa", "Deesa commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["vav-tharad", "tharad", "Tharad", "Tharad commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["vav-tharad", "dhanera", "Dhanera", "Dhanera commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["kutch", "bhuj", "Bhuj", "Bhuj commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["kutch", "gandhidham", "Gandhidham", "Gandhidham commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["rajkot", "gondal", "Gondal", "Gondal commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["rajkot", "jetpur", "Jetpur", "Jetpur commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["jamnagar", "dhrol", "Dhrol", "Dhrol commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["jamnagar", "kalavad", "Kalavad", "Kalavad commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["devbhoomi-dwarka", "khambhalia", "Khambhalia", "Khambhalia commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["devbhoomi-dwarka", "dwarka", "Dwarka", "Dwarka commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["porbandar", "ranavav", "Ranavav", "Ranavav commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["porbandar", "kutiyana", "Kutiyana", "Kutiyana commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["junagadh", "keshod", "Keshod", "Keshod commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["junagadh", "mangrol", "Mangrol", "Mangrol commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["gir-somnath", "veraval", "Veraval", "Veraval commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["gir-somnath", "una", "Una", "Una commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["amreli", "savarkundla", "Savarkundla", "Savarkundla commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["amreli", "rajula", "Rajula", "Rajula commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["bhavnagar", "palitana", "Palitana", "Palitana commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["bhavnagar", "mahuva", "Mahuva", "Mahuva commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["botad", "gadhada", "Gadhada", "Gadhada commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["botad", "barwala", "Barwala", "Barwala commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["morbi", "wankaner", "Wankaner", "Wankaner commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["morbi", "halvad", "Halvad", "Halvad commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["surendranagar", "wadhwan", "Wadhwan", "Wadhwan commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["surendranagar", "limbdi", "Limbdi", "Limbdi commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["surat", "bardoli", "Bardoli", "Bardoli commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["surat", "olpad", "Olpad", "Olpad commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["bharuch", "ankleshwar", "Ankleshwar", "Ankleshwar commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["bharuch", "jhagadia", "Jhagadia", "Jhagadia commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["narmada", "rajpipla", "Rajpipla", "Rajpipla commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["narmada", "dediapada", "Dediapada", "Dediapada commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["navsari", "bilimora", "Bilimora", "Bilimora commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["navsari", "chikhli", "Chikhli", "Chikhli commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["valsad", "vapi", "Vapi", "Vapi commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["valsad", "pardi", "Pardi", "Pardi commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["tapi", "vyara", "Vyara", "Vyara commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["tapi", "songadh", "Songadh", "Songadh commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["dang", "ahwa", "Ahwa", "Ahwa commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
  ["dang", "saputara", "Saputara", "Saputara commercial, passenger and regional fleet operations coordinated through verified driver assignments, planned route windows and completed delivery or journey records"],
];

export const gujaratCities: GujaratCitySeo[] = gujaratCitySeeds.map(([districtSlug, slug, name, focus]) => {
  const district = gujaratDistricts.find((entry) => entry.slug === districtSlug);
  if (!district || !district.cities.includes(name) || slug === districtSlug) throw new Error(`Invalid Gujarat city mapping: ${districtSlug}/${slug}`);
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

export function getGujaratCity(districtSlug: string, citySlug: string) { return gujaratCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug); }
export function getGujaratCitiesForDistrict(districtSlug: string) { return gujaratCities.filter((city) => city.districtSlug === districtSlug); }
export function getGujaratCityPath(city: Pick<GujaratCitySeo, "districtSlug" | "slug">) { return `/gps-tracker/gujarat/${city.districtSlug}/${city.slug}`; }

export function generateGujaratCityMetadata(city: GujaratCitySeo): Metadata {
  const url = `https://naviigps.com${getGujaratCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, fleet software and installation needs.`;
  return {
    title, description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Gujarat`, `vehicle tracking system ${city.name}`,
      `vehicle GPS installation ${city.name} ${city.districtName}`, `fleet management software ${city.name}`,
      `વાહન GPS ટ્રેકર ${city.name}`, `જીપીએસ ટ્રેકર ${city.name}`,
    ]),
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}


