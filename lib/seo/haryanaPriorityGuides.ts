export type HaryanaPriorityGuide = { title: string; description: string; cases: { title: string; text: string }[]; faqs: { question: string; answer: string }[] };
export const priorityGuides: Record<string, HaryanaPriorityGuide> = {
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

