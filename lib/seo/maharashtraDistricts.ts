import type { Metadata } from "next";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type MaharashtraDistrictSeo = { slug: string; name: string; region: string; cities: string[]; sectors: string[]; localContext: string; planningNote: string; sourceUrl: string };
type Seed = [string, string, string[], string];

const divisionSeeds: { region: string; sectors: string[]; districts: Seed[] }[] = [
  { region: "Konkan Division", sectors: ["port, warehouse and urban logistics", "tourism and passenger transport", "industrial and commercial fleets"], districts: [
    ["mumbai-city", "Mumbai City", ["Fort", "Colaba", "Byculla", "Dadar"], "dense urban deliveries, port-linked commerce, service calls and round-the-clock passenger operations"],
    ["mumbai-suburban", "Mumbai Suburban", ["Bandra", "Andheri", "Borivali", "Kurla"], "airport-linked traffic, employee transport, e-commerce delivery and high-frequency urban service routes"],
    ["thane", "Thane", ["Thane", "Kalyan", "Bhiwandi", "Ulhasnagar"], "warehouse and industrial movements, dense commuter fleets, highway freight and regional distribution"],
    ["palghar", "Palghar", ["Palghar", "Vasai", "Virar", "Boisar"], "industrial-estate traffic, coastal routes, Gujarat corridor freight and regional passenger services"],
    ["raigad", "Raigad", ["Alibag", "Panvel", "Uran", "Pen"], "port and container logistics, industrial supply, tourism routes and Mumbai-Pune corridor movement"],
    ["ratnagiri", "Ratnagiri", ["Ratnagiri", "Chiplun", "Dapoli", "Khed"], "coastal food and fisheries logistics, tourism fleets, highway freight and rural distribution"],
    ["sindhudurg", "Sindhudurg", ["Oros", "Kudal", "Sawantwadi", "Malvan"], "coastal tourism, food distribution, Goa corridor traffic and dispersed rural service routes"],
  ]},
  { region: "Pune Division", sectors: ["manufacturing and industrial logistics", "agricultural distribution", "intercity passenger and commercial fleets"], districts: [
    ["pune", "Pune", ["Pune", "Pimpri-Chinchwad", "Baramati", "Talegaon"], "automotive and technology fleets, warehouse distribution, employee transport and intercity freight"],
    ["satara", "Satara", ["Satara", "Karad", "Wai", "Phaltan"], "highway freight, agricultural collections, industrial supply and tourism passenger routes"],
    ["sangli", "Sangli", ["Sangli", "Miraj", "Vita", "Tasgaon"], "agricultural and food-processing logistics, Karnataka corridor traffic and regional distribution"],
    ["solapur", "Solapur", ["Solapur", "Pandharpur", "Barshi", "Akkalkot"], "textile and agricultural freight, pilgrimage transport, Karnataka corridor routes and commercial distribution"],
    ["kolhapur", "Kolhapur", ["Kolhapur", "Ichalkaranji", "Jaysingpur", "Gadhinglaj"], "manufacturing and textile logistics, food distribution, interstate freight and tourism traffic"],
  ]},
  { region: "Nashik Division", sectors: ["agricultural and cold-chain logistics", "industrial freight", "interstate commercial transport"], districts: [
    ["nashik", "Nashik", ["Nashik", "Malegaon", "Sinnar", "Manmad"], "industrial and agricultural supply chains, cold-chain movement, highway freight and pilgrimage transport"],
    ["dhule", "Dhule", ["Dhule", "Shirpur", "Dondaicha", "Sakri"], "Mumbai-Agra corridor freight, agricultural collections, industrial supply and regional passenger routes"],
    ["nandurbar", "Nandurbar", ["Nandurbar", "Shahada", "Taloda", "Navapur"], "tribal-area services, farm logistics, Gujarat-border freight and long regional routes"],
    ["jalgaon", "Jalgaon", ["Jalgaon", "Bhusawal", "Chalisgaon", "Amalner"], "banana and agricultural logistics, rail-linked commerce, highway freight and wholesale distribution"],
    ["ahilyanagar", "Ahilyanagar", ["Ahilyanagar", "Shirdi", "Sangamner", "Shrirampur"], "agricultural and industrial distribution, pilgrimage fleets, highway freight and regional passenger traffic"],
  ]},
  { region: "Chhatrapati Sambhajinagar Division", sectors: ["manufacturing and highway logistics", "agricultural distribution", "regional passenger transport"], districts: [
    ["chhatrapati-sambhajinagar", "Chhatrapati Sambhajinagar", ["Chhatrapati Sambhajinagar", "Paithan", "Kannad", "Sillod"], "industrial-corridor movement, tourism and passenger traffic, agricultural supply and highway freight"],
    ["jalna", "Jalna", ["Jalna", "Ambad", "Bhokardan", "Partur"], "steel and seed-industry logistics, agricultural collections, highway freight and regional distribution"],
    ["beed", "Beed", ["Beed", "Ambajogai", "Parli", "Georai"], "agricultural and sugar-sector traffic, energy-support trips, rural distribution and passenger routes"],
    ["dharashiv", "Dharashiv", ["Dharashiv", "Tuljapur", "Umarga", "Kalamb"], "pilgrimage passenger traffic, agricultural logistics, Karnataka corridor freight and regional services"],
    ["latur", "Latur", ["Latur", "Udgir", "Ausa", "Nilanga"], "food-processing and agricultural logistics, interstate commerce, wholesale distribution and passenger fleets"],
    ["nanded", "Nanded", ["Nanded", "Deglur", "Mukhed", "Kinwat"], "pilgrimage transport, Telangana corridor freight, agricultural movement and regional distribution"],
    ["parbhani", "Parbhani", ["Parbhani", "Jintur", "Gangakhed", "Selu"], "agricultural and cotton logistics, market distribution, rail-linked commerce and passenger routes"],
    ["hingoli", "Hingoli", ["Hingoli", "Basmath", "Kalamnuri", "Aundha Nagnath"], "farm collections, pilgrimage traffic, rural supply routes and interdistrict commercial movement"],
  ]},
  { region: "Amravati Division", sectors: ["cotton and agricultural logistics", "industrial and wholesale distribution", "interdistrict passenger fleets"], districts: [
    ["amravati", "Amravati", ["Amravati", "Achalpur", "Daryapur", "Morshi"], "cotton and farm logistics, urban distribution, industrial support and regional passenger operations"],
    ["akola", "Akola", ["Akola", "Akot", "Balapur", "Murtizapur"], "cotton-market traffic, agricultural collections, warehouse distribution and highway freight"],
    ["buldhana", "Buldhana", ["Buldhana", "Khamgaon", "Malkapur", "Shegaon"], "agricultural and industrial distribution, pilgrimage trips, highway freight and rural services"],
    ["washim", "Washim", ["Washim", "Karanja", "Mangrulpir", "Risod"], "farm and market logistics, regional distribution, pilgrimage traffic and rural passenger routes"],
    ["yavatmal", "Yavatmal", ["Yavatmal", "Wani", "Pusad", "Digras"], "cotton and mining-support logistics, farm collections, highway movement and regional distribution"],
  ]},
  { region: "Nagpur Division", sectors: ["mineral and industrial logistics", "agricultural and forest-produce transport", "interstate freight and passenger fleets"], districts: [
    ["nagpur", "Nagpur", ["Nagpur", "Kamptee", "Hingna", "Umred"], "central-India freight, industrial and warehouse traffic, urban delivery and employee transport"],
    ["wardha", "Wardha", ["Wardha", "Hinganghat", "Arvi", "Pulgaon"], "cotton and industrial logistics, highway freight, agricultural collections and regional distribution"],
    ["bhandara", "Bhandara", ["Bhandara", "Tumsar", "Sakoli", "Pauni"], "rice and agricultural logistics, industrial supply, forest-edge routes and regional passenger traffic"],
    ["gondia", "Gondia", ["Gondia", "Tirora", "Amgaon", "Deori"], "rice and forest-produce movement, rail-linked commerce, interstate routes and rural distribution"],
    ["chandrapur", "Chandrapur", ["Chandrapur", "Ballarpur", "Warora", "Brahmapuri"], "coal and power-sector transport, industrial supply, forest routes and highway freight"],
    ["gadchiroli", "Gadchiroli", ["Gadchiroli", "Armori", "Aheri", "Desaiganj"], "remote project and public-service routes, forest-produce logistics, mining support and long rural journeys"],
  ]},
];

const officialSource = "https://plan.maharashtra.gov.in/en/36-districts/";
export const maharashtraDistricts: MaharashtraDistrictSeo[] = divisionSeeds.flatMap(({ region, sectors, districts }) => districts.map(([slug, name, cities, profile]) => ({ slug, name, region, cities, sectors, sourceUrl: officialSource, localContext: `${name} district in ${region} includes ${profile}. Compatible GPS devices and fleet software can support authorised teams reviewing reported location, trip history and supported alerts across these routes.`, planningNote: `Before deployment in ${name}, confirm vehicle and route requirements, device compatibility, network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.` })));
export function getMaharashtraDistrict(slug: string) { return maharashtraDistricts.find((district) => district.slug === slug); }
export function generateMaharashtraDistrictKeywords(district: MaharashtraDistrictSeo) { return uniqueKeywords([`GPS tracker in ${district.name}`, `GPS tracker ${district.name} Maharashtra`, `vehicle tracking system ${district.name}`, `car GPS tracker ${district.name}`, `truck GPS tracking ${district.name}`, `fleet management software ${district.name}`, `commercial vehicle tracking ${district.name}`, `school bus GPS tracking ${district.name}`, `वाहन GPS ट्रॅकर ${district.name}`, `जीपीएस ट्रॅकर ${district.name}`, ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`])]); }
export function generateMaharashtraDistrictMetadata(district: MaharashtraDistrictSeo): Metadata { const url = `https://naviigps.com/gps-tracker/maharashtra/${district.slug}`; const description = `GPS trackers and fleet management software in ${district.name} district, Maharashtra, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`; return { title: `GPS Tracker in ${district.name} District, Maharashtra`, description, keywords: uniqueKeywords([...generateMaharashtraDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]), alternates: { canonical: url }, openGraph: { title: `GPS Tracker in ${district.name} District, Maharashtra | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] }, twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Maharashtra | NAVII GPS`, description, images: ["/og-image.jpg"] } }; }
