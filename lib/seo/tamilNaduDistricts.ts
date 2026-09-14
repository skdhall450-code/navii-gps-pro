import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";

export type TamilNaduDistrictSeo = {
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

// The Government of Tamil Nadu district portal currently lists 38 districts.
// Location labels support district-level discovery; they do not imply a local office.
const regionSeeds: RegionSeed[] = [
  { region: "Chennai and North Coast", sectors: ["urban delivery", "industrial logistics", "employee transport"], districts: [
    ["chennai", "Chennai", ["Chennai", "Ambattur", "Guindy", "Sholinganallur"], "dense urban deliveries, port-linked freight, IT-corridor staff transport and multi-zone commercial routes", "https://chennai.nic.in/"],
    ["chengalpattu", "Chengalpattu", ["Chengalpattu", "Tambaram", "Madurantakam", "Mahabalipuram"], "suburban employee movement, industrial corridors, tourism vehicles and routes connecting the southern Chennai region", "https://chengalpattu.nic.in/"],
    ["kancheepuram", "Kancheepuram", ["Kancheepuram", "Sriperumbudur", "Uthiramerur", "Walajabad"], "manufacturing and supplier fleets, temple-city traffic, warehouse dispatch and Chennai-linked industrial movement", "https://kancheepuram.nic.in/"],
    ["tiruvallur", "Tiruvallur", ["Tiruvallur", "Avadi", "Ponneri", "Gummidipoondi"], "industrial-estate transport, northern port corridors, suburban distribution and cross-district employee movement", "https://tiruvallur.nic.in/"],
    ["ranipet", "Ranipet", ["Ranipet", "Arcot", "Walajah", "Arakkonam"], "leather and manufacturing logistics, supplier collections, highway freight and regional workforce transport", "https://ranipet.nic.in/"],
    ["vellore", "Vellore", ["Vellore", "Gudiyatham", "Katpadi", "Pernambut"], "medical and institutional transport, leather-sector distribution, highway fleets and regional service journeys", "https://vellore.nic.in/"],
    ["tirupathur", "Tirupathur", ["Tirupathur", "Vaniyambadi", "Ambur", "Natrampalli"], "leather-industry freight, interstate highway movement, supplier routes and commercial passenger operations", "https://tirupathur.nic.in/"],
    ["tiruvannamalai", "Tiruvannamalai", ["Tiruvannamalai", "Arani", "Cheyyar", "Polur"], "pilgrimage and passenger traffic, manufacturing supply routes, agricultural collection and regional distribution", "https://tiruvannamalai.nic.in/"],
    ["viluppuram", "Viluppuram", ["Viluppuram", "Tindivanam", "Gingee", "Vanur"], "national-highway freight, regional bus operations, farm-to-market movement and coastal access routes", "https://viluppuram.nic.in/"],
    ["kallakurichi", "Kallakurichi", ["Kallakurichi", "Ulundurpet", "Sankarapuram", "Tirukoilur"], "agricultural collection, highway logistics, rural service fleets and inter-district commercial distribution", "https://kallakurichi.nic.in/"],
    ["cuddalore", "Cuddalore", ["Cuddalore", "Chidambaram", "Neyveli", "Panruti"], "industrial and energy-sector transport, coastal distribution, agricultural freight and institutional vehicle routes", "https://cuddalore.nic.in/"],
  ] },
  { region: "Western Tamil Nadu", sectors: ["manufacturing logistics", "commercial distribution", "interstate transport"], districts: [
    ["coimbatore", "Coimbatore", ["Coimbatore", "Pollachi", "Mettupalayam", "Sulur"], "engineering and textile fleets, urban delivery, Kerala-linked freight and industrial workforce movement", "https://coimbatore.nic.in/"],
    ["tiruppur", "Tiruppur", ["Tiruppur", "Dharapuram", "Udumalaipettai", "Avinashi"], "garment supply chains, export-linked dispatch, industrial employee transport and intercity goods routes", "https://tiruppur.nic.in/"],
    ["erode", "Erode", ["Erode", "Gobichettipalayam", "Perundurai", "Bhavani"], "textile distribution, agricultural market fleets, industrial-estate traffic and interstate freight connections", "https://erode.nic.in/"],
    ["salem", "Salem", ["Salem", "Mettur", "Attur", "Sankari"], "steel and industrial transport, highway warehousing, agricultural distribution and regional passenger fleets", "https://salem.nic.in/"],
    ["namakkal", "Namakkal", ["Namakkal", "Tiruchengode", "Rasipuram", "Paramathi Velur"], "long-haul truck operations, poultry logistics, industrial supply routes and commercial vehicle coordination", "https://namakkal.nic.in/"],
    ["dharmapuri", "Dharmapuri", ["Dharmapuri", "Harur", "Palacode", "Pennagaram"], "agricultural transport, Bengaluru-linked highway fleets, rural distribution and passenger service routes", "https://dharmapuri.nic.in/"],
    ["krishnagiri", "Krishnagiri", ["Krishnagiri", "Hosur", "Denkanikottai", "Pochampalli"], "automotive and electronics logistics, Bengaluru-border traffic, industrial fleets and farm distribution", "https://krishnagiri.nic.in/"],
    ["nilgiris", "Nilgiris", ["Udhagamandalam", "Coonoor", "Gudalur", "Kotagiri"], "hill-route tourism vehicles, tea logistics, institutional transport and weather-sensitive regional journeys", "https://nilgiris.nic.in/"],
  ] },
  { region: "Central Tamil Nadu", sectors: ["regional logistics", "agri-logistics", "institutional transport"], districts: [
    ["tiruchirappalli", "Tiruchirappalli", ["Tiruchirappalli", "Srirangam", "Manapparai", "Lalgudi"], "central highway distribution, industrial and educational fleets, passenger movement and regional warehousing", "https://tiruchirappalli.nic.in/"],
    ["karur", "Karur", ["Karur", "Kulithalai", "Aravakurichi", "Krishnarayapuram"], "textile and bus-body supply chains, highway freight, agricultural collection and commercial distribution", "https://karur.nic.in/"],
    ["perambalur", "Perambalur", ["Perambalur", "Kunnam", "Veppanthattai", "Alathur"], "cement and construction fleets, rural distribution, farm transport and central corridor movements", "https://perambalur.nic.in/"],
    ["ariyalur", "Ariyalur", ["Ariyalur", "Jayankondam", "Udayarpalayam", "Sendurai"], "cement-industry traffic, mining support vehicles, agricultural movement and regional goods distribution", "https://ariyalur.nic.in/"],
    ["dindigul", "Dindigul", ["Dindigul", "Palani", "Oddanchatram", "Kodaikanal"], "agricultural market fleets, tourism transport, industrial distribution and hill-route service journeys", "https://dindigul.nic.in/"],
    ["pudukkottai", "Pudukkottai", ["Pudukkottai", "Aranthangi", "Alangudi", "Illuppur"], "rural supply routes, farm and fisheries transport, institutional vehicles and regional commercial fleets", "https://pudukkottai.nic.in/"],
  ] },
  { region: "Cauvery Delta and East Coast", sectors: ["agricultural distribution", "coastal logistics", "commercial transport"], districts: [
    ["thanjavur", "Thanjavur", ["Thanjavur", "Kumbakonam", "Pattukkottai", "Papanasam"], "farm-to-market logistics, tourism and temple traffic, wholesale distribution and inter-district routes", "https://thanjavur.nic.in/"],
    ["tiruvarur", "Tiruvarur", ["Tiruvarur", "Mannargudi", "Nannilam", "Thiruthuraipoondi"], "paddy and agricultural transport, rural service vehicles, market distribution and delta-region routes", "https://tiruvarur.nic.in/"],
    ["nagapattinam", "Nagapattinam", ["Nagapattinam", "Vedaranyam", "Kilvelur", "Thirukkuvalai"], "coastal and fisheries logistics, agricultural distribution, pilgrimage transport and rural fleet movement", "https://nagapattinam.nic.in/"],
    ["mayiladuthurai", "Mayiladuthurai", ["Mayiladuthurai", "Sirkazhi", "Kuthalam", "Tharangambadi"], "delta agriculture, coastal tourism, regional passenger fleets and market delivery operations", "https://mayiladuthurai.nic.in/"],
  ] },
  { region: "Southern Tamil Nadu", sectors: ["industrial transport", "tourism fleets", "regional distribution"], districts: [
    ["madurai", "Madurai", ["Madurai", "Melur", "Usilampatti", "Thirumangalam"], "urban deliveries, tourism and passenger fleets, wholesale markets and southern highway logistics", "https://madurai.nic.in/"],
    ["theni", "Theni", ["Theni", "Periyakulam", "Bodinayakanur", "Cumbum"], "agricultural produce movement, Kerala-border routes, hill-area transport and regional distribution", "https://theni.nic.in/"],
    ["sivaganga", "Sivaganga", ["Sivaganga", "Karaikudi", "Devakottai", "Manamadurai"], "commercial distribution, heritage tourism, rural service fleets and inter-district passenger routes", "https://sivaganga.nic.in/"],
    ["ramanathapuram", "Ramanathapuram", ["Ramanathapuram", "Rameswaram", "Paramakudi", "Kamuthi"], "pilgrimage and tourism vehicles, coastal logistics, fisheries transport and long regional routes", "https://ramanathapuram.nic.in/"],
    ["virudhunagar", "Virudhunagar", ["Virudhunagar", "Sivakasi", "Rajapalayam", "Aruppukkottai"], "manufacturing and printing logistics, textile distribution, commercial freight and worker transport", "https://virudhunagar.nic.in/"],
    ["thoothukudi", "Thoothukudi", ["Thoothukudi", "Kovilpatti", "Tiruchendur", "Srivaikuntam"], "port-linked freight, industrial and salt logistics, coastal distribution and regional passenger fleets", "https://thoothukudi.nic.in/"],
    ["tirunelveli", "Tirunelveli", ["Tirunelveli", "Ambasamudram", "Nanguneri", "Radhapuram"], "industrial and wind-energy support, agricultural logistics, city deliveries and southern corridor traffic", "https://tirunelveli.nic.in/"],
    ["tenkasi", "Tenkasi", ["Tenkasi", "Sankarankovil", "Kadayanallur", "Shenkottai"], "Kerala-border freight, tourism vehicles, agricultural transport and hill-adjacent commercial routes", "https://tenkasi.nic.in/"],
    ["kanniyakumari", "Kanniyakumari", ["Nagercoil", "Kanniyakumari", "Marthandam", "Colachel"], "tourism and passenger fleets, Kerala-linked commerce, coastal distribution and intercity service routes", "https://kanniyakumari.nic.in/"],
  ] },
];

export const tamilNaduDistricts: TamilNaduDistrictSeo[] = regionSeeds.flatMap(
  ({ region, sectors, districts }) => districts.map(([slug, name, cities, routeProfile, sourceUrl]) => ({
    slug,
    name,
    region,
    cities,
    sectors,
    sourceUrl,
    localContext: `${name} district in the ${region} operating region includes ${routeProfile}. Compatible GPS devices and fleet software can help authorized teams review reported vehicle location, trip history and supported alerts across these routes.`,
    planningNote: `Before deployment in ${name}, confirm the actual operating route, vehicle and device compatibility, SIM network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.`,
  })),
);

export function getTamilNaduDistrict(slug: string) {
  return tamilNaduDistricts.find((district) => district.slug === slug);
}

export function generateTamilNaduDistrictKeywords(district: TamilNaduDistrictSeo) {
  return uniqueKeywords([
    `GPS tracker in ${district.name}`,
    `GPS tracker ${district.name} Tamil Nadu`,
    `vehicle tracking system ${district.name}`,
    `car GPS tracker ${district.name}`,
    `truck GPS tracking ${district.name}`,
    `fleet management software ${district.name}`,
    `commercial vehicle tracking ${district.name}`,
    `school bus GPS tracking ${district.name}`,
    ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`]),
  ]);
}

export function generateTamilNaduDistrictMetadata(district: TamilNaduDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/tamil-nadu/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Tamil Nadu, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`;
  return {
    title: `GPS Tracker in ${district.name} District, Tamil Nadu`,
    description,
    keywords: uniqueKeywords([...generateTamilNaduDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]),
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${district.name} District, Tamil Nadu | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Tamil Nadu | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
