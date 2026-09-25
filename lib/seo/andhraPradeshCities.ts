import type { Metadata } from "next";

import { andhraPradeshDistricts } from "@/lib/seo/andhraPradeshDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type AndhraPradeshCitySeo = {
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

// Phase 2 publishes two reviewed locations within each current Andhra Pradesh district.
// The list is intentionally curated; it does not auto-publish every locality.
const andhraPradeshCitySeeds: CitySeed[] = [
  ["alluri-sitharama-raju", "paderu", "Paderu", "agency-area service trips coordinated with named drivers, hill-route timing and recorded delivery handovers"],
  ["alluri-sitharama-raju", "araku-valley", "Araku Valley", "tourism and coffee-route vehicles checked against passenger manifests, collection notes and changing hill conditions"],
  ["anakapalli", "narsipatnam", "Narsipatnam", "regional wholesale and farm trips reconciled with dispatch records, market receipts and return-load instructions"],
  ["anakapalli", "chodavaram", "Chodavaram", "agricultural collection vehicles tracked alongside supplier schedules, quantity records and processing-centre arrivals"],
  ["ananthapuramu", "guntakal", "Guntakal", "rail-linked commercial distribution coordinated through assigned vehicles, warehouse releases and receiving acknowledgements"],
  ["ananthapuramu", "tadipatri", "Tadipatri", "industrial and construction-material journeys reviewed against work orders, loading windows and authorised site receipts"],
  ["annamayya", "rayachoti", "Rayachoti", "district-market replenishment trips closed with store records, driver responsibility and verified return-stock details"],
  ["annamayya", "madanapalle", "Madanapalle", "horticulture movements planned around collection timing, temperature-sensitive handling and buyer receiving windows"],
  ["bapatla", "chirala", "Chirala", "textile and coastal-market deliveries reconciled with consignment lists, customer handovers and return journeys"],
  ["bapatla", "repalle", "Repalle", "delta farm and fisheries trips checked against collection quantities, cold-chain needs and receiving confirmations"],
  ["chittoor", "palamaner", "Palamaner", "interstate dairy and commercial routes coordinated with loading records, border timing and consignee acknowledgements"],
  ["chittoor", "kuppam", "Kuppam", "three-state corridor journeys reviewed through driver assignments, scheduled stops and documented delivery outcomes"],
  ["dr-br-ambedkar-konaseema", "amalapuram", "Amalapuram", "delta distribution and passenger operations managed with route rosters, authorised stops and completed-trip records"],
  ["dr-br-ambedkar-konaseema", "mummidivaram", "Mummidivaram", "aquaculture and coconut collections coordinated with supplier readiness, loading notes and buyer acceptance"],
  ["east-godavari", "rajamahendravaram", "Rajamahendravaram", "urban and Godavari-corridor fleets reviewed through dispatch sequencing, delivery evidence and driver handovers"],
  ["east-godavari", "kovvur", "Kovvur", "bridge-corridor freight and regional supply trips matched with warehouse releases and destination receipts"],
  ["eluru", "jangareddygudem", "Jangareddygudem", "upland agricultural and service routes closed using collection records, scheduled calls and receiver confirmation"],
  ["eluru", "nuzvid", "Nuzvid", "mango and farm-produce movements planned around harvest readiness, loading counts and market arrival windows"],
  ["guntur", "tenali", "Tenali", "delta market and retail replenishment coordinated with dispatch batches, shop acknowledgements and returned inventory"],
  ["guntur", "mangalagiri", "Mangalagiri", "Amaravati-region employee and commercial trips reviewed through shift rosters, authorised stops and trip closure"],
  ["kakinada", "tuni", "Tuni", "coastal highway freight managed through driver relays, delivery appointments and recorded exception follow-up"],
  ["kakinada", "pithapuram", "Pithapuram", "farm, food-processing and local distribution runs matched with order references and receiving acknowledgements"],
  ["krishna", "machilipatnam", "Machilipatnam", "coastal commercial and fisheries trips coordinated with dispatch notes, handling requirements and delivery proof"],
  ["krishna", "gudivada", "Gudivada", "rice-belt distribution and passenger routes checked against job sheets, scheduled stops and completed handovers"],
  ["kurnool", "adoni", "Adoni", "interstate agricultural and wholesale freight reviewed through loading slips, route exceptions and consignee records"],
  ["kurnool", "yemmiganur", "Yemmiganur", "cotton and regional market trips reconciled with supplier documents, vehicle assignments and buyer receipts"],
  ["markapuram", "giddalur", "Giddalur", "Nallamala-edge goods and passenger routes planned with fuel stops, driver check-ins and destination confirmation"],
  ["markapuram", "kanigiri", "Kanigiri", "rural distribution and farm-support vehicles reviewed against service calls, stock movement and customer handovers"],
  ["nandyal", "dhone", "Dhone", "highway freight and industrial supply trips coordinated with loading windows, driver responsibility and site receipts"],
  ["nandyal", "atmakur", "Atmakur", "forest-edge service and pilgrimage routes checked through authorised itineraries, stop records and trip outcomes"],
  ["ntr", "vijayawada", "Vijayawada", "dense urban delivery and intercity fleets sequenced through dispatch zones, time windows and digital job closure"],
  ["ntr", "nandigama", "Nandigama", "national-highway commercial trips reconciled with warehouse release, scheduled delivery and return-load records"],
  ["palnadu", "narasaraopet", "Narasaraopet", "regional wholesale and agricultural distribution managed through route sheets, order references and store receipts"],
  ["palnadu", "sattenapalle", "Sattenapalle", "cement, construction and market trips checked against work orders, unloading approval and completed-job evidence"],
  ["parvathipuram-manyam", "parvathipuram", "Parvathipuram", "agency-border distribution coordinated with named contacts, scheduled calls and documented rural handovers"],
  ["parvathipuram-manyam", "salur", "Salur", "Odisha-linked passenger and goods routes reviewed through driver rosters, stop plans and receiving confirmation"],
  ["polavaram", "rampachodavaram", "Rampachodavaram", "agency-area project and supply vehicles checked against permits, remote-route timing and site acknowledgements"],
  ["polavaram", "chinturu", "Chinturu", "long rural service journeys coordinated with field contacts, network-gap notes and verified task completion"],
  ["prakasam", "ongole", "Ongole", "granite, tobacco and urban distribution fleets reviewed through load documents, delivery slots and receiver sign-off"],
  ["prakasam", "kandukur", "Kandukur", "coastal and agricultural market trips matched with supplier records, planned stops and delivery acknowledgements"],
  ["spsr-nellore", "nellore", "Nellore", "aquaculture, industrial and city fleets coordinated through dispatch queues, cold-chain notes and customer receipts"],
  ["spsr-nellore", "kavali", "Kavali", "Chennai-corridor freight and coastal deliveries reviewed against manifests, driver relays and destination windows"],
  ["sri-sathya-sai", "puttaparthi", "Puttaparthi", "visitor and institutional transport managed through authorised itineraries, passenger rosters and trip completion"],
  ["sri-sathya-sai", "hindupur", "Hindupur", "Bengaluru-linked manufacturing fleets coordinated with shift schedules, gate entries and supplier handovers"],
  ["srikakulam", "palasa", "Palasa", "cashew and coastal freight trips reconciled with processor schedules, consignment details and buyer acceptance"],
  ["srikakulam", "tekkali", "Tekkali", "regional service and farm routes checked against assigned calls, material records and completed handovers"],
  ["tirupati", "srikalahasti", "Srikalahasti", "pilgrimage and industrial transport coordinated with passenger lists, shift timing and authorised route stops"],
  ["tirupati", "sullurpeta", "Sullurpeta", "Chennai corridor and space-industry support trips reviewed through access instructions, schedules and site receipts"],
  ["visakhapatnam", "gajuwaka", "Gajuwaka", "industrial employee and cargo movements sequenced with gate windows, shift rosters and plant acknowledgements"],
  ["visakhapatnam", "bheemunipatnam", "Bheemunipatnam", "coastal passenger and delivery routes checked against itineraries, customer stops and completed-trip evidence"],
  ["vizianagaram", "bobbili", "Bobbili", "industrial and agricultural supply trips reconciled with dispatch documents, market timing and receiver records"],
  ["vizianagaram", "cheepurupalli", "Cheepurupalli", "rural commercial routes managed through vehicle assignments, scheduled calls and delivery confirmation"],
  ["west-godavari", "bhimavaram", "Bhimavaram", "aquaculture collections and urban distribution coordinated with harvest timing, cold-chain notes and buyer receipts"],
  ["west-godavari", "narasapuram", "Narasapuram", "coastal trade and lace-sector deliveries reviewed through order references, route stops and customer handovers"],
  ["ysr-kadapa", "kadapa", "Kadapa", "urban, mineral and regional distribution fleets sequenced through dispatch plans, delivery evidence and return records"],
  ["ysr-kadapa", "proddatur", "Proddatur", "commercial and industrial trips checked against consignment documents, scheduled unloading and consignee approval"],
];

export const andhraPradeshCities: AndhraPradeshCitySeo[] = andhraPradeshCitySeeds.map(([districtSlug, slug, name, focus]) => {
  const district = andhraPradeshDistricts.find((entry) => entry.slug === districtSlug);
  if (!district || !district.cities.includes(name) || slug === districtSlug) {
    throw new Error(`Invalid Andhra Pradesh city mapping: ${districtSlug}/${slug}`);
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

export function getAndhraPradeshCity(districtSlug: string, citySlug: string) {
  return andhraPradeshCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug);
}

export function getAndhraPradeshCitiesForDistrict(districtSlug: string) {
  return andhraPradeshCities.filter((city) => city.districtSlug === districtSlug);
}

export function getAndhraPradeshCityPath(city: Pick<AndhraPradeshCitySeo, "districtSlug" | "slug">) {
  return `/gps-tracker/andhra-pradesh/${city.districtSlug}/${city.slug}`;
}

export function generateAndhraPradeshCityMetadata(city: AndhraPradeshCitySeo): Metadata {
  const url = `https://naviigps.com${getAndhraPradeshCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, fleet software and installation needs.`;
  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Andhra Pradesh`,
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
