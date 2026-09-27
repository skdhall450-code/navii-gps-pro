import type { Metadata } from "next";

import { telanganaDistricts } from "@/lib/seo/telanganaDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type TelanganaCitySeo = {
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

// Phase 2 publishes two curated locations within each current Telangana district.
// It does not automatically generate pages for every locality.
const telanganaCitySeeds: CitySeed[] = [
  ["adilabad", "utnoor", "Utnoor", "forest-edge supply and agricultural collection trips coordinated through assigned drivers, collection records and authorised stops"],
  ["adilabad", "boath", "Boath", "rural service and farm-produce journeys planned around pickup windows, vehicle assignments and documented handovers"],
  ["bhadradri-kothagudem", "kothagudem", "Kothagudem", "industrial and power-sector fleets coordinated with site schedules, gate entries and delivery acknowledgements"],
  ["bhadradri-kothagudem", "bhadrachalam", "Bhadrachalam", "pilgrimage and Godavari-side passenger operations reviewed through authorised itineraries, stop plans and trip closure"],
  ["hanumakonda", "kazipet", "Kazipet", "rail-linked commercial and employee transport coordinated through dispatch windows, assigned drivers and destination records"],
  ["hanumakonda", "parkal", "Parkal", "regional farm and passenger routes managed with planned stops, operating contacts and completed-trip records"],
  ["hyderabad", "secunderabad", "Secunderabad", "urban fleet dispatch and employee transport coordinated through route groups, shift rosters and authorised-user access"],
  ["hyderabad", "charminar", "Charminar", "dense-city deliveries and service visits sequenced with time windows, driver assignments and proof-of-completion records"],
  ["jagtial", "korutla", "Korutla", "agricultural market and regional distribution trips matched with supplier records, collection quantities and consignee receipts"],
  ["jagtial", "metpally", "Metpally", "Godavari-belt service and farm logistics reviewed against route plans, scheduled calls and documented delivery outcomes"],
  ["jangaon", "ghanpur-station", "Ghanpur Station", "corridor freight and passenger operations coordinated with dispatch timing, authorised stops and job closure"],
  ["jangaon", "palakurthi", "Palakurthi", "rural distribution and agricultural collection routes planned with vehicle assignments, field contacts and receiving records"],
  ["jayashankar-bhupalpally", "mahadevpur", "Mahadevpur", "remote project-support and forest-edge journeys coordinated through field contacts, route notes and confirmed task completion"],
  ["jayashankar-bhupalpally", "kataram", "Kataram", "mining-support and rural service trips reviewed through driver check-ins, site schedules and authorised handovers"],
  ["jogulamba-gadwal", "alampur", "Alampur", "pilgrimage and regional passenger trips managed with approved itineraries, passenger rosters and completed-journey records"],
  ["jogulamba-gadwal", "ieeja", "Ieeja", "interstate and agricultural market journeys coordinated with loading records, planned stops and buyer acknowledgements"],
  ["kamareddy", "banswada", "Banswada", "farm and food-distribution vehicles scheduled around collection readiness, market arrivals and documented receiving"],
  ["kamareddy", "yellareddy", "Yellareddy", "rural service and agricultural routes planned with assigned drivers, field contacts and recorded job outcomes"],
  ["karimnagar", "huzurabad", "Huzurabad", "regional wholesale and commercial trips reconciled with dispatch notes, delivery windows and store acknowledgements"],
  ["karimnagar", "choppadandi", "Choppadandi", "agricultural collection and district-market runs coordinated through supplier lists, assigned vehicles and receiving records"],
  ["khammam", "madhira", "Madhira", "interstate corridor freight and market distribution reviewed with consignment references, planned stops and consignee confirmation"],
  ["khammam", "sathupalli", "Sathupalli", "agricultural and commercial movements coordinated with collection schedules, vehicle assignments and documented handovers"],
  ["komaram-bheem-asifabad", "kagaznagar", "Kagaznagar", "industrial and forest-belt supply trips monitored alongside gate schedules, dispatch records and authorised route plans"],
  ["komaram-bheem-asifabad", "sirpur", "Sirpur", "border-area agricultural and service journeys coordinated with field contacts, route notes and receiving acknowledgements"],
  ["mahabubabad", "dornakal", "Dornakal", "rail-linked regional logistics and passenger trips scheduled with job sheets, authorised stops and journey closure"],
  ["mahabubabad", "thorrur", "Thorrur", "farm and wholesale distribution planned against pickup records, market timing and documented customer handovers"],
  ["mahabubnagar", "jadcherla", "Jadcherla", "industrial and highway-freight trips coordinated through loading windows, site entries and consignee receipts"],
  ["mahabubnagar", "devarkadra", "Devarkadra", "agricultural market and regional passenger operations reviewed with driver assignments, route plans and completed-trip records"],
  ["mancherial", "bellampalli", "Bellampalli", "coal-belt industrial and commercial fleets coordinated with site rosters, dispatch schedules and recorded handovers"],
  ["mancherial", "mandamarri", "Mandamarri", "mining-support and regional supply journeys reviewed against shift schedules, loading documents and site acknowledgements"],
  ["medak", "narsapur", "Narsapur", "farm and warehouse distribution coordinated through supplier schedules, stock documents and destination receipts"],
  ["medak", "toopran", "Toopran", "highway-connected service and commercial routes managed with dispatch timing, driver responsibility and job records"],
  ["medchal-malkajgiri", "malkajgiri", "Malkajgiri", "urban employee and service fleets organised with shift rosters, authorised stops and trip-history review"],
  ["medchal-malkajgiri", "quthbullapur", "Quthbullapur", "industrial-estate and warehouse movements coordinated through gate windows, delivery appointments and receiving records"],
  ["mulugu", "eturnagaram", "Eturnagaram", "remote forest and agency-area supply routes coordinated with field contacts, network-gap notes and verified task completion"],
  ["mulugu", "govindaraopet", "Govindaraopet", "rural service and tourism-support journeys planned with authorised itineraries, scheduled calls and driver check-ins"],
  ["nagarkurnool", "kollapur", "Kollapur", "agricultural and river-belt distribution managed with collection quantities, planned stops and buyer handovers"],
  ["nagarkurnool", "kalwakurthy", "Kalwakurthy", "market-bound farm and construction-supply trips coordinated through vehicle assignments, loading notes and delivery records"],
  ["nalgonda", "miryalaguda", "Miryalaguda", "agricultural processing and wholesale fleets scheduled with collection windows, dispatch references and destination receipts"],
  ["nalgonda", "devarakonda", "Devarakonda", "regional passenger and rural supply routes tracked alongside authorised stops, job sheets and completed handovers"],
  ["narayanpet", "makthal", "Makthal", "textile and agricultural movements coordinated with loading records, interstate route plans and buyer acknowledgements"],
  ["narayanpet", "kosgi", "Kosgi", "rural market distribution and service calls planned through assigned vehicles, scheduled contacts and job closure"],
  ["nirmal", "bhainsa", "Bhainsa", "interstate farm and wholesale freight reconciled with consignment records, driver relays and destination receipts"],
  ["nirmal", "khanapur", "Khanapur", "forest-edge service and agricultural routes managed with field contacts, authorised stops and delivery confirmation"],
  ["nizamabad", "bodhan", "Bodhan", "food-processing and agricultural collection trips coordinated with supplier timing, quantity records and receiving acknowledgements"],
  ["nizamabad", "armoor", "Armoor", "regional highway and market distribution managed through dispatch lists, vehicle assignments and verified trip closure"],
  ["peddapalli", "ramagundam", "Ramagundam", "power-sector and industrial logistics coordinated with site schedules, authorised entry and delivery handovers"],
  ["peddapalli", "manthani", "Manthani", "Godavari-side service and agricultural routes reviewed through planned stops, driver check-ins and job records"],
  ["rajanna-sircilla", "vemulawada", "Vemulawada", "pilgrimage and town-fleet operations coordinated with passenger rosters, authorised routes and trip closure"],
  ["rajanna-sircilla", "mustabad", "Mustabad", "textile supply and farm-market runs reconciled with dispatch documents, collection notes and receiver records"],
  ["ranga-reddy", "shamshabad", "Shamshabad", "airport and warehouse logistics coordinated through dispatch windows, vehicle assignments and destination receipts"],
  ["ranga-reddy", "shadnagar", "Shadnagar", "highway-linked industrial and agricultural freight scheduled with loading records, driver relays and delivery confirmation"],
  ["sangareddy", "patancheru", "Patancheru", "industrial-corridor and employee fleets managed with gate schedules, shift rosters and authorised-user access"],
  ["sangareddy", "zaheerabad", "Zaheerabad", "interstate manufacturing and supply routes coordinated with consignment records, planned stops and site receipts"],
  ["siddipet", "gajwel", "Gajwel", "regional commercial and public-service journeys planned with driver assignments, authorised stops and documented outcomes"],
  ["siddipet", "husnabad", "Husnabad", "agricultural market and passenger operations coordinated through route rosters, pickup schedules and receiving records"],
  ["suryapet", "kodad", "Kodad", "national-highway and interstate freight trips reconciled with manifests, scheduled stops and consignee acknowledgements"],
  ["suryapet", "huzurnagar", "Huzurnagar", "farm and regional distribution fleets scheduled around collection windows, market arrivals and delivery records"],
  ["vikarabad", "tandur", "Tandur", "cement and mineral logistics coordinated with loading slips, site windows and signed receiving records"],
  ["vikarabad", "pargi", "Pargi", "agricultural and regional service journeys planned with field contacts, authorised stops and job completion notes"],
  ["wanaparthy", "pebbair", "Pebbair", "highway-corridor and agricultural movements coordinated with route plans, pickup records and consignee confirmation"],
  ["wanaparthy", "atmakur", "Atmakur", "rural distribution and passenger routes managed through driver assignments, scheduled calls and completed-trip records"],
  ["warangal", "narsampet", "Narsampet", "farm and wholesale distribution trips reconciled with collection lists, loading notes and market receipts"],
  ["warangal", "wardhannapet", "Wardhannapet", "regional service and commercial routes planned with job sheets, driver check-ins and destination confirmation"],
  ["yadadri-bhuvanagiri", "yadagirigutta", "Yadagirigutta", "pilgrimage passenger operations coordinated with authorised itineraries, passenger rosters and scheduled trip closure"],
  ["yadadri-bhuvanagiri", "choutuppal", "Choutuppal", "highway-linked industrial and wholesale fleets coordinated with dispatch plans, delivery windows and receiver records"],
];

export const telanganaCities: TelanganaCitySeo[] = telanganaCitySeeds.map(([districtSlug, slug, name, focus]) => {
  const district = telanganaDistricts.find((entry) => entry.slug === districtSlug);
  if (!district || !district.cities.includes(name) || slug === districtSlug) {
    throw new Error(`Invalid Telangana city mapping: ${districtSlug}/${slug}`);
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

export function getTelanganaCity(districtSlug: string, citySlug: string) {
  return telanganaCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug);
}

export function getTelanganaCitiesForDistrict(districtSlug: string) {
  return telanganaCities.filter((city) => city.districtSlug === districtSlug);
}

export function getTelanganaCityPath(city: Pick<TelanganaCitySeo, "districtSlug" | "slug">) {
  return `/gps-tracker/telangana/${city.districtSlug}/${city.slug}`;
}

export function generateTelanganaCityMetadata(city: TelanganaCitySeo): Metadata {
  const url = `https://naviigps.com${getTelanganaCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, fleet software and installation needs.`;
  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Telangana`,
      `vehicle tracking system ${city.name}`,
      `vehicle GPS installation ${city.name} ${city.districtName}`,
      `fleet management software ${city.name}`,
      `వాహన GPS ట్రాకర్ ${city.name}`,
    ]),
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
