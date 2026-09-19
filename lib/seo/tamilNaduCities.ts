import type { Metadata } from "next";

import { tamilNaduDistricts } from "@/lib/seo/tamilNaduDistricts";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

type TamilNaduCitySeed = [districtSlug: string, slug: string, name: string, focus: string];

export type TamilNaduCitySeo = {
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

// Two reviewed priority towns per district. District-scoped URLs avoid conflicts
// between same-name locations and existing standalone city guides.
const tamilNaduCitySeeds: TamilNaduCitySeed[] = [
  ["chennai", "ambattur", "Ambattur", "industrial shift transport with documented driver and vehicle handovers"],
  ["chennai", "sholinganallur", "Sholinganallur", "employee transport rosters aligned with approved office pickup windows"],
  ["chengalpattu", "tambaram", "Tambaram", "suburban delivery windows confirmed before route reassignment"],
  ["chengalpattu", "madurantakam", "Madurantakam", "rural distribution rounds with separately approved return loads"],
  ["kancheepuram", "sriperumbudur", "Sriperumbudur", "supplier gate appointments linked to the correct work order"],
  ["kancheepuram", "uthiramerur", "Uthiramerur", "rural field-service calls grouped by confirmed customer appointments"],
  ["tiruvallur", "avadi", "Avadi", "factory employee shifts with separate boarding and vehicle-readiness checks"],
  ["tiruvallur", "gummidipoondi", "Gummidipoondi", "industrial freight arrivals coordinated with authorised gate slots"],
  ["ranipet", "arcot", "Arcot", "multi-stop wholesale distribution with clear order ownership"],
  ["ranipet", "arakkonam", "Arakkonam", "depot transfers recorded through dispatch and receiving custody stages"],
  ["vellore", "gudiyatham", "Gudiyatham", "supplier collections released against confirmed quantities and references"],
  ["vellore", "katpadi", "Katpadi", "institutional shuttle schedules with verified passenger rosters"],
  ["tirupathur", "vaniyambadi", "Vaniyambadi", "manufacturing dispatch batches kept separate from vehicle waiting time"],
  ["tirupathur", "ambur", "Ambur", "finished-goods consignments tracked through documented custody handovers"],
  ["tiruvannamalai", "arani", "Arani", "textile collection rounds reconciled with supplier acknowledgements"],
  ["tiruvannamalai", "cheyyar", "Cheyyar", "industrial supplier runs sequenced by confirmed receiving slots"],
  ["viluppuram", "tindivanam", "Tindivanam", "highway delivery reassignments recorded against the original order"],
  ["viluppuram", "gingee", "Gingee", "tour and passenger meeting points confirmed independently from parking arrival"],
  ["kallakurichi", "ulundurpet", "Ulundurpet", "long-route driver handovers documented before the next freight leg"],
  ["kallakurichi", "tirukoilur", "Tirukoilur", "farm collection substitutions approved before vehicle loading"],
  ["cuddalore", "neyveli", "Neyveli", "maintenance vehicle access aligned with approved plant work orders"],
  ["cuddalore", "chidambaram", "Chidambaram", "pilgrimage passenger rosters checked at outbound and return stages"],
  ["coimbatore", "pollachi", "Pollachi", "agricultural collections reconciled with supplier weight records"],
  ["coimbatore", "mettupalayam", "Mettupalayam", "hill-route vehicle readiness checked before each operating leg"],
  ["tiruppur", "udumalaipettai", "Udumalaipettai", "mixed textile and agricultural loads separated by delivery record"],
  ["tiruppur", "avinashi", "Avinashi", "sample-approval trips kept separate from production deliveries"],
  ["erode", "perundurai", "Perundurai", "industrial-estate visits coordinated through confirmed gate appointments"],
  ["erode", "bhavani", "Bhavani", "textile consignments and reusable packaging recorded independently"],
  ["salem", "mettur", "Mettur", "contractor access and shift changes tied to active service work orders"],
  ["salem", "attur", "Attur", "multi-supplier agricultural pickups consolidated without losing source records"],
  ["namakkal", "tiruchengode", "Tiruchengode", "long-haul driver relays completed with vehicle and document handovers"],
  ["namakkal", "rasipuram", "Rasipuram", "commercial collections released only after receiving instructions are confirmed"],
  ["dharmapuri", "harur", "Harur", "rural school transport attendance checked separately from vehicle arrival"],
  ["dharmapuri", "palacode", "Palacode", "produce pickup windows coordinated with supplier readiness"],
  ["krishnagiri", "hosur", "Hosur", "multi-plant supplier routes assigned without duplicate collection visits"],
  ["krishnagiri", "denkanikottai", "Denkanikottai", "remote-route reporting gaps distinguished from unplanned vehicle stops"],
  ["nilgiris", "udhagamandalam", "Udhagamandalam", "tour vehicle parking and passenger meeting points documented separately"],
  ["nilgiris", "coonoor", "Coonoor", "tea collection handovers matched with estate and receiving records"],
  ["tiruchirappalli", "srirangam", "Srirangam", "charter passenger pickups coordinated through authorised group contacts"],
  ["tiruchirappalli", "manapparai", "Manapparai", "wholesale delivery rounds closed with individual customer receipts"],
  ["karur", "kulithalai", "Kulithalai", "regional market collections assigned to one vehicle and dispatch owner"],
  ["karur", "aravakurichi", "Aravakurichi", "field-service equipment custody recorded before and after each visit"],
  ["perambalur", "kunnam", "Kunnam", "construction-material deliveries supported by site receiving evidence"],
  ["perambalur", "alathur", "Alathur", "commercial vehicle queues separated from active loading and travel time"],
  ["ariyalur", "jayankondam", "Jayankondam", "equipment-service shifts linked to authorised maintenance tasks"],
  ["ariyalur", "udayarpalayam", "Udayarpalayam", "rural service spares transferred through documented custody"],
  ["dindigul", "palani", "Palani", "pilgrimage passenger journeys checked against approved trip rosters"],
  ["dindigul", "oddanchatram", "Oddanchatram", "market dispatches sequenced by supplier readiness and receiver windows"],
  ["pudukkottai", "aranthangi", "Aranthangi", "mixed fisheries and farm collections separated by consignment record"],
  ["pudukkottai", "alangudi", "Alangudi", "rural maintenance appointments rescheduled through confirmed contacts"],
  ["thanjavur", "kumbakonam", "Kumbakonam", "tour and temple charter stops managed with passenger headcounts"],
  ["thanjavur", "pattukkottai", "Pattukkottai", "partial wholesale deliveries recorded before returned goods move onward"],
  ["tiruvarur", "mannargudi", "Mannargudi", "paddy collection loads consolidated with supplier-level records"],
  ["tiruvarur", "thiruthuraipoondi", "Thiruthuraipoondi", "field-route changes approved before vehicles leave the assigned area"],
  ["nagapattinam", "vedaranyam", "Vedaranyam", "coastal service journeys issued with check-in and emergency contacts"],
  ["nagapattinam", "kilvelur", "Kilvelur", "farm-input deliveries closed with receiver and quantity acknowledgements"],
  ["mayiladuthurai", "sirkazhi", "Sirkazhi", "school and institutional routes operated from current passenger rosters"],
  ["mayiladuthurai", "tharangambadi", "Tharangambadi", "coastal tourism pickups updated through the booking owner"],
  ["madurai", "melur", "Melur", "construction deliveries unloaded in the approved multi-site sequence"],
  ["madurai", "thirumangalam", "Thirumangalam", "cross-dock transfers documented at releasing and receiving stages"],
  ["theni", "periyakulam", "Periyakulam", "produce collection vehicles dispatched after supplier readiness confirmation"],
  ["theni", "cumbum", "Cumbum", "long regional freight legs reviewed with daily driver and load checks"],
  ["sivaganga", "karaikudi", "Karaikudi", "tour and commercial stops assigned to a clear trip owner"],
  ["sivaganga", "devakottai", "Devakottai", "service documents transferred with sender and receiver custody records"],
  ["ramanathapuram", "rameswaram", "Rameswaram", "pilgrimage charter headcounts confirmed at departure and return"],
  ["ramanathapuram", "paramakudi", "Paramakudi", "multi-town retail replenishment closed with store acknowledgements"],
  ["virudhunagar", "sivakasi", "Sivakasi", "manufacturing dispatches released against approved work and loading records"],
  ["virudhunagar", "rajapalayam", "Rajapalayam", "textile mill staff routes aligned with authorised shift rosters"],
  ["thoothukudi", "kovilpatti", "Kovilpatti", "industrial and food consignments separated by receiving instruction"],
  ["thoothukudi", "tiruchendur", "Tiruchendur", "pilgrimage and tourism pickups coordinated with group contacts"],
  ["tirunelveli", "ambasamudram", "Ambasamudram", "agricultural field-service visits linked to equipment handovers"],
  ["tirunelveli", "nanguneri", "Nanguneri", "industrial supplier access confirmed before dispatch and unloading"],
  ["tenkasi", "sankarankovil", "Sankarankovil", "textile and agricultural deliveries separated by order batch"],
  ["tenkasi", "kadayanallur", "Kadayanallur", "regional wholesale deliveries closed through receiver confirmation"],
  ["kanniyakumari", "nagercoil", "Nagercoil", "urban and regional staff routes coordinated from current shift lists"],
  ["kanniyakumari", "marthandam", "Marthandam", "cross-district retail service rounds updated through confirmed appointments"],
];

export const tamilNaduCities: TamilNaduCitySeo[] = tamilNaduCitySeeds.map(([districtSlug, slug, name, focus]) => {
  const district = tamilNaduDistricts.find((entry) => entry.slug === districtSlug);
  if (!district || !district.cities.includes(name) || slug === districtSlug) {
    throw new Error(`Invalid Tamil Nadu city mapping: ${districtSlug}/${slug}`);
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

export function getTamilNaduCity(districtSlug: string, citySlug: string) {
  return tamilNaduCities.find((city) => city.districtSlug === districtSlug && city.slug === citySlug);
}

export function getTamilNaduCitiesForDistrict(districtSlug: string) {
  return tamilNaduCities.filter((city) => city.districtSlug === districtSlug);
}

export function getTamilNaduCityPath(city: Pick<TamilNaduCitySeo, "districtSlug" | "slug">) {
  return `/gps-tracker/tamil-nadu/${city.districtSlug}/${city.slug}`;
}

export function generateTamilNaduCityMetadata(city: TamilNaduCitySeo): Metadata {
  const url = `https://naviigps.com${getTamilNaduCityPath(city)}`;
  const title = `GPS Tracker in ${city.name}, ${city.districtName}`;
  const description = `GPS tracking in ${city.name}, ${city.districtName}: ${city.focus}. Compare devices, fleet software and installation needs.`;
  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...generateLocalKeywords(`${city.name} ${city.districtName}`, city.sectors),
      `GPS tracker ${city.name} Tamil Nadu`,
      `vehicle tracking system ${city.name}`,
      `vehicle GPS installation ${city.name} ${city.districtName}`,
      `fleet management software ${city.name}`,
    ]),
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
