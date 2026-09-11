import { uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";

export type InternationalCountrySeo = {
  slug: string;
  name: string;
  cities: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
  searchAliases?: string[];
};

export const internationalCountries: InternationalCountrySeo[] = [
  {
    slug: "uae",
    name: "United Arab Emirates",
    searchAliases: ["UAE"],
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
    sectors: ["last-mile delivery", "construction fleets", "rental vehicles", "inter-emirate logistics"],
    localContext: "Fleet operations in the UAE often combine dense urban deliveries with inter-emirate journeys, construction movements and scheduled commercial transport.",
    planningNote: "Confirm device network compatibility, SIM and roaming arrangements, local regulations, installation responsibility and platform support before deployment.",
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    cities: ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"],
    sectors: ["long-distance logistics", "construction fleets", "commercial distribution", "employee transportation"],
    localContext: "Saudi fleet planning can involve long intercity routes, industrial zones, construction sites and high-volume commercial distribution across large operating areas.",
    planningNote: "Review coverage expectations, device certification, SIM provisioning, installation partners, data retention and alert workflows for the intended routes before procurement.",
  },
  {
    slug: "qatar",
    name: "Qatar",
    cities: ["Doha", "Al Rayyan", "Al Wakrah", "Ras Laffan", "Mesaieed"],
    sectors: ["construction transport", "service fleets", "staff transportation", "industrial logistics"],
    localContext: "Qatar fleets operate across Doha, industrial zones and planned service routes where clear vehicle status and journey history can support dispatch coordination.",
    planningNote: "Validate compatible mobile networks, installation arrangements, operating permissions and the required reporting workflow for each fleet before activation.",
  },
  {
    slug: "oman",
    name: "Oman",
    cities: ["Muscat", "Sohar", "Salalah", "Duqm", "Nizwa"],
    sectors: ["port-linked logistics", "long-route transport", "industrial fleets", "service vehicles"],
    localContext: "Oman combines urban service fleets with port, industrial and long-distance routes where reliable trip records and latest-location visibility can assist operations.",
    planningNote: "Discuss route coverage, network and SIM requirements, device installation, environmental conditions and support responsibilities before finalizing a rollout.",
  },
  {
    slug: "kuwait",
    name: "Kuwait",
    cities: ["Kuwait City", "Al Ahmadi", "Farwaniya", "Hawally", "Shuwaikh"],
    sectors: ["commercial distribution", "service fleets", "construction transport", "last-mile delivery"],
    localContext: "Kuwait fleet operations connect dense metropolitan routes with industrial districts, warehouses and scheduled service locations where vehicle status can support dispatch planning.",
    planningNote: "Confirm device and mobile-network compatibility, SIM provisioning, installation responsibility, local operating requirements and platform support before deployment.",
  },
  {
    slug: "bahrain",
    name: "Bahrain",
    cities: ["Manama", "Muharraq", "Riffa", "Sitra", "Hidd"],
    sectors: ["service fleets", "industrial logistics", "staff transportation", "commercial delivery"],
    localContext: "Bahrain combines compact urban routes with port, industrial and commercial zones where latest-location visibility and trip records can help coordinate fleet activity.",
    planningNote: "Review compatible networks, device certification, installation arrangements, data requirements and support responsibilities for the intended vehicles and routes.",
  },
  {
    slug: "singapore",
    name: "Singapore",
    cities: ["Jurong", "Tuas", "Changi", "Woodlands", "Tampines"],
    sectors: ["urban delivery", "port-linked logistics", "service fleets", "commercial distribution"],
    localContext: "Singapore fleets operate across high-density urban roads, logistics parks, port corridors and scheduled service routes where accurate trip records support operational control.",
    planningNote: "Confirm local regulatory requirements, supported networks, device installation, data handling and integration needs before selecting hardware or activating a fleet.",
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    cities: ["Kuala Lumpur", "Selangor", "Johor Bahru", "Penang", "Port Klang"],
    sectors: ["interstate logistics", "last-mile delivery", "industrial distribution", "service fleets"],
    localContext: "Malaysia combines metropolitan deliveries, industrial clusters, port activity and interstate routes where connected tracking can support dispatch, route review and fleet coordination.",
    planningNote: "Evaluate regional network coverage, SIM and device compatibility, installation capacity, data retention and support arrangements for each operating area before rollout.",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    searchAliases: ["UK"],
    cities: ["London", "Birmingham", "Manchester", "Glasgow", "Leeds"],
    sectors: ["last-mile delivery", "service fleets", "construction transport", "regional logistics"],
    localContext: "United Kingdom fleets combine dense urban deliveries, scheduled service work and motorway journeys where reliable vehicle status and trip records can support operational planning.",
    planningNote: "Confirm device and network compatibility, UK data-protection and vehicle-tracking obligations, installation arrangements and support responsibilities before deployment.",
  },
  {
    slug: "canada",
    name: "Canada",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton"],
    sectors: ["long-distance logistics", "service fleets", "construction vehicles", "commercial distribution"],
    localContext: "Canadian fleets may cover large service territories, long intercity routes and changing seasonal conditions where latest-location visibility and journey records assist coordination.",
    planningNote: "Review supported cellular bands, regional coverage, weather and installation requirements, privacy obligations, SIM provisioning and ongoing support before procurement.",
  },
  {
    slug: "australia",
    name: "Australia",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    sectors: ["interstate logistics", "field service fleets", "construction transport", "commercial delivery"],
    localContext: "Australian fleet operations can span metropolitan delivery networks, regional service areas and long interstate routes where route history and vehicle events support dispatch control.",
    planningNote: "Validate mobile-network coverage for intended routes, compatible device bands, installation standards, privacy requirements and support arrangements before rollout.",
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    searchAliases: ["NZ"],
    cities: ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga"],
    sectors: ["regional logistics", "service fleets", "commercial distribution", "construction vehicles"],
    localContext: "New Zealand fleets connect urban delivery areas, ports and regional routes across varied terrain where connected tracking can support trip review and fleet coordination.",
    planningNote: "Confirm cellular coverage, device compatibility, installation responsibility, local privacy and employment requirements, data handling and platform support before activation.",
  },
  {
    slug: "usa",
    name: "United States",
    searchAliases: ["USA", "US"],
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Dallas"],
    sectors: ["interstate logistics", "last-mile delivery", "field service fleets", "construction vehicles"],
    localContext: "United States fleet operations can combine dense metropolitan deliveries, regional service territories and long interstate routes where vehicle status and trip history support dispatch planning.",
    planningNote: "Confirm device certification, supported cellular bands, carrier coverage, installation standards, state privacy and employee-monitoring requirements, data handling and support responsibilities before rollout.",
  },
  {
    slug: "germany",
    name: "Germany",
    cities: ["Berlin", "Hamburg", "Munich", "Frankfurt", "Cologne"],
    sectors: ["road freight logistics", "service fleets", "construction transport", "commercial delivery"],
    localContext: "German fleets operate across major cities, industrial regions and cross-border road corridors where reliable trip records and vehicle events can support logistics and service coordination.",
    planningNote: "Review compatible mobile networks, device and installation requirements, GDPR responsibilities, employee and works-council considerations, data retention and support arrangements before deployment.",
  },
  {
    slug: "france",
    name: "France",
    cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Lille"],
    sectors: ["regional distribution", "service fleets", "construction transport", "urban delivery"],
    localContext: "French fleet activity connects high-density urban areas, regional distribution routes and major freight corridors where latest-location visibility can assist dispatch and journey review.",
    planningNote: "Validate network coverage, device compatibility, installation responsibility, GDPR and workplace requirements, data retention, cross-border roaming and platform support before activation.",
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
    sectors: ["port-linked logistics", "urban delivery", "service fleets", "commercial distribution"],
    localContext: "Netherlands fleets connect compact urban routes, port and logistics zones, regional distribution centres and cross-border corridors where accurate trip records support operational control.",
    planningNote: "Confirm supported networks, device and installation requirements, GDPR responsibilities, employee-tracking policies, roaming needs, data retention and ongoing support before deployment.",
  },
  {
    slug: "italy",
    name: "Italy",
    cities: ["Rome", "Milan", "Naples", "Turin", "Bologna"],
    sectors: ["regional distribution", "urban delivery", "service fleets", "industrial logistics"],
    localContext: "Italian fleet operations connect dense historic cities, northern industrial districts, ports and long regional corridors where trip history and vehicle events can support dispatch planning.",
    planningNote: "Confirm mobile-network coverage, device and installation requirements, GDPR and workplace obligations, restricted-zone workflows, roaming needs and ongoing platform support before deployment.",
  },
  {
    slug: "spain",
    name: "Spain",
    cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao"],
    sectors: ["national logistics", "urban delivery", "service fleets", "port-linked distribution"],
    localContext: "Spanish fleets combine metropolitan deliveries, port logistics, industrial routes and long national journeys where reliable vehicle visibility can assist scheduling and operational review.",
    planningNote: "Review carrier coverage, compatible devices, professional installation, GDPR and employee requirements, environmental-zone access, data retention and support responsibilities before activation.",
  },
  {
    slug: "belgium",
    name: "Belgium",
    cities: ["Brussels", "Antwerp", "Ghent", "Liège", "Charleroi"],
    sectors: ["cross-border logistics", "port freight", "urban delivery", "service fleets"],
    localContext: "Belgian fleets operate across compact metropolitan areas, major port facilities and cross-border Benelux freight corridors where connected trip records support fleet coordination.",
    planningNote: "Validate Belgian and EU privacy obligations, workplace policies, low-emission-zone processes, cross-border connectivity, device installation and platform support before rollout.",
  },
  {
    slug: "switzerland",
    name: "Switzerland",
    cities: ["Zurich", "Geneva", "Basel", "Bern", "Lausanne"],
    sectors: ["regional logistics", "service fleets", "commercial distribution", "construction transport"],
    localContext: "Swiss fleet activity connects major commercial centres, cross-border corridors and varied alpine routes where latest-location visibility and journey records can support operational control.",
    planningNote: "Confirm Swiss data and employment requirements, compatible networks and roaming, terrain-specific coverage, installation standards, data retention and support arrangements before deployment.",
  },
  {
    slug: "ireland",
    name: "Ireland",
    cities: ["Dublin", "Cork", "Limerick", "Galway", "Waterford"],
    sectors: ["regional distribution", "service fleets", "commercial delivery", "construction vehicles"],
    localContext: "Irish fleets connect Dublin and regional cities through motorway, port and rural service routes where accurate trip history and vehicle status can assist dispatch coordination.",
    planningNote: "Review Irish and EU data-protection duties, employee-tracking policies, regional coverage, device installation, roaming needs, data retention and ongoing support before activation.",
  },
  {
    slug: "portugal",
    name: "Portugal",
    cities: ["Lisbon", "Porto", "Braga", "Coimbra", "Faro"],
    sectors: ["regional distribution", "urban delivery", "service fleets", "port-linked logistics"],
    localContext: "Portuguese fleets connect dense coastal cities, major ports, industrial areas and long north-south routes where journey records and latest-location visibility can support dispatch coordination.",
    planningNote: "Confirm Portuguese and EU data duties, employee-tracking policies, mobile coverage, device installation, environmental-zone requirements, roaming and ongoing platform support before deployment.",
  },
  {
    slug: "austria",
    name: "Austria",
    cities: ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck"],
    sectors: ["cross-border logistics", "service fleets", "industrial distribution", "construction transport"],
    localContext: "Austrian fleet activity combines metropolitan operations, industrial corridors, cross-border freight and alpine routes where reliable trip history can assist scheduling and fleet control.",
    planningNote: "Review Austrian and EU privacy rules, workplace consultation, roaming and network coverage, alpine operating conditions, installation standards, data retention and support before rollout.",
  },
  {
    slug: "denmark",
    name: "Denmark",
    cities: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg"],
    sectors: ["urban delivery", "port logistics", "service fleets", "regional distribution"],
    localContext: "Danish fleets operate across compact cities, port and industrial zones, bridge connections and scheduled regional routes where connected vehicle records support operational planning.",
    planningNote: "Validate Danish and EU data obligations, employee policies, compatible networks, bridge and ferry route coverage, professional installation, retention settings and platform support before activation.",
  },
  {
    slug: "sweden",
    name: "Sweden",
    cities: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås"],
    sectors: ["national logistics", "urban delivery", "industrial fleets", "field service vehicles"],
    localContext: "Swedish fleet operations connect metropolitan deliveries, ports, manufacturing centres and long regional journeys where vehicle status and trip records can support dispatch decisions.",
    planningNote: "Confirm Swedish and EU privacy requirements, workforce policies, winter and remote-route coverage, device compatibility, installation responsibility, roaming and ongoing support before deployment.",
  },
  {
    slug: "norway",
    name: "Norway",
    cities: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen"],
    sectors: ["regional logistics", "energy service fleets", "commercial delivery", "construction vehicles"],
    localContext: "Norwegian fleets combine urban service routes, port and energy activity, mountain corridors and long coastal journeys where dependable trip records can assist operational coordination.",
    planningNote: "Review Norwegian privacy and employment duties, remote and tunnel coverage, winter conditions, compatible hardware, professional fitting, data retention and support arrangements before rollout.",
  },
  {
    slug: "finland",
    name: "Finland",
    cities: ["Helsinki", "Espoo", "Tampere", "Turku", "Oulu"],
    sectors: ["regional distribution", "service fleets", "industrial logistics", "commercial delivery"],
    localContext: "Finnish fleets connect southern metropolitan routes, port logistics, inland manufacturing centres and long northern journeys where vehicle events and route history support fleet planning.",
    planningNote: "Confirm Finnish and EU data rules, employee requirements, winter and remote-area coverage, compatible devices, installation standards, roaming needs and ongoing technical support before activation.",
  },
  {
    slug: "poland",
    name: "Poland",
    cities: ["Warsaw", "Kraków", "Wrocław", "Poznań", "Gdańsk"],
    sectors: ["cross-border logistics", "urban delivery", "industrial distribution", "service fleets"],
    localContext: "Polish fleet operations connect large metropolitan areas, manufacturing centres, Baltic ports and European freight corridors where reliable trip records can support dispatch and route planning.",
    planningNote: "Confirm Polish and EU data requirements, employee-tracking policies, compatible mobile networks, low-emission access, cross-border roaming, installation standards and ongoing platform support before deployment.",
  },
  {
    slug: "czech-republic",
    name: "Czech Republic",
    searchAliases: ["Czechia"],
    cities: ["Prague", "Brno", "Ostrava", "Plzeň", "Liberec"],
    sectors: ["regional logistics", "automotive fleets", "commercial delivery", "service vehicles"],
    localContext: "Czech fleet activity combines metropolitan services, automotive and industrial zones, and central European cross-border corridors where vehicle status and journey history assist operational control.",
    planningNote: "Review Czech and EU privacy duties, workplace requirements, roaming and network coverage, urban access rules, professional device fitting, data retention and support arrangements before rollout.",
  },
  {
    slug: "hungary",
    name: "Hungary",
    cities: ["Budapest", "Debrecen", "Szeged", "Miskolc", "Győr"],
    sectors: ["national distribution", "industrial logistics", "urban delivery", "service fleets"],
    localContext: "Hungarian fleets connect Budapest with manufacturing centres, regional distribution hubs and international road corridors where connected tracking can support dispatch and fleet coordination.",
    planningNote: "Validate Hungarian and EU data obligations, employee policies, compatible networks, cross-border roaming, installation responsibility, retention settings and technical support before activation.",
  },
  {
    slug: "romania",
    name: "Romania",
    cities: ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța"],
    sectors: ["national logistics", "port distribution", "service fleets", "commercial delivery"],
    localContext: "Romanian fleet operations span Bucharest, regional technology and manufacturing centres, Black Sea port activity and long national routes where trip visibility supports operational planning.",
    planningNote: "Confirm Romanian and EU privacy requirements, employee-tracking procedures, regional carrier coverage, cross-border connectivity, device installation, data retention and ongoing support before deployment.",
  },
  {
    slug: "greece",
    name: "Greece",
    cities: ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa"],
    sectors: ["port-linked logistics", "urban delivery", "tourism transport", "service fleets"],
    localContext: "Greek fleets combine dense metropolitan routes, mainland freight corridors, major ports and island operations where vehicle location and journey records can support scheduling and dispatch.",
    planningNote: "Review Greek and EU data rules, employee policies, mobile and ferry-route coverage, heat-resistant installation, roaming needs, retention settings and platform support before rollout.",
  },
  {
    slug: "turkey",
    name: "Turkey",
    searchAliases: ["Türkiye"],
    cities: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
    sectors: ["intercity logistics", "urban delivery", "industrial fleets", "commercial distribution"],
    localContext: "Turkish fleet operations connect major metropolitan markets, industrial regions, ports and long intercity corridors where latest-location visibility and route history support fleet coordination.",
    planningNote: "Confirm Turkish data and employment requirements, device and SIM compatibility, regional network coverage, installation responsibility, cross-border roaming, retention and ongoing platform support before activation.",
  },
  {
    slug: "japan",
    name: "Japan",
    cities: ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Fukuoka"],
    sectors: ["urban delivery", "port logistics", "industrial distribution", "service fleets"],
    localContext: "Japanese fleet operations connect dense metropolitan delivery networks, major ports, manufacturing regions and high-volume intercity corridors where accurate vehicle events can support dispatch planning.",
    planningNote: "Confirm Japanese radio and device requirements, supported mobile networks, workplace and privacy duties, professional installation, data retention, language needs and ongoing platform support before deployment.",
  },
  {
    slug: "south-korea",
    name: "South Korea",
    searchAliases: ["Korea"],
    cities: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"],
    sectors: ["metropolitan delivery", "port freight", "industrial fleets", "commercial distribution"],
    localContext: "South Korean fleets operate across dense urban regions, large port and airport facilities, industrial centres and national expressway routes where connected tracking supports fleet coordination.",
    planningNote: "Review Korean device certification, compatible carriers, privacy and employee requirements, installation responsibility, local-language workflows, data retention and support arrangements before activation.",
  },
  {
    slug: "thailand",
    name: "Thailand",
    cities: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Chonburi"],
    sectors: ["urban delivery", "tourism transport", "industrial logistics", "service fleets"],
    localContext: "Thai fleet operations combine Bangkok distribution, eastern industrial corridors, tourism transport and long regional routes where latest-location visibility and trip history assist dispatch decisions.",
    planningNote: "Confirm Thai device and SIM compatibility, regional mobile coverage, local privacy and employment duties, heat-resistant installation, data retention and ongoing technical support before rollout.",
  },
  {
    slug: "indonesia",
    name: "Indonesia",
    cities: ["Jakarta", "Surabaya", "Bandung", "Medan", "Makassar"],
    sectors: ["last-mile delivery", "inter-island logistics", "commercial distribution", "service fleets"],
    localContext: "Indonesian fleets span dense metropolitan routes, ports, industrial estates and inter-island logistics networks where connected vehicle records can support dispatch and operational review.",
    planningNote: "Validate Indonesian device and network requirements, multi-island SIM coverage, privacy and employment obligations, installation quality, data handling and support availability before deployment.",
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    cities: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong", "Can Tho"],
    sectors: ["urban delivery", "port logistics", "industrial distribution", "regional transport"],
    localContext: "Vietnamese fleet activity connects fast-growing metropolitan markets, major ports, manufacturing zones and long north-south routes where trip visibility can assist scheduling and fleet control.",
    planningNote: "Review Vietnamese device and telecommunications requirements, carrier coverage, privacy and workforce duties, professional installation, data retention and platform support before activation.",
  },
  {
    slug: "philippines",
    name: "Philippines",
    cities: ["Manila", "Quezon City", "Cebu City", "Davao City", "Makati"],
    sectors: ["metropolitan delivery", "inter-island logistics", "service fleets", "commercial distribution"],
    localContext: "Philippine fleets combine congested metropolitan deliveries, port and airport movements, regional service routes and inter-island logistics where reliable vehicle status supports operational coordination.",
    planningNote: "Confirm Philippine device and SIM compatibility, island-specific carrier coverage, privacy and employment duties, installation responsibility, data retention and ongoing platform support before rollout.",
  },
  {
    slug: "brazil",
    name: "Brazil",
    cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Belo Horizonte", "Curitiba"],
    sectors: ["national logistics", "urban delivery", "industrial fleets", "service vehicles"],
    localContext: "Brazilian fleet operations span dense metropolitan markets, industrial regions, ports and long interstate corridors where reliable vehicle events and trip history can support dispatch control.",
    planningNote: "Confirm Brazilian telecommunications and device requirements, LGPD and employment duties, carrier coverage, professional installation, data retention, Portuguese-language workflows and ongoing support before deployment.",
  },
  {
    slug: "mexico",
    name: "Mexico",
    cities: ["Mexico City", "Monterrey", "Guadalajara", "Puebla", "Tijuana"],
    sectors: ["cross-border logistics", "metropolitan delivery", "industrial distribution", "service fleets"],
    localContext: "Mexican fleets connect major metropolitan markets, manufacturing clusters, border gateways and long national freight routes where latest-location visibility can assist fleet coordination.",
    planningNote: "Review Mexican device and mobile-network compatibility, privacy and workforce rules, cross-border roaming, installation responsibility, data retention, security procedures and platform support before rollout.",
  },
  {
    slug: "argentina",
    name: "Argentina",
    cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
    sectors: ["regional distribution", "urban delivery", "agricultural logistics", "service fleets"],
    localContext: "Argentine fleet activity combines Buenos Aires distribution, inland industrial and agricultural routes, port operations and long provincial journeys where connected trip records support planning.",
    planningNote: "Confirm Argentine device and carrier requirements, privacy and employee policies, regional coverage, professional fitting, roaming needs, data retention and ongoing technical support before activation.",
  },
  {
    slug: "chile",
    name: "Chile",
    cities: ["Santiago", "Valparaíso", "Concepción", "Antofagasta", "Puerto Montt"],
    sectors: ["mining logistics", "port freight", "commercial delivery", "service fleets"],
    localContext: "Chilean fleets operate across Santiago, Pacific ports, mining regions and exceptionally long north-south corridors where vehicle status and route history can support operational decisions.",
    planningNote: "Review Chilean device and network requirements, privacy and employment duties, mountain and remote-route coverage, installation standards, data retention, roaming and support arrangements before deployment.",
  },
  {
    slug: "colombia",
    name: "Colombia",
    cities: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
    sectors: ["urban distribution", "port logistics", "regional transport", "service fleets"],
    localContext: "Colombian fleet operations connect high-altitude metropolitan areas, industrial valleys, Caribbean ports and intercity routes where accurate tracking records can assist dispatch coordination.",
    planningNote: "Confirm Colombian telecommunications and device requirements, data and workforce obligations, mountain-route coverage, installation responsibility, retention settings and ongoing platform support before rollout.",
  },
  {
    slug: "peru",
    name: "Peru",
    cities: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Cusco"],
    sectors: ["national logistics", "mining support fleets", "urban delivery", "commercial distribution"],
    localContext: "Peruvian fleets combine Lima distribution, coastal freight routes, mining support operations and high-altitude regional journeys where vehicle visibility supports scheduling and fleet control.",
    planningNote: "Validate Peruvian device and carrier requirements, privacy and employment duties, mountain and remote-area coverage, rugged installation, data retention, roaming and technical support before activation.",
  },
];


export function getInternationalCountry(slug: string): InternationalCountrySeo {
  const country = internationalCountries.find((item) => item.slug === slug);

  if (!country) {
    throw new Error(`Missing international SEO data for: ${slug}`);
  }

  return country;
}

export function generateInternationalKeywords(country: InternationalCountrySeo): string[] {
  const locations = [country.name, ...(country.searchAliases ?? [])];
  const countryIntentKeywords = locations.flatMap((location) => [
    `GPS tracker ${location}`,
    `vehicle tracking system ${location}`,
    `fleet tracking ${location}`,
    `fleet management software ${location}`,
    `commercial vehicle tracking ${location}`,
    `truck GPS tracking ${location}`,
  ]);
  const cityKeywords = country.cities.flatMap((city) => [
    `GPS tracker ${city}`,
    `vehicle tracking system ${city}`,
  ]);
  const sectorKeywords = country.sectors.map(
    (sector) => `${sector} GPS tracking ${country.name}`,
  );

  return [...new Set([...countryIntentKeywords, ...cityKeywords, ...sectorKeywords])];
}

export function generateInternationalHubKeywords(): string[] {
  const countryKeywords = internationalCountries.flatMap((country) =>
    [country.name, ...(country.searchAliases ?? [])].map(
      (location) => `GPS tracker ${location}`,
    ),
  );

  return [
    "international GPS tracking",
    "global fleet tracking software",
    ...new Set(countryKeywords),
  ];
}

export function generateInternationalMetadata(
  country: InternationalCountrySeo,
): Metadata {
  const featuredCities = country.cities.slice(0, 4);
  const description = `GPS tracking devices and fleet software planning for commercial vehicles in ${featuredCities.join(", ")} and across ${country.name}.`;
  const url = `https://naviigps.com/gps-tracker/${country.slug}`;

  return {
    title: `GPS Tracker in ${country.name} | Fleet Tracking`,
    description,
    openGraph: { title: `GPS Tracker in ${country.name} | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    keywords: uniqueKeywords(generateInternationalKeywords(country)),
    alternates: {
      canonical: `https://naviigps.com/gps-tracker/${country.slug}`,
    },
  };
}
