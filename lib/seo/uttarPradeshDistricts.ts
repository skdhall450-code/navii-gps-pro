import type { Metadata } from "next";

export type UttarPradeshDistrictSeo = {
  slug: string;
  name: string;
  division: string;
  cities: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
};

type DistrictSeed = [slug: string, name: string, cities: string[], routeProfile: string];
type DivisionSeed = {
  division: string;
  sectors: string[];
  districts: DistrictSeed[];
};

// Uttar Pradesh currently has 75 districts grouped into 18 administrative divisions.
const divisionSeeds: DivisionSeed[] = [
  { division: "Agra", sectors: ["tourism transport", "manufacturing logistics", "regional distribution"], districts: [
    ["agra", "Agra", ["Agra", "Fatehabad", "Kiraoli", "Etmadpur"], "Taj tourism traffic, urban deliveries and NH 19 freight movements"],
    ["firozabad", "Firozabad", ["Firozabad", "Shikohabad", "Tundla", "Jasrana"], "glass-industry transport, Tundla rail-linked routes and Agra–Kanpur highway traffic"],
    ["mainpuri", "Mainpuri", ["Mainpuri", "Karhal", "Bhongaon", "Kishni"], "agricultural collection, Karhal corridors and regional passenger movements"],
    ["mathura", "Mathura", ["Mathura", "Vrindavan", "Govardhan", "Kosi Kalan"], "pilgrimage transport, refinery-linked fleets and Delhi–Agra highway operations"],
  ] },
  { division: "Aligarh", sectors: ["industrial transport", "agri-logistics", "regional commercial fleets"], districts: [
    ["aligarh", "Aligarh", ["Aligarh", "Khair", "Atrauli", "Iglas"], "lock-industry distribution, university-area traffic and routes toward NCR"],
    ["etah", "Etah", ["Etah", "Jalesar", "Aliganj", "Marehra"], "agricultural markets, Jalesar manufacturing traffic and inter-district distribution"],
    ["hathras", "Hathras", ["Hathras", "Sikandra Rao", "Sadabad", "Sasni"], "food-processing transport, local market deliveries and routes toward Agra and Aligarh"],
    ["kasganj", "Kasganj", ["Kasganj", "Patiyali", "Sahawar", "Ganj Dundwara"], "grain-market fleets, rural collection routes and connections toward Etah and Badaun"],
  ] },
  { division: "Ayodhya", sectors: ["institutional transport", "agri-logistics", "regional distribution"], districts: [
    ["ayodhya", "Ayodhya", ["Ayodhya", "Faizabad", "Rudauli", "Bikapur"], "pilgrimage traffic, hospitality fleets and Lucknow–Gorakhpur corridor movements"],
    ["ambedkar-nagar", "Ambedkar Nagar", ["Akbarpur", "Tanda", "Jalalpur", "Alapur"], "textile and power-linked transport, market distribution and eastern UP routes"],
    ["amethi", "Amethi", ["Gauriganj", "Amethi", "Jagdishpur", "Tiloi"], "industrial-estate fleets, public-service vehicles and Lucknow–Sultanpur connections"],
    ["barabanki", "Barabanki", ["Barabanki", "Nawabganj", "Ramnagar", "Haidergarh"], "NCR-bound freight, agricultural distribution and Lucknow-adjacent commuter routes"],
    ["sultanpur", "Sultanpur", ["Sultanpur", "Lambhua", "Kadipur", "Jaisinghpur"], "regional goods transport, farm-to-market routes and Ayodhya–Prayagraj connections"],
  ] },
  { division: "Azamgarh", sectors: ["regional logistics", "passenger transport", "agricultural distribution"], districts: [
    ["azamgarh", "Azamgarh", ["Azamgarh", "Nizamabad", "Mehnagar", "Lalganj"], "dense market routes, passenger fleets and eastern UP distribution corridors"],
    ["ballia", "Ballia", ["Ballia", "Rasra", "Bansdih", "Sikanderpur"], "interstate Bihar routes, river-belt distribution and regional passenger traffic"],
    ["mau", "Mau", ["Mau", "Ghosi", "Muhammadabad Gohna", "Madhuban"], "textile-industry logistics, wholesale deliveries and Varanasi–Gorakhpur route activity"],
  ] },
  { division: "Bareilly", sectors: ["agri-logistics", "industrial distribution", "commercial transport"], districts: [
    ["bareilly", "Bareilly", ["Bareilly", "Aonla", "Baheri", "Nawabganj"], "regional warehousing, urban delivery fleets and Lucknow–Delhi highway traffic"],
    ["badaun", "Badaun", ["Badaun", "Bisauli", "Dataganj", "Sahaswan"], "agricultural collection, dairy transport and routes toward Bareilly and NCR"],
    ["pilibhit", "Pilibhit", ["Pilibhit", "Puranpur", "Bisalpur", "Kalinagar"], "sugarcane transport, forest-edge routes and Uttarakhand-linked distribution"],
    ["shahjahanpur", "Shahjahanpur", ["Shahjahanpur", "Tilhar", "Powayan", "Jalalabad"], "industrial and farm logistics, highway freight and regional market distribution"],
  ] },
  { division: "Basti", sectors: ["regional distribution", "institutional fleets", "agri-logistics"], districts: [
    ["basti", "Basti", ["Basti", "Harraiya", "Bhanpur", "Rudhauli"], "Lucknow–Gorakhpur highway movements, district services and rural delivery routes"],
    ["sant-kabir-nagar", "Sant Kabir Nagar", ["Khalilabad", "Mehdawal", "Dhanghata", "Maghar"], "textile and market transport, highway logistics and village distribution"],
    ["siddharthnagar", "Siddharthnagar", ["Naugarh", "Bansi", "Domariyaganj", "Shohratgarh"], "Nepal-border trade routes, agricultural fleets and regional passenger movements"],
  ] },
  { division: "Chitrakoot", sectors: ["mining logistics", "construction fleets", "regional transport"], districts: [
    ["banda", "Banda", ["Banda", "Atarra", "Baberu", "Naraini"], "Bundelkhand goods routes, stone and farm transport and regional distribution"],
    ["chitrakoot", "Chitrakoot", ["Karwi", "Rajapur", "Manikpur", "Mau"], "pilgrimage vehicles, quarry-linked traffic and rural service routes"],
    ["hamirpur", "Hamirpur", ["Hamirpur", "Rath", "Maudaha", "Sarila"], "sand and construction transport, farm routes and Bundelkhand freight movements"],
    ["mahoba", "Mahoba", ["Mahoba", "Charkhari", "Kulpahar", "Kabrai"], "stone-crusher fleets, construction logistics and Jhansi–Banda corridor traffic"],
  ] },
  { division: "Devipatan", sectors: ["agri-logistics", "border-route transport", "institutional fleets"], districts: [
    ["bahraich", "Bahraich", ["Bahraich", "Nanpara", "Kaiserganj", "Mihinpurwa"], "Nepal-border trade, forest-edge operations and agricultural distribution"],
    ["balrampur", "Balrampur", ["Balrampur", "Tulsipur", "Utraula", "Pachperwa"], "sugar-industry transport, border routes and district passenger services"],
    ["gonda", "Gonda", ["Gonda", "Colonelganj", "Mankapur", "Tarabganj"], "rail-linked distribution, agricultural fleets and Ayodhya–Nepal route connections"],
    ["shravasti", "Shravasti", ["Bhinga", "Ikauna", "Jamunaha", "Gilaula"], "pilgrimage traffic, Nepal-border routes and rural delivery operations"],
  ] },
  { division: "Gorakhpur", sectors: ["regional logistics", "institutional transport", "agricultural distribution"], districts: [
    ["deoria", "Deoria", ["Deoria", "Salempur", "Rudrapur", "Bhatpar Rani"], "Bihar-linked freight, farm distribution and regional passenger routes"],
    ["gorakhpur", "Gorakhpur", ["Gorakhpur", "Sahjanwa", "Chauri Chaura", "Campierganj"], "major logistics hubs, industrial-area fleets and Nepal-bound highway movements"],
    ["kushinagar", "Kushinagar", ["Padrauna", "Kasia", "Hata", "Tamkuhi Raj"], "tourism transport, sugarcane logistics and Bihar–Nepal corridor traffic"],
    ["maharajganj", "Maharajganj", ["Maharajganj", "Nautanwa", "Nichlaul", "Pharenda"], "Sonauli border trade, customs-linked freight and rural distribution"],
  ] },
  { division: "Jhansi", sectors: ["industrial logistics", "construction transport", "regional fleets"], districts: [
    ["jalaun", "Jalaun", ["Orai", "Jalaun", "Kalpi", "Konch"], "Bundelkhand freight, agricultural markets and Kanpur–Jhansi highway routes"],
    ["jhansi", "Jhansi", ["Jhansi", "Mauranipur", "Moth", "Garautha"], "railway and defence-linked fleets, interstate freight and industrial distribution"],
    ["lalitpur", "Lalitpur", ["Lalitpur", "Talbehat", "Mahroni", "Pali"], "mining and construction traffic, Madhya Pradesh routes and rural services"],
  ] },
  { division: "Kanpur", sectors: ["manufacturing logistics", "commercial distribution", "passenger fleets"], districts: [
    ["auraiya", "Auraiya", ["Auraiya", "Bidhuna", "Ajitmal", "Dibiyapur"], "energy and industrial traffic, expressway freight and agricultural routes"],
    ["etawah", "Etawah", ["Etawah", "Bharthana", "Jaswantnagar", "Saifai"], "Agra–Lucknow Expressway movements, farm logistics and passenger fleets"],
    ["farrukhabad", "Farrukhabad", ["Farrukhabad", "Fatehgarh", "Kaimganj", "Amritpur"], "potato and agricultural transport, local wholesale routes and regional distribution"],
    ["kannauj", "Kannauj", ["Kannauj", "Chhibramau", "Tirwa", "Gursahaiganj"], "perfume-industry logistics, expressway connections and farm-to-market fleets"],
    ["kanpur-dehat", "Kanpur Dehat", ["Akbarpur", "Rura", "Pukhrayan", "Rasulabad"], "industrial corridor traffic, warehousing and rural supply routes"],
    ["kanpur-nagar", "Kanpur Nagar", ["Kanpur", "Bilhaur", "Ghatampur", "Bithoor"], "large manufacturing fleets, urban delivery and national highway freight"],
  ] },
  { division: "Lucknow", sectors: ["urban logistics", "institutional transport", "regional distribution"], districts: [
    ["hardoi", "Hardoi", ["Hardoi", "Sandila", "Shahabad", "Bilgram"], "industrial-estate transport, agricultural collection and Lucknow-linked routes"],
    ["lakhimpur-kheri", "Lakhimpur Kheri", ["Lakhimpur", "Gola Gokaran Nath", "Palia Kalan", "Nighasan"], "sugar and farm logistics, forest-edge routes and Nepal-border operations"],
    ["lucknow", "Lucknow", ["Lucknow", "Mohanlalganj", "Malihabad", "Bakshi Ka Talab"], "state-capital services, urban delivery, employee transport and expressway traffic"],
    ["raebareli", "Raebareli", ["Raebareli", "Lalganj", "Salon", "Maharajganj"], "rail-coach and industrial traffic, farm distribution and Lucknow–Prayagraj routes"],
    ["sitapur", "Sitapur", ["Sitapur", "Mahmudabad", "Laharpur", "Misrikh"], "agricultural markets, industrial transport and Lucknow–Lakhimpur movements"],
    ["unnao", "Unnao", ["Unnao", "Shuklaganj", "Bangarmau", "Purwa"], "leather and industrial logistics, Kanpur–Lucknow commuter traffic and expressway routes"],
  ] },
  { division: "Meerut", sectors: ["NCR logistics", "industrial distribution", "commercial fleets"], districts: [
    ["baghpat", "Baghpat", ["Baghpat", "Baraut", "Khekra", "Chhaprauli"], "NCR-bound farm logistics, industrial routes and Delhi–Saharanpur corridor traffic"],
    ["bulandshahr", "Bulandshahr", ["Bulandshahr", "Khurja", "Sikandrabad", "Anupshahr"], "ceramics and dairy logistics, expressway access and NCR distribution"],
    ["gautam-buddha-nagar", "Gautam Buddha Nagar", ["Noida", "Greater Noida", "Dadri", "Jewar"], "technology and e-commerce fleets, industrial corridors and airport-linked logistics"],
    ["ghaziabad", "Ghaziabad", ["Ghaziabad", "Loni", "Modinagar", "Muradnagar"], "dense NCR deliveries, manufacturing fleets and Delhi–Meerut Expressway routes"],
    ["hapur", "Hapur", ["Hapur", "Pilkhuwa", "Garhmukteshwar", "Dhaulana"], "warehousing, textile distribution and Delhi–Lucknow highway freight"],
    ["meerut", "Meerut", ["Meerut", "Sardhana", "Mawana", "Kithore"], "sports-goods distribution, NCR commuter fleets and expressway logistics"],
  ] },
  { division: "Mirzapur", sectors: ["mining logistics", "industrial transport", "regional distribution"], districts: [
    ["mirzapur", "Mirzapur", ["Mirzapur", "Chunar", "Lalganj", "Marihan"], "carpet and stone logistics, river-belt routes and Varanasi corridor traffic"],
    ["bhadohi", "Bhadohi", ["Gyanpur", "Bhadohi", "Gopiganj", "Aurai"], "carpet-industry supply chains, export-linked movements and Varanasi–Prayagraj routes"],
    ["sonbhadra", "Sonbhadra", ["Robertsganj", "Renukoot", "Obra", "Dudhi"], "power, mining and heavy industrial fleets across long interstate routes"],
  ] },
  { division: "Moradabad", sectors: ["manufacturing logistics", "agri-distribution", "commercial transport"], districts: [
    ["amroha", "Amroha", ["Amroha", "Gajraula", "Hasanpur", "Dhanaura"], "industrial and dairy transport, highway warehousing and NCR-linked routes"],
    ["bijnor", "Bijnor", ["Bijnor", "Najibabad", "Dhampur", "Nagina"], "sugarcane fleets, Uttarakhand connections and rural market distribution"],
    ["moradabad", "Moradabad", ["Moradabad", "Thakurdwara", "Bilari", "Kanth"], "brass-industry exports, warehousing and Delhi–Lucknow highway freight"],
    ["rampur", "Rampur", ["Rampur", "Bilaspur", "Milak", "Suar"], "food-processing fleets, agricultural markets and Uttarakhand-linked routes"],
    ["sambhal", "Sambhal", ["Sambhal", "Chandausi", "Gunnaur", "Bahjoi"], "handicraft distribution, farm logistics and regional commercial traffic"],
  ] },
  { division: "Prayagraj", sectors: ["regional logistics", "institutional transport", "agricultural distribution"], districts: [
    ["fatehpur", "Fatehpur", ["Fatehpur", "Bindki", "Khaga", "Bahua"], "Delhi–Kolkata highway freight, farm distribution and industrial routes"],
    ["kaushambi", "Kaushambi", ["Manjhanpur", "Bharwari", "Chail", "Sirathu"], "Prayagraj-adjacent delivery, agricultural transport and highway movements"],
    ["pratapgarh", "Pratapgarh", ["Pratapgarh", "Kunda", "Patti", "Lalganj"], "amla and farm logistics, regional passenger routes and Lucknow–Prayagraj traffic"],
    ["prayagraj", "Prayagraj", ["Prayagraj", "Phulpur", "Soraon", "Karchhana"], "pilgrimage and institutional transport, urban delivery and national highway logistics"],
  ] },
  { division: "Saharanpur", sectors: ["industrial distribution", "agri-logistics", "interstate transport"], districts: [
    ["muzaffarnagar", "Muzaffarnagar", ["Muzaffarnagar", "Khatauli", "Budhana", "Jansath"], "sugar and paper logistics, NCR routes and Delhi–Dehradun corridor traffic"],
    ["saharanpur", "Saharanpur", ["Saharanpur", "Deoband", "Nakur", "Behat"], "woodcraft distribution, Uttarakhand and Haryana routes and agricultural freight"],
    ["shamli", "Shamli", ["Shamli", "Kairana", "Kandhla", "Thanabhawan"], "sugarcane fleets, Haryana-border traffic and NCR-bound distribution"],
  ] },
  { division: "Varanasi", sectors: ["regional logistics", "tourism transport", "commercial distribution"], districts: [
    ["chandauli", "Chandauli", ["Chandauli", "Mughalsarai", "Sakaldiha", "Chakia"], "railway logistics, industrial freight and Bihar-linked highway movements"],
    ["ghazipur", "Ghazipur", ["Ghazipur", "Zamania", "Saidpur", "Mohammadabad"], "farm and market distribution, Bihar connections and river-belt routes"],
    ["jaunpur", "Jaunpur", ["Jaunpur", "Shahganj", "Machhlishahr", "Kerakat"], "regional wholesale traffic, farm logistics and Varanasi–Lucknow connections"],
    ["varanasi", "Varanasi", ["Varanasi", "Pindra", "Ramnagar", "Rajatalab"], "tourism and pilgrimage fleets, urban delivery and eastern freight corridors"],
  ] },
];

export const uttarPradeshDistricts: UttarPradeshDistrictSeo[] = divisionSeeds.flatMap(
  ({ division, sectors, districts }) => districts.map(([slug, name, cities, routeProfile]) => ({
    slug,
    name,
    division,
    cities,
    sectors,
    localContext: `${name} district in ${division} division connects ${routeProfile}. Compatible GPS devices and fleet software can help authorized teams review vehicle location, trip history and supported alerts across these operating routes.`,
    planningNote: `Before deployment in ${name}, confirm actual route coverage, vehicle and device compatibility, SIM network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.`,
  })),
);

export function getUttarPradeshDistrict(slug: string) {
  return uttarPradeshDistricts.find((district) => district.slug === slug);
}

export function generateUttarPradeshDistrictKeywords(district: UttarPradeshDistrictSeo) {
  return [...new Set([
    `GPS tracker in ${district.name}`,
    `GPS tracker ${district.name} Uttar Pradesh`,
    `vehicle tracking system ${district.name}`,
    `car GPS tracker ${district.name}`,
    `truck GPS tracking ${district.name}`,
    `fleet management software ${district.name}`,
    `commercial vehicle tracking ${district.name}`,
    `school bus GPS tracking ${district.name}`,
    ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`]),
  ])];
}

export function generateUttarPradeshDistrictMetadata(district: UttarPradeshDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/uttar-pradesh/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Uttar Pradesh, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`;
  return {
    title: `GPS Tracker in ${district.name} District, Uttar Pradesh`,
    description,
    keywords: generateUttarPradeshDistrictKeywords(district),
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${district.name} District, Uttar Pradesh | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
  };
}
