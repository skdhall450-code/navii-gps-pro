import type { Metadata } from "next";
import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";

export type RajasthanDistrictSeo = { slug: string; name: string; region: string; cities: string[]; sectors: string[]; localContext: string; planningNote: string; sourceUrl: string };
type Seed = [string, string, string[], string];

// Division labels follow the official Board of Revenue inventory and organise navigation.
const regionSeeds: { region: string; sectors: string[]; districts: Seed[] }[] = [
  { region: "Ajmer Division", sectors: ["manufacturing and regional logistics","tourism and passenger transport","agricultural and market distribution"], districts: [
    ["ajmer","Ajmer",["Ajmer","Kishangarh","Nasirabad","Kekri"],"tourism, education, marble trade and central Rajasthan distribution routes"],
    ["bhilwara","Bhilwara",["Bhilwara","Shahpura","Mandal","Jahazpur"],"textile, mineral, agricultural and industrial freight operations"],
    ["beawar","Beawar",["Beawar","Masuda","Raipur","Jaitaran"],"cement, mineral, market and Ajmer-Pali corridor traffic"],
    ["didwana-kuchaman","Didwana-Kuchaman",["Didwana","Kuchaman City","Makrana","Ladnun"],"salt, marble, agricultural and Jaipur-Jodhpur corridor logistics"],
    ["nagaur","Nagaur",["Nagaur","Merta City","Parbatsar","Jayal"],"agricultural, livestock, mineral and regional market movement"],
    ["tonk","Tonk",["Tonk","Niwai","Malpura","Deoli"],"agricultural, textile, highway and regional passenger operations"],
  ]},
  { region: "Bikaner Division", sectors: ["agricultural and food logistics","border and interstate freight","industrial and passenger fleets"], districts: [
    ["bikaner","Bikaner",["Bikaner","Nokha","Kolayat","Lunkaransar"],"food processing, wool, tourism and desert-region distribution"],
    ["churu","Churu",["Churu","Ratangarh","Sujangarh","Taranagar"],"agricultural trade, passenger, market and Haryana-linked routes"],
    ["hanumangarh","Hanumangarh",["Hanumangarh","Sangaria","Pilibanga","Rawatsar"],"canal agriculture, food-grain, cotton and Punjab-border logistics"],
    ["sri-ganganagar","Sri Ganganagar",["Sri Ganganagar","Anupgarh","Suratgarh","Raisinghnagar"],"agricultural, food-processing, border and interstate freight movement"],
  ]},
  { region: "Bharatpur Division", sectors: ["tourism and passenger transport","agricultural distribution","Delhi-Agra corridor fleets"], districts: [
    ["bharatpur","Bharatpur",["Bharatpur","Bayana","Nadbai","Weir"],"tourism, stone, agriculture and Delhi-Agra corridor operations"],
    ["deeg","Deeg",["Deeg","Kaman","Nagar","Kumher"],"tourism, dairy, agricultural and Haryana-Uttar Pradesh linked routes"],
    ["dholpur","Dholpur",["Dholpur","Bari","Rajakhera","Baseri"],"stone, agriculture, Chambal-region and interstate highway transport"],
    ["karauli","Karauli",["Karauli","Hindaun","Todabhim","Sapotra"],"stone, pilgrimage, agriculture and rural passenger journeys"],
    ["sawai-madhopur","Sawai Madhopur",["Sawai Madhopur","Gangapur City","Bamanwas","Chauth Ka Barwara"],"tourism, agriculture, rail-linked trade and regional passenger traffic"],
  ]},
  { region: "Jaipur Division", sectors: ["urban and industrial logistics","tourism and employee transport","interstate commercial fleets"], districts: [
    ["jaipur","Jaipur",["Jaipur","Chomu","Sanganer","Bagru"],"urban delivery, tourism, manufacturing and high-frequency commercial routes"],
    ["alwar","Alwar",["Alwar","Rajgarh","Ramgarh","Thanagazi"],"industrial, dairy, tourism and NCR-linked freight operations"],
    ["dausa","Dausa",["Dausa","Bandikui","Lalsot","Mahwa"],"agricultural, stone, highway and Jaipur-Agra corridor movement"],
    ["kotputli-behror","Kotputli-Behror",["Kotputli","Behror","Neemrana","Bansur"],"industrial-estate, warehouse and Delhi-Jaipur highway freight"],
    ["khairthal-tijara","Khairthal-Tijara",["Khairthal","Tijara","Bhiwadi","Tapukara"],"NCR manufacturing, automotive, warehouse and employee transport fleets"],
    ["jhunjhunu","Jhunjhunu",["Jhunjhunu","Pilani","Nawalgarh","Chirawa"],"education, tourism, agriculture and Haryana-linked commerce"],
    ["sikar","Sikar",["Sikar","Fatehpur","Neem Ka Thana","Sri Madhopur"],"education, agriculture, mining-support and Jaipur-Delhi corridor routes"],
  ]},
  { region: "Jodhpur Division", sectors: ["mineral and industrial freight","tourism and desert transport","agricultural and interstate logistics"], districts: [
    ["jodhpur","Jodhpur",["Jodhpur","Bilara","Pipar City","Osian"],"handicraft, tourism, industrial and western Rajasthan distribution"],
    ["barmer","Barmer",["Barmer","Baytu","Chohtan","Sheo"],"energy, mineral, border-area and long desert logistics"],
    ["balotra","Balotra",["Balotra","Pachpadra","Siwana","Samdari"],"textile, refinery-support, mineral and regional freight operations"],
    ["jaisalmer","Jaisalmer",["Jaisalmer","Pokaran","Fatehgarh","Sam"],"tourism, defence-support, renewable-energy and desert routes"],
    ["jalore","Jalore",["Jalore","Bhinmal","Sanchore","Raniwara"],"granite, agriculture, dairy and Gujarat-linked commercial transport"],
    ["pali","Pali",["Pali","Sojat","Marwar Junction","Sumerpur"],"textile, industrial, agriculture and Ahmedabad-Jodhpur corridor traffic"],
    ["phalodi","Phalodi",["Phalodi","Lohawat","Bap","Aau"],"salt, solar-energy, agriculture and remote desert service routes"],
    ["sirohi","Sirohi",["Sirohi","Abu Road","Mount Abu","Pindwara"],"tourism, marble, industrial and Gujarat-border passenger movement"],
  ]},
  { region: "Kota Division", sectors: ["industrial and project logistics","agricultural distribution","education and passenger transport"], districts: [
    ["kota","Kota",["Kota","Ramganj Mandi","Sangod","Itawa"],"education, industrial, stone and high-frequency passenger operations"],
    ["baran","Baran",["Baran","Anta","Chhabra","Shahbad"],"agriculture, power-sector, forest-edge and Madhya Pradesh linked routes"],
    ["bundi","Bundi",["Bundi","Lakheri","Keshoraipatan","Nainwa"],"cement, tourism, agriculture and Kota corridor traffic"],
    ["jhalawar","Jhalawar",["Jhalawar","Bhawani Mandi","Aklera","Pirawa"],"citrus, spice, agricultural and Madhya Pradesh border logistics"],
  ]},
  { region: "Udaipur Division", sectors: ["tourism and passenger transport","mineral and industrial logistics","tribal-area and agricultural services"], districts: [
    ["udaipur","Udaipur",["Udaipur","Gogunda","Kherwara","Mavli"],"tourism, marble, hospitality and Gujarat-linked commercial routes"],
    ["banswara","Banswara",["Banswara","Kushalgarh","Bagidora","Garhi"],"tribal-area services, agriculture, power and Madhya Pradesh-Gujarat routes"],
    ["chittorgarh","Chittorgarh",["Chittorgarh","Nimbahera","Bari Sadri","Kapasan"],"cement, mineral, tourism and highway freight operations"],
    ["dungarpur","Dungarpur",["Dungarpur","Sagwara","Aspur","Simalwara"],"tribal-area services, stone, agriculture and Gujarat-border traffic"],
    ["pratapgarh","Pratapgarh",["Pratapgarh","Chhoti Sadri","Arnod","Dhariawad"],"agriculture, forest-produce, rural distribution and interstate routes"],
    ["rajsamand","Rajsamand",["Rajsamand","Nathdwara","Deogarh","Amet"],"marble, pilgrimage, tourism and industrial freight movement"],
    ["salumbar","Salumbar",["Salumbar","Sarada","Semari","Lasadiya"],"tribal-area services, agriculture, rural passenger and project routes"],
  ]},
];

const officialSource = "https://dmrelief.rajasthan.gov.in/content/raj/dmr/en/plans/district-dm-plans.html";
export const rajasthanDistricts: RajasthanDistrictSeo[] = regionSeeds.flatMap(({ region, sectors, districts }) => districts.map(([slug, name, cities, profile]) => ({
  slug, name, region, cities, sectors, sourceUrl: officialSource,
  localContext: `${name} district in ${region} includes ${profile}. Compatible GPS devices and fleet software can support authorised teams reviewing reported location, trip history and supported alerts across these routes.`,
  planningNote: `Before deployment in ${name}, confirm vehicle and route requirements, device compatibility, network availability, professional installation, user permissions, data retention and ongoing NAVII GPS platform support.`,
})));

export function getRajasthanDistrict(slug: string) { return rajasthanDistricts.find((district) => district.slug === slug); }
export function generateRajasthanDistrictKeywords(district: RajasthanDistrictSeo) { return uniqueKeywords([
  `GPS tracker in ${district.name}`, `GPS tracker ${district.name} Rajasthan`, `vehicle tracking system ${district.name}`,
  `car GPS tracker ${district.name}`, `truck GPS tracking ${district.name}`, `fleet management software ${district.name}`,
  `commercial vehicle tracking ${district.name}`, `school bus GPS tracking ${district.name}`,
  `वाहन GPS ट्रैकर ${district.name}`, `जीपीएस ट्रैकर ${district.name}`,
  ...district.cities.flatMap((city) => [`GPS tracker ${city}`, `vehicle tracking system ${city}`]),
]); }
export function generateRajasthanDistrictMetadata(district: RajasthanDistrictSeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/rajasthan/${district.slug}`;
  const description = `GPS trackers and fleet management software in ${district.name} district, Rajasthan, including ${district.cities.slice(0, 3).join(", ")} and connected routes.`;
  return {
    title: `GPS Tracker in ${district.name} District, Rajasthan`, description,
    keywords: uniqueKeywords([...generateRajasthanDistrictKeywords(district), ...generateLocalKeywords(district.name, district.sectors)]),
    alternates: { canonical: url },
    openGraph: { title: `GPS Tracker in ${district.name} District, Rajasthan | NAVII GPS`, description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `GPS Tracker in ${district.name} District, Rajasthan | NAVII GPS`, description, images: ["/og-image.jpg"] },
  };
}

