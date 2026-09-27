import type { Metadata } from "next";

import { maharashtraDistricts } from "@/lib/seo/maharashtraDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type MaharashtraCitySeo = {
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

// Phase 2 publishes two curated locations within every Maharashtra district.
// District headquarters are excluded where their city name would duplicate the parent page.
const maharashtraCitySeeds: CitySeed[] = [
  ["mumbai-city", "fort", "Fort", "South Mumbai business, port and service fleets coordinated through timed dispatch, restricted loading access and verified delivery handovers"],
  ["mumbai-city", "colaba", "Colaba", "tourism, hospitality and urban service vehicles planned around dense traffic, authorised stops and completed-job records"],
  ["mumbai-suburban", "andheri", "Andheri", "airport-corridor, media, e-commerce and employee transport managed with shift rosters, route windows and trip closure records"],
  ["mumbai-suburban", "borivali", "Borivali", "western-suburb delivery and passenger fleets coordinated through depot assignments, scheduled stops and route completion checks"],
  ["thane", "kalyan", "Kalyan", "regional distribution, commuter and industrial journeys organised through dispatch lists, highway timings and receiving acknowledgements"],
  ["thane", "bhiwandi", "Bhiwandi", "warehouse, textile and highway freight fleets managed with gate schedules, consignment references and delivery confirmation"],
  ["palghar", "vasai", "Vasai", "industrial, retail and commuter routes coordinated through vehicle assignments, delivery windows and customer handovers"],
  ["palghar", "boisar", "Boisar", "industrial-estate and Gujarat-corridor movements planned with gate access, driver contacts and completed freight records"],
  ["raigad", "panvel", "Panvel", "Mumbai-Pune corridor, warehouse and passenger operations managed through dispatch timing, toll routes and journey closure"],
  ["raigad", "uran", "Uran", "port, container and industrial-support trips coordinated with gate appointments, authorised drivers and receiving records"],
  ["ratnagiri", "chiplun", "Chiplun", "Konkan highway freight, food distribution and passenger trips planned through route conditions, scheduled stops and proof of delivery"],
  ["ratnagiri", "dapoli", "Dapoli", "coastal tourism, fisheries and rural service routes coordinated with itineraries, collection schedules and trip completion records"],
  ["sindhudurg", "kudal", "Kudal", "Goa-corridor commerce, food distribution and regional passenger fleets managed through route rosters and customer acknowledgements"],
  ["sindhudurg", "sawantwadi", "Sawantwadi", "border tourism, retail supply and passenger operations planned with authorised stops, driver contacts and journey records"],
  ["pune", "pimpri-chinchwad", "Pimpri-Chinchwad", "automotive, manufacturing and employee transport fleets coordinated with plant shifts, gate schedules and trip reports"],
  ["pune", "baramati", "Baramati", "agricultural, food-processing and industrial distribution planned through pickup rosters, dispatch windows and receiving confirmation"],
  ["satara", "karad", "Karad", "highway freight, agricultural collections and regional passenger journeys managed with route schedules and delivery records"],
  ["satara", "phaltan", "Phaltan", "sugar, agricultural and industrial-support fleets coordinated through supplier pickups, plant timings and completed-job records"],
  ["sangli", "miraj", "Miraj", "healthcare-support, passenger and food-distribution routes organised through timed assignments, authorised contacts and trip closure"],
  ["sangli", "tasgaon", "Tasgaon", "grape, agricultural and cold-chain movements planned with collection windows, temperature procedures and buyer acknowledgements"],
  ["solapur", "pandharpur", "Pandharpur", "pilgrimage, passenger and retail supply fleets coordinated around event traffic, approved stops and journey completion records"],
  ["solapur", "barshi", "Barshi", "agricultural, textile and regional distribution trips managed through dispatch lists, market timings and receiving confirmation"],
  ["kolhapur", "ichalkaranji", "Ichalkaranji", "textile, manufacturing and commercial fleets planned with production shifts, loading records and customer handovers"],
  ["kolhapur", "jaysingpur", "Jaysingpur", "agricultural, industrial and Karnataka-linked journeys coordinated through pickup schedules and completed delivery records"],
  ["nashik", "malegaon", "Malegaon", "textile, agricultural and highway freight operations organised with loading windows, driver assignments and destination receipts"],
  ["nashik", "sinnar", "Sinnar", "industrial-estate, manufacturing and warehouse trips managed through gate schedules, route plans and receiving acknowledgements"],
  ["dhule", "shirpur", "Shirpur", "Mumbai-Agra corridor freight, agricultural supply and passenger routes planned through dispatch timing and journey records"],
  ["dhule", "dondaicha", "Dondaicha", "farm collection, market distribution and regional commercial trips coordinated with pickup lists and delivery confirmation"],
  ["nandurbar", "shahada", "Shahada", "agricultural, tribal-area service and regional passenger fleets managed through route notes, scheduled stops and job closure"],
  ["nandurbar", "navapur", "Navapur", "Gujarat-border freight, farm logistics and long regional journeys planned with driver relays and receiving records"],
  ["jalgaon", "bhusawal", "Bhusawal", "rail-linked commerce, banana distribution and highway freight coordinated through dispatch windows and consignment handovers"],
  ["jalgaon", "chalisgaon", "Chalisgaon", "agricultural, wholesale and interdistrict routes managed with collection schedules, market calls and completed-trip records"],
  ["ahilyanagar", "shirdi", "Shirdi", "pilgrimage, hotel-supply and passenger fleets planned around arrival windows, approved parking and journey closure records"],
  ["ahilyanagar", "sangamner", "Sangamner", "agricultural, dairy and highway distribution coordinated through supplier pickups, dispatch timing and buyer acknowledgements"],
  ["chhatrapati-sambhajinagar", "paithan", "Paithan", "tourism, textile and agricultural routes organised through vehicle assignments, planned stops and delivery records"],
  ["chhatrapati-sambhajinagar", "sillod", "Sillod", "farm collection, market distribution and regional passenger journeys managed with route rosters and trip closure"],
  ["jalna", "ambad", "Ambad", "steel, seed-industry and agricultural freight planned through loading references, dispatch windows and receiving confirmation"],
  ["jalna", "partur", "Partur", "farm, wholesale and rail-linked commercial routes coordinated through pickup schedules and completed delivery records"],
  ["beed", "ambajogai", "Ambajogai", "healthcare-support, agricultural and passenger fleets managed through shift assignments, authorised stops and service records"],
  ["beed", "parli", "Parli", "energy, sugar and industrial-support trips organised with plant access, driver contacts and job completion evidence"],
  ["dharashiv", "tuljapur", "Tuljapur", "pilgrimage, passenger and retail-supply operations planned around visitor traffic, authorised stops and journey records"],
  ["dharashiv", "umarga", "Umarga", "Karnataka-border freight, agricultural supply and regional service routes coordinated with dispatch and delivery confirmation"],
  ["latur", "udgir", "Udgir", "interstate commerce, food distribution and passenger journeys managed through route rosters and completed-job records"],
  ["latur", "nilanga", "Nilanga", "agricultural collection, wholesale distribution and rural service trips planned with supplier lists and receiving acknowledgements"],
  ["nanded", "deglur", "Deglur", "Telangana-border freight, farm logistics and passenger movements coordinated through route checks and journey closure records"],
  ["nanded", "kinwat", "Kinwat", "forest-edge, tribal-area and long rural routes managed with driver check-ins, planned stops and service completion evidence"],
  ["parbhani", "jintur", "Jintur", "cotton, agricultural and market-distribution fleets organised through collection schedules and destination acknowledgements"],
  ["parbhani", "gangakhed", "Gangakhed", "regional freight, farm supply and passenger journeys planned through dispatch lists, route notes and trip closure"],
  ["hingoli", "basmath", "Basmath", "turmeric, agricultural and wholesale movements coordinated with market timings, pickup records and buyer confirmation"],
  ["hingoli", "aundha-nagnath", "Aundha Nagnath", "pilgrimage, rural service and passenger fleets managed through approved itineraries and completed journey records"],
  ["amravati", "achalpur", "Achalpur", "cotton, agricultural and regional commercial routes planned through collection rosters and delivery acknowledgements"],
  ["amravati", "morshi", "Morshi", "orange, farm-input and rural distribution fleets coordinated with seasonal pickups, route plans and receiving records"],
  ["akola", "akot", "Akot", "cotton-market, farm collection and wholesale trips managed through supplier schedules and completed consignment records"],
  ["akola", "murtizapur", "Murtizapur", "rail-linked commerce, agricultural freight and regional distribution organised through dispatch windows and handovers"],
  ["buldhana", "khamgaon", "Khamgaon", "industrial, agricultural and highway distribution fleets planned through loading schedules and destination receipts"],
  ["buldhana", "shegaon", "Shegaon", "pilgrimage, passenger and retail-supply routes coordinated around arrival windows and journey completion checks"],
  ["washim", "karanja", "Karanja", "agricultural, market and pilgrimage traffic managed with pickup schedules, authorised stops and trip closure records"],
  ["washim", "risod", "Risod", "farm collection, rural supply and passenger journeys planned through route rosters and receiving confirmation"],
  ["yavatmal", "wani", "Wani", "mining-support, industrial and highway freight coordinated with site access, driver assignments and job closure evidence"],
  ["yavatmal", "pusad", "Pusad", "cotton, agricultural and regional distribution routes managed through collection lists and completed delivery records"],
  ["nagpur", "kamptee", "Kamptee", "urban distribution, industrial support and passenger fleets organised through depot assignments and route completion checks"],
  ["nagpur", "hingna", "Hingna", "industrial-estate, manufacturing and warehouse trips planned with plant shifts, gate schedules and receiving acknowledgements"],
  ["wardha", "hinganghat", "Hinganghat", "cotton, textile and highway freight operations coordinated through loading windows and delivery confirmation"],
  ["wardha", "pulgaon", "Pulgaon", "agricultural, industrial and regional supply journeys managed through dispatch lists and completed-job records"],
  ["bhandara", "tumsar", "Tumsar", "rice, industrial and regional commercial fleets planned with collection schedules and consignment handovers"],
  ["bhandara", "sakoli", "Sakoli", "farm, forest-edge and rural passenger routes coordinated through route notes, scheduled stops and trip closure"],
  ["gondia", "tirora", "Tirora", "power-sector, rice and industrial-support movements organised with site access, dispatch timing and receiving records"],
  ["gondia", "amgaon", "Amgaon", "forest-produce, agricultural and interstate routes managed through pickup rosters and destination acknowledgements"],
  ["chandrapur", "ballarpur", "Ballarpur", "paper, coal and industrial freight planned through plant gates, driver contacts and completed delivery evidence"],
  ["chandrapur", "warora", "Warora", "power, agricultural and highway logistics coordinated with shift schedules, route checks and receiving confirmation"],
  ["gadchiroli", "armori", "Armori", "forest-produce, agricultural and public-service routes managed through route notes and completed-trip records"],
  ["gadchiroli", "aheri", "Aheri", "remote project, mining-support and long rural journeys planned with driver check-ins and service closure evidence"],
];

export const maharashtraCities: MaharashtraCitySeo[] = maharashtraCitySeeds.map(([districtSlug, slug, name, focus]) => {
  const district = maharashtraDistricts.find((entry) => entry.slug === districtSlug);
  if (!district || !district.cities.includes(name) || slug === districtSlug) throw new Error(`Invalid Maharashtra city mapping: ${districtSlug}/${slug}`);
  return {
    slug, name, districtSlug, districtName: district.name,
    nearbyLocations: district.cities.filter((location) => location !== name),
    sectors: district.sectors, focus, sourceUrl: district.sourceUrl,
    localContext: `For vehicle operations in ${name}, plan ${focus}. Record the responsible driver, vehicle, route, authorised contact and actual operational outcome. GPS reports support journey review, while job records, passenger checks and signed handovers remain the evidence for the underlying task.`,
    routeChecks: [
      `Confirm the ${name} assignment, responsible driver and authorised contact before dispatch.`,
      `Test device reporting on the actual ${name} route and record network gaps separately from operational delays.`,
      `Reconcile the ${name} job record and receiving acknowledgement with the completed journey before closure.`,
    ],
  };
});

export function getMaharashtraCity(districtSlug: string, citySlug: string) { return maharashtraCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug); }
export function getMaharashtraCitiesForDistrict(districtSlug: string) { return maharashtraCities.filter((city) => city.districtSlug === districtSlug); }
export function getMaharashtraCityPath(city: Pick<MaharashtraCitySeo, "districtSlug" | "slug">) { return `/gps-tracker/maharashtra/${city.districtSlug}/${city.slug}`; }

export function generateMaharashtraCityMetadata(city: MaharashtraCitySeo): Metadata {
  const url = `https://naviigps.com${getMaharashtraCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, fleet software and installation needs.`;
  return {
    title, description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Maharashtra`, `vehicle tracking system ${city.name}`,
      `vehicle GPS installation ${city.name} ${city.districtName}`, `fleet management software ${city.name}`,
      `वाहन GPS ट्रॅकर ${city.name}`, `जीपीएस ट्रॅकर ${city.name}`,
    ]),
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
