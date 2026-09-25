import type { Metadata } from "next";

import { karnatakaDistricts } from "@/lib/seo/karnatakaDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

type KarnatakaCitySeed = [districtSlug: string, slug: string, name: string, focus: string];

export type KarnatakaCitySeo = {
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

// Two reviewed priority towns per district. District-scoped URLs prevent
// collisions with standalone city guides and same-name locations.
const karnatakaCitySeeds: KarnatakaCitySeed[] = [
  ["bengaluru-urban", "yelahanka", "Yelahanka", "airport-side employee and service routes aligned with approved shift and access windows"],
  ["bengaluru-urban", "anekal", "Anekal", "industrial worker transport and supplier visits reconciled with plant gate records"],
  ["bengaluru-rural", "devanahalli", "Devanahalli", "airport logistics assignments separated from waiting, loading and active journey time"],
  ["bengaluru-rural", "doddaballapura", "Doddaballapura", "industrial collection rounds released against confirmed supplier and receiving slots"],
  ["bengaluru-south", "channapatna", "Channapatna", "highway retail deliveries closed with individual receiver and quantity acknowledgements"],
  ["bengaluru-south", "kanakapura", "Kanakapura", "rural service and construction visits grouped by authorised customer appointments"],
  ["kolar", "malur", "Malur", "industrial supplier runs sequenced through confirmed dispatch and factory gate appointments"],
  ["kolar", "bangarapet", "Bangarapet", "regional wholesale and farm consignments separated through documented custody stages"],
  ["chikkaballapura", "gauribidanur", "Gauribidanur", "interstate agricultural pickups coordinated with supplier readiness and load records"],
  ["chikkaballapura", "chintamani", "Chintamani", "horticulture collection routes reconciled against grower and market acknowledgements"],
  ["tumakuru", "tiptur", "Tiptur", "coconut and agricultural loads consolidated without losing supplier-level records"],
  ["tumakuru", "kunigal", "Kunigal", "regional delivery changes approved before vehicles leave their assigned operating corridor"],
  ["mysuru", "nanjangud", "Nanjangud", "industrial dispatch and employee transport kept on separate approved trip rosters"],
  ["mysuru", "hunsur", "Hunsur", "tourism and agricultural routes reviewed with driver, vehicle and load handovers"],
  ["mandya", "maddur", "Maddur", "highway distribution rounds closed with customer receipts and returned-goods records"],
  ["mandya", "srirangapatna", "Srirangapatna", "tour and charter stops coordinated through authorised group contacts and headcounts"],
  ["chamarajanagar", "kollegal", "Kollegal", "long rural service routes distinguished from reporting gaps and unplanned stops"],
  ["chamarajanagar", "gundlupet", "Gundlupet", "interstate freight and tourism journeys checked through border-route handovers"],
  ["hassan", "sakleshpur", "Sakleshpur", "hill-route vehicle readiness and driver handovers checked before each freight leg"],
  ["hassan", "arsikere", "Arsikere", "agricultural market collections assigned to one dispatch owner and receiving record"],
  ["kodagu", "kushalnagar", "Kushalnagar", "tourism pickups and plantation collections separated by booking and consignment record"],
  ["kodagu", "virajpet", "Virajpet", "coffee-estate collection handovers matched with grower and warehouse acknowledgements"],
  ["dakshina-kannada", "mangaluru", "Mangaluru", "port-linked freight stages recorded separately from yard and terminal waiting time"],
  ["dakshina-kannada", "puttur", "Puttur", "regional goods and institutional routes operated from current dispatch rosters"],
  ["udupi", "kundapura", "Kundapura", "coastal distribution and fisheries loads reconciled with receiver instructions"],
  ["udupi", "karkala", "Karkala", "institutional and industrial service visits linked to authorised work orders"],
  ["uttara-kannada", "karwar", "Karwar", "port and coastal service movements issued with check-in and emergency contacts"],
  ["uttara-kannada", "sirsi", "Sirsi", "forest and agricultural collections closed through source and quantity acknowledgements"],
  ["chikkamagaluru", "kadur", "Kadur", "agricultural dispatches sequenced by supplier readiness and market receiving windows"],
  ["chikkamagaluru", "mudigere", "Mudigere", "plantation and hill-route reporting gaps separated from actual operational delays"],
  ["shivamogga", "bhadravati", "Bhadravati", "industrial shift vehicles and material dispatches tied to separate work records"],
  ["shivamogga", "sagara", "Sagara", "remote tourism and service journeys confirmed through current route contacts"],
  ["chitradurga", "hiriyur", "Hiriyur", "national-highway driver relays completed with vehicle and document handovers"],
  ["chitradurga", "challakere", "Challakere", "field-service and project vehicles assigned against active work orders"],
  ["davanagere", "harihar", "Harihar", "industrial and textile consignments tracked through releasing and receiving custody"],
  ["davanagere", "channagiri", "Channagiri", "farm collection substitutions approved before loading and route reassignment"],
  ["belagavi", "gokak", "Gokak", "manufacturing and sugar-sector loads separated by dispatch batch and destination"],
  ["belagavi", "chikkodi", "Chikkodi", "interstate agricultural routes reviewed with driver and consignment handovers"],
  ["bagalkote", "jamkhandi", "Jamkhandi", "sugarcane and farm pickups consolidated with supplier-level quantity records"],
  ["bagalkote", "mudhol", "Mudhol", "industrial and agricultural deliveries sequenced by confirmed receiving slots"],
  ["vijayapura", "indi", "Indi", "long regional freight legs checked through daily driver and load confirmations"],
  ["vijayapura", "sindagi", "Sindagi", "rural wholesale replenishment closed through store and quantity acknowledgements"],
  ["dharwad", "hubballi", "Hubballi", "warehouse collections and urban deliveries assigned without duplicate vehicle visits"],
  ["dharwad", "kalghatgi", "Kalghatgi", "rural distribution rounds rescheduled only through confirmed customer contacts"],
  ["gadag", "gajendragad", "Gajendragad", "construction and agricultural loads supported by site receiving evidence"],
  ["gadag", "lakshmeshwar", "Lakshmeshwar", "market delivery rounds reconciled with individual customer acknowledgements"],
  ["haveri", "ranebennur", "Ranebennur", "highway freight reassignments recorded against the original dispatch order"],
  ["haveri", "byadgi", "Byadgi", "chilli-market collections matched with supplier and weighment records"],
  ["ballari", "siruguppa", "Siruguppa", "agricultural and industrial loads separated through documented receiving instructions"],
  ["ballari", "sandur", "Sandur", "mining-support vehicle access aligned with approved contractor work orders"],
  ["vijayanagara", "hosapete", "Hosapete", "industrial traffic and heritage tourism trips maintained on separate rosters"],
  ["vijayanagara", "harapanahalli", "Harapanahalli", "regional material deliveries unloaded in the authorised multi-site sequence"],
  ["koppal", "gangavati", "Gangavati", "rice and agricultural collections reconciled with supplier weight records"],
  ["koppal", "kushtagi", "Kushtagi", "rural field-service equipment custody recorded before and after each visit"],
  ["raichur", "sindhanur", "Sindhanur", "rice-belt dispatches coordinated with supplier readiness and mill receiving windows"],
  ["raichur", "manvi", "Manvi", "multi-town retail replenishment closed with store and returned-stock records"],
  ["kalaburagi", "aland", "Aland", "regional construction deliveries supported by authorised site acknowledgements"],
  ["kalaburagi", "sedam", "Sedam", "cement-sector contractor access and loading time linked to active work orders"],
  ["bidar", "basavakalyan", "Basavakalyan", "interstate passenger and freight routes managed through documented driver relays"],
  ["bidar", "bhalki", "Bhalki", "agricultural collections released only after receiving instructions are confirmed"],
  ["yadgir", "shahapur", "Shahapur", "farm-input and produce trips closed with receiver and quantity acknowledgements"],
  ["yadgir", "shorapur", "Shorapur", "remote commercial routes checked through assigned driver and support contacts"],
];

export const karnatakaCities: KarnatakaCitySeo[] = karnatakaCitySeeds.map(([districtSlug, slug, name, focus]) => {
  const district = karnatakaDistricts.find((entry) => entry.slug === districtSlug);
  if (!district || !district.cities.includes(name) || slug === districtSlug) {
    throw new Error(`Invalid Karnataka city mapping: ${districtSlug}/${slug}`);
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

export function getKarnatakaCity(districtSlug: string, citySlug: string) {
  return karnatakaCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug);
}

export function getKarnatakaCitiesForDistrict(districtSlug: string) {
  return karnatakaCities.filter((city) => city.districtSlug === districtSlug);
}

export function getKarnatakaCityPath(city: Pick<KarnatakaCitySeo, "districtSlug" | "slug">) {
  return `/gps-tracker/karnataka/${city.districtSlug}/${city.slug}`;
}

export function generateKarnatakaCityMetadata(city: KarnatakaCitySeo): Metadata {
  const url = `https://naviigps.com${getKarnatakaCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, fleet software and installation needs.`;
  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Karnataka`,
      `vehicle tracking system ${city.name}`,
      `vehicle GPS installation ${city.name} ${city.districtName}`,
      `fleet management software ${city.name}`,
      `ವಾಹನ GPS ಟ್ರ್ಯಾಕರ್ ${city.name}`,
    ]),
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
