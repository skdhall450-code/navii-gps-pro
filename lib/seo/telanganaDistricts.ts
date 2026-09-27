import type { Metadata } from "next";

import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type TelanganaDistrictSeo = {
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

// Telangana has 33 districts. Regional groups below are editorial navigation labels.
// Location labels support district-level discovery and do not imply a local office.
const regionSeeds: RegionSeed[] = [
  { region: "North Telangana", sectors: ["agricultural and forest-produce logistics", "interstate freight", "regional passenger transport"], districts: [
    ["adilabad", "Adilabad", ["Adilabad", "Utnoor", "Boath", "Ichoda"], "cotton and agricultural collections, forest-edge routes, Maharashtra corridor freight and dispersed passenger operations", "https://adilabad.telangana.gov.in/"],
    ["komaram-bheem-asifabad", "Komaram Bheem Asifabad", ["Asifabad", "Kagaznagar", "Sirpur", "Rebbena"], "paper-industry support, forest and farm collections, Maharashtra-border freight and long rural service routes", "https://asifabad.telangana.gov.in/"],
    ["mancherial", "Mancherial", ["Mancherial", "Bellampalli", "Mandamarri", "Chennur"], "coal-belt industrial traffic, Godavari corridor movement, urban delivery and regional passenger services", "https://mancherial.telangana.gov.in/"],
    ["nirmal", "Nirmal", ["Nirmal", "Bhainsa", "Khanapur", "Mudhole"], "agricultural market trips, forest-linked routes, Maharashtra corridor freight and district distribution", "https://nirmal.telangana.gov.in/"],
    ["nizamabad", "Nizamabad", ["Nizamabad", "Bodhan", "Armoor", "Bheemgal"], "turmeric and agricultural logistics, food-processing supply trips, highway freight and urban delivery", "https://nizamabad.telangana.gov.in/"],
    ["kamareddy", "Kamareddy", ["Kamareddy", "Banswada", "Yellareddy", "Jukkal"], "farm and food logistics, Hyderabad-Nagpur corridor movement, market distribution and rural passenger routes", "https://kamareddy.telangana.gov.in/"],
  ] },
  { region: "Central Telangana and Godavari Belt", sectors: ["industrial and mineral transport", "agricultural distribution", "intercity commercial fleets"], districts: [
    ["jagtial", "Jagtial", ["Jagtial", "Korutla", "Metpally", "Dharmapuri"], "agricultural collections, market distribution, pilgrimage passenger trips and Godavari-linked commercial routes", "https://jagtial.telangana.gov.in/"],
    ["karimnagar", "Karimnagar", ["Karimnagar", "Huzurabad", "Choppadandi", "Manakondur"], "urban delivery, granite and agricultural transport, regional wholesale movement and passenger fleet operations", "https://karimnagar.telangana.gov.in/"],
    ["peddapalli", "Peddapalli", ["Peddapalli", "Ramagundam", "Manthani", "Sultanabad"], "thermal-power and industrial traffic, coal logistics, Godavari corridor freight and town-to-town distribution", "https://peddapalli.telangana.gov.in/"],
    ["rajanna-sircilla", "Rajanna Sircilla", ["Sircilla", "Vemulawada", "Mustabad", "Gambhiraopet"], "textile supply chains, pilgrimage passenger movement, agricultural logistics and regional distribution", "https://rajannasircilla.telangana.gov.in/"],
    ["siddipet", "Siddipet", ["Siddipet", "Gajwel", "Husnabad", "Dubbak"], "Hyderabad-linked distribution, agricultural market traffic, construction support and intercity passenger routes", "https://siddipet.telangana.gov.in/"],
    ["medak", "Medak", ["Medak", "Narsapur", "Toopran", "Ramayampet"], "industrial and warehouse trips, agricultural collections, highway freight and regional service fleets", "https://medak.telangana.gov.in/"],
    ["sangareddy", "Sangareddy", ["Sangareddy", "Patancheru", "Zaheerabad", "Narayankhed"], "industrial-corridor transport, warehousing, interstate freight and dense Hyderabad-linked employee movement", "https://sangareddy.telangana.gov.in/"],
  ] },
  { region: "Hyderabad Metropolitan Region", sectors: ["urban delivery and e-commerce", "employee and passenger transport", "industrial and warehouse fleets"], districts: [
    ["hyderabad", "Hyderabad", ["Hyderabad", "Secunderabad", "Charminar", "Mehdipatnam"], "dense urban delivery, airport and passenger trips, employee transport and round-the-clock commercial fleet movement", "https://hyderabad.telangana.gov.in/"],
    ["medchal-malkajgiri", "Medchal-Malkajgiri", ["Medchal", "Malkajgiri", "Quthbullapur", "Kapra"], "industrial-estate traffic, urban delivery, employee transport and Outer Ring Road-connected fleet operations", "https://medchal-malkajgiri.telangana.gov.in/"],
    ["ranga-reddy", "Ranga Reddy", ["Shamshabad", "Shadnagar", "Ibrahimpatnam", "Chevella"], "airport logistics, warehousing, industrial movement and Hyderabad-region highway distribution", "https://rangareddy.telangana.gov.in/"],
    ["vikarabad", "Vikarabad", ["Vikarabad", "Tandur", "Pargi", "Kodangal"], "cement and mineral transport, farm collections, Karnataka-border freight and regional passenger routes", "https://vikarabad.telangana.gov.in/"],
  ] },
  { region: "East Telangana", sectors: ["mineral and industrial logistics", "agricultural and forest-produce transport", "regional passenger fleets"], districts: [
    ["hanumakonda", "Hanumakonda", ["Hanumakonda", "Kazipet", "Parkal", "Elkathurthy"], "tri-city urban delivery, rail-linked commercial movement, education transport and regional passenger operations", "https://hanumakonda.telangana.gov.in/"],
    ["warangal", "Warangal", ["Warangal", "Narsampet", "Wardhannapet", "Nekkonda"], "agricultural market traffic, urban distribution, textile-linked trips and district passenger services", "https://warangal.telangana.gov.in/"],
    ["jangaon", "Jangaon", ["Jangaon", "Ghanpur Station", "Palakurthi", "Devaruppula"], "Hyderabad-Warangal corridor traffic, farm logistics, market distribution and regional passenger movement", "https://jangaon.telangana.gov.in/"],
    ["jayashankar-bhupalpally", "Jayashankar Bhupalpally", ["Bhupalpally", "Mahadevpur", "Kataram", "Mogullapally"], "mining support, forest and farm routes, Godavari-side movement and long rural service operations", "https://bhoopalapally.telangana.gov.in/"],
    ["mulugu", "Mulugu", ["Mulugu", "Eturnagaram", "Venkatapur", "Govindaraopet"], "forest and tribal-area supply routes, tourism traffic, farm collections and remote public-service journeys", "https://mulugu.telangana.gov.in/"],
    ["mahabubabad", "Mahabubabad", ["Mahabubabad", "Dornakal", "Maripeda", "Thorrur"], "agricultural and chilli logistics, rail-linked commerce, rural distribution and district passenger movement", "https://mahabubabad.telangana.gov.in/"],
    ["khammam", "Khammam", ["Khammam", "Madhira", "Sathupalli", "Wyra"], "agricultural and market logistics, Andhra Pradesh corridor freight, urban delivery and intercity passenger fleets", "https://khammam.telangana.gov.in/"],
    ["bhadradri-kothagudem", "Bhadradri Kothagudem", ["Kothagudem", "Bhadrachalam", "Palvancha", "Manuguru"], "coal and power-sector transport, forest routes, pilgrimage passenger trips and interstate freight operations", "https://kothagudem.telangana.gov.in/"],
  ] },
  { region: "South Telangana", sectors: ["highway and agricultural logistics", "construction and industrial transport", "regional passenger operations"], districts: [
    ["nalgonda", "Nalgonda", ["Nalgonda", "Miryalaguda", "Devarakonda", "Nakrekal"], "cement and agricultural transport, Hyderabad-Vijayawada corridor freight, market trips and regional distribution", "https://nalgonda.telangana.gov.in/"],
    ["suryapet", "Suryapet", ["Suryapet", "Kodad", "Huzurnagar", "Thungathurthi"], "national-highway freight, agricultural collections, Andhra Pradesh corridor movement and town delivery fleets", "https://suryapet.telangana.gov.in/"],
    ["yadadri-bhuvanagiri", "Yadadri Bhuvanagiri", ["Bhongir", "Yadagirigutta", "Choutuppal", "Alair"], "pilgrimage transport, Hyderabad-Warangal and Vijayawada corridor traffic, industrial trips and urban-edge distribution", "https://yadadri.telangana.gov.in/"],
    ["mahabubnagar", "Mahabubnagar", ["Mahabubnagar", "Jadcherla", "Devarkadra", "Bhoothpur"], "Bengaluru-Hyderabad highway freight, agricultural logistics, industrial supply trips and passenger transport", "https://mahabubnagar.telangana.gov.in/"],
    ["narayanpet", "Narayanpet", ["Narayanpet", "Makthal", "Kosgi", "Dhanwada"], "textile and agricultural movement, Karnataka-border freight, rural distribution and long passenger routes", "https://narayanpet.telangana.gov.in/"],
    ["wanaparthy", "Wanaparthy", ["Wanaparthy", "Pebbair", "Atmakur", "Kothakota"], "agricultural market trips, Bengaluru corridor movement, rural distribution and regional passenger services", "https://wanaparthy.telangana.gov.in/"],
    ["nagarkurnool", "Nagarkurnool", ["Nagarkurnool", "Kollapur", "Kalwakurthy", "Achampet"], "farm and forest-edge logistics, Srisailam-bound passenger traffic, long rural routes and market distribution", "https://nagarkurnool.telangana.gov.in/"],
    ["jogulamba-gadwal", "Jogulamba Gadwal", ["Gadwal", "Alampur", "Ieeja", "Waddepally"], "textile and agricultural logistics, interstate highway freight, pilgrimage movement and regional passenger operations", "https://gadwal.telangana.gov.in/"],
  ] },
];

export const telanganaDistricts: TelanganaDistrictSeo[] = regionSeeds.flatMap(
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

export function getTelanganaDistrict(slug: string) {
  return telanganaDistricts.find((district) => district.slug === slug);
}

export function generateTelanganaDistrictKeywords(district: TelanganaDistrictSeo) {
  return uniqueKeywords([
    `GPS tracker in ${district.name}`,
    `GPS tracker ${district.name} Telangana`,
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

export function generateTelanganaDistrictMetadata(district: TelanganaDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/telangana/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Telangana, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`;
  return {
    title: `GPS Tracker in ${district.name} District, Telangana`,
    description,
    keywords: uniqueKeywords([...generateTelanganaDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]),
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${district.name} District, Telangana | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Telangana | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
