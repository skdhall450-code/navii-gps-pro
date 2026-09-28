import type { Metadata } from "next";

import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type MadhyaPradeshDistrictSeo = {
  slug: string;
  name: string;
  region: string;
  cities: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
  sourceUrl: string;
};

type Seed = [slug: string, name: string, cities: string[], profile: string];

// Division labels organise navigation; the district inventory follows the current Government of Madhya Pradesh directory.
const regionSeeds: { region: string; sectors: string[]; districts: Seed[] }[] = [
  { region: "Bhopal Division", sectors: ["urban and industrial logistics", "agricultural distribution", "employee and passenger transport"], districts: [
    ["bhopal", "Bhopal", ["Bhopal", "Berasia", "Huzur", "Phanda"], "capital-region delivery, public-service, industrial and employee transport operations"],
    ["raisen", "Raisen", ["Raisen", "Mandideep", "Obedullaganj", "Begumganj"], "industrial-estate, tourism, agricultural and Bhopal corridor fleet movement"],
    ["rajgarh", "Rajgarh", ["Rajgarh", "Biaora", "Narsinghgarh", "Sarangpur"], "agricultural markets, highway freight, rural distribution and passenger routes"],
    ["sehore", "Sehore", ["Sehore", "Ashta", "Budhni", "Ichhawar"], "agriculture, industrial supply, highway and Narmada corridor operations"],
    ["vidisha", "Vidisha", ["Vidisha", "Basoda", "Sironj", "Kurwai"], "agricultural trade, tourism, rural distribution and Bhopal-linked routes"],
  ]},
  { region: "Chambal Division", sectors: ["agricultural and market logistics", "interstate freight", "rural passenger fleets"], districts: [
    ["bhind", "Bhind", ["Bhind", "Gohad", "Lahar", "Mehgaon"], "agricultural, dairy, market and Uttar Pradesh border transport"],
    ["morena", "Morena", ["Morena", "Ambah", "Joura", "Sabalgarh"], "agriculture, stone, highway freight and Gwalior-Agra corridor movement"],
    ["sheopur", "Sheopur", ["Sheopur", "Vijaypur", "Karahal", "Baroda"], "agricultural, forest-edge, rural service and Rajasthan-linked routes"],
  ]},
  { region: "Gwalior Division", sectors: ["urban and industrial logistics", "agricultural distribution", "tourism and passenger transport"], districts: [
    ["ashoknagar", "Ashoknagar", ["Ashoknagar", "Chanderi", "Mungaoli", "Isagarh"], "textile, tourism, agricultural and regional market operations"],
    ["datia", "Datia", ["Datia", "Bhander", "Seondha", "Indergarh"], "pilgrimage, agriculture, passenger and Jhansi-Gwalior corridor traffic"],
    ["guna", "Guna", ["Guna", "Raghogarh", "Aron", "Chachoda"], "industrial, agricultural, highway and Rajasthan-linked freight routes"],
    ["gwalior", "Gwalior", ["Gwalior", "Dabra", "Bhitarwar", "Morar"], "urban delivery, tourism, manufacturing and interstate commercial fleets"],
    ["shivpuri", "Shivpuri", ["Shivpuri", "Karera", "Pichhore", "Kolaras"], "tourism, agriculture, highway and regional passenger operations"],
  ]},
  { region: "Indore Division", sectors: ["industrial and commercial logistics", "agricultural distribution", "interstate fleet operations"], districts: [
    ["alirajpur", "Alirajpur", ["Alirajpur", "Jobat", "Chandrashekhar Azad Nagar", "Sondwa"], "tribal-area services, agriculture, rural distribution and Gujarat-linked routes"],
    ["barwani", "Barwani", ["Barwani", "Sendhwa", "Rajpur", "Anjad"], "agriculture, highway freight, rural services and Maharashtra-border transport"],
    ["burhanpur", "Burhanpur", ["Burhanpur", "Nepanagar", "Khaknar", "Shahpur"], "textile, banana trade, industrial and Maharashtra-linked freight operations"],
    ["dhar", "Dhar", ["Dhar", "Pithampur", "Manawar", "Badnawar"], "automotive, industrial-estate, agricultural and highway fleet movement"],
    ["indore", "Indore", ["Indore", "Mhow", "Sanwer", "Depalpur"], "urban delivery, warehousing, manufacturing and high-frequency commercial routes"],
    ["jhabua", "Jhabua", ["Jhabua", "Petlawad", "Thandla", "Ranapur"], "tribal-area services, agriculture, market distribution and Gujarat-border traffic"],
    ["khandwa", "Khandwa", ["Khandwa", "Pandhana", "Punasa", "Harsud"], "agriculture, power-sector, pilgrimage and central India freight operations"],
    ["khargone", "Khargone", ["Khargone", "Maheshwar", "Kasrawad", "Barwaha"], "cotton, tourism, agricultural trade and Indore-Maharashtra corridor routes"],
  ]},
  { region: "Jabalpur Division", sectors: ["industrial and mineral logistics", "agricultural and forest-produce distribution", "tourism and passenger transport"], districts: [
    ["balaghat", "Balaghat", ["Balaghat", "Baihar", "Waraseoni", "Katangi"], "mineral, forest-produce, agriculture and Maharashtra-border transport"],
    ["chhindwara", "Chhindwara", ["Chhindwara", "Parasia", "Amarwara", "Harrai"], "mining-support, agriculture, industrial and Satpura-region fleet operations"],
    ["dindori", "Dindori", ["Dindori", "Shahpura", "Bajag", "Karanjia"], "forest-produce, tribal-area services, agriculture and rural passenger routes"],
    ["jabalpur", "Jabalpur", ["Jabalpur", "Sihora", "Patan", "Panagar"], "urban delivery, defence-support, industrial and regional distribution fleets"],
    ["katni", "Katni", ["Katni", "Vijayraghavgarh", "Barhi", "Bahoriband"], "cement, mineral, rail-linked trade and industrial freight movement"],
    ["mandla", "Mandla", ["Mandla", "Nainpur", "Bichhiya", "Niwas"], "tourism, forest-area services, agriculture and rural passenger operations"],
    ["narsinghpur", "Narsinghpur", ["Narsinghpur", "Gadarwara", "Kareli", "Gotegaon"], "agriculture, sugar, highway freight and Narmada corridor logistics"],
    ["pandhurna", "Pandhurna", ["Pandhurna", "Sausar", "Lodhikheda", "Mohgaon"], "orange trade, industrial supply, agriculture and Maharashtra-border routes"],
    ["seoni", "Seoni", ["Seoni", "Lakhnadon", "Barghat", "Ghansaur"], "agriculture, forest-produce, highway and Nagpur-Jabalpur corridor traffic"],
  ]},
  { region: "Narmadapuram Division", sectors: ["agricultural and food logistics", "industrial freight", "tourism and passenger transport"], districts: [
    ["betul", "Betul", ["Betul", "Multai", "Amla", "Bhainsdehi"], "agriculture, mining-support, forest-produce and Maharashtra-linked routes"],
    ["harda", "Harda", ["Harda", "Timarni", "Khirkiya", "Handia"], "grain, agricultural inputs, highway freight and rural distribution operations"],
    ["narmadapuram", "Narmadapuram", ["Narmadapuram", "Itarsi", "Pipariya", "Sohagpur"], "rail-linked logistics, tourism, agriculture and central corridor fleets"],
  ]},
  { region: "Rewa Division", sectors: ["mineral and energy logistics", "agricultural distribution", "interstate passenger and freight fleets"], districts: [
    ["maihar", "Maihar", ["Maihar", "Amarpatan", "Ramnagar", "Sarla Nagar"], "cement, pilgrimage, mineral and Satna-Rewa corridor operations"],
    ["mauganj", "Mauganj", ["Mauganj", "Hanumana", "Naigarhi", "Devtalab"], "agriculture, rural services, market distribution and Uttar Pradesh-linked routes"],
    ["rewa", "Rewa", ["Rewa", "Teonthar", "Sirmour", "Gurh"], "urban delivery, agriculture, mineral and Uttar Pradesh corridor movement"],
    ["satna", "Satna", ["Satna", "Nagod", "Chitrakoot", "Majhgawan"], "cement, pilgrimage, industrial and interstate freight operations"],
    ["sidhi", "Sidhi", ["Sidhi", "Churhat", "Majhauli", "Sihawal"], "agriculture, energy-support, rural distribution and regional passenger routes"],
    ["singrauli", "Singrauli", ["Singrauli", "Waidhan", "Deosar", "Chitrangi"], "coal, power-sector, heavy equipment and interstate project logistics"],
  ]},
  { region: "Sagar Division", sectors: ["agricultural and market logistics", "mineral and industrial freight", "tourism and passenger transport"], districts: [
    ["chhatarpur", "Chhatarpur", ["Chhatarpur", "Khajuraho", "Nowgong", "Bijawar"], "tourism, stone, agriculture and Uttar Pradesh-linked transport"],
    ["damoh", "Damoh", ["Damoh", "Hatta", "Patharia", "Tendukheda"], "cement, agriculture, rural distribution and regional freight movement"],
    ["niwari", "Niwari", ["Niwari", "Orchha", "Prithvipur", "Tarichar Kalan"], "tourism, agriculture, passenger and Jhansi-linked commercial routes"],
    ["panna", "Panna", ["Panna", "Pawai", "Ajaigarh", "Amanganj"], "diamond and stone support, tourism, agriculture and rural logistics"],
    ["sagar", "Sagar", ["Sagar", "Bina", "Khurai", "Rehli"], "education, industrial, rail-linked trade and regional distribution fleets"],
    ["tikamgarh", "Tikamgarh", ["Tikamgarh", "Jatara", "Palera", "Baldeogarh"], "agriculture, stone, rural services and Uttar Pradesh border traffic"],
  ]},
  { region: "Shahdol Division", sectors: ["mineral and project logistics", "forest-produce distribution", "rural passenger fleets"], districts: [
    ["anuppur", "Anuppur", ["Anuppur", "Kotma", "Jaithari", "Pushprajgarh"], "power-sector, coal, pilgrimage and Chhattisgarh-linked logistics"],
    ["shahdol", "Shahdol", ["Shahdol", "Beohari", "Jaisinghnagar", "Burhar"], "mining-support, forest-produce, agriculture and regional freight operations"],
    ["umaria", "Umaria", ["Umaria", "Bandhavgarh", "Manpur", "Pali"], "tourism, mining-support, forest-area services and passenger routes"],
  ]},
  { region: "Ujjain Division", sectors: ["industrial and agricultural logistics", "tourism and passenger transport", "interstate commercial fleets"], districts: [
    ["agar-malwa", "Agar-Malwa", ["Agar", "Susner", "Nalkheda", "Badod"], "agriculture, market distribution, pilgrimage and Rajasthan-linked routes"],
    ["dewas", "Dewas", ["Dewas", "Bagli", "Sonkatch", "Kannod"], "manufacturing, agriculture, warehousing and Indore-Bhopal corridor traffic"],
    ["mandsaur", "Mandsaur", ["Mandsaur", "Malhargarh", "Garoth", "Sitamau"], "agricultural produce, industrial supply and Rajasthan-border freight"],
    ["neemuch", "Neemuch", ["Neemuch", "Manasa", "Jawad", "Singoli"], "agricultural markets, cement-support and Rajasthan-linked logistics"],
    ["ratlam", "Ratlam", ["Ratlam", "Jaora", "Sailana", "Alot"], "rail-linked trade, agriculture, industrial and Gujarat-Rajasthan corridor fleets"],
    ["shajapur", "Shajapur", ["Shajapur", "Shujalpur", "Kalapipal", "Moman Badodia"], "agricultural trade, highway freight and regional market distribution"],
    ["ujjain", "Ujjain", ["Ujjain", "Nagda", "Mahidpur", "Badnagar"], "pilgrimage, industrial, agricultural and passenger fleet operations"],
  ]},
];

const officialSource = "https://ceoelection.mp.gov.in/DistrictWebsiteLink.aspx";

export const madhyaPradeshDistricts: MadhyaPradeshDistrictSeo[] = regionSeeds.flatMap(({ region, sectors, districts }) =>
  districts.map(([slug, name, cities, profile]) => ({
    slug,
    name,
    region,
    cities,
    sectors,
    sourceUrl: officialSource,
    localContext: `${name} district in ${region} includes ${profile}. Compatible GPS devices and fleet software can support authorised teams reviewing reported location, trip history and supported alerts across these routes.`,
    planningNote: `Before deployment in ${name}, confirm vehicle and route requirements, device compatibility, network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.`,
  })),
);

export function getMadhyaPradeshDistrict(slug: string) {
  return madhyaPradeshDistricts.find((district) => district.slug === slug);
}

export function generateMadhyaPradeshDistrictKeywords(district: MadhyaPradeshDistrictSeo) {
  return uniqueKeywords([
    `GPS tracker in ${district.name}`,
    `GPS tracker ${district.name} Madhya Pradesh`,
    `vehicle tracking system ${district.name}`,
    `car GPS tracker ${district.name}`,
    `truck GPS tracking ${district.name}`,
    `fleet management software ${district.name}`,
    `commercial vehicle tracking ${district.name}`,
    `school bus GPS tracking ${district.name}`,
    `वाहन GPS ट्रैकर ${district.name}`,
    `जीपीएस ट्रैकर ${district.name}`,
    ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`]),
  ]);
}

export function generateMadhyaPradeshDistrictMetadata(district: MadhyaPradeshDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/madhya-pradesh/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Madhya Pradesh, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`;
  return {
    title: `GPS Tracker in ${district.name} District, Madhya Pradesh`,
    description,
    keywords: uniqueKeywords([...generateMadhyaPradeshDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]),
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${district.name} District, Madhya Pradesh | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Madhya Pradesh | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}
