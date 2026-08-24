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

const salesWhatsApp = "917717394007";

export const products: Product[] = [
  {
    id: 1,
    slug: "g17-gps-tracker",
    name: "G17 GPS Tracker",
    category: "Vehicle GPS",
    badge: "GT06 COMPATIBLE",
    shortDescription:
      "Wired vehicle GPS tracker for live location, ignition status, route history and fleet alerts.",
    description:
      "The G17 GPS Tracker is designed for cars, trucks, buses and commercial fleets. It supports GT06-compatible communication, real-time vehicle tracking, route history, geofencing and configurable alerts through the NAVII GPS platform.",
    image: "/assets/products/g17/main.png",
    gallery: [
      "/assets/products/g17/main.png",
      "/assets/products/g17/1.png",
      "/assets/products/g17/2.png",
      "/assets/products/g17/3.png",
    ],
    features: [
      "Real-Time GPS Tracking",
      "GT06-Compatible Communication",
      "Ignition Status Monitoring",
      "Route History and Playback",
      "Geofence and Overspeed Alerts",
      "Mobile and Web Platform",
    ],
    specifications: [
      {
        label: "Protocol",
        value: "GT06 compatible",
      },
      {
        label: "Installation",
        value: "Wired vehicle installation",
      },
      {
        label: "Tracking",
        value: "Real-time GNSS location",
      },
      {
        label: "Application",
        value: "Cars and commercial fleets",
      },
      {
        label: "Platform",
        value: "NAVII GPS web and mobile platform",
      },
    ],
    brochure: "",
    whatsapp: salesWhatsApp,
  },
  {
    id: 2,
    slug: "gs900-4g-gps-tracker",
    name: "GS900 4G GPS Tracker",
    category: "Vehicle GPS",
    badge: "4G CONNECTIVITY",
    shortDescription:
      "4G vehicle tracking solution for live monitoring, fleet history and configurable alerts.",
    description:
      "The GS900 4G GPS Tracker is intended for connected vehicle and fleet monitoring. Available functions depend on the selected hardware configuration, installation and network coverage.",
    image: "/assets/products/gs900/main.png",
    gallery: [
      "/assets/products/gs900/main.png",
      "/assets/products/gs900/1.png",
      "/assets/products/gs900/2.png",
      "/assets/products/gs900/3.png",
    ],
    features: [
      "4G Mobile Connectivity",
      "Real-Time Vehicle Tracking",
      "Ignition Status Monitoring",
      "Route History and Playback",
      "Geofence and Fleet Alerts",
      "Mobile and Web Platform",
    ],
    specifications: [
      {
        label: "Network",
        value: "4G mobile network",
      },
      {
        label: "Installation",
        value: "Wired vehicle installation",
      },
      {
        label: "Tracking",
        value: "Real-time GNSS location",
      },
      {
        label: "Application",
        value: "Vehicle and fleet monitoring",
      },
      {
        label: "Features",
        value: "Configuration dependent",
      },
    ],
    brochure: "",
    whatsapp: salesWhatsApp,
  },
  {
    id: 3,
    slug: "bt50-vehicle-gps-tracker",
    name: "BT50 Vehicle GPS Tracker",
    category: "Vehicle GPS",
    badge: "9V-90V INPUT",
    shortDescription:
      "Wide-voltage wired GPS tracker designed for vehicle location and operational monitoring.",
    description:
      "The BT50 is a wired vehicle GPS tracker with a 9V-90V input range shown on the device label. Tracking functions and platform integration depend on the final device protocol and deployment configuration.",
    image: "/assets/products/bt50/main.png",
    gallery: [
      "/assets/products/bt50/main.png",
      "/assets/products/bt50/1.png",
      "/assets/products/bt50/2.png",
      "/assets/products/bt50/3.png",
    ],
    features: [
      "Real-Time Vehicle Location",
      "Wide Voltage Input",
      "Wired Vehicle Installation",
      "Route History Support",
      "Geofence and Fleet Alerts",
      "Web and Mobile Monitoring",
    ],
    specifications: [
      {
        label: "Model",
        value: "BT50",
      },
      {
        label: "Input Voltage",
        value: "9V-90V",
      },
      {
        label: "Installation",
        value: "Wired vehicle installation",
      },
      {
        label: "Application",
        value: "Vehicle tracking",
      },
      {
        label: "Integration",
        value: "Subject to protocol validation",
      },
    ],
    brochure: "",
    whatsapp: salesWhatsApp,
  },
  {
    id: 4,
    slug: "ev02-gps-tracker",
    name: "EV02 GPS Tracker",
    category: "Vehicle GPS",
    shortDescription:
      "Vehicle GPS tracking device for location monitoring, route history and fleet visibility.",
    description:
      "The EV02 GPS Tracker is suitable for vehicle and fleet tracking deployments. Supported functions depend on the selected device configuration, installation and integration requirements.",
    image: "/assets/products/EV02.png",
    gallery: ["/assets/products/EV02.png"],
    features: [
      "Real-Time Location Monitoring",
      "Route History and Playback",
      "Vehicle Status Visibility",
      "Geofence Alert Support",
      "Fleet Monitoring Dashboard",
      "Web and Mobile Access",
    ],
    specifications: [
      {
        label: "Application",
        value: "Vehicle and fleet tracking",
      },
      {
        label: "Tracking",
        value: "GNSS location monitoring",
      },
      {
        label: "Installation",
        value: "Vehicle specific",
      },
      {
        label: "Alerts",
        value: "Configuration dependent",
      },
      {
        label: "Integration",
        value: "Subject to protocol validation",
      },
    ],
    brochure: "",
    whatsapp: salesWhatsApp,
  },
  {
    id: 5,
    slug: "ai-dash-camera",
    name: "AI Dash Camera",
    category: "AI Dashcam",
    badge: "VIDEO TELEMATICS",
    shortDescription:
      "Connected fleet camera solution for journey visibility, event review and driver safety workflows.",
    description:
      "The NAVII AI Dash Camera supports fleet safety and video telematics use cases. Camera channels, storage, connectivity and AI functions depend on the selected model and deployment configuration.",
    image: "/assets/products/dashcam/main.png",
    gallery: [
      "/assets/products/dashcam/main.png",
      "/assets/products/dashcam/1.png",
      "/assets/products/dashcam/2.png",
      "/assets/products/dashcam/3.png",
    ],
    features: [
      "Journey Video Recording",
      "Event-Based Video Review",
      "Location-Linked Fleet Visibility",
      "Driver Safety Workflows",
      "Remote Monitoring Support",
      "Web Platform Integration",
    ],
    specifications: [
      {
        label: "Application",
        value: "Fleet safety and video telematics",
      },
      {
        label: "Camera Channels",
        value: "Model dependent",
      },
      {
        label: "Storage",
        value: "Configuration dependent",
      },
      {
        label: "Connectivity",
        value: "Model and network dependent",
      },
      {
        label: "AI Functions",
        value: "Selected configuration dependent",
      },
    ],
    brochure: "",
    whatsapp: salesWhatsApp,
  },
  {
    id: 6,
    slug: "fuel-monitoring-sensor",
    name: "Fuel Monitoring Sensor",
    category: "Fuel Sensor",
    shortDescription:
      "Fuel monitoring solution for level visibility, refill events, usage reports and theft alerts.",
    description:
      "The NAVII Fuel Monitoring Sensor is intended for fleet fuel visibility and reporting. Installation, calibration and accuracy depend on the vehicle, tank and selected sensor configuration.",
    image: "/assets/products/FuelSensor.png",
    gallery: ["/assets/products/FuelSensor.png"],
    features: [
      "Fuel Level Monitoring",
      "Refill Event Visibility",
      "Fuel Theft Alert Support",
      "Usage and Consumption Reports",
      "Vehicle Tracking Integration",
      "Configurable Fleet Dashboard",
    ],
    specifications: [
      {
        label: "Monitoring",
        value: "Fuel level and events",
      },
      {
        label: "Installation",
        value: "Vehicle and tank specific",
      },
      {
        label: "Calibration",
        value: "Required during installation",
      },
      {
        label: "Integration",
        value: "Compatible GPS platform required",
      },
      {
        label: "Reports",
        value: "Usage, refill and event reports",
      },
    ],
    brochure: "",
    whatsapp: salesWhatsApp,
  },
  {
    id: 7,
    slug: "smart-e-lock",
    name: "Smart E-Lock",
    category: "IoT Solutions",
    badge: "CARGO SECURITY",
    shortDescription:
      "Connected electronic lock solution for cargo security, access history and tamper monitoring.",
    description:
      "The NAVII Smart E-Lock is designed for cargo, logistics and controlled-access workflows. Connectivity, lock control and alert functions depend on the selected hardware and integration configuration.",
    image: "/assets/products/SmartELock.png",
    gallery: ["/assets/products/SmartELock.png"],
    features: [
      "Electronic Lock Workflow",
      "Tamper Status Monitoring",
      "Access History Support",
      "Location Association",
      "Configurable Security Alerts",
      "Logistics Platform Integration",
    ],
    specifications: [
      {
        label: "Application",
        value: "Cargo and logistics security",
      },
      {
        label: "Control",
        value: "Authorized workflow dependent",
      },
      {
        label: "Monitoring",
        value: "Lock and tamper status",
      },
      {
        label: "Connectivity",
        value: "Configuration dependent",
      },
      {
        label: "Integration",
        value: "Subject to deployment validation",
      },
    ],
    brochure: "",
    whatsapp: salesWhatsApp,
  },
];
