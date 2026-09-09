export type PriorityCitySeo = {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
  areas: string[];
  sectors: string[];
  localContext: string;
};

export const priorityCities: PriorityCitySeo[] = [
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
];
