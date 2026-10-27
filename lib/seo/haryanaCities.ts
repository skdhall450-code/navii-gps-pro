import { generateLocalKeywords, uniqueKeywords } from "@/lib/seo/trackingSolutions";
import type { Metadata } from "next";

import { haryanaDistricts } from "@/lib/seo/haryanaDistricts";

export type HaryanaCitySeo = {
  slug: string;
  name: string;
  districtSlug: string;
  districtName: string;
  nearbyLocations: string[];
  sectors: string[];
  localContext: string;
  planningNote: string;
  guide?: { title: string; description: string; cases: { title: string; text: string }[]; faqs: { question: string; answer: string }[] };
};

const priorityGuides: Record<string, NonNullable<HaryanaCitySeo["guide"]>> = {
  "panchkula": {
    "title": "GPS Tracker in Panchkula | Service Visits & Shared Fleets",
    "description": "Plan GPS tracking in Panchkula for scheduled service visits and shared vehicles. Review appointment records, vehicle changes and fitting requirements.",
    "cases": [
      {
        "title": "Appointments need an exact destination",
        "text": "For a Panchkula service round, record the customer address, entrance and job reference rather than using the city or sector name alone. Keep the planned appointment window alongside available arrival records. A vehicle passing near a customer does not establish that the visit took place."
      },
      {
        "title": "Hand over shared vehicles between teams",
        "text": "If a vehicle serves several teams during the day, record each assignment and handover time in the dispatch sheet. Review trip history against the team responsible at that time, not only the current driver label. Restrict customer and vehicle information to the people who need it for coordination."
      },
      {
        "title": "Reconcile the working day",
        "text": "Compare completed jobs, cancelled appointments and extra calls with the recorded route and final return. Keep work completion in the job system; parking duration alone does not establish service quality. Pilot a typical local round and a connected Chandigarh journey before extending the setup."
      }
    ],
    "faqs": [
      {
        "question": "Can GPS prove a Panchkula service appointment was completed?",
        "answer": "Vehicle location helps review the journey, but completion should come from the job record or customer acknowledgement. Keep appointment references with the trip review."
      },
      {
        "question": "How should I track a shared Panchkula service vehicle?",
        "answer": "Record each team assignment and its effective time. Confirm authorised account access and the reports supported by the selected device and platform before relying on them for handovers."
      }
    ]
  },
  "kalka": {
    "title": "GPS Tracker in Kalka | Onward Trips & Vehicle Handovers",
    "description": "Plan GPS tracking in Kalka for onward journeys and vehicle handovers. Separate local stops, passenger coordination and return-leg reporting before rollout.",
    "cases": [
      {
        "title": "Separate a local stop from an onward trip",
        "text": "For a vehicle stopping in Kalka before continuing into Himachal Pradesh, record the Kalka task and onward destination as separate legs. Agree the actual meeting point and departure responsibility. Do not close the onward booking merely because the vehicle has entered Kalka."
      },
      {
        "title": "Keep a transfer handover record",
        "text": "Where passengers or goods move to another vehicle, record both vehicle identities, the handover time and the receiving confirmation in the booking or consignment record. GPS history describes each vehicle journey; it does not prove that the transfer between vehicles was completed."
      },
      {
        "title": "Plan the return before departure",
        "text": "Record whether the original vehicle returns to base, waits for a later booking or finishes at another destination. Test a representative full journey and check location timestamps and supported trip exports. Confirm reporting behaviour and fitting availability for the actual route rather than assuming continuous updates."
      }
    ],
    "faqs": [
      {
        "question": "How do I review a Kalka journey with a vehicle change?",
        "answer": "Keep both vehicle assignments and the handover acknowledgement in the booking record. Review each vehicle trip for its own leg; a location event alone cannot confirm the transfer."
      },
      {
        "question": "Does reaching Kalka complete an onward Himachal booking?",
        "answer": "No. Use the agreed final destination and booking acknowledgement to close the journey. Kalka may be an intermediate stop, so track the local task and onward leg separately."
      }
    ]
  },
  "pinjore": {
    "title": "GPS Tracker in Pinjore | Local Deliveries & Through Trips",
    "description": "Plan GPS tracking in Pinjore for local deliveries and through journeys. Review stop entrances, repeat visits, dispatch records and installation needs.",
    "cases": [
      {
        "title": "Distinguish a delivery from a through journey",
        "text": "For Pinjore operations, list which vehicles have a local customer stop and which are only passing through toward another destination. Compare supported arrival events with the dispatch plan. A broad town geofence should not automatically count every passing vehicle as a completed local delivery."
      },
      {
        "title": "Use the actual receiving entrance",
        "text": "Record the agreed entrance, unloading point and receiver reference for each Pinjore delivery. Keep waiting outside the premises separate from unloading where operationally useful. Confirm receipt through the delivery record; vehicle position cannot establish the items or quantity received."
      },
      {
        "title": "Review repeat visits independently",
        "text": "When a vehicle returns to the same customer or depot several times, give each visit its own dispatch reference. Reconcile available arrival and departure records with loading and delivery acknowledgements. During a pilot include a repeat visit and the final return, then confirm supported exports and any reporting gaps."
      }
    ],
    "faqs": [
      {
        "question": "Can a Pinjore geofence count completed deliveries?",
        "answer": "A supported geofence event can help identify a vehicle visit, but passing traffic and waiting nearby may also need review. Confirm deliveries using dispatch references and receiver acknowledgements."
      },
      {
        "question": "What details help plan installation for Pinjore vehicles?",
        "answer": "Share vehicle models, fleet size, the exact fitting location and recurring stops with NAVII GPS. Confirm hardware, SIM, platform, fitting arrangements, accessories and renewal costs before booking."
      }
    ]
  }
};

const operatingProfiles = [
  "daily dispatch, customer-service vehicles and town-to-district movements",
  "commercial deliveries, return trips and mixed urban-rural operations",
  "scheduled fleet routes, field teams and time-sensitive vehicle movements",
  "local distribution, institutional vehicles and connections to regional roads",
  "industrial journeys, staff transport and multi-stop fleet operations",
];

export function toHaryanaCitySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const haryanaCities: HaryanaCitySeo[] = haryanaDistricts.flatMap(
  (district, districtIndex) => district.cities.map((name, cityIndex) => {
    const nearbyLocations = district.cities.filter((city) => city !== name);
    const operatingProfile = operatingProfiles[(districtIndex + cityIndex) % operatingProfiles.length];

    return {
      guide: district.slug === "panchkula" ? priorityGuides[toHaryanaCitySlug(name)] : undefined,
      slug: toHaryanaCitySlug(name),
      name,
      districtSlug: district.slug,
      districtName: district.name,
      nearbyLocations,
      sectors: district.sectors,
      localContext: `${name} vehicle operations in ${district.name} district can include ${operatingProfile}. Connected planning may also cover ${nearbyLocations.slice(0, 3).join(", ")} and wider Haryana routes.`,
      planningNote: `For GPS tracking around ${name}, confirm the actual vehicle routes, mobile-network availability, compatible hardware and SIM, professional installation, authorized user access and alert responsibilities before deployment.`,
    };
  }),
);

export function getHaryanaCity(districtSlug: string, citySlug: string) {
  return haryanaCities.find(
    (city) => city.districtSlug === districtSlug && city.slug === citySlug,
  );
}

export function getHaryanaCitiesForDistrict(districtSlug: string) {
  return haryanaCities.filter((city) => city.districtSlug === districtSlug);
}

export function generateHaryanaCityKeywords(city: HaryanaCitySeo) {
  return [...new Set([
    `GPS tracker in ${city.name}`,
    `GPS tracker ${city.name} Haryana`,
    `GPS tracker ${city.name} ${city.districtName}`,
    `vehicle tracking system ${city.name}`,
    `car GPS tracker ${city.name}`,
    `truck GPS tracking ${city.name}`,
    `fleet management software ${city.name}`,
    `commercial vehicle tracking ${city.name}`,
    `school bus GPS tracking ${city.name}`,
    `GPS tracking company ${city.name}`,
  ])];
}

export function generateHaryanaCityMetadata(city: HaryanaCitySeo): Metadata {
  const url = `https://naviigps.com/gps-tracker/haryana/${city.districtSlug}/${city.slug}`;
  const description = city.guide?.description ?? `GPS trackers and fleet management software in ${city.name}, ${city.districtName} district, Haryana, for cars, trucks, buses and commercial vehicles.`;

  return {
    title: city.guide?.title ?? `GPS Tracker in ${city.name}, ${city.districtName}`,
    description,
    keywords: uniqueKeywords([...new Set([...generateHaryanaCityKeywords(city), ...generateLocalKeywords(city.name, city.sectors)])]),
    ...(city.guide ? { twitter: { card: "summary_large_image" as const, title: city.guide.title, description, images: ["/og-image.jpg"] } } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: city.guide?.title ?? `GPS Tracker in ${city.name}, Haryana | NAVII GPS`,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}
