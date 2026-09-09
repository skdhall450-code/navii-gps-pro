export type IndiaStateSeo = {
  slug: string;
  name: string;
  capital: string;
  cities: string[];
  sectors: string[];
  region: "South India" | "North India" | "West India" | "East India" | "Central India" | "Northeast India";
  southPriority?: boolean;
};

export const indiaStates: IndiaStateSeo[] = [
  { slug: "andhra-pradesh", name: "Andhra Pradesh", capital: "Amaravati", cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"], sectors: ["port logistics", "aquaculture transport", "intercity passenger fleets"], region: "South India", southPriority: true },
  { slug: "karnataka", name: "Karnataka", capital: "Bengaluru", cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"], sectors: ["technology services fleets", "urban delivery", "interstate logistics"], region: "South India", southPriority: true },
  { slug: "kerala", name: "Kerala", capital: "Thiruvananthapuram", cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"], sectors: ["tourism transport", "cold-chain distribution", "school and staff transport"], region: "South India", southPriority: true },
  { slug: "tamil-nadu", name: "Tamil Nadu", capital: "Chennai", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"], sectors: ["manufacturing logistics", "commercial transport", "employee transportation"], region: "South India", southPriority: true },
  { slug: "telangana", name: "Telangana", capital: "Hyderabad", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"], sectors: ["e-commerce delivery", "pharma logistics", "urban commercial fleets"], region: "South India", southPriority: true },
  { slug: "arunachal-pradesh", name: "Arunachal Pradesh", capital: "Itanagar", cities: ["Itanagar", "Naharlagun", "Pasighat", "Tawang"], sectors: ["remote-route transport", "construction fleets", "institutional vehicles"], region: "Northeast India" },
  { slug: "assam", name: "Assam", capital: "Dispur", cities: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur"], sectors: ["tea logistics", "regional distribution", "passenger transport"], region: "Northeast India" },
  { slug: "bihar", name: "Bihar", capital: "Patna", cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"], sectors: ["goods transport", "school transport", "regional distribution"], region: "East India" },
  { slug: "chhattisgarh", name: "Chhattisgarh", capital: "Raipur", cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"], sectors: ["mining support fleets", "industrial logistics", "construction vehicles"], region: "Central India" },
  { slug: "goa", name: "Goa", capital: "Panaji", cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"], sectors: ["tourism transport", "rental fleets", "hospitality logistics"], region: "West India" },
  { slug: "gujarat", name: "Gujarat", capital: "Gandhinagar", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"], sectors: ["industrial logistics", "port-linked transport", "commercial distribution"], region: "West India" },
  { slug: "haryana", name: "Haryana", capital: "Chandigarh", cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar"], sectors: ["corporate fleets", "manufacturing logistics", "NCR distribution"], region: "North India" },
  { slug: "himachal-pradesh", name: "Himachal Pradesh", capital: "Shimla", cities: ["Shimla", "Solan", "Dharamshala", "Mandi", "Baddi"], sectors: ["hill-route transport", "pharma logistics", "tourism vehicles"], region: "North India" },
  { slug: "jharkhand", name: "Jharkhand", capital: "Ranchi", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"], sectors: ["mining fleets", "industrial transport", "regional logistics"], region: "East India" },
  { slug: "madhya-pradesh", name: "Madhya Pradesh", capital: "Bhopal", cities: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"], sectors: ["central distribution", "agri-logistics", "commercial transport"], region: "Central India" },
  { slug: "maharashtra", name: "Maharashtra", capital: "Mumbai", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Chhatrapati Sambhajinagar"], sectors: ["urban logistics", "industrial fleets", "last-mile delivery"], region: "West India" },
  { slug: "manipur", name: "Manipur", capital: "Imphal", cities: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"], sectors: ["regional goods transport", "institutional fleets", "passenger vehicles"], region: "Northeast India" },
  { slug: "meghalaya", name: "Meghalaya", capital: "Shillong", cities: ["Shillong", "Tura", "Jowai", "Nongpoh"], sectors: ["hill-route transport", "tourism fleets", "regional distribution"], region: "Northeast India" },
  { slug: "mizoram", name: "Mizoram", capital: "Aizawl", cities: ["Aizawl", "Lunglei", "Champhai", "Kolasib"], sectors: ["remote-route logistics", "passenger transport", "institutional vehicles"], region: "Northeast India" },
  { slug: "nagaland", name: "Nagaland", capital: "Kohima", cities: ["Dimapur", "Kohima", "Mokokchung", "Wokha"], sectors: ["regional logistics", "commercial transport", "institutional fleets"], region: "Northeast India" },
  { slug: "odisha", name: "Odisha", capital: "Bhubaneswar", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur"], sectors: ["mineral transport", "port logistics", "industrial fleets"], region: "East India" },
  { slug: "punjab", name: "Punjab", capital: "Chandigarh", cities: ["Ludhiana", "Amritsar", "Jalandhar", "Mohali", "Dera Bassi"], sectors: ["goods transport", "agri-logistics", "school and commercial fleets"], region: "North India" },
  { slug: "rajasthan", name: "Rajasthan", capital: "Jaipur", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"], sectors: ["long-haul transport", "tourism fleets", "mining logistics"], region: "North India" },
  { slug: "sikkim", name: "Sikkim", capital: "Gangtok", cities: ["Gangtok", "Namchi", "Gyalshing", "Mangan"], sectors: ["hill-route transport", "tourism vehicles", "institutional fleets"], region: "Northeast India" },
  { slug: "uttar-pradesh", name: "Uttar Pradesh", capital: "Lucknow", cities: ["Lucknow", "Noida", "Kanpur", "Ghaziabad", "Varanasi"], sectors: ["large-scale distribution", "school transport", "commercial logistics"], region: "North India" },
  { slug: "uttarakhand", name: "Uttarakhand", capital: "Dehradun", cities: ["Dehradun", "Haridwar", "Haldwani", "Rudrapur", "Roorkee"], sectors: ["industrial transport", "hill-route fleets", "tourism vehicles"], region: "North India" },
  { slug: "west-bengal", name: "West Bengal", capital: "Kolkata", cities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"], sectors: ["port and warehouse logistics", "regional distribution", "commercial fleets"], region: "East India" },
  { slug: "tripura", name: "Tripura", capital: "Agartala", cities: ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar"], sectors: ["regional distribution", "institutional transport", "commercial vehicles"], region: "Northeast India" },
];

export const southIndiaStates = indiaStates.filter((state) => state.southPriority);

export function getIndiaState(slug: string) {
  return indiaStates.find((state) => state.slug === slug);
}
