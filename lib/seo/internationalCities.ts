import type { Metadata } from "next";

export type InternationalCitySeo = {
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
  areas: string[];
  localContext: string;
  planningNote: string;
};

export const internationalCities: InternationalCitySeo[] = [
  {
    slug: "new-york",
    name: "New York",
    countrySlug: "usa",
    countryName: "United States",
    areas: ["Manhattan", "Brooklyn", "Queens", "The Bronx"],
    localContext: "New York fleets manage dense delivery zones, bridge and tunnel crossings, borough-to-borough service calls and regional routes where timely vehicle status supports dispatch decisions.",
    planningNote: "Review cellular coverage, device certification, installation standards, employee-notice obligations, state and local privacy requirements, data retention and support arrangements before deployment.",
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    countrySlug: "usa",
    countryName: "United States",
    areas: ["Downtown Los Angeles", "Long Beach", "Santa Monica", "San Fernando Valley"],
    localContext: "Los Angeles operations span congested urban corridors, port-linked freight routes, wide service territories and scheduled field visits where trip history can assist route and workload review.",
    planningNote: "Confirm supported carrier bands, route coverage, California privacy and employee-monitoring requirements, installation responsibility, alert policies and ongoing platform support before activation.",
  },
  {
    slug: "chicago",
    name: "Chicago",
    countrySlug: "usa",
    countryName: "United States",
    areas: ["The Loop", "O'Hare", "South Side", "West Side"],
    localContext: "Chicago fleets connect central business districts, industrial corridors, airport logistics and interstate freight routes where dependable journey records can support daily operations.",
    planningNote: "Evaluate regional network coverage, winter operating conditions, compatible hardware, installation quality, workplace policies, data access and technical support before fleet rollout.",
  },
  {
    slug: "houston",
    name: "Houston",
    countrySlug: "usa",
    countryName: "United States",
    areas: ["Downtown Houston", "Energy Corridor", "Port Houston", "The Woodlands"],
    localContext: "Houston fleets serve broad metropolitan routes, energy and industrial sites, port activity and regional distribution journeys where vehicle events help coordinate field operations.",
    planningNote: "Validate cellular availability across intended sites, equipment and installation requirements, company vehicle policies, alert escalation, environmental conditions and support ownership before deployment.",
  },
  {
    slug: "dallas",
    name: "Dallas",
    countrySlug: "usa",
    countryName: "United States",
    areas: ["Downtown Dallas", "Fort Worth", "Irving", "Plano"],
    localContext: "Dallas–Fort Worth fleets cover large urban service areas, warehouse clusters, airport routes and interstate distribution corridors where location visibility can improve dispatch coordination.",
    planningNote: "Confirm carrier coverage, supported device bands, installation standards, privacy and workforce policies, reporting requirements, data retention and platform support before procurement.",
  },
  {
    slug: "london",
    name: "London",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    areas: ["Central London", "Heathrow", "Croydon", "Enfield"],
    localContext: "London fleets operate through dense delivery areas, restricted and charging zones, airport corridors and outer-borough service routes where accurate trip records support planning.",
    planningNote: "Review UK data-protection and employee-tracking duties, mobile coverage, device installation, access-zone workflows, data retention and support responsibilities before activation.",
  },
  {
    slug: "birmingham",
    name: "Birmingham",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    areas: ["City Centre", "Digbeth", "Solihull", "West Bromwich"],
    localContext: "Birmingham fleets connect city deliveries, manufacturing areas, motorway junctions and wider West Midlands service routes where route history can support operational review.",
    planningNote: "Confirm network compatibility, clean-air and operating-zone workflows, installation responsibility, UK privacy obligations, driver communication and ongoing platform support before deployment.",
  },
  {
    slug: "manchester",
    name: "Manchester",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    areas: ["Manchester City Centre", "Trafford Park", "Salford", "Stockport"],
    localContext: "Manchester fleets cover urban delivery districts, Trafford Park logistics activity and regional routes across Greater Manchester where vehicle status can assist dispatch teams.",
    planningNote: "Evaluate mobile coverage, compatible devices, installation procedures, UK data and workplace requirements, alert escalation, retention policies and technical support before rollout.",
  },
  {
    slug: "glasgow",
    name: "Glasgow",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    areas: ["Glasgow City Centre", "Clydebank", "Paisley", "East Kilbride"],
    localContext: "Glasgow operations combine city service calls, industrial routes around the Clyde and journeys across the wider urban region where trip records support fleet coordination.",
    planningNote: "Review route and network coverage, low-emission-zone processes, device fitting, UK privacy and employee obligations, reporting access and support arrangements before activation.",
  },
  {
    slug: "leeds",
    name: "Leeds",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    areas: ["Leeds City Centre", "Holbeck", "Seacroft", "Bradford"],
    localContext: "Leeds fleets serve city-centre routes, commercial estates and wider West Yorkshire distribution networks where latest-location information can improve service coordination.",
    planningNote: "Confirm mobile-network suitability, device and installation standards, UK data-protection duties, workforce policies, required reports and ongoing support before deployment.",
  },
  {
    slug: "toronto",
    name: "Toronto",
    countrySlug: "canada",
    countryName: "Canada",
    areas: ["Downtown Toronto", "North York", "Scarborough", "Mississauga"],
    localContext: "Toronto fleets navigate dense urban deliveries, Greater Toronto service territories and major highway corridors where reliable vehicle events can assist dispatch and route review.",
    planningNote: "Validate Canadian carrier bands, regional coverage, winter installation needs, privacy and workplace obligations, data retention, alert access and support responsibilities before rollout.",
  },
  {
    slug: "vancouver",
    name: "Vancouver",
    countrySlug: "canada",
    countryName: "Canada",
    areas: ["Downtown Vancouver", "Burnaby", "Richmond", "Surrey"],
    localContext: "Vancouver fleets connect port and airport logistics, dense metropolitan routes and mountain-linked regional journeys where trip visibility supports changing operating conditions.",
    planningNote: "Review network performance across intended routes, device compatibility, weather-resistant installation, Canadian privacy duties, workforce communication and technical support before activation.",
  },
  {
    slug: "montreal",
    name: "Montreal",
    countrySlug: "canada",
    countryName: "Canada",
    areas: ["Downtown Montreal", "Saint-Laurent", "Laval", "Longueuil"],
    localContext: "Montreal fleets serve island routes, industrial districts, port-linked freight and surrounding metropolitan areas where journey records can support bilingual operating teams.",
    planningNote: "Confirm Quebec and Canadian privacy requirements, language and driver communication needs, cellular coverage, winter-ready installation, data access and platform support before deployment.",
  },
  {
    slug: "calgary",
    name: "Calgary",
    countrySlug: "canada",
    countryName: "Canada",
    areas: ["Downtown Calgary", "Foothills Industrial", "Airport Trail", "Airdrie"],
    localContext: "Calgary fleets cover broad urban routes, industrial parks, energy-sector service journeys and regional highways where latest-location visibility assists field coordination.",
    planningNote: "Evaluate carrier coverage beyond the city, cold-weather device and installation requirements, privacy responsibilities, alert procedures, data retention and support capacity before rollout.",
  },
  {
    slug: "edmonton",
    name: "Edmonton",
    countrySlug: "canada",
    countryName: "Canada",
    areas: ["Downtown Edmonton", "Nisku", "Sherwood Park", "St. Albert"],
    localContext: "Edmonton operations combine city service routes, industrial activity, warehouse movements and long regional journeys where dependable trip data supports fleet oversight.",
    planningNote: "Confirm regional mobile coverage, winter operating and installation standards, Canadian privacy duties, workforce policies, reporting needs and ongoing technical support before activation.",
  },
  {
    slug: "sydney",
    name: "Sydney",
    countrySlug: "australia",
    countryName: "Australia",
    areas: ["Sydney CBD", "Parramatta", "Botany", "Liverpool"],
    localContext: "Sydney fleets operate across congested central routes, port and airport logistics, western business districts and wider metropolitan service territories where trip records aid planning.",
    planningNote: "Validate Australian mobile-network coverage, compatible device bands, installation standards, workplace and privacy requirements, toll-route workflows and support arrangements before deployment.",
  },
  {
    slug: "melbourne",
    name: "Melbourne",
    countrySlug: "australia",
    countryName: "Australia",
    areas: ["Melbourne CBD", "Port Melbourne", "Dandenong", "Tullamarine"],
    localContext: "Melbourne fleets connect central deliveries, port movements, industrial suburbs and regional highway routes where vehicle status can help coordinate varied daily schedules.",
    planningNote: "Review carrier availability, hardware compatibility, professional installation, Australian privacy and employee policies, data retention, alert ownership and platform support before activation.",
  },
  {
    slug: "brisbane",
    name: "Brisbane",
    countrySlug: "australia",
    countryName: "Australia",
    areas: ["Brisbane CBD", "Eagle Farm", "Logan", "Ipswich"],
    localContext: "Brisbane fleets serve fast-growing metropolitan corridors, industrial districts and routes toward surrounding regional centres where journey visibility supports dispatch operations.",
    planningNote: "Confirm network performance across intended routes, device and heat-resistant installation needs, workplace and privacy requirements, reporting access and support responsibilities before rollout.",
  },
  {
    slug: "perth",
    name: "Perth",
    countrySlug: "australia",
    countryName: "Australia",
    areas: ["Perth CBD", "Fremantle", "Welshpool", "Joondalup"],
    localContext: "Perth fleets cover a wide metropolitan footprint, port-linked freight, industrial zones and long regional approaches where dependable location reporting assists operational control.",
    planningNote: "Evaluate mobile coverage outside central areas, compatible hardware, environmental and installation standards, Australian privacy duties, retention needs and technical support before deployment.",
  },
  {
    slug: "adelaide",
    name: "Adelaide",
    countrySlug: "australia",
    countryName: "Australia",
    areas: ["Adelaide CBD", "Port Adelaide", "Wingfield", "Salisbury"],
    localContext: "Adelaide operations combine compact city routes, northern industrial areas, port activity and regional distribution journeys where trip history can support fleet scheduling.",
    planningNote: "Confirm carrier coverage, device compatibility, installation responsibility, Australian workplace and privacy obligations, alert workflows, data retention and ongoing support before activation.",
  },
];

export function getInternationalCity(slug: string) {
  return internationalCities.find((city) => city.slug === slug);
}

export function generateInternationalCityKeywords(city: InternationalCitySeo) {
  return [...new Set([
    `GPS tracker ${city.name}`,
    `GPS tracker in ${city.name}`,
    `vehicle tracking system ${city.name}`,
    `fleet tracking ${city.name}`,
    `fleet management software ${city.name}`,
    `commercial vehicle tracking ${city.name}`,
    `truck GPS tracking ${city.name}`,
    `GPS tracker ${city.name} ${city.countryName}`,
    ...city.areas.map((area) => `GPS tracker ${area}`),
  ])];
}

export function generateInternationalCityMetadata(city: InternationalCitySeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/${city.slug}`;
  const description = `GPS tracking devices and fleet software planning in ${city.name}, ${city.countryName}, including routes around ${city.areas.slice(0, 2).join(" and ")}.`;

  return {
    title: `GPS Tracker in ${city.name}, ${city.countryName} | NAVII GPS`,
    description,
    keywords: generateInternationalCityKeywords(city),
    alternates: { canonical: url },
    openGraph: {
      title: `GPS Tracker in ${city.name}, ${city.countryName} | NAVII GPS`,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}
