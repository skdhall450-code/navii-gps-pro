export const ludhianaGuide = {
  "description": "Plan GPS tracking in Ludhiana district for manufacturing collections and job-work rounds. Reconcile supplier pickups, batch references and returnable packaging.",
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
    }
  ]
};

export const khannaGuide = {
  "description": "Plan GPS tracking in Khanna for market loads and warehouse trips. Separate vehicle queues, weighbridge records, unloading acknowledgements and empty return legs.",
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
    }
  ]
};
