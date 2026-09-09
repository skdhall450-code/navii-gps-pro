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
];
