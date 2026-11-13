export type HaryanaPriorityGuide = { source?: string; sourceLabel?: string; title: string; description: string; cases: { title: string; text: string }[]; faqs: { question: string; answer: string }[] };
export const priorityGuides: Record<string, HaryanaPriorityGuide> = {
  "kurukshetra": {
    "title": "GPS Tracker in Kurukshetra District, Haryana",
    "description": "Plan Kurukshetra GPS tracking for paddy and rice dispatches. Separate milling stages, by-product loads and tractor-trailer assignments in your trip records.",
    "source": "https://kurukshetra.gov.in/economy/",
    "sourceLabel": "Kurukshetra district administration: agricultural economy",
    "cases": [
      {
        "title": "Separate incoming paddy from outgoing rice",
        "text": "Kurukshetra's district economy guide identifies rice cultivation and rice-processing units. When planning a mill journey, label the load as incoming paddy, processed rice or another specified material, with its own dispatch reference and receiver. Keep the milling job separate from the transport job: a vehicle reaching the mill does not establish that processing has finished or that the resulting rice has been dispatched."
      },
      {
        "title": "Give milling by-products their own dispatch record",
        "text": "If a Kurukshetra milling operation sends husk or bran to a different buyer, create a separate load reference with the material, agreed quantity unit and receiving premises. Link that movement to the relevant milling record without treating it as the rice delivery. Reconcile the buyer acknowledgement against that specific load; a route trace cannot identify a by-product or calculate the milling yield."
      },
      {
        "title": "Record tractor and trailer changes during a load cycle",
        "text": "For a Kurukshetra agricultural journey using a detachable trailer, record the towing vehicle, trailer identifier and the time of any reassignment. If the tractor leaves a loaded trailer at a mill and takes another away, keep both handovers in the dispatch record. A tracker fitted only to the tractor reports that device position, not the detached trailer. Pilot a complete loading, uncoupling and return cycle and confirm any separate trailer hardware before relying on an asset-location report."
      }
    ],
    "faqs": [
      {
        "question": "Can GPS confirm that Kurukshetra paddy has become a completed rice order?",
        "answer": "No. Keep the mill processing record and finished-rice dispatch acknowledgement separately from vehicle movements. Reaching or leaving a mill does not identify the material carried, its quantity or the milling yield."
      },
      {
        "question": "Will a tractor GPS show a trailer left at a Kurukshetra mill?",
        "answer": "A tracker installed only on the tractor follows that device, not the detached trailer. Record the trailer handover and reassignment, and confirm suitable separate hardware if you need to locate the trailer independently."
      }
    ]
  },
  "pehowa": {
    "title": "GPS Tracker in Pehowa, Kurukshetra",
    "description": "Plan GPS tracking for Pehowa dairy collection journeys. Match collection lots and receiving records, distinguish quality evidence and reconcile container returns.",
    "source": "https://cisharyana.in/home/industries_list?dept_id=3&distt_id=11",
    "sourceLabel": "Haryana Central Inspection System: Kurukshetra industry addresses",
    "cases": [
      {
        "title": "Keep each dairy collection lot tied to its pickup record",
        "text": "Haryana's industry register lists a milk-foods establishment on Kaithal Road in Pehowa. If planning dairy collection journeys around the town, give each pickup a supplier or collection-point reference, recorded time, quantity unit and receiving destination. Several collections on one vehicle journey need separate lot records. Compare supported trip timestamps with those records; a vehicle stop cannot identify whose milk was collected or how much was loaded."
      },
      {
        "title": "Use receiving evidence for quality and temperature questions",
        "text": "For a Pehowa dairy delivery, match the receiver's sample reference, accepted quantity and any rejection reason to the collection lots being handed over. Keep temperature readings with their measurement time and the equipment that produced them. GPS position or time on the road does not establish milk quality or temperature. Confirm any required sensor hardware and reporting integration separately; this location guide does not promise those capabilities."
      },
      {
        "title": "Separate milk delivery from can returns and cleaning records",
        "text": "Where a Pehowa collection round uses reusable cans, record can identifiers or counts issued, received and still outstanding separately from the milk quantity. Keep empty-can return and cleaning confirmation as distinct records even when they accompany the next pickup. Trial a complete collection, receipt and container-return round against the available trip export, and confirm fitting arrangements, report access and retention for the actual vehicle."
      }
    ],
    "faqs": [
      {
        "question": "Can Pehowa vehicle GPS confirm milk quality or temperature?",
        "answer": "No. Use the receiver's quality checks and separately recorded temperature measurements, matched to the relevant collection lots. Confirm sensor hardware and reporting support independently; a route trace does not measure either quality or temperature."
      },
      {
        "question": "Should a Pehowa milk delivery also close the empty-can balance?",
        "answer": "Only reconcile cans from the actual container handover record. Record milk quantity, returned cans, outstanding cans and cleaning confirmation separately; vehicle arrival cannot count containers or prove they were cleaned."
      }
    ]
  },
  "yamunanagar": {
    "title": "GPS Tracker in Yamunanagar District, Haryana",
    "description": "Plan GPS tracking for Yamunanagar plywood dispatches. Keep board specifications with load references, record receiving exceptions and test reporting on factory rounds.",
    "source": "https://yamunanagar.nic.in/economy/",
    "sourceLabel": "Yamunanagar district administration: local industries",
    "cases": [
      {
        "title": "Identify the plywood load beyond the vehicle number",
        "text": "Yamunanagar's district economy page identifies plywood manufacturing among its industries. For a board dispatch, keep the supplier's grade, thickness, sheet dimensions and bundle or sheet quantity with the load reference. Specify which unit is being counted so a bundle total is not mistaken for a sheet total. Link the assigned vehicle to that record; the vehicle marker cannot identify the board specification or quantity on board."
      },
      {
        "title": "Record sheet and packaging exceptions at receipt",
        "text": "For a Yamunanagar plywood delivery, ask the receiver to record any count difference or visible edge, surface or wrapping issue against the affected load reference. Keep the receiving note and any authorised photographs with the order. Compare the relevant trip and stop timestamps with that evidence, without treating a route trace as proof of cargo condition or when damage occurred. GPS alone does not measure board moisture or verify weather protection."
      },
      {
        "title": "Test reporting at the factory loading point and receiver",
        "text": "Pilot the actual Yamunanagar factory-to-receiver route before adding more vehicles. Compare reported position timestamps at loading, departure and receipt with the dispatch record, and check whether delayed updates remain distinguishable from current positions. Review the available trip export with the person handling delivery disputes. Confirm hardware placement, mobile-network availability, report retention and fitting access for the operating vehicle rather than assuming every industrial premises has the same conditions."
      }
    ],
    "faqs": [
      {
        "question": "Can GPS confirm a Yamunanagar plywood grade or sheet count?",
        "answer": "No. Retain the supplier specification and quantity unit in the load record, then reconcile them with the receiver's acknowledgement. GPS helps associate a vehicle journey with the dispatch but cannot identify the boards carried."
      },
      {
        "question": "Does a plywood delivery route prove when damage occurred?",
        "answer": "No. Review receiving notes and authorised condition photographs alongside the relevant trip timestamps. Location records alone cannot establish cargo condition, moisture or the time and cause of damage."
      }
    ]
  },
  "jagadhri": {
    "title": "GPS Tracker in Jagadhri, Yamunanagar",
    "description": "Plan GPS tracking for Jagadhri metal and utensil jobs. Distinguish pieces from sets, track workshop processing stages and reconcile finished goods with unused material.",
    "source": "https://yamunanagar.nic.in/town-jagadhri/",
    "sourceLabel": "Yamunanagar district administration: Jagadhri town and industry",
    "cases": [
      {
        "title": "State the quantity unit for each utensil dispatch",
        "text": "The district's Jagadhri guide describes its metal industry, including brassware and stainless steel products. For a utensil order, record the item or set reference and whether the dispatch quantity means individual pieces, complete sets or cartons. Keep the pack composition with the order where it matters. A carton count or vehicle visit alone cannot establish that each requested set is complete."
      },
      {
        "title": "Keep workshop processing stages separate from customer delivery",
        "text": "If a Jagadhri metal job moves to another workshop for polishing or another agreed process, label that journey with the job reference and expected processing stage. Record what the workshop accepted and which items remain due back. Keep the workshop stop distinct from the final customer destination; reaching the processor does not prove that the work has finished or that finished goods have reached the buyer."
      },
      {
        "title": "Reconcile finished pieces and unused material on return",
        "text": "When a Jagadhri processing job returns, record finished pieces, rejected items and unused material separately, using the agreed quantity or weight units. Do not classify everything arriving on the return vehicle as completed stock. Trial an outward workshop job and its return against supported trip records and the job ledger, then confirm who can access reports, how long records are retained and how the actual vehicle will be fitted."
      }
    ],
    "faqs": [
      {
        "question": "Can a Jagadhri GPS stop prove a utensil set is complete?",
        "answer": "No. Use the order's set composition, packing record and receiving acknowledgement to verify completeness. Vehicle location cannot count the pieces inside a carton or identify missing components."
      },
      {
        "question": "How should a Jagadhri workshop return be reconciled?",
        "answer": "Link it to the original processing job and record finished pieces, rejected items and unused material separately. Compare the return journey with the workshop handover record; vehicle arrival is not proof that all returned material is finished stock."
      }
    ]
  },
  "sonipat": {
    "title": "GPS Tracker in Sonipat District, Haryana",
    "description": "Plan GPS tracking for Sonipat industrial transfers. Match dispatch and receiving sites, reconcile returnable pallets or crates, and review repeat shuttle journeys.",
    "source": "https://sonipat.gov.in/department/hsidc/",
    "sourceLabel": "Sonipat district administration: HSIIDC Kundli directory",
    "cases": [
      {
        "title": "Identify both ends of an industrial transfer",
        "text": "Kundli is part of Sonipat district's industrial setting, with an HSIIDC office listed in the district directory. For a transfer between a Kundli premises and another Sonipat location, record separate dispatch and receiving site codes, exact entrances and the transfer reference. Two sites belonging to the same business still need separate journey endpoints; an office address is not automatically the loading premises."
      },
      {
        "title": "Reconcile returnable pallets and crates separately",
        "text": "If a Sonipat industrial delivery uses returnable pallets or crates, record the number issued, accepted back and left outstanding against the transfer. Keep empty-container collection distinct from the goods delivery, even when both happen on one vehicle visit. Vehicle GPS cannot count packaging or prove that it was returned. Use the signed exchange record to resolve a container balance rather than closing it from a geofence event."
      },
      {
        "title": "Give each shuttle circuit its own transfer reference",
        "text": "A vehicle shuttling repeatedly between Sonipat sites may follow the same route several times. Pair each outward movement with its own receiving record and return assignment; do not reuse the first completed transfer for later circuits. Pilot a working shift with a goods delivery and an empty-container collection, comparing supported trip timestamps with the transfer register before choosing reporting access and fitting arrangements."
      }
    ],
    "faqs": [
      {
        "question": "Can GPS confirm a Sonipat pallet or crate balance?",
        "answer": "No. Keep issued, returned and outstanding quantities in the container exchange record. GPS can help match a vehicle visit to that record, but cannot count packaging or confirm its condition."
      },
      {
        "question": "How can repeated Sonipat shuttle trips be distinguished?",
        "answer": "Assign a separate transfer reference to each circuit, with dispatch and receiving sites, handover records and the return task. Match those references to supported trip timestamps instead of treating all visits between the same sites as one transfer."
      }
    ]
  },
  "gohana": {
    "title": "GPS Tracker in Gohana, Sonipat",
    "description": "Plan GPS tracking for Gohana grain-market transport. Keep crop lots separate, match weighing slips to the right journey and confirm onward unloading instructions.",
    "source": "https://hsamb.org.in/grain-market",
    "sourceLabel": "Haryana State Agricultural Marketing Board: grain markets",
    "cases": [
      {
        "title": "Keep each grain lot tied to its vehicle assignment",
        "text": "The Haryana State Agricultural Marketing Board lists Gohana as a grain market. For a market-bound load, record the crop lot reference, originating pickup and assigned vehicle, and confirm the actual receiving yard with the coordinator. If several lots share a vehicle, keep their records distinct. A Gohana map position cannot identify the grower, crop grade or lot carried, and this guide does not state current procurement arrangements."
      },
      {
        "title": "Match weighing records to the correct load cycle",
        "text": "Where the Gohana transport job includes weighing, retain the weighbridge slip reference, vehicle registration, recorded weight and timestamp with that load. If loaded and empty readings are required, pair the readings for the same load cycle rather than combining slips from different trips. GPS movement can help review the visit sequence; it cannot measure crop weight, moisture or quality, or replace the weighing record."
      },
      {
        "title": "Confirm the unloading destination after the market visit",
        "text": "A Gohana market visit may be followed by an instructed journey to storage or another receiver. Record that destination and who authorised it before dispatching the next leg. Keep unloading acknowledgement separate from market arrival and vehicle departure. Trial a market-to-receiver journey with supported trip records, checking location freshness and access for the coordinator, then confirm compatible hardware, installation and renewal costs for the actual vehicle."
      }
    ],
    "faqs": [
      {
        "question": "Can vehicle GPS measure a Gohana grain load?",
        "answer": "No. Use the relevant weighing records for weight and the authorised inspection records for crop quality. Associate the slips and lot reference with the correct vehicle journey; a location event cannot replace those records."
      },
      {
        "question": "Does arrival at Gohana grain market complete the transport job?",
        "answer": "Only if the agreed task ends there and its handover is confirmed. If onward unloading is required, retain the receiver instruction and track that journey leg separately until its own acknowledgement is recorded."
      }
    ]
  },
"rohtak": {
  "title": "GPS Tracker in Rohtak District, Haryana",
  "description": "Plan GPS tracking for Rohtak campus deliveries. Separate gate arrival, department handover and unreceived consignments when reviewing vehicle journeys.",
  "source": "https://rohtak.gov.in/public-utility-category/universities/",
  "sourceLabel": "Rohtak district administration: universities",
  "cases": [
    {
      "title": "Identify the campus department receiving the delivery",
      "text": "Rohtak's university directory includes Maharshi Dayanand University and other institutions. For a campus delivery, record the institution, department, receiving contact and agreed vehicle entrance. Confirm entry arrangements directly before dispatch. A university address or map pin does not identify the department store or grant vehicle access; this planning example does not imply a NAVII GPS institutional partnership."
    },
    {
      "title": "Separate the gate stop from the consignment handover",
      "text": "A Rohtak delivery vehicle may stop at an entrance before proceeding to the receiving department. Keep the gate arrival and actual handover as separate events in the delivery record. Match the receiver acknowledgement to the consignment reference. GPS stop history supports movement review but cannot establish that staff checked or accepted the items."
    },
    {
      "title": "Keep unreceived items open when the vehicle returns",
      "text": "If a campus receiver is unavailable, record which items remain on the vehicle and the agreed next action. Do not mark the order delivered merely because the vehicle entered the campus or returned to its depot. Trial a partly completed delivery round and compare supported trip exports with individual handover records before selecting reporting access, retention and installation arrangements."
    }
  ],
  "faqs": [
    {
      "question": "Does a GPS stop at a Rohtak campus prove delivery?",
      "answer": "No. A stop records vehicle movement, not acceptance of a consignment. Keep the department, order reference and receiver acknowledgement alongside the trip record; an entrance stop may precede the actual handover."
    },
    {
      "question": "How should an unsuccessful Rohtak campus delivery be recorded?",
      "answer": "Keep the unreceived items and reason against the original order, confirm their return or next delivery instruction, and retain the receiver response. Vehicle return to the depot does not close the delivery."
    }
  ]
},
"meham": {
  "title": "GPS Tracker in Meham, Rohtak",
  "description": "Plan GPS tracking for Meham document courier rounds. Confirm the receiving office, distinguish a vehicle visit from a receipt and record return collections.",
  "source": "https://rohtak.gov.in/divisions/sub-division/",
  "sourceLabel": "Rohtak district administration: subdivision offices",
  "cases": [
    {
      "title": "Confirm the office before sending a Meham courier",
      "text": "Rohtak district's subdivision directory lists an SDM office at Meham. For a document courier journey, confirm the exact receiving office, department and appointment directly with the recipient. A Meham-area address is not automatically a booking at the SDM office. Keep current opening times and acceptance requirements separate from the vehicle route plan."
    },
    {
      "title": "Match the receipt to the envelope reference",
      "text": "For a Meham courier carrying several document packets, use a separate dispatch reference and receipt for each handover. Keep confidential document details in the authorised work record rather than a shared vehicle-location link. A GPS visit cannot prove that a packet was submitted, checked or accepted, and should not replace the recipient's acknowledgement."
    },
    {
      "title": "Treat the return collection as a separate task",
      "text": "If a document must be collected later from Meham, confirm that it is ready and assign a collection instruction linked to the original dispatch. Do not infer readiness from a previous visit. Pilot an outward submission and later collection with supported trip records, checking timestamps, user access and fitting arrangements for the courier's actual vehicle."
    }
  ],
  "faqs": [
    {
      "question": "Can a Meham GPS visit replace a document receipt?",
      "answer": "No. Keep the recipient's acknowledgement against the packet reference. Vehicle location can support journey review, but cannot confirm submission, acceptance or processing of documents."
    },
    {
      "question": "Should a Meham return collection be inferred from the original trip?",
      "answer": "No. Confirm readiness with the receiving office and record a separate collection task. Link it to the original dispatch reference and reconcile the actual collection acknowledgement with the assigned vehicle journey."
    }
  ]
},
"hisar": {
  "title": "GPS Tracker in Hisar District, Haryana",
  "description": "Plan GPS tracking in Hisar for multi-desk fleet dispatch. Review vehicle responsibility, overlapping orders and shift handovers across district destinations.",
  "source": "https://commhsr.haryana.gov.in/about-division/",
  "sourceLabel": "Hisar Divisional Commissioner: district and tehsil directory",
  "cases": [
    {
      "title": "Assign a dispatch owner for each Hisar-area journey",
      "text": "The Hisar divisional directory lists Hisar, Adampur and Barwala tehsils within Hisar district, with Hansi listed separately. For vehicles serving several destinations, identify the actual receiving premises and one dispatcher responsible for each journey. Keep the operating depot separate from the customer destination so a district label does not become a default delivery address."
    },
    {
      "title": "Resolve competing vehicle requests before departure",
      "text": "If two dispatch desks request the same Hisar-based vehicle, record which order has been accepted and which remains unassigned. Share the dated assignment with both desks before releasing the vehicle. Check the latest location timestamp as supporting information, but confirm availability with the responsible coordinator; a parked marker does not show whether the vehicle is already committed to another order."
    },
    {
      "title": "Hand over open exceptions with the shift",
      "text": "At a dispatcher shift change, pass on the active order, next confirmed stop, outstanding receiver response and agreed return point. Keep the time of the handover and name of the receiving dispatcher in the work log. Trial a journey spanning a shift change against supported trip records and confirm platform access, reporting retention and fitting arrangements for the actual base before rollout."
    }
  ],
  "faqs": [
    {
      "question": "Can the nearest Hisar vehicle automatically take another order?",
      "answer": "No. Check its existing assignment and confirm availability with the responsible dispatcher. The latest GPS position supports coordination but cannot establish load capacity, driver readiness or release from a previous booking."
    },
    {
      "question": "What should a Hisar dispatcher hand over at a shift change?",
      "answer": "Pass on the active order reference, assigned vehicle, next confirmed stop, unresolved exceptions and agreed return point. Retain the handover time and compare supported journey records with the plan in force for that shift."
    }
  ]
},
"hansi": {
  "title": "GPS Tracker in Hansi District, Haryana",
  "description": "Plan GPS tracking in Hansi district with current destination records. Separate Hansi, Narnaund and Bass jobs and reconcile older Hisar address labels.",
  "source": "https://hansi.haryana.gov.in/administrative-setup/",
  "sourceLabel": "Hansi district administration: tehsil and sub-tehsil setup",
  "cases": [
    {
      "title": "Use Hansi district destinations explicitly",
      "text": "Hansi is a separate district; its administration lists Hansi, Narnaund and Bass tehsils and Kheri Jalab sub-tehsil. Keep the actual customer premises and town or village in each dispatch record. A Hansi district booking is not necessarily a stop in Hansi city, and an administrative office is not a substitute for the receiver’s address."
    },
    {
      "title": "Reconcile older Hisar labels without creating a second customer",
      "text": "If an older customer record labels a Hansi-area destination as Hisar, confirm the current district and exact premises with the receiver before changing it. Retain the existing customer reference and an audit note explaining the corrected label. Do not create a duplicate receiving site merely because its district field changes, or move its map pin to a district headquarters."
    },
    {
      "title": "Compare route reports using the address version for that trip",
      "text": "For rounds involving Hansi, Narnaund or Bass destinations, retain the dispatch sheet used on the journey date. When an address label is corrected later, keep historic orders traceable to the original reference. Pilot a repeat visit after a label correction and confirm supported report exports, access and installation arrangements. GPS evidence can help identify the vehicle visit; it does not verify administrative boundaries or delivery acceptance."
    }
  ],
  "faqs": [
    {
      "question": "Should Hansi jobs still be grouped under Hisar district?",
      "answer": "Hansi is a separate district. Use the current district and the exact receiving premises for new planning, while retaining older customer and order references so historical journeys remain traceable."
    },
    {
      "question": "Does correcting a Hansi customer’s district require a new GPS location?",
      "answer": "Not necessarily. Confirm the actual premises and map position with the receiver. Correct the address label without creating a duplicate site or moving a valid pin to the district headquarters; retain a record of the change."
    }
  ]
},
"panipat": {
  "title": "GPS Tracker in Panipat District, Haryana",
  "description": "Plan GPS tracking in Panipat for textile dispatches. Match roll and bale references, loading sequences and customer receiving records to vehicle journeys.",
  "source": "https://panipat.gov.in/industries/",
  "sourceLabel": "Panipat district administration: textile and Samalkha foundry industries",
  "cases": [
    {
      "title": "Identify textile rolls and bales before dispatch",
      "text": "Panipat is known for textiles, carpets and blankets. For a textile dispatch, list the roll or bale identifiers, customer order and receiving premises before assigning the vehicle. Keep packing quantities and product details in the dispatch sheet; a vehicle tracker cannot identify fabric, colour, roll length or the items on board."
    },
    {
      "title": "Review loading order against the delivery sequence",
      "text": "When a Panipat vehicle carries textile orders for several receivers, agree the delivery sequence before loading and retain a separate acknowledgement for each order. If the sequence changes, confirm with the dispatch team whether the required consignment can be reached without unloading other orders. GPS stop history supports journey review but does not show the physical arrangement of the load."
    },
    {
      "title": "Record packaging exceptions at the receiving point",
      "text": "Keep any wet, torn or missing packaging observations with the receiver record and the affected roll or bale reference. Compare the assigned vehicle journey with that record without treating location or waiting time as proof of cargo condition. Pilot a multi-customer round and confirm available trip exports, retention and fitting arrangements before fleet rollout."
    }
  ],
  "faqs": [
    {
      "question": "Can GPS identify a Panipat textile roll or its condition?",
      "answer": "No. Keep roll identifiers, quantities and packaging condition in the dispatch and receiving records. Vehicle GPS can help review the journey, but does not establish fabric specifications, moisture or damage."
    },
    {
      "question": "How should a changed Panipat delivery sequence be reviewed?",
      "answer": "Retain the revised stop order and confirm that the planned consignment can be unloaded at each receiver. Reconcile supported stop timestamps with individual order acknowledgements; the first delivery does not close the remaining textile orders."
    }
  ]
},
"samalkha": {
  "title": "GPS Tracker in Samalkha, Panipat",
  "description": "Plan GPS tracking in Samalkha for foundry collections. Confirm release readiness, loading appointments and casting return references alongside vehicle trips.",
  "source": "https://panipat.gov.in/industries/",
  "sourceLabel": "Panipat district administration: textile and Samalkha foundry industries",
  "cases": [
    {
      "title": "Confirm foundry release before sending a vehicle",
      "text": "Samalkha is in Panipat district and has foundry activity associated with agricultural implements. For a casting collection, confirm the order reference, supplier release and actual loading premises before dispatch. Separate production or inspection clearance from vehicle arrival; reaching the foundry does not mean a consignment is ready to load."
    },
    {
      "title": "Coordinate the loading appointment with the supplier",
      "text": "Ask the Samalkha supplier to confirm the loading window, receiving contact and handling arrangements suitable for the consignment and vehicle. Record a postponed appointment separately from a driver delay. Compare supported arrival and departure times with the loading note; GPS cannot confirm lifting capacity, load securing or weight."
    },
    {
      "title": "Keep rejected castings separate from the next collection",
      "text": "If castings return for inspection or rework, link the return reference to the original order and list the items accepted back by the supplier. Keep this return task separate from any fresh collection on the same vehicle. Trial the outward and return legs against available trip records and confirm hardware, reporting and installation requirements for the actual operating base."
    }
  ],
  "faqs": [
    {
      "question": "Does a Samalkha foundry arrival prove a casting is ready?",
      "answer": "No. Confirm production or inspection release with the supplier before dispatch. Use vehicle timestamps to review the collection journey, and keep the loading acknowledgement with the order reference."
    },
    {
      "question": "Can GPS confirm casting weight or acceptance of a rework return?",
      "answer": "No. Use the relevant weighing, inspection and supplier acceptance records. Link a returned casting to its order and vehicle journey; location data alone cannot measure the load or prove acceptance for rework."
    }
  ]
},
"karnal": {
  "title": "GPS Tracker in Karnal District, Haryana",
  "description": "Plan GPS tracking in Karnal district for agricultural service rounds. Record field access points, equipment job references and workshop follow-up journeys.",
  "source": "https://karnal.gov.in/about-district/",
  "sourceLabel": "Karnal district administration",
  "cases": [
    {
      "title": "Locate the field entrance, not only the village",
      "text": "Karnal district includes agricultural operations around towns such as Indri, Nilokheri, Assandh and Gharaunda. For an equipment service call, record the village, customer reference and agreed vehicle-access point separately from the field or work-site pin. Confirm the usable approach with the customer before travel. A map route does not establish that a lane is suitable for the assigned vehicle."
    },
    {
      "title": "Keep the service vehicle separate from the equipment job",
      "text": "When a Karnal field team travels to a pump, implement or other customer equipment, link the job reference to the assigned service vehicle and planned parts. Review the vehicle journey against the technician report. The tracker in a service van does not report the operating hours, condition or location of a separate machine left at the site."
    },
    {
      "title": "Track workshop follow-ups as separate legs",
      "text": "If a field repair needs a workshop visit or a part must be collected before returning, give those movements separate tasks linked to the original service call. Record who holds any removed item and whether the customer equipment remains out of service. Pilot a full field-to-workshop-to-field round, checking supported trip records and report timestamps before using them for dispatch review."
    }
  ],
  "faqs": [
    {
      "question": "Does tracking a Karnal service van also track the farm equipment it visits?",
      "answer": "No. A tracker reports the vehicle or asset on which it is installed. Keep equipment identity, condition and service completion in the job record. Any separate equipment-tracking requirement needs its own suitability and installation assessment."
    },
    {
      "question": "What should I test on a Karnal rural service route?",
      "answer": "Test the actual access point, a customer stop, any workshop follow-up and the return journey. Compare the latest update time and available trip history with the job log. Confirm hardware compatibility, SIM/network requirements, supported reporting and fitting arrangements for the actual locations."
    }
  ]
},
"gharaunda": {
  "title": "GPS Tracker in Gharaunda, Karnal",
  "description": "Plan GPS tracking in Gharaunda for nursery pickups and vegetable consignments. Keep lot records, receiving windows and handling checks alongside vehicle trips.",
  "source": "https://ulbharyana.gov.in/Gharaunda/772",
  "sourceLabel": "Municipal Committee Gharaunda",
  "cases": [
    {
      "title": "Identify the nursery or produce collection point",
      "text": "Gharaunda is in Karnal district and is home to a Centre of Excellence for Vegetables. For your own nursery or vegetable dispatch, record the actual supplier premises, lot reference and receiving destination before assigning a vehicle. This planning example does not imply that NAVII GPS serves the centre or has an institutional partnership."
    },
    {
      "title": "Keep tray counts and condition checks with the lot",
      "text": "Where a Gharaunda nursery load contains several plant varieties or tray lots, keep the labels, quantities and collection condition in the dispatch record. Match each delivery acknowledgement to its lot and assigned vehicle. GPS trip history can help review the journey, but cannot count plants, confirm variety or establish damage, moisture or temperature without separately specified equipment and procedures."
    },
    {
      "title": "Review receiving windows before changing the stop order",
      "text": "For a vegetable or nursery round leaving Gharaunda, agree the receiving window and handling instructions with each customer. If a stop is delayed or resequenced, record the change and confirm that the receiver can still accept the consignment. During a pilot, compare actual trip timestamps with the lot handover records; location tracking alone cannot guarantee freshness or suitability on arrival."
    }
  ],
  "faqs": [
    {
      "question": "Can GPS confirm that a Gharaunda nursery load arrived in good condition?",
      "answer": "No. Confirm quantities and condition at collection and receipt using the lot record. Vehicle GPS describes movement; it does not by itself measure plant condition, cargo temperature or handling quality."
    },
    {
      "question": "Does this Gharaunda guide imply a government-centre partnership or local NAVII branch?",
      "answer": "No. The centre is mentioned only as local horticulture context. Share your actual vehicle location and use case with NAVII GPS to confirm hardware, reporting, fitting availability and costs before booking."
    }
  ]
},
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

