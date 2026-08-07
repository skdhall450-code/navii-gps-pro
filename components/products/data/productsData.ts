export interface Product {
  id: number;
  slug: string;

  name: string;

  category: string;

  badge?: string;

  shortDescription: string;

  description: string;

  image: string;

  gallery: string[];

  features: string[];

  specifications: {
    label: string;
    value: string;
  }[];

  brochure: string;

  whatsapp: string;
}

export const products: Product[] = [
  {
    id: 1,

    slug: "g17-gps-tracker",

    name: "G17 GPS Tracker",

    category: "Vehicle GPS",

    badge: "BEST SELLER",

    shortDescription:
      "Advanced real-time vehicle tracking with ignition detection and remote engine control.",

    description:
      "The G17 GPS Tracker is designed for cars, trucks, buses and commercial fleets. It supports real-time tracking, route history, geo-fencing and intelligent alerts.",

    image: "/assets/products/g17/main.png",

    gallery: [
      "/assets/products/g17/main.png",
      "/assets/products/g17/1.png",
      "/assets/products/g17/2.png",
      "/assets/products/g17/3.png",
    ],

    features: [
      "Real-Time GPS Tracking",
      "ACC Detection",
      "Remote Fuel Cut",
      "Geo Fence",
      "Playback History",
      "Overspeed Alert",
      "Engine ON/OFF Alert",
      "Mobile App Support",
    ],

    specifications: [
      {
        label: "Network",
        value: "4G LTE",
      },
      {
        label: "GPS Accuracy",
        value: "<5 meters",
      },
      {
        label: "Power",
        value: "9V–90V",
      },
      {
        label: "Backup Battery",
        value: "180mAh",
      },
      {
        label: "Operating Temp",
        value: "-20°C to +70°C",
      },
    ],

    brochure: "/brochures/g17.pdf",

    whatsapp: "917717394007",
  },
];