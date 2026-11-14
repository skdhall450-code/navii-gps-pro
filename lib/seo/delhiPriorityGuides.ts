export const delhiPriorityGuides = {
  "shahdara": {
  "name": "Shahdara",
  "description": "Plan GPS tracking for Shahdara appointment journeys. Confirm the actual office destination, keep return pickups separate and protect private document details.",
  "source": "https://revenue.delhi.gov.in/revenue/sub-division-offices",
  "sourceLabel": "Delhi Revenue Department: Shahdara subdivision office address",
  "related": "/gps-tracker/delhi/north-east/nand-nagri",
  "relatedLabel": "Nand Nagri vehicle-route planning",
  "cases": [
    {
      "title": "Distinguish the Shahdara office name from its destination address",
      "text": "The Delhi Revenue directory lists Shahdara subdivision under North East and gives its office address as the DC Office Complex in Nand Nagri. For a vehicle booking to that office, use the confirmed office address and meeting point rather than a general Shahdara locality pin. Reconfirm the destination against the appointment instructions before departure; the name of the subdivision does not by itself identify where the passenger needs to be dropped."
    },
    {
      "title": "Separate the office drop from a later return pickup",
      "text": "For a Shahdara office appointment, record whether the driver will wait, leave for another job or return after a passenger call. Keep the return pickup as its own assignment with an agreed meeting point and contact method. An appointment time is not a promised completion time, and a vehicle leaving the office area does not establish that the passenger has finished. Test a drop-and-return journey against supported trip timestamps before relying on reports to review missed pickups."
    },
    {
      "title": "Use a trip reference without exposing document details",
      "text": "When coordinating a Shahdara administrative visit, put a booking reference in the shared vehicle task and keep identity-document numbers, application scans and the reason for the visit in the authorised appointment record. Confirm who can see the trip and how long location records are retained. During a pilot, check that a dispatcher can distinguish fresh from delayed vehicle updates without sharing private paperwork. GPS arrival can support transport review but cannot prove an application was submitted, accepted or approved."
    }
  ],
  "faqs": [
    {
      "question": "Should a Shahdara subdivision-office trip use a general Shahdara map pin?",
      "answer": "No. The Revenue directory lists the Shahdara subdivision office at the DC Office Complex in Nand Nagri. Confirm the actual address and meeting point from the appointment instructions before assigning the vehicle."
    },
    {
      "question": "Can GPS confirm that a Shahdara office application was accepted?",
      "answer": "No. A trip record shows vehicle movement, not an administrative outcome. Keep the official acknowledgement with the authorised appointment record and use a booking reference, rather than private document details, for shared transport coordination."
    }
  ]
},
  "gandhiNagar": {
    "name": "Gandhi Nagar",
    "description": "Plan GPS tracking for Gandhi Nagar garment dispatches. Match size and colour assortments, separate buyer parcels and reconcile exchanges against the original order.",
    "source": "https://delhiplanning.delhi.gov.in/sites/default/files/Planning/2026-27/2026-27/vol_i_2026-27_updated.pdf#page=79",
    "sourceLabel": "Delhi Planning Department: Gandhi Nagar garment market (2026-27, PDF page 79)",
    "related": "/gps-tracker/delhi/east/patparganj",
    "relatedLabel": "Patparganj industrial service-vehicle planning",
    "cases": [
      {
        "title": "Keep the garment assortment with the order reference",
        "text": "Delhi's Planning Department identifies Gandhi Nagar as a readymade garment market. For a dispatch from the market, keep style, size and colour quantities with the buyer's order and parcel identifiers. Record whether the quantity means pieces, packs or cartons. A vehicle carrying the expected number of cartons does not establish that the requested size assortment is inside; use the packing record and buyer acknowledgement to resolve differences."
      },
      {
        "title": "Separate buyer parcels when several orders share a vehicle",
        "text": "A Gandhi Nagar collection run may combine parcels from several sellers for different buyers. Give each parcel a seller, buyer-order reference and agreed receiving point, then associate that manifest with the assigned vehicle journey. If a parcel changes vehicles at a consolidation point, retain both handovers under the same parcel reference. The first vehicle arriving at the transfer point does not mean that every buyer has received an order."
      },
      {
        "title": "Link size exchanges to the original outward dispatch",
        "text": "For a Gandhi Nagar size or colour exchange, record the original order, returned assortment and replacement assortment as separate movements. Keep any shortage or rejected item open until the seller and buyer reconcile it; do not close an exchange solely because the collection vehicle returned. Trial a delivery and an exchange pickup against the available trip export, checking that repeated visits can be matched to the right parcel records before selecting report access and retention."
      }
    ],
    "faqs": [
      {
        "question": "Can GPS confirm the size or colour mix in a Gandhi Nagar garment parcel?",
        "answer": "No. Check the packing record, parcel identifier and buyer acknowledgement against the ordered assortment. GPS can help associate a vehicle journey with the parcel manifest, but it cannot inspect garments inside the packaging."
      },
      {
        "question": "How should Gandhi Nagar garment exchanges be linked to vehicle trips?",
        "answer": "Keep the original buyer-order reference, returned assortment and replacement dispatch separately. Match each movement to its parcel handover and available trip timestamps; a return to base alone does not complete the exchange."
      }
    ]
  },
  "patparganj": {
    "name": "Patparganj",
    "description": "Plan GPS tracking for Patparganj industrial service vans. Separate site waiting from repair time, record replacement-part returns and confirm job completion.",
    "source": "https://industries.delhi.gov.in/industries/export-promotion-cell",
    "sourceLabel": "Delhi Industries Department: Functional Industrial Estate at Patparganj",
    "related": "/gps-tracker/delhi/east/gandhi-nagar",
    "relatedLabel": "Gandhi Nagar garment dispatch planning",
    "cases": [
      {
        "title": "Separate the service appointment from the production shutdown",
        "text": "Delhi's Industries Department identifies a Functional Industrial Estate at Patparganj. For an industrial maintenance visit, record the plot or unit, machine or asset reference, service appointment and the customer's agreed work window. Confirm site access and the responsible contact before dispatch. The van reaching the estate does not establish that the machine is available for work; keep the customer's readiness confirmation with the job card."
      },
      {
        "title": "Reconcile fitted, unused and removed parts after a visit",
        "text": "When a Patparganj service van carries replacement parts, record which items were fitted, left unused or removed from the customer equipment. Link returned parts to the job and the agreed recipient, including any item held for inspection. Do not infer a completed repair from the parts van leaving the premises. Vehicle GPS cannot identify a fitted component or confirm that removed material was handed back."
      },
      {
        "title": "Review vehicle dwell time alongside the signed service record",
        "text": "A Patparganj industrial visit can include waiting for access, diagnosis, work and customer acceptance. Keep these stages in the service record and compare them with available vehicle trip timestamps; a parked van does not measure technician working time or prove the equipment is ready to restart. Pilot a completed visit and one requiring a return appointment, checking fresh versus delayed positions and report access before relying on fleet reports for service reviews."
      }
    ],
    "faqs": [
      {
        "question": "Does a Patparganj vehicle stop measure the time spent repairing a machine?",
        "answer": "No. A stop may include waiting, diagnosis and customer review as well as work. Compare supported vehicle timestamps with the job card and customer acknowledgement; location alone cannot establish labour time or repair completion."
      },
      {
        "question": "How should unused or removed parts be recorded after a Patparganj visit?",
        "answer": "List fitted, unused and removed items separately under the service-job reference, with the agreed return recipient and handover record. A van returning to base cannot identify the parts it carries or prove that a customer repair is complete."
      }
    ]
  },
  "janakpuri": {
    "name": "Janakpuri",
    "description": "Plan GPS tracking for Janakpuri office courier rounds. Record sealed-packet references, recipient acknowledgements and undelivered items separately from vehicle stops.",
    "source": "https://dda.gov.in/faq-1",
    "sourceLabel": "DDA: district centres including Janakpuri",
    "related": "/gps-tracker/delhi/west/vikaspuri",
    "relatedLabel": "Vikaspuri group transport planning",
    "cases": [
      {
        "title": "Identify the office within Janakpuri District Centre",
        "text": "DDA lists Janakpuri among Delhi district centres. For an office courier round here, record the building, office or unit, receiving desk and appointment reference. Confirm whether reception can accept the packet or the named recipient must receive it. District Centre is a destination area, not a complete delivery address; agree the vehicle stopping arrangement with the receiver before dispatch."
      },
      {
        "title": "Track sealed packets with references outside the GPS label",
        "text": "Give each document packet its own dispatch reference and record who may acknowledge receipt. Keep confidential document contents and unnecessary recipient details out of shared vehicle labels. A vehicle arriving near a Janakpuri office can support the journey record, but it cannot verify a seal, identify the contents or establish that the authorised recipient accepted the packet. Retain that evidence in the courier handover record."
      },
      {
        "title": "Reconcile undelivered packets when the courier returns",
        "text": "If reception declines a packet or the recipient is unavailable, record the attempted visit and the agreed next action under the original reference. At return to base, reconcile delivered, returned and still-outstanding packets rather than closing every item when the vehicle reaches the depot. Pilot a round with both an accepted packet and a failed delivery, then compare supported trip records with acknowledgements before choosing reporting access and retention."
      }
    ],
    "faqs": [
      {
        "question": "Can a Janakpuri GPS arrival prove that a confidential packet was delivered?",
        "answer": "No. Keep the packet reference, authorised recipient acknowledgement and any seal-condition note in the courier record. Vehicle location supports journey review but does not prove document contents, acceptance or custody."
      },
      {
        "question": "How should a failed Janakpuri office delivery appear in a fleet review?",
        "answer": "Record the attempted visit, reason for non-delivery and agreed return or retry under the packet reference. Reconcile it when the courier returns; a completed vehicle trip does not make an undelivered packet a completed delivery."
      }
    ]
  },
  "vikaspuri": {
    "name": "Vikaspuri",
    "description": "Plan GPS tracking for Vikaspuri sports-session transport. Match vehicles to dated sessions, confirm group departures and reconcile shared equipment on return.",
    "source": "https://dda.gov.in/play-fields",
    "sourceLabel": "DDA: Vikaspuri C Block play field",
    "related": "/gps-tracker/delhi/west/janakpuri",
    "relatedLabel": "Janakpuri office courier planning",
    "cases": [
      {
        "title": "Agree the meeting point for the actual Vikaspuri session",
        "text": "DDA lists a play field at Vikaspuri C Block. For transport to a booked sports session, record the specific venue, date, session reference and coordinator-approved road meeting point. Confirm current venue use and access arrangements directly; a listed play field does not establish an available booking or a vehicle entrance. Keep a session destination separate from the place where a group boards the vehicle."
      },
      {
        "title": "Give consecutive sessions separate vehicle assignments",
        "text": "If a Vikaspuri vehicle serves an earlier group and then a later session, record each assignment and its agreed departure separately. When a session finishes late or moves venue, update the coordinator and preserve the revised pickup instruction. Confirm boarding through the responsible group leader; a parked vehicle does not show which group is ready. Use session references rather than unnecessary participant details in shared tracking labels."
      },
      {
        "title": "Check shared sports equipment before closing the return",
        "text": "Where a group carries shared kit, use a separate outbound and return equipment list alongside the transport booking. Record items retained by the organiser, collected by another vehicle or still at the venue. GPS cannot count balls, bags or other equipment. Pilot consecutive sessions with a changed return pickup, comparing supported trip history with group departure confirmations and kit handovers before regular use."
      }
    ],
    "faqs": [
      {
        "question": "Does a Vikaspuri vehicle marker confirm that a sports group is ready to leave?",
        "answer": "No. The responsible group leader should confirm readiness and boarding for the dated session. Review that confirmation with the assigned vehicle and its latest update time; vehicle location cannot establish who has boarded."
      },
      {
        "question": "Can GPS confirm that all shared kit returned from a Vikaspuri session?",
        "answer": "No. Reconcile the return equipment list with the organiser and record items retained or moved in another vehicle. Supported trip records show vehicle journeys, not an inventory of sports equipment."
      }
    ]
  },
pitampura: {
  "name": "Pitampura",
  "description": "Plan GPS tracking for Pitampura exhibition deliveries. Confirm the correct Dilli Haat venue, separate stall consignments and reconcile equipment returns after an event.",
  "source": "https://delhitourism.gov.in/tourist_place/pitampura.html",
  "sourceLabel": "Delhi Tourism: Dilli Haat Pitampura",
  "related": "/gps-tracker/delhi/central-north",
  "relatedLabel": "Central North Delhi fleet planning",
  "cases": [
    {
      "title": "Confirm Pitampura rather than another Dilli Haat venue",
      "text": "Delhi Tourism lists separate Dilli Haat venues at Pitampura, INA and Janakpuri. For an exhibition delivery, include Pitampura, the event date, organiser and agreed receiving point on the dispatch instruction. Confirm unloading arrangements with the organiser before travel. A booking saying only Dilli Haat is incomplete, and a public visitor entrance is not automatically the goods receiving point."
    },
    {
      "title": "Match every stall consignment to its own handover",
      "text": "Dilli Haat Pitampura includes craft stalls and exhibition spaces. If one vehicle carries material for several exhibitors, keep each stall or exhibitor reference, package list and receiving acknowledgement separate. Use supported stop times to review the vehicle visit; GPS cannot identify which display items were unloaded or establish that every exhibitor accepted their consignment. This is independent planning guidance, not a claim of venue affiliation."
    },
    {
      "title": "Keep event pack-down separate from the original delivery",
      "text": "For a later collection in Pitampura, ask each exhibitor which display equipment, empty packaging or unsold items are ready to return. Give the collection its own booking and list anything left at the venue. An earlier delivery visit does not confirm pack-down readiness. Pilot a delivery and collection on different days, comparing supported trip records with item handovers before confirming reporting access, vehicle suitability and fitting arrangements."
    }
  ],
  "faqs": [
    {
      "question": "What should a Pitampura exhibition delivery instruction include?",
      "answer": "Specify Dilli Haat Pitampura rather than just Dilli Haat, then add the event date, exhibitor reference, organiser contact and confirmed goods receiving point. Check unloading arrangements directly; a map destination does not grant access."
    },
    {
      "question": "Can GPS confirm that all Pitampura event equipment returned?",
      "answer": "No. Reconcile the collection list with individual exhibitor handovers and note items still at the venue. Vehicle trip history can support the journey review but cannot count display equipment or prove custody."
    }
  ]
},
rohini: {
  "name": "Rohini",
  "description": "Plan GPS tracking for Rohini commercial service visits. Identify the correct district centre, match vehicle visits to equipment jobs and record replacement handovers.",
  "source": "https://dda.gov.in/architecture/district-centre",
  "sourceLabel": "DDA: Rohini district centres",
  "related": "/gps-tracker/delhi/north-west",
  "relatedLabel": "North West Delhi fleet planning",
  "cases": [
    {
      "title": "Distinguish Mangalam Place from the Sector 10 district centre",
      "text": "DDA lists Mangalam Place District Centre in Sector 3 and Twin District Centre in Sector 10, Rohini. For a commercial service appointment, record the centre, building, unit and receiving contact before assigning a vehicle. A booking labelled only Rohini district centre can send the driver to the wrong destination. Confirm the usable entrance with the customer; the DDA listing does not establish vehicle access or parking availability."
    },
    {
      "title": "Keep each equipment job separate from the service vehicle",
      "text": "When a Rohini service van visits several offices, link each appointment to the customer's equipment reference and technician job sheet. Record whether the visit is inspection, replacement delivery or collection. The van's GPS history can help review the journey, but does not identify equipment inside a building or confirm that an installation or repair was completed."
    },
    {
      "title": "Record replacement and return equipment at the same stop",
      "text": "A single Rohini office stop may involve delivering a replacement unit and collecting the old one. Keep separate handover references, item identifiers and receiving acknowledgements for both tasks. If only one task is completed, leave the other open. Pilot a round between the actual customer premises and compare supported trip records with these handovers before choosing device compatibility, reporting access and fitting arrangements."
    }
  ],
  "faqs": [
    {
      "question": "Which Rohini district centre should a service booking identify?",
      "answer": "Specify whether the appointment is at Mangalam Place in Sector 3, Twin District Centre in Sector 10 or another location. Include the building, unit and confirmed entrance; a generic Rohini district-centre pin is not enough."
    },
    {
      "question": "Can a Rohini GPS stop confirm both replacement delivery and old-equipment collection?",
      "answer": "No. Keep separate item and handover records for the delivery and collection. One vehicle stop may support both tasks, but location alone cannot identify the equipment, confirm acceptance or close an unfinished task."
    }
  ]
},
dwarka: {
  "name": "Dwarka",
  "description": "Plan GPS tracking for Dwarka society pickups: identify the sector and gate, review shared vehicle stops and handle a changed return entrance.",
  "source": "https://dmsouthwest.delhi.gov.in/about-district/administrative-setup/subdivision-blocks/",
  "sourceLabel": "South West Delhi district subdivision directory",
  "related": "/gps-tracker/delhi/south-west/najafgarh",
  "relatedLabel": "Najafgarh village service rounds",
  "cases": [
    {
      "title": "Give the driver a gate, not just a sector",
      "text": "For a pickup in a Dwarka housing society, put the sector, society name and agreed gate on the booking sheet. Confirm with the coordinator whether the vehicle should enter or meet the passenger outside. If the vehicle waits at a different gate, record that location separately so the passenger does not follow a pin to the wrong entrance."
    },
    {
      "title": "Review one vehicle stop against several bookings",
      "text": "Two passengers may use the same gate on the same round. Give each booking its own reference, then compare the vehicle’s stop time with the coordinator’s boarding record. A single stop can serve both bookings; it cannot tell the dispatcher that both passengers boarded."
    },
    {
      "title": "Test a changed gate on the return trip",
      "text": "Keep the outward pickup and return drop as separate tasks. If the coordinator changes the return gate, note when the instruction changed and which driver received it. On a trial run, check whether the available trip history distinguishes the two entrances. If it cannot, use the driver’s confirmed meeting point when reviewing a missed pickup."
    }
  ],
  "faqs": [
    {
      "question": "What address should I give for a Dwarka society pickup?",
      "answer": "Give the sector, society name, agreed gate and meeting instructions confirmed by the coordinator. A sector pin alone is too broad to identify the pickup point."
    },
    {
      "question": "Can one GPS stop prove everyone boarded at a Dwarka gate?",
      "answer": "No. Match the vehicle stop with a boarding confirmation for each booking. Keep a missed passenger or a changed return gate on the relevant booking record."
    }
  ]
},
najafgarh: {
  "name": "Najafgarh",
  "description": "Plan Najafgarh field-service rounds by village and customer site. Record a roadside meeting separately from the work location and review unfinished calls.",
  "source": "https://dmsouthwest.delhi.gov.in/about-district/administrative-setup/village-panchayats/",
  "sourceLabel": "South West Delhi district village directory",
  "related": "/gps-tracker/delhi/south-west/dwarka",
  "relatedLabel": "Dwarka society pickup planning",
  "cases": [
    {
      "title": "Distinguish the village from the service address",
      "text": "The district directory lists Ujwa, Dhansa and Najafgarh separately within the Najafgarh subdivision. For a call in Ujwa, record Ujwa and the actual premises rather than sending the driver to a generic Najafgarh pin. Ask the customer for the approach point and whether the assigned vehicle can reach it before grouping calls into a round."
    },
    {
      "title": "Record where the service van stops and where the work happens",
      "text": "If a customer meets the technician at a roadside landmark and walks them to the site, keep both locations on the job sheet. The van tracker stays with the van. Use the technician’s job record to explain time away from the vehicle; a stationary vehicle does not mean the technician was idle or that the repair was finished."
    },
    {
      "title": "Leave an unresolved call open on depot return",
      "text": "Suppose a van returns after a Dhansa visit because a replacement part is needed. Record the part request and the next agreed appointment against the original job. Compare the two dated vehicle visits separately. Returning to the depot closes a journey, while the customer’s job remains open until the work is confirmed."
    }
  ],
  "faqs": [
    {
      "question": "Is a Najafgarh subdivision pin enough for a village service call?",
      "answer": "No. Record the village, customer premises and confirmed vehicle approach point. The subdivision identifies the wider area, not the location of the job."
    },
    {
      "question": "How do I review an unfinished call when the van returns to base?",
      "answer": "Close the vehicle journey but leave the service job open. Record what is needed, link the next appointment to the original job and confirm the outcome from the technician’s report."
    }
  ]
},
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
