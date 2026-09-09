export type InternationalCountrySeo = {
  slug: string;
  name: string;
  cities: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
};

export const internationalCountries: InternationalCountrySeo[] = [
  {
    slug: "uae",
    name: "United Arab Emirates",
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
];
