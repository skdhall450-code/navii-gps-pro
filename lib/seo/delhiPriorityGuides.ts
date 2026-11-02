export const delhiPriorityGuides = {
"karolBagh": {
  "name": "Karol Bagh",
  "description": "Plan GPS tracking in Karol Bagh for shop collections and retail deliveries. Record shop entrances, collection references and consolidated dispatch handovers.",
  "source": "https://delhitourism.gov.in/shopping/karol_bagh.html",
  "sourceLabel": "Delhi Tourism: Karol Bagh",
  "related": "/gps-tracker/delhi/central/paharganj",
  "relatedLabel": "Paharganj pickup planning",
  "cases": [
    {
      "title": "Give each Karol Bagh shop its own collection reference",
      "text": "Ajmal Khan Road, Arya Samaj Road, Bank Street and Ghaffar Market are distinct shopping references within Karol Bagh. Record the shop name, exact entrance, receiving contact and collection reference before assigning a vehicle. Confirm a usable meeting point with the shop; a market name alone is not a complete loading instruction."
    },
    {
      "title": "Keep collection readiness separate for each shop",
      "text": "For a round collecting from several Karol Bagh shops, confirm which orders are packed and ready before arranging the stop sequence. If one shop defers a collection, preserve that exception and its revised appointment. Match every collection to its acknowledgement rather than assuming all nearby orders were loaded during one vehicle stop."
    },
    {
      "title": "Reconcile consolidated goods before onward dispatch",
      "text": "If several shop collections are combined at a depot, retain the shop references under the onward dispatch record. Record any missing parcel, return or vehicle reassignment before closing the collection round. Test a representative round against supported trip history; vehicle movement cannot count parcels or establish custody of goods after they leave the vehicle."
    }
  ],
  "faqs": [
    {
      "question": "Can one Karol Bagh GPS stop confirm collections from several shops?",
      "answer": "No. Keep a separate collection reference and acknowledgement for each shop. A stop can support multiple visits, but vehicle location alone does not show which parcels were collected."
    },
    {
      "question": "What should a Karol Bagh collection pilot include?",
      "answer": "Include several confirmed shop entrances, a deferred order and a depot handover. Compare supported trip records with collection acknowledgements, then confirm reporting retention, vehicle compatibility and fitting arrangements before rollout."
    }
  ]
},
"paharganj": {
  "name": "Paharganj",
  "description": "Plan GPS tracking in Paharganj for station-area and guest pickups. Confirm meeting points, luggage handovers and changed departure plans before dispatch.",
  "source": "https://delhitourism.gov.in/shopping/paharganj.html",
  "sourceLabel": "Delhi Tourism: Paharganj",
  "related": "/gps-tracker/delhi/central/karol-bagh",
  "relatedLabel": "Karol Bagh collection planning",
  "cases": [
    {
      "title": "Distinguish the station meeting point from Main Bazaar",
      "text": "Paharganj Main Bazaar is near New Delhi Railway Station. A booking labelled Paharganj may refer to a station meeting point, a guest accommodation or a shop. Record the exact agreed pickup point and passenger contact reference; confirm the station side or property entrance separately rather than sending a driver to a general locality pin."
    },
    {
      "title": "Confirm passengers and luggage through the booking record",
      "text": "For a guest pickup, record passenger readiness and the agreed luggage handover with the coordinator. Keep a vehicle arrival separate from boarding confirmation, especially when people meet the driver away from the accommodation entrance. GPS reports the vehicle and cannot confirm that every passenger or bag is on board; avoid placing unnecessary guest details in shared vehicle labels."
    },
    {
      "title": "Reassign delayed departures without losing the original booking",
      "text": "If a train arrival or guest departure changes, update the booking with the revised meeting time and assigned vehicle. Confirm train information through the relevant travel service; a vehicle tracker does not report railway status. Retain cancellation or replacement notes and review both journey legs during a pilot before relying on available trip reports for pickup coordination."
    }
  ],
  "faqs": [
    {
      "question": "Does a Paharganj arrival alert confirm that a guest and luggage are onboard?",
      "answer": "No. Confirm passengers and luggage through the booking handover process. A supported location event can help review the vehicle arrival but does not establish boarding or luggage custody."
    },
    {
      "question": "How should a changed Paharganj station pickup be recorded?",
      "answer": "Keep the revised meeting point, time and vehicle assignment under the original booking reference. Verify train status separately and compare vehicle movements with the version of the booking that applied to that journey."
    }
  ]
},
"delhiCantt": {
  "name": "Delhi Cantt",
  "description": "Plan GPS tracking in Delhi Cantt for passenger meeting points and booked visits. Separate station pickups, premises access and vehicle waiting records.",
  "source": "https://dmnewdelhi.delhi.gov.in/subdivision-blocks/",
  "sourceLabel": "New Delhi district: Delhi Cantt",
  "related": "/gps-tracker/delhi/new-delhi",
  "relatedLabel": "New Delhi district fleet planning",
  "cases": [
    {
      "title": "Distinguish a station pickup from a premises visit",
      "text": "Delhi Cantt is the commonly used name for Delhi Cantonment. A booking labelled only Delhi Cantt may refer to the railway station or another destination in the area. Record the specific meeting point and passenger contact reference before dispatch. Check current train information separately when relevant; vehicle GPS does not report train arrival or passenger readiness."
    },
    {
      "title": "Confirm the meeting arrangement with the host",
      "text": "For a booked premises visit in Delhi Cantt, agree the receiving point and any vehicle-entry arrangements with the host in advance. Keep arrival at the agreed waiting point separate from entry to the destination. A route shown on a map or a location alert does not establish permission to enter a site. This guide does not specify access rules for individual premises."
    },
    {
      "title": "Close the waiting leg before the return booking",
      "text": "Record when the passenger is ready, when boarding is confirmed and whether the same vehicle handles the return. If another vehicle takes the return leg, retain both assignments under the booking reference. During a pilot, compare supported stop and trip records with these milestones so waiting near a pickup is not counted as a completed passenger journey."
    }
  ],
  "faqs": [
    {
      "question": "Does a Delhi Cantt geofence confirm that passengers have boarded?",
      "answer": "No. Confirm boarding through the booking process. A supported location event can help review the vehicle arrival, but cannot establish which passengers boarded or whether the intended meeting point was reached."
    },
    {
      "question": "Can GPS guidance confirm entry arrangements for a Delhi Cantt destination?",
      "answer": "No. Confirm the exact receiving point and entry arrangements with the host before travel. A tracker reports vehicle movement and does not grant access or verify permission for a particular premises."
    }
  ]
},
"chanakyapuri": {
  "name": "Chanakyapuri",
  "description": "Plan GPS tracking in Chanakyapuri for hotel pickups and multi-venue visits. Coordinate vehicle staging, revised departure times and passenger handovers.",
  "source": "https://www.ndmc.gov.in/Departments/civil_control.aspx",
  "sourceLabel": "NDMC Chanakyapuri and Diplomatic Enclave geography",
  "related": "/gps-tracker/delhi/new-delhi/connaught-place",
  "relatedLabel": "Connaught Place stop planning",
  "cases": [
    {
      "title": "Use the booked venue and entrance for each transfer",
      "text": "Chanakyapuri and the Diplomatic Enclave appear in NDMC locality information. For a hotel or appointment transfer in this area, record the actual venue, agreed vehicle entrance and booking reference. Keep the passenger meeting point separate from the vehicle staging point where they differ. Confirm the arrangement with the host or hotel rather than relying on a general locality pin."
    },
    {
      "title": "Keep a multi-venue itinerary versioned",
      "text": "For a Chanakyapuri pickup followed by several appointments, record the planned departure and destination for each leg. When a meeting overruns, preserve the revised departure time and the coordinator who accepted the change. Compare the vehicle history with the itinerary that applied during that leg; a later edited schedule can otherwise make an agreed wait look like a missed departure."
    },
    {
      "title": "Hand the return pickup to the next coordinator",
      "text": "If the passenger leaves the first vehicle to attend a meeting, record who confirms readiness for the return and which vehicle is assigned. Share only the booking details needed by the responsible coordinator. Pilot a day with a venue change and return pickup, checking update timestamps and supported trip reports before using the setup for regular transfers."
    }
  ],
  "faqs": [
    {
      "question": "Can vehicle GPS confirm that a Chanakyapuri meeting has finished?",
      "answer": "No. The host or passenger should confirm readiness for pickup. Review that confirmation alongside the assigned vehicle and its latest update time; a parked marker cannot establish the status of a meeting."
    },
    {
      "question": "Does this guide establish a diplomatic affiliation or NAVII branch in Chanakyapuri?",
      "answer": "No. It provides independent fleet planning guidance only. Confirm hardware, SIM, platform, reporting support, fitting availability and complete costs for your exact vehicle location with NAVII GPS before booking."
    }
  ]
},
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
