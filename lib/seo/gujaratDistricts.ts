import type { Metadata } from "next";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type GujaratDistrictSeo = { slug: string; name: string; region: string; cities: string[]; sectors: string[]; localContext: string; planningNote: string; sourceUrl: string };
type Seed = [string, string, string[], string];

// Region names below are editorial navigation groups, not an extra administrative tier.
const regionSeeds: { region: string; sectors: string[]; districts: Seed[] }[] = [
  { region: "Central Gujarat", sectors: ["manufacturing and industrial logistics", "agricultural distribution", "urban and regional passenger fleets"], districts: [
    ["ahmedabad", "Ahmedabad", ["Ahmedabad", "Sanand", "Dholka", "Viramgam"], "urban delivery, automotive supply, warehouse movement and high-frequency commercial routes"],
    ["gandhinagar", "Gandhinagar", ["Gandhinagar", "Kalol", "Dehgam", "Mansa"], "government-service, industrial, employee transport and regional distribution routes"],
    ["kheda", "Kheda", ["Nadiad", "Kapadvanj", "Mahemdavad", "Thasra"], "dairy, agricultural, industrial and Ahmedabad-Vadodara corridor traffic"],
    ["anand", "Anand", ["Anand", "Khambhat", "Borsad", "Petlad"], "dairy supply chains, food distribution, agricultural collection and passenger operations"],
    ["vadodara", "Vadodara", ["Vadodara", "Savli", "Dabhoi", "Padra"], "petrochemical, engineering, warehouse and employee transport fleets"],
    ["panchmahal", "Panchmahal", ["Godhra", "Halol", "Kalol", "Shahera"], "industrial-estate freight, agricultural movement and regional passenger routes"],
    ["dahod", "Dahod", ["Dahod", "Jhalod", "Limkheda", "Devgadh Baria"], "tribal-area services, interstate freight, farm logistics and long rural journeys"],
    ["mahisagar", "Mahisagar", ["Lunawada", "Balasinor", "Santrampur", "Kadana"], "agricultural collection, rural distribution, quarry support and passenger routes"],
    ["chhota-udaipur", "Chhota Udaipur", ["Chhota Udaipur", "Bodeli", "Naswadi", "Kawant"], "tribal-area services, mineral transport, farm supply and dispersed rural operations"],
  ]},
  { region: "North Gujarat", sectors: ["agricultural and dairy logistics", "industrial freight", "interstate commercial transport"], districts: [
    ["mehsana", "Mehsana", ["Mehsana", "Kadi", "Unjha", "Visnagar"], "dairy, spice-market, engineering and North Gujarat highway movement"],
    ["patan", "Patan", ["Patan", "Sidhpur", "Radhanpur", "Chanasma"], "agricultural freight, heritage tourism, market distribution and Rajasthan corridor traffic"],
    ["sabarkantha", "Sabarkantha", ["Himmatnagar", "Idar", "Khedbrahma", "Prantij"], "ceramic and agricultural logistics, tribal-area services and interstate routes"],
    ["aravalli", "Aravalli", ["Modasa", "Bayad", "Bhiloda", "Meghraj"], "farm collection, quarry transport, Rajasthan-linked commerce and rural distribution"],
    ["banaskantha", "Banaskantha", ["Palanpur", "Deesa", "Danta", "Vadgam"], "dairy, agricultural and Rajasthan corridor freight after the Vav-Tharad reorganisation"],
    ["vav-tharad", "Vav-Tharad", ["Tharad", "Vav", "Dhanera", "Diyodar"], "border-area agriculture, dairy collection, Rajasthan freight and long rural service routes"],
  ]},
  { region: "Kutch", sectors: ["port and container logistics", "mineral and industrial freight", "tourism and interstate transport"], districts: [
    ["kutch", "Kutch", ["Bhuj", "Gandhidham", "Anjar", "Mandvi"], "port-linked cargo, salt and mineral logistics, tourism traffic and long-distance freight"],
  ]},
  { region: "Saurashtra", sectors: ["port and industrial logistics", "agricultural and fisheries distribution", "tourism and passenger transport"], districts: [
    ["rajkot", "Rajkot", ["Rajkot", "Gondal", "Jetpur", "Dhoraji"], "engineering, foundry, agricultural and regional distribution fleets"],
    ["jamnagar", "Jamnagar", ["Jamnagar", "Dhrol", "Kalavad", "Jamjodhpur"], "refinery, brass, port-linked and agricultural freight operations"],
    ["devbhoomi-dwarka", "Devbhoomi Dwarka", ["Khambhalia", "Dwarka", "Bhanvad", "Kalyanpur"], "pilgrimage, tourism, port support and coastal agricultural routes"],
    ["porbandar", "Porbandar", ["Porbandar", "Ranavav", "Kutiyana", "Madhavpur"], "port, fisheries, cement, tourism and coastal distribution traffic"],
    ["junagadh", "Junagadh", ["Junagadh", "Keshod", "Mangrol", "Vanthali"], "agricultural, fisheries, tourism and regional commercial journeys"],
    ["gir-somnath", "Gir Somnath", ["Veraval", "Somnath", "Una", "Kodinar"], "fisheries, pilgrimage, tourism, industrial and coastal freight routes"],
    ["amreli", "Amreli", ["Amreli", "Savarkundla", "Rajula", "Lathi"], "agricultural, port-support, industrial and rural passenger operations"],
    ["bhavnagar", "Bhavnagar", ["Bhavnagar", "Palitana", "Mahuva", "Sihor"], "ship-recycling support, port freight, agriculture and pilgrimage transport"],
    ["botad", "Botad", ["Botad", "Gadhada", "Barwala", "Ranpur"], "cotton and agricultural logistics, pilgrimage trips and regional distribution"],
    ["morbi", "Morbi", ["Morbi", "Wankaner", "Halvad", "Maliya"], "ceramic, manufacturing, salt and port-linked freight movement"],
    ["surendranagar", "Surendranagar", ["Surendranagar", "Wadhwan", "Limbdi", "Dhrangadhra"], "ceramic, salt, cotton and Ahmedabad-Rajkot corridor traffic"],
  ]},
  { region: "South Gujarat", sectors: ["port, industrial and warehouse logistics", "textile and agricultural distribution", "interstate passenger and commercial fleets"], districts: [
    ["surat", "Surat", ["Surat", "Bardoli", "Mandvi", "Olpad"], "textile, diamond, port, e-commerce and dense urban distribution fleets"],
    ["bharuch", "Bharuch", ["Bharuch", "Ankleshwar", "Jambusar", "Jhagadia"], "chemical, industrial, port-linked and highway freight operations"],
    ["narmada", "Narmada", ["Rajpipla", "Dediapada", "Sagbara", "Garudeshwar"], "tourism, tribal-area services, agriculture and project-support routes"],
    ["navsari", "Navsari", ["Navsari", "Bilimora", "Chikhli", "Vansda"], "horticulture, food distribution, industrial and Mumbai-Surat corridor traffic"],
    ["valsad", "Valsad", ["Valsad", "Vapi", "Pardi", "Umargam"], "industrial-estate, chemical, coastal and Maharashtra-border freight"],
    ["tapi", "Tapi", ["Vyara", "Songadh", "Valod", "Nizar"], "tribal-area services, agriculture, forest-produce and rural passenger routes"],
    ["dang", "Dang", ["Ahwa", "Waghai", "Subir", "Saputara"], "hill tourism, forest-area services, rural supply and passenger operations"],
  ]},
];

const officialSource = "https://climatetracker.gujarat.gov.in/en/district-wise-emissions";
export const gujaratDistricts: GujaratDistrictSeo[] = regionSeeds.flatMap(({ region, sectors, districts }) => districts.map(([slug, name, cities, profile]) => ({ slug, name, region, cities, sectors, sourceUrl: officialSource, localContext: `${name} district in ${region} includes ${profile}. Compatible GPS devices and fleet software can support authorised teams reviewing reported location, trip history and supported alerts across these routes.`, planningNote: `Before deployment in ${name}, confirm vehicle and route requirements, device compatibility, network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.` })));
export function getGujaratDistrict(slug: string) { return gujaratDistricts.find((district) => district.slug === slug); }
export function generateGujaratDistrictKeywords(district: GujaratDistrictSeo) { return uniqueKeywords([`GPS tracker in ${district.name}`, `GPS tracker ${district.name} Gujarat`, `vehicle tracking system ${district.name}`, `car GPS tracker ${district.name}`, `truck GPS tracking ${district.name}`, `fleet management software ${district.name}`, `commercial vehicle tracking ${district.name}`, `school bus GPS tracking ${district.name}`, `વાહન GPS ટ્રેકર ${district.name}`, `જીપીએસ ટ્રેકર ${district.name}`, ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`])]); }
export function generateGujaratDistrictMetadata(district: GujaratDistrictSeo): Metadata { const url = `https://naviigps.com/gps-tracker/gujarat/${district.slug}`; const description = `GPS trackers and fleet management software in ${district.name} district, Gujarat, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`; return { title: `GPS Tracker in ${district.name} District, Gujarat`, description, keywords: uniqueKeywords([...generateGujaratDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]), alternates: { canonical: url }, openGraph: { title: `GPS Tracker in ${district.name} District, Gujarat | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] }, twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Gujarat | NAVII GPS`, description, images: ["/og-image.jpg"] } }; }
