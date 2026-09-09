import { westIndiaCities } from "./westIndiaCities";

export type PriorityCitySeo = {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
  areas: string[];
  sectors: string[];
  localContext: string;
  planningNote?: string;
};

const existingCities: PriorityCitySeo[] = [
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    areas: ["Ambattur", "Guindy", "Sriperumbudur", "Oragadam", "Chengalpattu"],
    sectors: ["manufacturing logistics", "port-linked transport", "employee transportation", "urban delivery fleets"],
    localContext: "Chennai's industrial, port-linked and metropolitan transport operations need clear vehicle visibility across busy urban and regional routes.",
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    stateSlug: "karnataka",
    areas: ["Electronic City", "Whitefield", "Peenya", "Yelahanka", "Devanahalli"],
    sectors: ["technology company fleets", "employee transportation", "e-commerce delivery", "intercity logistics"],
    localContext: "Bengaluru fleets operate across technology corridors, industrial areas and rapidly growing delivery routes where central tracking supports daily coordination.",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    stateSlug: "telangana",
    areas: ["HITEC City", "Gachibowli", "Kukatpally", "Shamshabad", "Medchal"],
    sectors: ["pharma logistics", "technology company fleets", "airport-linked transport", "last-mile delivery"],
    localContext: "Hyderabad combines technology, pharmaceutical, airport and distribution corridors where connected vehicle tracking can improve fleet oversight.",
  },
  {
    slug: "kochi",
    name: "Kochi",
    state: "Kerala",
    stateSlug: "kerala",
    areas: ["Kakkanad", "Edappally", "Kalamassery", "Aluva", "Willington Island"],
    sectors: ["port-linked logistics", "tourism transport", "cold-chain distribution", "urban delivery fleets"],
    localContext: "Kochi combines port, commercial, tourism and metropolitan transport corridors where connected GPS tracking can support clearer vehicle and route visibility.",
  },
  {
    slug: "coimbatore",
    name: "Coimbatore",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    areas: ["Peelamedu", "Singanallur", "Ganapathy", "Saravanampatti", "Sulur"],
    sectors: ["textile logistics", "manufacturing transport", "employee transportation", "regional distribution"],
    localContext: "Coimbatore's manufacturing, textile and regional distribution operations use busy urban and intercity routes where central fleet visibility can support daily coordination.",
  },
  {
    slug: "visakhapatnam",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    stateSlug: "andhra-pradesh",
    areas: ["Gajuwaka", "Madhurawada", "Duvvada", "Parawada", "Anakapalle"],
    sectors: ["port-linked transport", "industrial logistics", "commercial distribution", "employee transportation"],
    localContext: "Visakhapatnam's port-linked, industrial and metropolitan routes create practical demand for centralized vehicle tracking and fleet-event visibility.",
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    stateSlug: "maharashtra",
    areas: ["Hinjawadi", "Pimpri-Chinchwad", "Chakan", "Talegaon", "Hadapsar"],
    sectors: ["automotive logistics", "technology company fleets", "employee transportation", "industrial distribution"],
    localContext: "Pune's automotive, technology and industrial corridors connect dense urban routes with major manufacturing clusters where centralized vehicle visibility supports fleet coordination.",
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    stateSlug: "maharashtra",
    areas: ["Andheri", "Navi Mumbai", "Thane", "Bhiwandi", "Panvel"],
    sectors: ["port-linked logistics", "last-mile delivery", "corporate fleets", "warehouse distribution"],
    localContext: "Mumbai's metropolitan, port, warehouse and last-mile corridors create demanding fleet operations where route and vehicle-event visibility can support daily control.",
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    stateSlug: "gujarat",
    areas: ["Sanand", "Naroda", "Changodar", "Vatva", "Sarkhej"],
    sectors: ["manufacturing logistics", "textile distribution", "commercial transport", "warehouse fleets"],
    localContext: "Ahmedabad connects industrial estates, manufacturing clusters and major distribution routes where connected GPS tracking can improve fleet and trip visibility.",
  },
];

const westSlugs = new Set(westIndiaCities.map((city) => city.slug));
export const priorityCities: PriorityCitySeo[] = [...existingCities.filter((city) => !westSlugs.has(city.slug)), ...westIndiaCities];
