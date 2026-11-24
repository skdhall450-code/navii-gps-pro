export const ludhianaGuide = {
  "description": "Plan Ludhiana manufacturing GPS tracking with supplier rounds, cycle-parts packing references, delivery discrepancies and returnable-container records.",
  "cases": [
    {
      "title": "Plan collections around the production batch",
      "text": "For hosiery or cycle-parts movements in Ludhiana, give each supplier collection a batch or job reference, the exact premises and an agreed pickup window. Keep material readiness separate from vehicle arrival. If a batch is not ready, record the revised collection plan rather than treating a nearby GPS position as evidence that loading took place."
    },
    {
      "title": "Follow job-work movements between premises",
      "text": "A manufacturing round may take materials to a processor and bring finished items back later. Link the outward and return legs to the same job reference, but record each handover separately. Retain quantities and acceptance notes in the production or dispatch record. Vehicle tracking can support movement review; it does not measure processing progress or identify the parts on board."
    },
    {
      "title": "Reconcile empty containers and unfinished collections",
      "text": "At the end of a Ludhiana collection round, account for returnable crates, rejected items and stops deferred to another day. Give each carry-forward task an owner and destination. Trial a real supplier round with the dispatcher and compare supported trip records with the collection sheet before expanding to more vehicles. Confirm fitting arrangements and reporting requirements for each operating location."
    },
    {
      "title": "Keep cycle-parts cartons tied to the receiving order",
      "text": "For a Ludhiana cycle-parts dispatch, list the part type, pack quantity and carton reference against each receiving order before loading. If frames, rims or smaller fittings travel in separate packages, record which packages belong together and which receiver expects them. Compare the assigned vehicle journey with that packing list; a vehicle arriving at the buyer does not prove that every component package arrived."
    },
    {
      "title": "Resolve a damaged or short package at the handover",
      "text": "When a receiver reports damaged packaging or a shortage, retain the affected carton reference, the quantity accepted and the unresolved balance. Link any receiver notes or photographs to the delivery record, then agree whether the vehicle carries a return or a replacement needs a later dispatch. Keep that decision distinct from the GPS arrival time so a completed trip does not silently close an incomplete parts order."
    }
  ],
  "faqs": [
    {
      "question": "Can GPS identify which Ludhiana production batch is in a vehicle?",
      "answer": "GPS location alone cannot identify a batch, quantity or processing status. Keep the batch reference and handover record in the dispatch system, then compare its assigned vehicle and time window with available trip history."
    },
    {
      "question": "What should a Ludhiana manufacturing fleet pilot include?",
      "answer": "Include a supplier collection, a job-work handover, a return trip and any returnable packaging. Agree how delayed batches and incomplete pickups are recorded. Confirm compatible hardware, supported reports, authorised access, fitting availability and full costs before rollout."
    },
    {
      "question": "How should a Ludhiana cycle-parts load with several cartons be tracked?",
      "answer": "Assign carton references and quantities to the receiving order and vehicle before departure. Record each package accepted at handover, including any package sent separately. Supported GPS history can help review the vehicle journey, but it cannot count cartons or identify missing components."
    },
    {
      "question": "Does a completed Ludhiana delivery trip close a parts shortage?",
      "answer": "No. Keep the shortage or damage record open against the order until the receiver and dispatcher agree the outcome. Record a return or replacement as its own assignment rather than using the original vehicle arrival as proof that the order is complete."
    }
  ]
};

export const khannaGuide = {
  "description": "Plan Khanna market and warehouse GPS trips with separate queue, weighing, quality-check and partial-delivery records, plus clear onward-load instructions.",
  "source": "https://ludhiana.nic.in/about-district/district-at-a-glance/",
  "sourceLabel": "Ludhiana district administration: Khanna market committee",
  "cases": [
    {
      "title": "Give each market load its own destination record",
      "text": "Khanna is listed among Ludhiana district market committees. For a market collection, record the trader or receiving premises, load reference and agreed vehicle entrance. Confirm the actual loading point with the receiver before departure. Use the dispatch record to distinguish a market pickup from an onward warehouse delivery; the town name alone is not a complete stop instruction."
    },
    {
      "title": "Keep queue time separate from weighing and unloading",
      "text": "For a Khanna load that requires a weighbridge visit, retain the ticket reference and its gross, tare or net weight as recorded by the weighing operator. Compare vehicle timestamps with those records to review the sequence. A GPS stop cannot measure cargo weight or show whether a vehicle was queuing, on the weighbridge or waiting for unloading."
    },
    {
      "title": "Assign the empty return or next load explicitly",
      "text": "After a Khanna delivery, record the receiving acknowledgement and whether the vehicle returns empty, collects packaging or proceeds to another load. If the plan changes while the vehicle waits, preserve the revised assignment and its time. Check one representative market-to-warehouse round during the pilot, including the return leg, before relying on supported trip reports for daily reconciliation."
    },
    {
      "title": "Record a sampling hold separately from a vehicle wait",
      "text": "If a Khanna market load needs sampling or a buyer quality check, retain the load or lot reference, who requested the check and the recorded decision before assigning the next stop. Distinguish waiting for a sample result from waiting for a loading bay. Vehicle location and dwell time cannot establish cargo quality, moisture or acceptance; those details must come from the responsible inspection or receiving record."
    },
    {
      "title": "Reconcile a load split between receiving premises",
      "text": "For a market-to-warehouse journey with more than one receiver, give each delivered portion its own quantity, destination and acknowledgement. After a partial delivery, update the remaining load and confirm the next receiving premises with the dispatcher. If a receiver declines part of the load, record its agreed return or onward instruction before the next leg; do not mark the whole load delivered because the first stop was completed."
    }
  ],
  "faqs": [
    {
      "question": "Can a Khanna GPS stop confirm cargo weight or unloading?",
      "answer": "No. Use the weighbridge ticket for weight and the receiving acknowledgement for unloading. Vehicle location and stop duration can help review the journey sequence, but do not establish either measurement or delivery acceptance."
    },
    {
      "question": "How should a Khanna empty return be recorded?",
      "answer": "Close the delivered load with its acknowledgement, then record a separate return or next-load assignment. An empty or loaded status must come from the operating record; GPS location alone cannot determine what the vehicle carries."
    },
    {
      "question": "Can a Khanna vehicle waiting at the market prove a quality check is complete?",
      "answer": "No. Record the sample or lot reference and the decision from the responsible buyer or inspection record. A GPS stop can help review when the vehicle waited, but cannot confirm the sampling outcome, moisture measurement or acceptance of the load."
    },
    {
      "question": "How should a Khanna load delivered to two warehouses be reconciled?",
      "answer": "Keep separate destination and acknowledgement records for each portion. After the first delivery, record the quantity remaining and confirm the next warehouse or return instruction. Review each assigned leg against supported trip history without treating one stop as acceptance of the entire load."
    }
  ]
};
