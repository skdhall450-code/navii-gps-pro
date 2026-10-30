export type HaryanaPriorityGuide = { source?: string; sourceLabel?: string; title: string; description: string; cases: { title: string; text: string }[]; faqs: { question: string; answer: string }[] };
export const priorityGuides: Record<string, HaryanaPriorityGuide> = {
"ambala-city": {
  "title": "GPS Tracker in Ambala City, Ambala",
  "description": "Plan GPS tracking in Ambala City for local distribution and return collections. Review stop references, vehicle loading breaks and end-of-round records.",
  "source": "https://ambala.gov.in/about-district/",
  "sourceLabel": "Ambala district administration",
  "cases": [
    {
      "title": "Keep Ambala City and Cantt delivery instructions separate",
      "text": "An address labelled only Ambala may not identify the intended destination. For Ambala City distribution, record the receiver, exact premises entrance and delivery reference before dispatch. Keep a stop in Ambala Cantt as a separate task, even when the same vehicle serves both places during one round."
    },
    {
      "title": "Pair return collections with the original delivery record",
      "text": "If an Ambala City customer returns goods on a later visit, give the collection its own reference linked to the original delivery. Compare supported stop records with the collection acknowledgement. A vehicle returning to the same address does not establish what was collected, whether it was accepted or how much space remains in the vehicle."
    },
    {
      "title": "Separate depot reloads from customer waiting",
      "text": "For several Ambala City rounds in one shift, record the depot return, reload and next departure against separate round references. Review available timestamps alongside loading records rather than treating all stationary time as customer delay. Pilot one complete shift, including a return collection, and confirm supported reports and fitting arrangements before fleet rollout."
    }
  ],
  "faqs": [
    {
      "question": "How should I distinguish Ambala City deliveries from Ambala Cantt stops?",
      "answer": "Use the exact destination and a separate task reference for every stop. Confirm the receiving entrance before dispatch and compare trip records with delivery acknowledgements; a broad Ambala geofence does not identify a completed customer delivery."
    },
    {
      "question": "Can GPS show which goods were returned during an Ambala City round?",
      "answer": "No. Use the return collection acknowledgement and goods record to establish the items and quantities. Location and supported trip records can help review when the vehicle visited the collection point."
    }
  ]
},
"ambala-cantt": {
  "title": "GPS Tracker in Ambala Cantt, Ambala",
  "description": "Plan GPS tracking in Ambala Cantt for passenger pickups and onward journeys. Separate arrival information, vehicle waiting, boarding and return assignments.",
  "source": "https://ambala.gov.in/how-to-reach/",
  "sourceLabel": "Ambala district travel information",
  "cases": [
    {
      "title": "Confirm the pickup destination before assigning a vehicle",
      "text": "For an Ambala Cantt passenger booking, confirm the exact station, entrance or other meeting point with the passenger. Do not substitute Ambala City for Ambala Cantt in the booking. Where the pickup connects with a train, check current railway arrival information separately; the tracker reports the vehicle, not the train."
    },
    {
      "title": "Keep vehicle waiting and passenger readiness separate",
      "text": "Record the agreed waiting arrangement, the latest vehicle update time and passenger readiness as separate booking milestones. A vehicle reaching the pickup area is not proof that passengers have boarded. Confirm the permitted meeting and waiting arrangements for the actual premises; a GPS location does not establish access permission."
    },
    {
      "title": "Reassign a delayed pickup without losing the onward booking",
      "text": "If a delayed Ambala Cantt pickup affects another journey, record any replacement vehicle and effective assignment time in the booking sheet. Keep the passenger acknowledgement and onward destination with that assignment. Review each vehicle leg separately and test supported waiting and trip records on a representative journey before relying on them for dispatch."
    }
  ],
  "faqs": [
    {
      "question": "Can a vehicle tracker confirm a train arrival for an Ambala Cantt pickup?",
      "answer": "No. Use current railway information for train status and confirm passenger readiness through the booking process. Vehicle GPS can help review the assigned vehicle journey and the age of its last update."
    },
    {
      "question": "What should I confirm before arranging GPS fitting for Ambala Cantt vehicles?",
      "answer": "Share the exact fitting location, vehicle models, recurring pickup points and reporting needs with NAVII GPS. Confirm access arrangements, hardware, SIM, platform, installation availability and complete costs before booking; this guide does not establish a local NAVII office."
    }
  ]
},
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

