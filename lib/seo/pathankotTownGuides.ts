export const sujanpurGuide = {
  description: "Plan GPS tracking for Sujanpur deliveries in Pathankot, Punjab. Match customer addresses, distinguish shared stops and keep corrected delivery details traceable.",
  source: "https://pathankot.nic.in/public-utility/municipal-council-sujanpur/",
  sourceLabel: "Pathankot district administration: Municipal Council Sujanpur",
  cases: [
    {
      title: "Resolve the Sujanpur address before assigning the vehicle",
      text: "This guide covers Sujanpur in Pathankot district, Punjab. The district directory places its municipal council near Ghass Mandi; that landmark is not a substitute for a customer's delivery address. Keep the state, district, premises name and customer-confirmed entrance together in the job record. Resolve a search result with only the town name before sending it to the driver.",
    },
    {
      title: "Keep each customer separate at a shared vehicle stop",
      text: "For a Sujanpur delivery round where several shops are served from one agreed vehicle stop, give each order its own recipient and acknowledgement. A single stationary period may cover several handovers, while the vehicle trace remains unchanged. Compare the stop with the order list rather than treating one GPS stop as one completed delivery; confirm where stopping and unloading are permitted locally.",
    },
    {
      title: "Preserve the reason for a corrected delivery pin",
      text: "If a Sujanpur customer corrects an entrance or asks for delivery to another premises, retain the original address, revised instruction and confirmation time against the order. Tell the dispatcher which version the driver followed before reviewing a route deviation. Trial one shared stop and one corrected address with supported trip exports to see whether the team can reconcile the journey without losing the original request.",
    },
  ],
  faqs: [
    {
      question: "Which Sujanpur does this GPS tracking guide cover?",
      answer: "Sujanpur in Pathankot district, Punjab. Include the state, district and exact premises in a delivery request; a town-name search or a municipal landmark does not identify a customer's entrance.",
    },
    {
      question: "Can one Sujanpur GPS stop represent several deliveries?",
      answer: "Yes, if several customers are served while the vehicle stays at an agreed stop. Confirm each order with its own receiving acknowledgement. Vehicle location alone cannot establish which customer received which goods.",
    },
  ],
};

export const dharKalanGuide = {
  description: "Plan GPS tracking for Dhar Kalan nature-camp transport. Confirm the road meeting point, separate vehicle and activity schedules, and agree on overnight hire duties.",
  source: "https://pathankot.nic.in/tourist-place/dhar-nature-retreat-and-awareness-camp/",
  sourceLabel: "Pathankot district administration: Dhar Nature Retreat and Awareness Camp",
  cases: [
    {
      title: "Confirm the camp's road meeting point before departure",
      text: "The district tourism page places Dhar Nature Retreat and Awareness Camp in Dhar Kalan and describes the camp near Chamrod village. For a booked visit, ask the organiser for the current road meeting point and vehicle instructions. Keep the named camp and booking reference with those instructions. A general Dhar Kalan pin does not confirm the correct arrival point or permission for a particular vehicle to enter.",
    },
    {
      title: "Keep the road vehicle schedule separate from camp activities",
      text: "If visitors leave the road vehicle for an organised activity, record when the driver should next be available and who will confirm a changed collection time. A tracker installed in the road vehicle reports that vehicle, not visitors away from it. Check current activity arrangements with the organiser; do not use a stationary vehicle marker as evidence that an activity is delayed or the group needs collection.",
    },
    {
      title: "Agree on the vehicle's role during an overnight booking",
      text: "For a Dhar Kalan stay, agree whether the hired vehicle remains assigned overnight, returns to base or is replaced for the next pickup. Record the next required reporting time and the person authorised to change it. Review any overnight movement against that hire agreement. Before rollout, test the actual arrival and collection route, location timestamps and authorised reporting access, then confirm hardware and fitting arrangements with NAVII GPS.",
    },
  ],
  faqs: [
    {
      question: "Does a vehicle tracker follow visitors during Dhar Kalan camp activities?",
      answer: "No. A tracker installed in the road vehicle reports the vehicle carrying it. Coordinate activity attendance and changed collection times with the organiser; the vehicle marker cannot establish a visitor's location away from it.",
    },
    {
      question: "How should an overnight Dhar Kalan vehicle booking be reviewed?",
      answer: "Record whether the vehicle is retained, returns to base or is replaced, together with the next reporting time and authorised changes. Compare supported vehicle records with that agreement rather than assuming every overnight movement is an unauthorised trip.",
    },
  ],
};
