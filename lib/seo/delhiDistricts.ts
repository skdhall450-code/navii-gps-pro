import type { Metadata } from "next";

export type DelhiDistrictSeo = {
  slug: string;
  name: string;
  areas: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
};

type DelhiDistrictSeed = [
  slug: string,
  name: string,
  areas: string[],
  sectors: string[],
  routeProfile: string,
  planningFocus: string,
];

// Current 13-district structure follows the Delhi Revenue Department list updated in August 2026.
const delhiDistrictSeeds: DelhiDistrictSeed[] = [
  ["north", "North", ["Burari", "Badli", "Adarsh Nagar", "Alipur"], ["commercial delivery", "institutional fleets", "regional logistics"], "Burari residential and service routes, Adarsh Nagar market traffic, Badli commercial movements and northern connections toward Alipur and the wider NCR", "dense mixed traffic, urban-to-peripheral network coverage, installation responsibility and secure platform access"],
  ["central", "Central", ["Patel Nagar", "Karol Bagh", "Paharganj", "Rajinder Nagar"], ["market distribution", "tourism transport", "service fleets"], "Karol Bagh and Patel Nagar commerce, Paharganj hospitality vehicles, central-market deliveries and high-frequency routes through densely developed areas", "congested routes, parking and loading constraints, device placement, alert ownership and authorized tracking policies"],
  ["south", "South", ["Chhatarpur", "Malviya Nagar", "Mehrauli", "Deoli", "Saket"], ["corporate transport", "commercial delivery", "service vehicles"], "Saket and Malviya Nagar commercial services, Chhatarpur and Mehrauli routes, institutional fleets and southern connections toward Gurugram and Faridabad", "high-density traffic, underground parking, variable mobile coverage, installation quality and workforce privacy policies"],
  ["new-delhi", "New Delhi", ["New Delhi", "Delhi Cantt", "Connaught Place", "Chanakyapuri"], ["government fleets", "corporate transport", "tourism vehicles"], "Connaught Place business traffic, Chanakyapuri institutional movements, Delhi Cantt operations and central administrative and tourism routes", "restricted-route procedures, secure user roles, reliable device installation and compliant location-data handling"],
  ["south-west", "South West", ["Matiala", "Najafgarh", "Dwarka", "Bijwasan", "Kapashera"], ["airport logistics", "warehouse distribution", "commercial fleets"], "Dwarka urban fleets, Kapashera and Bijwasan airport-linked operations, Najafgarh routes and warehouse movements toward Gurugram and western Delhi", "airport and interstate routes, mixed urban-rural coverage, scalable installations and dependable alert workflows"],
  ["west", "West", ["Vikaspuri", "Rajouri Garden", "Janakpuri", "Punjabi Bagh", "Tilak Nagar"], ["retail distribution", "employee transport", "commercial delivery"], "Rajouri Garden and Tilak Nagar retail distribution, Janakpuri and Vikaspuri service fleets, employee transport and western-ring-road connections", "congested commercial streets, multi-stop routes, device compatibility, data retention and authorized team access"],
  ["north-east", "North East", ["Yamuna Vihar", "Gokalpuri", "Karawal Nagar", "Seelampur", "Nand Nagri"], ["local distribution", "service fleets", "institutional transport"], "Yamuna Vihar services, Seelampur commercial traffic, Karawal Nagar and Gokalpuri routes and cross-Yamuna movements toward Ghaziabad", "dense neighbourhood routes, cross-border network continuity, professional fitting and clear alert escalation"],
  ["east", "East", ["Gandhi Nagar", "Vishwas Nagar", "Patparganj", "Mayur Vihar", "Laxmi Nagar"], ["wholesale logistics", "commercial delivery", "employee transport"], "Gandhi Nagar wholesale movements, Patparganj industrial and warehouse traffic, Mayur Vihar and Laxmi Nagar services and NCR routes toward Noida", "high-volume market traffic, cross-border journeys, scalable fleet reporting and secure driver-location policies"],
  ["north-west", "North West", ["Rohini", "Kirari", "Nangloi Jat", "Kanjhawala", "Saraswati Vihar"], ["industrial logistics", "regional distribution", "commercial fleets"], "Rohini urban fleets, Kirari and Nangloi Jat commercial routes, Kanjhawala peripheral operations and movements toward Haryana", "urban-to-industrial coverage, long peripheral routes, rugged installation and SIM-network compatibility"],
  ["south-east", "South East", ["Kalkaji", "Jangpura", "Badarpur", "Lajpat Nagar", "Okhla"], ["industrial logistics", "commercial delivery", "corporate transport"], "Okhla industrial traffic, Lajpat Nagar and Kalkaji distribution, Jangpura services and Badarpur routes connecting Faridabad and Noida", "industrial-site requirements, interstate connectivity, traffic variability, professional installation and secure fleet access"],
  ["central-north", "Central North", ["Shakur Basti", "Shalimar Bagh", "Model Town", "Wazirpur"], ["industrial transport", "market distribution", "service fleets"], "Shalimar Bagh and Model Town services, Wazirpur industrial movements, Shakur Basti routes and connections across north-central Delhi", "new district operating boundaries, industrial fitting conditions, congested corridors and role-based platform access"],
  ["outer-north", "Outer North", ["Mundka", "Narela", "Bawana", "Pooth Khurd"], ["industrial logistics", "warehouse distribution", "interstate transport"], "Bawana and Narela industrial operations, Mundka warehousing, peripheral freight routes and interstate movements toward Haryana", "long industrial routes, peripheral mobile coverage, dust and heat exposure, compatible hardware and maintenance ownership"],
  ["old-delhi", "Old Delhi", ["Sadar Bazar", "Chandni Chowk", "Daryaganj", "Jama Masjid", "Kashmere Gate"], ["wholesale distribution", "tourism transport", "last-mile delivery"], "Sadar Bazar and Chandni Chowk wholesale traffic, Daryaganj services, tourism vehicles and last-mile movements through heritage commercial corridors", "narrow and congested roads, loading restrictions, compact device installation, route alerts and responsible data access"],
];

export const delhiDistricts: DelhiDistrictSeo[] = delhiDistrictSeeds.map(
  ([slug, name, areas, sectors, routeProfile, planningFocus]) => ({
    slug,
    name,
    areas,
    sectors,
    localContext: `${name} district fleet operations connect ${routeProfile}, where vehicle location, trip history and supported alerts can help authorized teams coordinate daily routes.`,
    planningNote: `Before deployment in ${name} district, confirm ${planningFocus}, device and SIM compatibility, installation responsibility, data retention and ongoing NAVII GPS platform support.`,
  }),
);

export function getDelhiDistrict(slug: string) {
  return delhiDistricts.find((district) => district.slug === slug);
}

export function generateDelhiDistrictKeywords(district: DelhiDistrictSeo) {
  return [...new Set([
    `GPS tracker in ${district.name} Delhi`,
    `GPS tracker ${district.name} district Delhi`,
    `vehicle tracking system ${district.name} Delhi`,
    `car GPS tracker ${district.name} Delhi`,
    `truck GPS tracking ${district.name} Delhi`,
    `fleet management software ${district.name} Delhi`,
    `commercial vehicle tracking ${district.name} Delhi`,
    `school bus GPS tracking ${district.name} Delhi`,
    ...district.areas.flatMap((area) => [
      `GPS tracker ${area}`,
      `vehicle tracking system ${area}`,
    ]),
  ])];
}

export function generateDelhiDistrictMetadata(district: DelhiDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/delhi/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Delhi, including ${district.areas.slice(0, 3).join(", ")} and nearby operating routes.`;

  return {
    title: `GPS Tracker in ${district.name} District, Delhi`,
    description,
    keywords: generateDelhiDistrictKeywords(district),
    alternates: { canonical: url },
    openGraph: {
      title: `GPS Tracker in ${district.name} District, Delhi | NAVII GPS`,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}
