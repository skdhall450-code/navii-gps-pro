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

type GeneratedInternationalCitySeo = Omit<
  InternationalCitySeo,
  "localContext" | "planningNote"
> & {
  routeProfile: string;
  planningFocus: string;
};

function createInternationalCity(
  input: GeneratedInternationalCitySeo,
): InternationalCitySeo {
  const { routeProfile, planningFocus, ...city } = input;

  return {
    ...city,
    localContext: `${city.name} fleet operations connect ${routeProfile}, where reliable vehicle location, trip history and event visibility can support dispatch and route coordination.`,
    planningNote: `Before deployment in ${city.name}, confirm ${planningFocus}, compatible mobile networks, device installation responsibility, privacy and workplace requirements, data retention and ongoing platform support.`,
  };
}

const initialInternationalCities: InternationalCitySeo[] = [
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

type InternationalCitySeed = [
  slug: string,
  name: string,
  countrySlug: string,
  countryName: string,
  areas: string[],
  routeProfile: string,
  planningFocus: string,
];

const expansionCitySeeds: InternationalCitySeed[] = [
  ["berlin", "Berlin", "germany", "Germany", ["Mitte", "Charlottenburg", "Tempelhof", "Spandau"], "central delivery districts, commercial centres, airport approaches and surrounding logistics corridors", "German and EU data rules, workforce consultation, urban access requirements and route coverage"],
  ["hamburg", "Hamburg", "germany", "Germany", ["HafenCity", "Port of Hamburg", "Altona", "Harburg"], "port terminals, warehouse districts, urban service routes and north-German freight connections", "port operating conditions, cross-border roaming, GDPR duties and professional device fitting"],
  ["munich", "Munich", "germany", "Germany", ["Altstadt", "Schwabing", "Garching", "Freiham"], "busy central routes, technology districts, industrial locations and wider Bavarian service journeys", "urban access workflows, German privacy duties, driver communication and regional network coverage"],
  ["frankfurt", "Frankfurt", "germany", "Germany", ["Innenstadt", "Frankfurt Airport", "Höchst", "Offenbach"], "financial districts, airport logistics, industrial zones and major national road connections", "airport and freight workflows, GDPR compliance, cross-border operations and device certification"],
  ["cologne", "Cologne", "germany", "Germany", ["Innenstadt", "Deutz", "Niehl", "Leverkusen"], "Rhine-side commercial routes, industrial areas, urban deliveries and regional motorway corridors", "mobile coverage, low-emission access, workplace policies and secure fleet-data handling"],
  ["paris", "Paris", "france", "France", ["Central Paris", "La Défense", "Rungis", "Roissy"], "dense central deliveries, business districts, wholesale logistics and airport-linked service routes", "French workplace rules, GDPR responsibilities, restricted-zone planning and installation standards"],
  ["lyon", "Lyon", "france", "France", ["Presqu'île", "Part-Dieu", "Saint-Priest", "Villeurbanne"], "city-centre operations, commercial districts, industrial estates and Rhône corridor distribution routes", "French data obligations, urban access policies, driver notices and cross-region connectivity"],
  ["marseille", "Marseille", "france", "France", ["Old Port", "Fos-sur-Mer", "Marignane", "Aubagne"], "urban service zones, port and petrochemical logistics, airport routes and Mediterranean freight corridors", "port environments, network coverage, GDPR requirements and durable device installation"],
  ["toulouse", "Toulouse", "france", "France", ["City Centre", "Blagnac", "Colomiers", "Montaudran"], "central routes, aerospace districts, airport activity and regional service territories", "industrial-site procedures, French workplace requirements, carrier coverage and reporting access"],
  ["lille", "Lille", "france", "France", ["Euralille", "Lesquin", "Roubaix", "Tourcoing"], "metropolitan deliveries, airport logistics, industrial communities and cross-border Benelux corridors", "international roaming, GDPR compliance, employee policies and route-specific network performance"],
  ["amsterdam", "Amsterdam", "netherlands", "Netherlands", ["Centrum", "Westpoort", "Schiphol", "Zuidoost"], "compact urban routes, port-related activity, airport logistics and regional service networks", "Dutch privacy and workplace duties, environmental-zone workflows, installation and roaming needs"],
  ["rotterdam", "Rotterdam", "netherlands", "Netherlands", ["Port of Rotterdam", "Europoort", "Spaanse Polder", "Dordrecht"], "major port terminals, industrial estates, urban distribution and European freight corridors", "port conditions, cross-border connectivity, GDPR responsibilities and device installation quality"],
  ["the-hague", "The Hague", "netherlands", "Netherlands", ["Centrum", "Binckhorst", "Scheveningen", "Zoetermeer"], "government and business districts, coastal service routes, commercial zones and regional connections", "Dutch workforce policies, privacy compliance, urban route restrictions and secure data access"],
  ["utrecht", "Utrecht", "netherlands", "Netherlands", ["City Centre", "Lage Weide", "Nieuwegein", "Amersfoort"], "central Dutch distribution routes, industrial estates, city services and national motorway links", "coverage across regional corridors, GDPR duties, employee communication and installation responsibility"],
  ["eindhoven", "Eindhoven", "netherlands", "Netherlands", ["City Centre", "Strijp-S", "Veldhoven", "Helmond"], "technology campuses, manufacturing areas, urban deliveries and cross-border regional routes", "industrial access, Dutch privacy requirements, roaming arrangements and fleet support ownership"],
  ["dubai", "Dubai", "uae", "United Arab Emirates", ["Deira", "Jebel Ali", "Dubai South", "Al Quoz"], "high-density commercial districts, port and free-zone logistics, airport corridors and inter-emirate routes", "UAE device and SIM compatibility, operating permissions, heat-resistant fitting and data policies"],
  ["abu-dhabi", "Abu Dhabi", "uae", "United Arab Emirates", ["Mussafah", "Khalifa City", "Yas Island", "Al Reem Island"], "government and commercial districts, industrial zones, island routes and long inter-emirate journeys", "network coverage, local operating requirements, installation standards and fleet-data access controls"],
  ["sharjah", "Sharjah", "uae", "United Arab Emirates", ["Industrial Area", "Al Nahda", "Hamriyah", "Al Sajaa"], "dense commuter routes, industrial districts, free-zone logistics and connections toward Dubai and the northern emirates", "cross-emirate coverage, SIM provisioning, device certification and driver communication"],
  ["ajman", "Ajman", "uae", "United Arab Emirates", ["Al Jurf", "Ajman Industrial", "Al Nuaimiya", "Al Zorah"], "compact urban deliveries, industrial activity, coastal routes and daily inter-emirate service journeys", "carrier performance, compatible hardware, local requirements and reliable professional installation"],
  ["ras-al-khaimah", "Ras Al Khaimah", "uae", "United Arab Emirates", ["Al Nakheel", "Al Hamra", "Al Ghail", "Mina Al Arab"], "city operations, industrial zones, tourism routes and longer movements across the northern emirates", "coverage beyond urban centres, environmental conditions, SIM plans and technical support arrangements"],
  ["riyadh", "Riyadh", "saudi-arabia", "Saudi Arabia", ["Olaya", "Al Sulay", "King Abdullah Financial District", "Second Industrial City"], "large metropolitan service territories, warehouse districts, construction sites and long highway routes", "Saudi network and device requirements, driver policies, installation capacity and data retention"],
  ["jeddah", "Jeddah", "saudi-arabia", "Saudi Arabia", ["Al Balad", "Jeddah Islamic Port", "Al Khomrah", "King Abdulaziz Airport"], "dense urban routes, port freight, southern logistics districts and airport-linked commercial journeys", "coastal operating conditions, device certification, SIM coverage and local fleet procedures"],
  ["dammam", "Dammam", "saudi-arabia", "Saudi Arabia", ["Dammam Industrial Area", "King Abdulaziz Port", "Khobar", "Dhahran"], "Eastern Province cities, port movements, energy-sector sites and regional freight corridors", "industrial-site access, long-route coverage, compatible equipment and alert escalation ownership"],
  ["mecca", "Mecca", "saudi-arabia", "Saudi Arabia", ["Al Aziziyah", "Al Awali", "Al Kakiyyah", "Jabal Al Noor"], "busy urban roads, scheduled transport operations, service districts and routes with changing seasonal demand", "local access requirements, peak-period capacity, network performance and authorized data use"],
  ["medina", "Medina", "saudi-arabia", "Saudi Arabia", ["Central Area", "Qurban", "Al Khalidiyyah", "Medina Industrial City"], "central service routes, industrial activity, airport connections and regional highway journeys", "operating-zone requirements, cellular coverage, device installation and driver communication processes"],
  ["doha", "Doha", "qatar", "Qatar", ["West Bay", "Industrial Area", "Old Airport", "Ras Abu Aboud"], "central business districts, industrial routes, airport approaches and scheduled commercial services", "Qatar network compatibility, operating permissions, installation responsibility and data handling"],
  ["al-rayyan", "Al Rayyan", "qatar", "Qatar", ["Education City", "Al Waab", "Aspire Zone", "Muaither"], "education and sports districts, residential service routes, commercial zones and connections into Doha", "coverage across operating areas, device compatibility, local requirements and alert workflows"],
  ["al-wakrah", "Al Wakrah", "qatar", "Qatar", ["Al Wukair", "Ezdan Oasis", "Mesaieed Road", "Al Wakrah Port"], "growing residential areas, coastal services, port routes and southern industrial connections", "regional coverage, device fitting, operating permissions and support for longer southern routes"],
  ["ras-laffan", "Ras Laffan", "qatar", "Qatar", ["Ras Laffan Industrial City", "Port Area", "North Field Support Zone", "Al Khor Road"], "energy facilities, port terminals, controlled industrial routes and workforce transportation corridors", "industrial access rules, rugged installation, network availability and authorized alert management"],
  ["mesaieed", "Mesaieed", "qatar", "Qatar", ["Mesaieed Industrial City", "Mesaieed Port", "Sealine Road", "Umm Said"], "industrial plants, port logistics, coastal routes and long-distance connections toward Doha", "site permissions, environmental conditions, compatible networks and device maintenance ownership"],
  ["muscat", "Muscat", "oman", "Oman", ["Ruwi", "Ghala", "Rusayl", "Seeb"], "commercial districts, industrial estates, airport routes and coastal highway service operations", "Oman network and SIM compatibility, heat-resistant fitting, route coverage and local procedures"],
  ["sohar", "Sohar", "oman", "Oman", ["Sohar Port", "Freezone Sohar", "Falaj Al Qabail", "Liwa"], "port terminals, free-zone businesses, industrial plants and freight routes toward Muscat and the UAE", "cross-border roaming, industrial access, device durability and installation support"],
  ["salalah", "Salalah", "oman", "Oman", ["Salalah Port", "Raysut", "Awqad", "Thumrait"], "port logistics, industrial areas, urban services and long regional routes across Dhofar", "seasonal weather, remote-route coverage, compatible SIM plans and maintenance arrangements"],
  ["duqm", "Duqm", "oman", "Oman", ["Port of Duqm", "Special Economic Zone", "Haima Road", "Dry Dock Area"], "port construction, special-zone industry, dry-dock operations and remote highway journeys", "remote network availability, rugged hardware, environmental installation standards and support response"],
  ["nizwa", "Nizwa", "oman", "Oman", ["Nizwa Industrial Estate", "Birkat Al Mouz", "Adam Road", "Bahla Road"], "regional commerce, industrial-estate routes, service journeys and inland highway connections", "coverage across interior routes, device compatibility, installation quality and SIM provisioning"],
  ["kuwait-city", "Kuwait City", "kuwait", "Kuwait", ["Sharq", "Shuwaikh", "Al Rai", "Kuwait Free Trade Zone"], "central commercial districts, port-linked routes, warehouse areas and metropolitan service operations", "Kuwait network support, device compatibility, heat-resistant fitting and local data procedures"],
  ["al-ahmadi", "Al Ahmadi", "kuwait", "Kuwait", ["Ahmadi Industrial Area", "Mina Al Ahmadi", "Fahaheel", "Mangaf"], "energy-sector sites, industrial roads, coastal logistics and employee transport routes", "industrial permissions, environmental conditions, reliable coverage and alert escalation processes"],
  ["farwaniya", "Farwaniya", "kuwait", "Kuwait", ["Farwaniya Industrial Area", "Kuwait Airport", "Jleeb Al-Shuyoukh", "Ardiya"], "airport logistics, dense commercial routes, warehouse districts and metropolitan deliveries", "airport and industrial workflows, SIM performance, professional installation and data access"],
  ["hawally", "Hawally", "kuwait", "Kuwait", ["Hawally District", "Salmiya", "Jabriya", "Bayan"], "dense residential services, retail deliveries, coastal commercial routes and scheduled field visits", "urban coverage, driver policies, device placement and authorized location-data handling"],
  ["shuwaikh", "Shuwaikh", "kuwait", "Kuwait", ["Shuwaikh Industrial", "Shuwaikh Port", "Shuwaikh Free Trade Zone", "Al Rai"], "port freight, industrial workshops, wholesale markets and high-volume warehouse movements", "port and industrial conditions, hardware durability, network coverage and installation responsibility"],
  ["manama", "Manama", "bahrain", "Bahrain", ["Diplomatic Area", "Seef", "Salmaniya", "Bahrain Bay"], "central business districts, retail and service routes, waterfront developments and island-wide journeys", "Bahrain network compatibility, local policies, device installation and secure data access"],
  ["muharraq", "Muharraq", "bahrain", "Bahrain", ["Bahrain International Airport", "Hidd", "Amwaj Islands", "Galali"], "airport logistics, port connections, residential services and routes across the northern islands", "airport operating procedures, SIM coverage, installation requirements and fleet alert ownership"],
  ["riffa", "Riffa", "bahrain", "Bahrain", ["East Riffa", "West Riffa", "Riffa Industrial Area", "Isa Town"], "urban service areas, industrial routes, commercial districts and connections toward Manama", "network coverage, device compatibility, workforce procedures and platform support arrangements"],
  ["sitra", "Sitra", "bahrain", "Bahrain", ["Sitra Industrial Area", "Sitra Wharf", "Ma'ameer", "Nabih Saleh"], "industrial plants, wharf operations, energy logistics and short inter-island commercial routes", "industrial access, environmental installation needs, reliable connectivity and data responsibilities"],
  ["hidd", "Hidd", "bahrain", "Bahrain", ["Bahrain Logistics Zone", "Khalifa Bin Salman Port", "Hidd Industrial Area", "Arad"], "port terminals, logistics parks, industrial estates and airport-linked freight routes", "port workflows, device durability, local network compatibility and support response procedures"],
  ["jurong", "Jurong", "singapore", "Singapore", ["Jurong Industrial Estate", "Jurong Port", "Tuas Link", "Jurong Innovation District"], "industrial estates, port freight, technology facilities and scheduled western-region routes", "Singapore regulatory duties, port access, supported networks and secure fleet-data handling"],
  ["tuas", "Tuas", "singapore", "Singapore", ["Tuas Port", "Tuas South", "Tuas Biomedical Park", "Tuas View"], "major port operations, industrial plants, logistics facilities and cross-island freight journeys", "port and site permissions, device installation, network coverage and data governance"],
  ["changi", "Changi", "singapore", "Singapore", ["Changi Airport", "Changi Business Park", "Loyang", "Tampines Logistics Park"], "airport cargo, business parks, aerospace services and eastern commercial delivery routes", "airport procedures, Singapore privacy rules, compatible connectivity and alert access controls"],
  ["woodlands", "Woodlands", "singapore", "Singapore", ["Woodlands Regional Centre", "Senoko", "Admiralty", "Marsiling"], "northern commercial districts, industrial facilities, residential services and cross-border approaches", "border-route operations, roaming needs, local network coverage and authorized data use"],
  ["tampines", "Tampines", "singapore", "Singapore", ["Tampines Regional Centre", "Tampines North", "Changi South", "Pasir Ris"], "regional business districts, residential deliveries, airport-support zones and eastern service routes", "urban operating requirements, device fitting, data protection and dispatch alert workflows"],
  ["kuala-lumpur", "Kuala Lumpur", "malaysia", "Malaysia", ["City Centre", "Bukit Bintang", "Sungai Besi", "Kepong"], "dense commercial districts, urban deliveries, industrial routes and Greater Kuala Lumpur journeys", "Malaysian network coverage, device compatibility, local data duties and installation support"],
  ["selangor", "Selangor", "malaysia", "Malaysia", ["Shah Alam", "Petaling Jaya", "Puchong", "Subang Jaya"], "large metropolitan service territories, manufacturing zones, warehouse clusters and highway corridors", "multi-carrier coverage, regional route needs, professional fitting and workforce procedures"],
  ["johor-bahru", "Johor Bahru", "malaysia", "Malaysia", ["Pasir Gudang", "Tanjung Pelepas", "Skudai", "Iskandar Puteri"], "port logistics, industrial districts, cross-border approaches and southern regional distribution routes", "Malaysia-Singapore roaming, port access, device certification and data handling responsibilities"],
  ["penang", "Penang", "malaysia", "Malaysia", ["George Town", "Bayan Lepas", "Perai", "Batu Kawan"], "island deliveries, manufacturing hubs, bridge crossings and mainland logistics corridors", "cross-island coverage, industrial requirements, SIM compatibility and installation quality"],
  ["port-klang", "Port Klang", "malaysia", "Malaysia", ["Northport", "Westports", "Pulau Indah", "Klang Industrial Area"], "container terminals, free zones, warehouse districts and routes across the Klang Valley", "port permissions, rugged equipment, reliable network performance and alert escalation ownership"],
];

export const internationalCities: InternationalCitySeo[] = [
  ...initialInternationalCities,
  ...expansionCitySeeds.map(
    ([slug, name, countrySlug, countryName, areas, routeProfile, planningFocus]) =>
      createInternationalCity({
        slug,
        name,
        countrySlug,
        countryName,
        areas,
        routeProfile,
        planningFocus,
      }),
  ),
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
