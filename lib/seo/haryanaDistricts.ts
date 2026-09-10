import type { Metadata } from "next";

export type HaryanaDistrictSeo = {
  slug: string;
  name: string;
  cities: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
};

type HaryanaDistrictSeed = [
  slug: string,
  name: string,
  cities: string[],
  sectors: string[],
  routeProfile: string,
  planningFocus: string,
];

const haryanaDistrictSeeds: HaryanaDistrictSeed[] = [
  ["ambala", "Ambala", ["Ambala City", "Ambala Cantt", "Barara", "Naraingarh"], ["highway logistics", "defence support vehicles", "commercial delivery"], "Ambala City and Cantonment operations, wholesale markets, industrial routes and NH-44 connections toward Punjab and Delhi", "interstate network coverage, cantonment-area operating procedures, installation quality and authorized fleet-data access"],
  ["bhiwani", "Bhiwani", ["Bhiwani", "Loharu", "Siwani", "Tosham"], ["regional goods transport", "mining support fleets", "agricultural logistics"], "urban distribution in Bhiwani, stone and construction activity around Tosham, agricultural routes and western Haryana road corridors", "rural mobile coverage, dusty operating conditions, rugged device installation and driver alert workflows"],
  ["charkhi-dadri", "Charkhi Dadri", ["Charkhi Dadri", "Badhra", "Baund Kalan", "Jhojhu Kalan"], ["construction transport", "agricultural fleets", "regional distribution"], "district-centre deliveries, quarry and construction routes, agricultural movements and road connections toward Bhiwani and Rewari", "coverage outside town centres, device durability, installation responsibility and location-data access policies"],
  ["faridabad", "Faridabad", ["Faridabad", "Ballabgarh", "Tigaon", "Greater Faridabad"], ["manufacturing logistics", "NCR delivery", "employee transportation"], "dense NCR deliveries, industrial estates around Ballabgarh, employee transport and high-volume routes toward Delhi and Palwal", "NCR network performance, industrial-site access, professional fitting and employee-tracking requirements"],
  ["fatehabad", "Fatehabad", ["Fatehabad", "Tohana", "Ratia", "Bhuna"], ["agricultural logistics", "commercial distribution", "service fleets"], "market-town distribution, agricultural supply routes, rice and cotton movements and regional journeys toward Hisar and Punjab", "rural carrier coverage, seasonal fleet demand, compatible SIM plans and dependable installation support"],
  ["gurugram", "Gurugram", ["Gurugram", "Manesar", "Sohna", "Pataudi", "Farrukhnagar"], ["corporate fleets", "employee transportation", "industrial logistics"], "corporate districts, Manesar manufacturing, warehouse corridors, employee transport and high-density NCR delivery routes", "urban and industrial network reliability, workplace policies, secure data access and scalable device installation"],
  ["hansi", "Hansi", ["Hansi", "Narnaund", "Bass", "Sisai"], ["agricultural logistics", "regional distribution", "service fleets"], "Hansi city distribution, agricultural markets, village service routes and NH-9 connections toward Hisar, Rohtak and Delhi", "new-district operating boundaries, urban-to-rural coverage, compatible mobile networks and dependable installation support"],
  ["hisar", "Hisar", ["Hisar", "Barwala", "Uklana", "Adampur", "Agroha"], ["agricultural logistics", "industrial transport", "regional distribution"], "Hisar city distribution, steel and industrial activity, agricultural markets and long western Haryana service routes", "urban-to-rural coverage, heat and dust conditions, device compatibility and maintenance ownership"],
  ["jhajjar", "Jhajjar", ["Jhajjar", "Bahadurgarh", "Beri", "Badli"], ["NCR warehousing", "industrial logistics", "commercial delivery"], "Bahadurgarh industry, NCR warehouses, district services and routes connecting Delhi, Rohtak and Gurugram", "cross-NCR connectivity, industrial fitting standards, workforce communication and secure alert management"],
  ["jind", "Jind", ["Jind", "Narwana", "Safidon", "Uchana"], ["agricultural transport", "regional logistics", "service vehicles"], "district-centre deliveries, grain-market movements, agricultural routes and central Haryana connections toward Punjab and Delhi", "rural route coverage, seasonal operations, reliable device power installation and data-retention settings"],
  ["kaithal", "Kaithal", ["Kaithal", "Pundri", "Guhla Cheeka", "Kalayat"], ["agricultural logistics", "commercial distribution", "school transport"], "Kaithal market operations, grain and rice logistics, school routes and northern Haryana connections toward Punjab", "town and village network coverage, route-specific alerts, device fitting and authorized user access"],
  ["karnal", "Karnal", ["Karnal", "Gharaunda", "Nilokheri", "Assandh", "Indri"], ["highway logistics", "agricultural fleets", "commercial distribution"], "NH-44 freight, Karnal city services, agricultural research and market routes, and distribution across surrounding towns", "highway and rural connectivity, professional installation, driver policies and fleet reporting responsibility"],
  ["kurukshetra", "Kurukshetra", ["Thanesar", "Shahbad", "Pehowa", "Ladwa"], ["tourism transport", "agricultural logistics", "regional delivery"], "Thanesar services, pilgrimage and tourism transport, agricultural markets and highway routes toward Ambala and Karnal", "seasonal traffic, interstate carrier coverage, device placement and location-data handling requirements"],
  ["mahendragarh", "Mahendragarh", ["Narnaul", "Mahendragarh", "Kanina", "Ateli"], ["construction fleets", "regional goods transport", "agricultural logistics"], "Narnaul commercial activity, construction and stone routes, agricultural movements and Rajasthan-border connections", "border-area network coverage, dusty conditions, rugged installation and ongoing maintenance arrangements"],
  ["nuh", "Nuh", ["Nuh", "Tauru", "Ferozepur Jhirka", "Punahana"], ["regional distribution", "construction transport", "service fleets"], "town and village deliveries, construction movements, Sohna connections and longer routes across the Mewat region", "rural and hill-route coverage, compatible mobile networks, installation quality and authorized tracking use"],
  ["palwal", "Palwal", ["Palwal", "Hodal", "Hathin", "Hassanpur"], ["highway logistics", "industrial delivery", "agricultural transport"], "NH-19 freight, Palwal and Hodal commercial routes, industrial deliveries and agricultural movements near the Uttar Pradesh border", "interstate coverage, highway alert workflows, professional fitting and driver communication procedures"],
  ["panchkula", "Panchkula", ["Panchkula", "Kalka", "Pinjore", "Raipur Rani", "Barwala"], ["service fleets", "hill-route transport", "commercial delivery"], "Tricity services, Kalka and Pinjore hill approaches, industrial areas and routes toward Chandigarh and Himachal Pradesh", "hill and interstate coverage, urban access, device compatibility and secure workforce tracking policies"],
  ["panipat", "Panipat", ["Panipat", "Samalkha", "Israna", "Bapoli"], ["textile logistics", "industrial fleets", "highway distribution"], "textile and refinery logistics, industrial estates, NH-44 freight and regional delivery routes around Panipat and Samalkha", "industrial-site procedures, highway connectivity, rugged device fitting and alert escalation ownership"],
  ["rewari", "Rewari", ["Rewari", "Dharuhera", "Bawal", "Kosli"], ["automotive logistics", "warehouse fleets", "regional distribution"], "Bawal and Dharuhera industry, Rewari logistics, NCR warehousing and Rajasthan-border freight corridors", "industrial and cross-border coverage, professional installation, employee policies and data security"],
  ["rohtak", "Rohtak", ["Rohtak", "Sampla", "Kalanaur", "Meham"], ["regional distribution", "institutional fleets", "commercial transport"], "Rohtak city services, education and healthcare fleets, Sampla industrial routes and central Haryana road connections", "urban-to-rural coverage, institutional data access, compatible devices and maintenance responsibility"],
  ["sirsa", "Sirsa", ["Sirsa", "Dabwali", "Ellenabad", "Rania"], ["agricultural logistics", "interstate transport", "commercial distribution"], "cotton and agricultural movements, Sirsa market routes, Dabwali interstate traffic and long western district journeys", "Punjab and Rajasthan border coverage, heat and dust resilience, SIM compatibility and support response"],
  ["sonipat", "Sonipat", ["Sonipat", "Kundli", "Gohana", "Ganaur"], ["NCR warehousing", "food logistics", "commercial delivery"], "Kundli warehouses, Sonipat industry, food and agricultural distribution, and NH-44 routes between Delhi and Panipat", "highway and NCR network reliability, warehouse workflows, installation standards and secure data access"],
  ["yamunanagar", "Yamunanagar", ["Yamunanagar", "Jagadhri", "Chhachhrauli", "Radaur"], ["plywood logistics", "industrial transport", "regional distribution"], "Yamunanagar and Jagadhri industry, plywood and metal logistics, agricultural routes and connections toward Uttar Pradesh and Himachal Pradesh", "industrial environments, interstate coverage, device durability and fleet alert management responsibility"],
];

export const haryanaDistricts: HaryanaDistrictSeo[] = haryanaDistrictSeeds.map(
  ([slug, name, cities, sectors, routeProfile, planningFocus]) => ({
    slug,
    name,
    cities,
    sectors,
    localContext: `${name} district fleet operations connect ${routeProfile}, where vehicle location, trip history and supported alerts can help authorized teams coordinate daily routes.`,
    planningNote: `Before deployment in ${name} district, confirm ${planningFocus}, device and SIM compatibility, installation responsibility, data retention and ongoing NAVII GPS platform support.`,
  }),
);

export function getHaryanaDistrict(slug: string) {
  return haryanaDistricts.find((district) => district.slug === slug);
}

export function generateHaryanaDistrictKeywords(district: HaryanaDistrictSeo) {
  return [...new Set([
    `GPS tracker in ${district.name}`,
    `GPS tracker ${district.name} Haryana`,
    `vehicle tracking system ${district.name}`,
    `car GPS tracker ${district.name}`,
    `truck GPS tracking ${district.name}`,
    `fleet management software ${district.name}`,
    `commercial vehicle tracking ${district.name}`,
    `school bus GPS tracking ${district.name}`,
    ...district.cities.flatMap((city) => [
      `GPS tracker ${city}`,
      `vehicle tracking system ${city}`,
    ]),
  ])];
}

export function generateHaryanaDistrictMetadata(
  district: HaryanaDistrictSeo,
): Metadata {
  const url = `https://naviigps.com/gps-tracker/haryana/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Haryana, including ${district.cities.slice(0, 3).join(", ")} and nearby operating routes.`;

  return {
    title: `GPS Tracker in ${district.name} District, Haryana | NAVII GPS`,
    description,
    keywords: generateHaryanaDistrictKeywords(district),
    alternates: { canonical: url },
    openGraph: {
      title: `GPS Tracker in ${district.name} District | NAVII GPS`,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}
