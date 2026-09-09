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

  return {
    title: `GPS Tracker in ${country.name} | Fleet Tracking | NAVII GPS`,
    description: `GPS tracking devices and fleet software planning for commercial vehicles in ${featuredCities.join(", ")} and across ${country.name}.`,
    keywords: generateInternationalKeywords(country),
    alternates: {
      canonical: `https://naviigps.com/gps-tracker/${country.slug}`,
    },
  };
}
