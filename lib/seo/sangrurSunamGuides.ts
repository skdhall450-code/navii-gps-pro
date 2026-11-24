export const sangrurGuide = {
  "description": "Plan GPS tracking for Sangrur dispatch addresses. Distinguish city gate landmarks from nearby towns, confirm the actual premises and review corrected journey records.",
  "cases": [
    {
      "title": "Separate Sangrur gate names from out-of-town destinations",
      "text": "Sangrur's district tourism page names Sunami Gate, Patiala Gate, Dhuri Gate and Nabha Gate as city landmarks associated with the directions of neighbouring towns. Keep the full address in each dispatch request: a stop near Dhuri Gate in Sangrur is different from a job in Dhuri town. Ask the receiver to confirm the town as well as the landmark before assigning a vehicle or saving a recurring destination."
    },
    {
      "title": "Save the customer premises separately from the landmark",
      "text": "For a Sangrur customer using a gate or bazaar as a reference, retain the premises name, road, receiving entrance and confirmed map point in the job record. Keep the landmark as a navigation note rather than the customer location itself. If supported geofences are used, trial them around the actual operating premises; passing a well-known gate must not automatically count as a customer visit."
    },
    {
      "title": "Review an address correction against the original assignment",
      "text": "When a Sangrur dispatch address was mistaken for a different town, retain the original instruction, corrected destination and time the driver received the change. Separate the correction journey from the intended customer leg when reviewing trip distance or delay. Before rollout, trial a city stop followed by an out-of-town assignment and compare supported trip records with the confirmed destinations and receiving acknowledgements."
    }
  ],
  "faqs": [
    {
      "question": "Is Dhuri Gate in Sangrur the same destination as Dhuri town?",
      "answer": "No. Dhuri Gate is a Sangrur city landmark; a job in Dhuri town needs its own address. Confirm the town, premises and receiving entrance rather than selecting a destination from the gate name alone."
    },
    {
      "question": "Should passing a Sangrur gate count as a completed customer visit?",
      "answer": "No. A landmark passage may be part of a through journey. Use the actual customer premises for supported location checks and confirm the visit or delivery with the relevant receiving record."
    }
  ]
};

export const sunamGuide = {
  "description": "Plan GPS tracking for Sunam college-visit transport. Confirm the named campus, use dated pickup bookings and coordinate replacement vehicles with limited data sharing.",
  "source": "https://sangrur.nic.in/public-utility-category/colleges/",
  "sourceLabel": "Sangrur district administration: college directory",
  "cases": [
    {
      "title": "Name the Sunam campus in the transport booking",
      "text": "The district directory lists Shaheed Udham Singh Government College on S.U.S College Road, Bakshiwala, Sunam Udham Singh Wala, and Guru Nanak Dev Dental College on Bathinda Road. A request for a Sunam college visit needs the full institution name and a confirmed meeting point. Check visitor entry arrangements with the institution directly; these location examples do not imply a NAVII GPS college partnership or transport service."
    },
    {
      "title": "Use a dated booking for each visit and return pickup",
      "text": "For an admission enquiry, meeting or other arranged Sunam college visit, record the date, requested arrival time and separate return instruction. A later appointment at the same campus is a new transport task, not a continuation inferred from the previous trip. Use the coordinator's confirmation for the return pickup; vehicle arrival cannot establish attendance, appointment progress or when a visitor is ready to leave."
    },
    {
      "title": "Confirm a replacement vehicle without exposing visitor records",
      "text": "If the return vehicle changes during a Sunam visit, confirm the replacement registration and pickup details with the booking coordinator before arrival. Keep visitor contact and appointment details in the authorised booking record, not in a broadly shared location link. Use time-limited sharing only if the selected platform supports it. Pilot the replacement and return sequence, checking fresh timestamps, access controls and fitting arrangements before rollout."
    }
  ],
  "faqs": [
    {
      "question": "Can a Sunam campus GPS arrival prove attendance at an appointment?",
      "answer": "No. GPS reports the assigned vehicle, not attendance or appointment progress. Confirm the visit and return readiness with the visitor or authorised coordinator, using a dated booking for each journey."
    },
    {
      "question": "What should change when a Sunam return vehicle is replaced?",
      "answer": "Record the replacement registration and revised pickup instruction, then confirm them with the booking coordinator. Share only the vehicle information needed for that booking; keep personal appointment details in the authorised booking record."
    }
  ]
};
