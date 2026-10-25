import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";

import { punjabDistricts } from "@/lib/seo/punjabDistricts";

export type PunjabCitySeo = {
  slug: string;
  name: string;
  districtSlug: string;
  districtName: string;
  nearbyLocations: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
  guide?: { description: string; cases: { title: string; text: string }[]; faqs: { question: string; answer: string }[] };
};

const operatingProfiles = [
  "daily dispatch, customer-service vehicles and town-to-district movements",
  "commercial deliveries, return trips and mixed urban-rural operations",
  "scheduled fleet routes, field teams and time-sensitive vehicle movements",
  "local distribution, institutional vehicles and connections to regional roads",
  "industrial journeys, staff transport and multi-stop fleet operations",
  "agricultural supply routes, market movements and seasonal fleet activity",
];

export function toPunjabCitySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const priorityGuides: Record<string, NonNullable<PunjabCitySeo["guide"]>> = {
"zirakpur": {
  "description": "GPS tracking in Zirakpur for delivery fleets and shared vehicles. Plan customer stops, driver handovers and reporting checks on connected Tricity trips.",
  "cases": [
    {
      "title": "Separate local deliveries from through journeys",
      "text": "For a vehicle serving Zirakpur and continuing to Dera Bassi, Chandigarh or Mohali, record which stops are actual customer appointments. Review the local delivery leg separately from the onward journey. A passing vehicle can cross a geofence without completing a delivery, so reconcile trip history with the driver's delivery record."
    },
    {
      "title": "Choose the correct entrance for each stop",
      "text": "When a Zirakpur delivery address has more than one entrance or a separate loading point, agree the usable entry with the customer before setting the stop boundary. Pilot arrival and departure alerts at that point. Review repeated boundary events with the dispatcher before changing a geofence or assuming multiple visits."
    },
    {
      "title": "Keep shared-vehicle handovers clear",
      "text": "For a Zirakpur vehicle used by more than one driver, record the vehicle, driver assignment and handover time in the operating log. Compare trip timestamps with the relevant shift when investigating a route change. Confirm tracker power, SIM plan, reporting settings and authorised account access before starting regular use."
    }
  ],
  "faqs": [
    {
      "question": "How can I review Zirakpur deliveries and onward trips separately?",
      "answer": "Agree the delivery stops and onward destination before dispatch, then review each leg in trip history. Check geofence timestamps against the driver's delivery record; a reported arrival alone does not confirm that goods were handed over."
    },
    {
      "question": "How do I arrange installation for a vehicle based in Zirakpur?",
      "answer": "Contact the NAVII GPS team in Dera Bassi with the vehicle model, parking location and preferred fitting time. Confirm installation arrangements, compatible hardware and the full device, SIM, platform and renewal quotation before booking."
    }
  ]
},
"kharar": {
  "description": "GPS tracking in Kharar for service vehicles and scheduled pickups. Plan repeat visits, route changes and reporting checks for Mohali and Kurali journeys.",
  "cases": [
    {
      "title": "Organise repeat service rounds in Kharar",
      "text": "For a Kharar service vehicle visiting several customers, list the appointments in order and identify any sites that need repeat visits. Compare the recorded stop sequence with the day's work log. Keep customer completion notes separately so a short stop or nearby road movement is not mistaken for a completed job."
    },
    {
      "title": "Record changes to scheduled pickup routes",
      "text": "For scheduled pickups around Kharar, agree the approved stops, pickup windows and dispatcher responsible for changes. When a stop is temporarily moved, update the operating plan and review the relevant geofence before the next trip. Confirm supported alert behaviour with a pilot; do not infer passenger boarding from the vehicle's position."
    },
    {
      "title": "Check the return leg from Mohali or Kurali",
      "text": "If a Kharar-based vehicle also works in Mohali or Kurali, include the return journey in your installation trial. Check the latest reported time at the destination and again on return. Review gaps with the installer or dispatcher, and agree how to follow up when a vehicle has not sent a fresh update."
    }
  ],
  "faqs": [
    {
      "question": "Can GPS records confirm a Kharar customer visit was completed?",
      "answer": "Trip history and supported geofence events can help review the vehicle's reported movements. Confirm job completion with the customer or service record; location data alone does not establish that work was performed."
    },
    {
      "question": "What information is needed for a Kharar fleet quotation?",
      "answer": "Share vehicle models, fleet size, usual stops, parking location and reporting needs with NAVII GPS. Ask for hardware, SIM, platform, installation and renewal charges, and confirm fitting arrangements for your Kharar location before booking."
    }
  ]
},
  "dera-bassi": {
    "description": "Plan GPS tracking in Dera Bassi for dispatch vehicles and commercial fleets. Review installation enquiries, depot geofences and connected Tricity journeys.",
    "cases": [
      {
        "title": "Prepare a Dera Bassi installation enquiry",
        "text": "Contact NAVII GPS at SCO 46, 2nd Floor, GBP Business Square, Barwala Road, Dera Bassi, Punjab – 140507. Share the vehicle model, power supply, parking location and available fitting time. Confirm the appointment, installation arrangements and itemised quotation before bringing a vehicle or booking a visit."
      },
      {
        "title": "Separate depot waiting from the delivery journey",
        "text": "For a Dera Bassi dispatch vehicle, record the loading location, planned customer stops and return point. Place geofences around agreed premises rather than the whole town. Compare departure and return times with trip history; confirm loading delays with the dispatch team instead of treating every long stop as idle time."
      },
      {
        "title": "Test a connected Tricity route",
        "text": "If your vehicles travel from Dera Bassi to Zirakpur, Chandigarh or Mohali, pilot one representative journey before rolling out to the fleet. Check location timestamps at stops and compare the recorded route after the trip. Agree who follows up on missing updates and which dispatcher can view each vehicle."
      }
    ],
    "faqs": [
      {
        "question": "Where can I enquire about a GPS tracker in Dera Bassi?",
        "answer": "The NAVII GPS office is at SCO 46, 2nd Floor, GBP Business Square, Barwala Road, Dera Bassi, Punjab – 140507. Contact the team before visiting to confirm availability, device suitability and installation arrangements."
      },
      {
        "question": "What should I test after fitting a Dera Bassi fleet tracker?",
        "answer": "Test a real departure, customer stop and return journey. Review the latest location time, trip history, authorised account access and supported geofence alerts. Confirm any accessory functions separately with the installer before accepting the setup."
      }
    ]
  },
  "mohali": {
    "description": "Plan GPS tracking in Mohali for employee transport and service fleets. Compare pickup geofences, dispatcher access, reporting checks and installation requirements.",
    "cases": [
      {
        "title": "Plan employee pickup and shift handover",
        "text": "For Mohali employee transport, keep pickup stops separate from the office arrival geofence. Give the dispatcher a planned stop sequence and shift window, then review recorded journeys against that plan. Limit access to the vehicles each coordinator manages and confirm who handles a missed pickup report."
      },
      {
        "title": "Review multi-stop service visits",
        "text": "For a service vehicle working around Mohali, record the customer appointment order and expected return point before dispatch. Use trip history to investigate route changes and prolonged stops with the driver. A geofence event indicates a reported boundary crossing; it does not establish that the customer visit or service job was completed."
      },
      {
        "title": "Check journeys beyond Mohali",
        "text": "For fleets with stops in Kharar, Zirakpur or Chandigarh, test reporting on the actual working route. Compare the last location timestamp with the current time before interpreting a stationary marker. Include shift changes and return journeys in the pilot so the next dispatcher knows which updates need follow-up."
      }
    ],
    "faqs": [
      {
        "question": "Does the Mohali guide describe a separate NAVII GPS office?",
        "answer": "No separate Mohali office is listed in this guide. Contact the NAVII GPS team in Dera Bassi with your Mohali vehicle location to confirm installation arrangements, appointment availability and the quotation."
      },
      {
        "question": "What should a Mohali employee transport pilot include?",
        "answer": "Choose a representative pickup route and agree its stops, shift window and authorised dispatcher. Test location reporting, trip history and supported geofence alerts, then review missing updates and alert responsibilities before adding more vehicles."
      }
    ]
  }
};

export const punjabCities: PunjabCitySeo[] = punjabDistricts.flatMap(
  (district, districtIndex) => district.cities.map((name, cityIndex) => {
    const nearbyLocations = district.cities.filter((city) => city !== name);
    const operatingProfile = operatingProfiles[(districtIndex + cityIndex) % operatingProfiles.length];

    return {
      slug: toPunjabCitySlug(name),
      guide: district.slug === "sahibzada-ajit-singh-nagar" ? priorityGuides[toPunjabCitySlug(name)] : undefined,
      name,
      districtSlug: district.slug,
      districtName: district.name,
      nearbyLocations,
      sectors: district.sectors,
      localContext: `${name} vehicle operations in ${district.name} district can include ${operatingProfile}. Connected planning may also cover ${nearbyLocations.slice(0, 3).join(", ")} and wider Punjab routes.`,
      planningNote: `For GPS tracking around ${name}, confirm the actual vehicle routes, mobile-network availability, compatible hardware and SIM, professional installation, authorized user access and alert responsibilities before deployment.`,
    };
  }),
);

export function getPunjabCity(districtSlug: string, citySlug: string) {
  return punjabCities.find(
    (city) => city.districtSlug === districtSlug && city.slug === citySlug,
  );
}

export function getPunjabCitiesForDistrict(districtSlug: string) {
  return punjabCities.filter((city) => city.districtSlug === districtSlug);
}

export function generatePunjabCityKeywords(city: PunjabCitySeo) {
  const cityVariants = city.name === "Ferozepur" ? [city.name, "Firozpur"] : [city.name];
  return [...new Set([
    ...cityVariants.flatMap((name) => [
      `GPS tracker in ${name}`,
      `GPS tracker ${name} Punjab`,
      `vehicle tracking system ${name}`,
    ]),
    `GPS tracker ${city.name} ${city.districtName}`,
    `car GPS tracker ${city.name}`,
    `truck GPS tracking ${city.name}`,
    `fleet management software ${city.name}`,
    `commercial vehicle tracking ${city.name}`,
    `school bus GPS tracking ${city.name}`,
    `GPS tracking company ${city.name}`,
  ])];
}

export function generatePunjabCityMetadata(city: PunjabCitySeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/punjab/${city.districtSlug}/${city.slug}`;
  const description = city.guide?.description ?? `GPS trackers and fleet management software in ${city.name}, ${city.districtName} district, Punjab, for cars, trucks, buses and commercial vehicles.`;

  return {
    title: `GPS Tracker in ${city.name}, ${city.districtName}`,
    description,
    keywords: uniqueKeywords([...new Set([...generatePunjabCityKeywords(city), ...generateLocalKeywords(city.name, city.sectors)])]),
    alternates: { canonical: url },
    openGraph: {
      title: `GPS Tracker in ${city.name}, Punjab | NAVII GPS`,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}
