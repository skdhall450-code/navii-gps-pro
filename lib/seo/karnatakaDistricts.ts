import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";

export type KarnatakaDistrictSeo = {
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

// The Integrated Government Online Directory currently lists 31 Karnataka districts.
// Location labels support district-level discovery; they do not imply a local office.
const regionSeeds: RegionSeed[] = [
  { region: "Bengaluru and South Interior", sectors: ["technology and employee transport", "urban delivery", "regional distribution"], districts: [
    ["bengaluru-urban", "Bengaluru Urban", ["Bengaluru", "Yelahanka", "Anekal", "Kengeri"], "technology-campus transport, dense last-mile delivery, airport-linked movement and multi-zone commercial fleet operations", "https://bengaluruurban.nic.in/"],
    ["bengaluru-rural", "Bengaluru Rural", ["Devanahalli", "Doddaballapura", "Hoskote", "Nelamangala"], "airport and industrial-corridor traffic, warehouse dispatch, peri-urban distribution and highway-connected employee transport", "https://bangalorerural.nic.in/"],
    ["bengaluru-south", "Bengaluru South", ["Ramanagara", "Channapatna", "Kanakapura", "Magadi"], "Bengaluru–Mysuru corridor traffic, manufacturing supply trips, rural distribution and tourism-linked passenger movement", "https://ramanagara.nic.in/"],
    ["kolar", "Kolar", ["Kolar", "Malur", "Bangarapet", "Mulbagal"], "industrial supply routes, horticulture collection, Chennai–Bengaluru highway freight and regional commercial distribution", "https://kolar.nic.in/"],
    ["chikkaballapura", "Chikkaballapura", ["Chikkaballapura", "Gauribidanur", "Bagepalli", "Chintamani"], "airport-region access, horticulture logistics, interstate highway movement and rural passenger service operations", "https://chikkaballapur.nic.in/"],
    ["tumakuru", "Tumakuru", ["Tumakuru", "Tiptur", "Kunigal", "Sira"], "industrial-estate fleets, coconut and farm logistics, national-highway freight and Bengaluru-linked regional distribution", "https://tumkur.nic.in/"],
    ["mysuru", "Mysuru", ["Mysuru", "Nanjangud", "Hunsur", "T. Narasipura"], "tourism and passenger fleets, industrial transport, city distribution and routes connecting southern Karnataka markets", "https://mysore.nic.in/"],
    ["mandya", "Mandya", ["Mandya", "Maddur", "Srirangapatna", "Nagamangala"], "sugarcane and agricultural movement, Bengaluru–Mysuru highway traffic, tourism vehicles and wholesale distribution", "https://mandya.nic.in/"],
    ["chamarajanagar", "Chamarajanagar", ["Chamarajanagar", "Kollegal", "Gundlupet", "Yelandur"], "interstate border routes, agricultural freight, forest-edge tourism transport and dispersed rural service fleets", "https://chamrajnagar.nic.in/"],
    ["hassan", "Hassan", ["Hassan", "Sakleshpur", "Arsikere", "Channarayapatna"], "coffee and agricultural logistics, highway freight, tourism routes and regional passenger fleet coordination", "https://hassan.nic.in/"],
    ["kodagu", "Kodagu", ["Madikeri", "Kushalnagar", "Virajpet", "Somwarpet"], "coffee-estate transport, hill-route tourism vehicles, farm collections and weather-sensitive regional journeys", "https://kodagu.nic.in/"],
  ] },
  { region: "Coastal and Malnad Karnataka", sectors: ["port and coastal logistics", "tourism transport", "agricultural distribution"], districts: [
    ["dakshina-kannada", "Dakshina Kannada", ["Mangaluru", "Puttur", "Bantwal", "Moodabidri"], "port-linked freight, fisheries and coastal distribution, education transport and Kerala-connected commercial routes", "https://dk.nic.in/"],
    ["udupi", "Udupi", ["Udupi", "Kundapura", "Karkala", "Brahmavar"], "coastal tourism fleets, fisheries logistics, institutional transport and highway distribution across the coast", "https://udupi.nic.in/"],
    ["uttara-kannada", "Uttara Kannada", ["Karwar", "Sirsi", "Kumta", "Dandeli"], "port and forest-product movement, long coastal routes, tourism vehicles and remote-area commercial distribution", "https://uttarakannada.nic.in/"],
    ["chikkamagaluru", "Chikkamagaluru", ["Chikkamagaluru", "Kadur", "Koppa", "Mudigere"], "coffee and plantation collections, hill-route tourism, agricultural freight and dispersed service vehicle operations", "https://chikkamagaluru.nic.in/"],
    ["shivamogga", "Shivamogga", ["Shivamogga", "Bhadravati", "Sagara", "Shikaripura"], "industrial and agricultural transport, Malnad route coverage, market distribution and tourism-linked journeys", "https://shimoga.nic.in/"],
  ] },
  { region: "Central Karnataka", sectors: ["industrial logistics", "agricultural transport", "highway distribution"], districts: [
    ["chitradurga", "Chitradurga", ["Chitradurga", "Hiriyur", "Challakere", "Hosadurga"], "national-highway freight, wind-energy support vehicles, agricultural collection and long-distance commercial routes", "https://chitradurga.nic.in/"],
    ["davanagere", "Davanagere", ["Davanagere", "Harihar", "Honnali", "Channagiri"], "textile and food-processing logistics, central highway traffic, agricultural distribution and employee transport", "https://davanagere.nic.in/"],
  ] },
  { region: "Northwest Karnataka", sectors: ["manufacturing logistics", "agri-logistics", "interstate freight"], districts: [
    ["belagavi", "Belagavi", ["Belagavi", "Gokak", "Chikkodi", "Athani"], "industrial and foundry fleets, Maharashtra and Goa corridor freight, agricultural movement and regional distribution", "https://belagavi.nic.in/"],
    ["bagalkote", "Bagalkote", ["Bagalkote", "Jamkhandi", "Mudhol", "Badami"], "cement and sugar-industry transport, farm logistics, tourism routes and inter-district goods movement", "https://bagalkot.nic.in/"],
    ["vijayapura", "Vijayapura", ["Vijayapura", "Indi", "Sindagi", "Muddebihal"], "agricultural supply chains, long-distance freight, tourism vehicles and northern Karnataka market distribution", "https://vijayapura.nic.in/"],
    ["dharwad", "Dharwad", ["Dharwad", "Hubballi", "Kalghatgi", "Kundgol"], "urban freight and warehousing, industrial transport, interstate highway operations and education-sector fleets", "https://dharwad.nic.in/"],
    ["gadag", "Gadag", ["Gadag", "Gajendragad", "Lakshmeshwar", "Nargund"], "agricultural collections, textile and small-industry distribution, regional freight and rural service routes", "https://gadag.nic.in/"],
    ["haveri", "Haveri", ["Haveri", "Ranebennur", "Byadgi", "Hangal"], "chilli and agricultural logistics, highway freight, market deliveries and commercial passenger operations", "https://haveri.nic.in/"],
  ] },
  { region: "Northeast Karnataka", sectors: ["mining and industrial transport", "agricultural logistics", "regional freight"], districts: [
    ["ballari", "Ballari", ["Ballari", "Siruguppa", "Sandur", "Kudligi"], "mining and steel-sector traffic, industrial workforce transport, agricultural freight and long-haul fleet movement", "https://ballari.nic.in/"],
    ["vijayanagara", "Vijayanagara", ["Hosapete", "Hagaribommanahalli", "Harapanahalli", "Kotturu"], "mining-support operations, heritage tourism fleets, industrial supply routes and regional commercial transport", "https://vijayanagara.nic.in/"],
    ["koppal", "Koppal", ["Koppal", "Gangavati", "Kushtagi", "Yelburga"], "rice and agricultural logistics, industrial support traffic, heritage tourism and district-wide market distribution", "https://koppal.nic.in/"],
    ["raichur", "Raichur", ["Raichur", "Sindhanur", "Manvi", "Lingasugur"], "rice-belt agricultural movement, thermal-energy support fleets, interstate freight and rural distribution", "https://raichur.nic.in/"],
    ["kalaburagi", "Kalaburagi", ["Kalaburagi", "Aland", "Chittapur", "Sedam"], "cement and construction logistics, regional wholesale movement, interstate freight and institutional transport", "https://kalaburagi.nic.in/"],
    ["bidar", "Bidar", ["Bidar", "Basavakalyan", "Bhalki", "Humnabad"], "interstate highway operations, agricultural collections, industrial supply routes and heritage tourism vehicles", "https://bidar.nic.in/"],
    ["yadgir", "Yadgir", ["Yadgir", "Shahapur", "Shorapur", "Gurmitkal"], "agricultural freight, construction material movement, rural service fleets and Telangana-linked commercial routes", "https://yadgir.nic.in/"],
  ] },
];

export const karnatakaDistricts: KarnatakaDistrictSeo[] = regionSeeds.flatMap(
  ({ region, sectors, districts }) => districts.map(([slug, name, cities, routeProfile, sourceUrl]) => ({
    slug,
    name,
    region,
    cities,
    sectors,
    sourceUrl,
    localContext: `${name} district in the ${region} operating region includes ${routeProfile}. Compatible GPS devices and fleet software can help authorized teams review reported vehicle location, trip history and supported alerts across these routes.`,
    planningNote: `Before deployment in ${name}, confirm the operating route, vehicle and device compatibility, SIM network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.`,
  })),
);

export function getKarnatakaDistrict(slug: string) {
  return karnatakaDistricts.find((district) => district.slug === slug);
}

export function generateKarnatakaDistrictKeywords(district: KarnatakaDistrictSeo) {
  return uniqueKeywords([
    `GPS tracker in ${district.name}`,
    `GPS tracker ${district.name} Karnataka`,
    `vehicle tracking system ${district.name}`,
    `car GPS tracker ${district.name}`,
    `truck GPS tracking ${district.name}`,
    `fleet management software ${district.name}`,
    `commercial vehicle tracking ${district.name}`,
    `school bus GPS tracking ${district.name}`,
    `GPS tracker dealer ${district.name}`,
    `ವಾಹನ GPS ಟ್ರ್ಯಾಕರ್ ${district.name}`,
    ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`]),
  ]);
}

export function generateKarnatakaDistrictMetadata(district: KarnatakaDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/karnataka/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Karnataka, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`;
  return {
    title: `GPS Tracker in ${district.name} District, Karnataka`,
    description,
    keywords: uniqueKeywords([...generateKarnatakaDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]),
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${district.name} District, Karnataka | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Karnataka | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
