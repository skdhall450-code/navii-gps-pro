import type { Metadata } from "next";

import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type AndhraPradeshDistrictSeo = {
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

// Andhra Pradesh has 28 districts after the 31 December 2025 reorganisation.
// Location labels support district-level discovery and do not imply a local office.
const regionSeeds: RegionSeed[] = [
  { region: "North Coastal and Agency Andhra Pradesh", sectors: ["port and coastal logistics", "tourism and passenger transport", "rural and agency-area distribution"], districts: [
    ["alluri-sitharama-raju", "Alluri Sitharama Raju", ["Paderu", "Araku Valley", "Chintapalle", "G. Madugula"], "hill and agency-area passenger movement, coffee and farm collections, tourism routes and remote service-vehicle operations", "https://allurisitharamaraju.ap.gov.in/"],
    ["anakapalli", "Anakapalli", ["Anakapalli", "Narsipatnam", "Chodavaram", "Yelamanchili"], "industrial-corridor fleets, agricultural market trips, coastal highway freight and Visakhapatnam-linked distribution", "https://anakapalli.ap.gov.in/"],
    ["parvathipuram-manyam", "Parvathipuram Manyam", ["Parvathipuram", "Palakonda", "Salur", "Kurupam"], "agency-area supply routes, agricultural collections, Odisha-border freight and dispersed public-service vehicle movement", "https://parvathipurammanyam.ap.gov.in/"],
    ["polavaram", "Polavaram", ["Rampachodavaram", "Chinturu", "Kunavaram", "V. R. Puram"], "Godavari agency routes, project-support traffic, remote passenger services and long rural supply journeys", "https://polavaram.ap.gov.in/"],
    ["srikakulam", "Srikakulam", ["Srikakulam", "Palasa", "Tekkali", "Amadalavalasa"], "coastal freight, cashew and agricultural logistics, Odisha corridor movement and district market distribution", "https://srikakulam.ap.gov.in/"],
    ["visakhapatnam", "Visakhapatnam", ["Visakhapatnam", "Gajuwaka", "Bheemunipatnam", "Anandapuram"], "port logistics, steel and industrial transport, dense urban delivery and coastal passenger-fleet operations", "https://visakhapatnam.ap.gov.in/"],
    ["vizianagaram", "Vizianagaram", ["Vizianagaram", "Bobbili", "Cheepurupalli", "Gajapathinagaram"], "regional passenger services, agricultural collections, industrial supply trips and north-coastal market distribution", "https://vizianagaram.ap.gov.in/"],
  ] },
  { region: "Godavari and Krishna Delta", sectors: ["aquaculture and agricultural logistics", "port and warehouse distribution", "intercity commercial fleets"], districts: [
    ["dr-br-ambedkar-konaseema", "Dr. B. R. Ambedkar Konaseema", ["Amalapuram", "Mummidivaram", "Razole", "Kothapeta"], "delta aquaculture collections, coconut and farm logistics, ferry-connected routes and regional passenger transport", "https://konaseema.ap.gov.in/"],
    ["east-godavari", "East Godavari", ["Rajamahendravaram", "Kovvur", "Nidadavole", "Anaparthi"], "Godavari corridor freight, agricultural distribution, urban delivery and highway-connected commercial fleet movement", "https://eastgodavari.ap.gov.in/"],
    ["eluru", "Eluru", ["Eluru", "Jangareddygudem", "Nuzvid", "Kaikalur"], "aquaculture and farm logistics, highway freight, wholesale distribution and multi-town service vehicle operations", "https://eluru.ap.gov.in/"],
    ["kakinada", "Kakinada", ["Kakinada", "Tuni", "Pithapuram", "Peddapuram"], "port-linked freight, oil and industrial support, aquaculture transport and coastal highway distribution", "https://kakinada.ap.gov.in/"],
    ["krishna", "Krishna", ["Machilipatnam", "Gudivada", "Pedana", "Avanigadda"], "coastal and delta logistics, agricultural market trips, fisheries transport and regional passenger fleet coordination", "https://krishna.ap.gov.in/"],
    ["ntr", "NTR", ["Vijayawada", "Nandigama", "Tiruvuru", "Jaggayyapeta"], "Vijayawada urban delivery, national-highway freight, industrial supply movement and intercity passenger operations", "https://ntr.ap.gov.in/"],
    ["west-godavari", "West Godavari", ["Bhimavaram", "Narasapuram", "Tadepalligudem", "Tanuku"], "aquaculture movement, rice and food-processing logistics, coastal trade and dense town-to-town distribution", "https://westgodavari.ap.gov.in/"],
  ] },
  { region: "Central and South Coastal Andhra Pradesh", sectors: ["agricultural and food logistics", "urban and regional distribution", "construction and industrial transport"], districts: [
    ["bapatla", "Bapatla", ["Bapatla", "Chirala", "Repalle", "Parchur"], "coastal agricultural movement, textile and market deliveries, delta routes and regional passenger services", "https://bapatla.ap.gov.in/"],
    ["guntur", "Guntur", ["Guntur", "Tenali", "Mangalagiri", "Ponnur"], "chilli and agricultural logistics, urban delivery, education transport and Amaravati-region commercial movement", "https://guntur.ap.gov.in/"],
    ["palnadu", "Palnadu", ["Narasaraopet", "Sattenapalle", "Gurazala", "Macherla"], "cement and construction logistics, agricultural freight, long regional routes and market-linked vehicle operations", "https://palnadu.ap.gov.in/"],
    ["prakasam", "Prakasam", ["Ongole", "Kandukur", "Darsi", "Chimakurthy"], "granite and industrial traffic, tobacco and farm logistics, coastal corridor freight and district distribution", "https://prakasam.ap.gov.in/"],
    ["markapuram", "Markapuram", ["Markapuram", "Giddalur", "Kanigiri", "Yerragondapalem"], "slate and mineral transport, Nallamala access routes, agricultural collections and long-distance rural distribution", "https://markapuram.ap.gov.in/"],
    ["spsr-nellore", "Sri Potti Sriramulu Nellore", ["Nellore", "Kavali", "Atmakur", "Udayagiri"], "port and industrial corridor traffic, aquaculture logistics, Chennai-linked freight and urban distribution", "https://spsnellore.ap.gov.in/"],
  ] },
  { region: "Rayalaseema", sectors: ["highway and industrial freight", "agricultural logistics", "tourism and passenger transport"], districts: [
    ["ananthapuramu", "Ananthapuramu", ["Ananthapuramu", "Guntakal", "Tadipatri", "Rayadurg"], "Bengaluru-linked highway freight, industrial transport, groundnut logistics and long-distance commercial routes", "https://ananthapuramu.ap.gov.in/"],
    ["annamayya", "Annamayya", ["Rayachoti", "Madanapalle", "Rajampet", "Railway Kodur"], "horticulture and farm collections, hill and inter-district routes, market distribution and passenger movement", "https://annamayya.ap.gov.in/"],
    ["chittoor", "Chittoor", ["Chittoor", "Palamaner", "Kuppam", "Punganur"], "Tamil Nadu and Karnataka corridor freight, dairy and horticulture logistics, industrial trips and passenger transport", "https://chittoor.ap.gov.in/"],
    ["kurnool", "Kurnool", ["Kurnool", "Adoni", "Yemmiganur", "Kodumur"], "interstate highway freight, agricultural market movement, warehousing and regional commercial fleet operations", "https://kurnool.ap.gov.in/"],
    ["nandyal", "Nandyal", ["Nandyal", "Dhone", "Atmakur", "Banaganapalle"], "cement and industrial logistics, Nallamala tourism access, agricultural freight and multi-town distribution", "https://nandyal.ap.gov.in/"],
    ["sri-sathya-sai", "Sri Sathya Sai", ["Puttaparthi", "Hindupur", "Kadiri", "Dharmavaram"], "Bengaluru corridor manufacturing, textile and agricultural logistics, tourism traffic and regional passenger fleets", "https://srisathyasai.ap.gov.in/"],
    ["tirupati", "Tirupati", ["Tirupati", "Srikalahasti", "Sullurpeta", "Puttur"], "pilgrimage passenger fleets, electronics and industrial transport, Chennai corridor freight and urban delivery", "https://tirupati.ap.gov.in/"],
    ["ysr-kadapa", "YSR Kadapa", ["Kadapa", "Proddatur", "Pulivendula", "Badvel"], "mineral and industrial traffic, horticulture collections, regional highway freight and district market distribution", "https://kadapa.ap.gov.in/"],
  ] },
];

export const andhraPradeshDistricts: AndhraPradeshDistrictSeo[] = regionSeeds.flatMap(
  ({ region, sectors, districts }) => districts.map(([slug, name, cities, routeProfile, sourceUrl]) => ({
    slug,
    name,
    region,
    cities,
    sectors,
    sourceUrl,
    localContext: `${name} district in the ${region} operating region includes ${routeProfile}. Compatible GPS devices and fleet software can help authorised teams review reported vehicle location, trip history and supported alerts across these routes.`,
    planningNote: `Before deployment in ${name}, confirm the operating route, vehicle and device compatibility, SIM network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.`,
  })),
);

export function getAndhraPradeshDistrict(slug: string) {
  return andhraPradeshDistricts.find((district) => district.slug === slug);
}

export function generateAndhraPradeshDistrictKeywords(district: AndhraPradeshDistrictSeo) {
  return uniqueKeywords([
    `GPS tracker in ${district.name}`,
    `GPS tracker ${district.name} Andhra Pradesh`,
    `vehicle tracking system ${district.name}`,
    `car GPS tracker ${district.name}`,
    `truck GPS tracking ${district.name}`,
    `fleet management software ${district.name}`,
    `commercial vehicle tracking ${district.name}`,
    `school bus GPS tracking ${district.name}`,
    `GPS tracker dealer ${district.name}`,
    `వాహన GPS ట్రాకర్ ${district.name}`,
    ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`]),
  ]);
}

export function generateAndhraPradeshDistrictMetadata(district: AndhraPradeshDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/andhra-pradesh/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Andhra Pradesh, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`;
  return {
    title: `GPS Tracker in ${district.name} District, Andhra Pradesh`,
    description,
    keywords: uniqueKeywords([...generateAndhraPradeshDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]),
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${district.name} District, Andhra Pradesh | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Andhra Pradesh | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
