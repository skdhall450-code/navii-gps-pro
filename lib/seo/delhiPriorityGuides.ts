export const delhiPriorityGuides = {
  "newDelhi": {
    "name": "New Delhi",
    "description": "Plan GPS tracking in New Delhi district for scheduled office visits and shared vehicles. Review destination entrances, appointment changes and return assignments.",
    "source": "https://dmnewdelhi.delhi.gov.in/history/",
    "sourceLabel": "New Delhi district administration",
    "related": "/gps-tracker/delhi/new-delhi/connaught-place",
    "relatedLabel": "Connaught Place delivery planning",
    "cases": [
      {
        "title": "Name the premises, not only New Delhi",
        "text": "For a New Delhi office or institutional visit, give the dispatcher the exact building, receiving entrance and appointment reference. Keep the administrative district label separate from the customer address. Confirm meeting and vehicle access arrangements with the receiving organisation before departure; a map marker does not establish permission to enter."
      },
      {
        "title": "Keep appointment changes with the vehicle assignment",
        "text": "When several teams share a New Delhi service vehicle, record the planned visit window and the team responsible for each leg. If an appointment moves or a different vehicle is assigned, preserve the effective change time. Compare available trip records with the plan that applied during the journey, rather than only the latest edited schedule."
      },
      {
        "title": "Close the visit and onward assignment separately",
        "text": "Use the job acknowledgement to confirm completion, then record whether the vehicle returns to base or continues to another appointment. Keep waiting for a receiver separate from completed service work. Pilot a representative multi-appointment day and confirm supported reports, account access and fitting arrangements for the actual location before rollout."
      }
    ],
    "faqs": [
      {
        "question": "Does a New Delhi vehicle arrival confirm an office visit is complete?",
        "answer": "No. Review the location record alongside the appointment reference and receiving acknowledgement. Arrival, authorised entry and completed work are separate milestones."
      },
      {
        "question": "What information helps plan GPS fitting for a New Delhi fleet?",
        "answer": "Share vehicle models, exact fitting location, recurring premises and team assignments. Confirm installation availability, hardware, SIM, platform, supported reporting and full costs before booking. This guide does not establish a NAVII office in New Delhi."
      }
    ]
  },
  "connaughtPlace": {
    "name": "Connaught Place",
    "description": "Plan GPS tracking in Connaught Place for block-specific deliveries and service visits. Separate vehicle parking, receiving entrances and proof of handover.",
    "source": "https://www.ndmc.gov.in/departments/civil_i_cp_div_enquiry.aspx",
    "sourceLabel": "NDMC Connaught Place division",
    "related": "/gps-tracker/delhi/new-delhi",
    "relatedLabel": "New Delhi district appointment planning",
    "cases": [
      {
        "title": "Record the block, circle and receiving entrance",
        "text": "Connaught Place includes Inner, Middle and Outer Circle locations. For a delivery or service visit, record the customer block, premises number and agreed receiving entrance instead of using CP as the entire destination. Confirm current access and unloading arrangements with the receiver; this guide does not specify parking availability or permitted stopping locations."
      },
      {
        "title": "Separate the parked vehicle from the final handover",
        "text": "A driver may park at an agreed location and complete the last part of a Connaught Place visit on foot. Keep the vehicle stop record separate from the delivery acknowledgement or service report. Vehicle GPS cannot establish which shop or office received the goods, or whether someone reached a particular floor inside a building."
      },
      {
        "title": "Reconcile several customers served from one stop",
        "text": "When one vehicle stop supports visits to several Connaught Place customers, give each task its own reference and completion record. Do not count one parking event as one completed delivery or duplicate it across all customers automatically. During a pilot, compare the dispatch sheet with supported stop reports and note any return collection or unfinished visit."
      }
    ],
    "faqs": [
      {
        "question": "Can one Connaught Place parking event prove several deliveries?",
        "answer": "No. Retain a separate receiver acknowledgement for each delivery. A vehicle stop can support several visits, but its location alone does not establish which customers were served."
      },
      {
        "question": "Should a Connaught Place geofence use the whole commercial area?",
        "answer": "Choose the actual agreed vehicle stop or premises boundary where supported, then test it on a representative visit. Review arrival events alongside block and entrance details. A broad CP boundary may include passing traffic and does not prove delivery completion."
      }
    ]
  }
};
export type DelhiPriorityGuide = typeof delhiPriorityGuides.newDelhi;
