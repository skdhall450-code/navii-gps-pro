export const bathindaGuide = {
  "description": "Plan GPS tracking for Bathinda station transfers. Separate train arrival updates from vehicle positions, revised pickups and onward passenger journeys.",
  "cases": [
    {
      "title": "Keep the train arrival and vehicle arrival separate",
      "text": "Bathinda Junction is a rail connection for journeys into the district. For a station pickup, record the passenger’s arrival service and date alongside the assigned road vehicle and confirmed meeting point. Use current railway information for the train status. The tracker fitted to a taxi or van reports that vehicle; it does not report the train or confirm that a passenger has left the station."
    },
    {
      "title": "Record what changed when an arrival is delayed",
      "text": "If a Bathinda arrival is delayed, keep the original pickup time and the coordinator’s revised instruction. Confirm whether the vehicle waits, leaves for another task or is replaced. Review waiting time against that instruction before classifying it as an avoidable delay. A vehicle shown near the station may still be assigned to a different passenger."
    },
    {
      "title": "Give the onward journey its own destination",
      "text": "After a station pickup, record whether the passenger is going to Bathinda city, Talwandi Sabo or another district destination. Confirm boarding and the actual drop separately from station arrival. Trial a pickup with a changed arrival time, then compare supported vehicle trip records with the dated booking sheet before choosing reporting and installation arrangements."
    }
  ],
  "faqs": [
    {
      "question": "Does a vehicle tracker provide Bathinda train arrival information?",
      "answer": "No. Check current railway information for the train and the passenger’s confirmation for the meeting point. Vehicle GPS helps coordinate the assigned road vehicle, not the train’s location or a passenger’s arrival."
    },
    {
      "question": "How should waiting during a delayed Bathinda station pickup be reviewed?",
      "answer": "Compare vehicle stop times with the coordinator’s original and revised pickup instructions. Record whether waiting was agreed, whether another task was accepted and whether a replacement vehicle took over."
    }
  ]
};
export const talwandiSaboGuide = {
  "description": "Plan GPS tracking for Talwandi Sabo group visits. Agree on reunion instructions, account for changed return plans and distinguish coach movement from group readiness.",
  "source": "https://bathinda.nic.in/tourist-place/takhat-sri-damdama-sahib/",
  "sourceLabel": "Bathinda district administration: Takhat Sri Damdama Sahib",
  "cases": [
    {
      "title": "Agree on the reunion before the group leaves the vehicle",
      "text": "Takhat Sri Damdama Sahib is at Talwandi Sabo in Bathinda district. For a group visit, agree on a return meeting point and coordinator before passengers leave the vehicle. Confirm the usable vehicle stop locally for the day of travel. The landmark pin identifies the destination but does not establish where a coach may park or meet the group."
    },
    {
      "title": "Keep a changed return plan against the right booking",
      "text": "Some visitors may leave Talwandi Sabo with another party or stay longer. Ask the group coordinator to record those changes against the return booking before the driver departs. Vehicle location cannot count passengers. Keep personal details with authorised coordination staff rather than adding them to broadly shared vehicle-location links."
    },
    {
      "title": "Distinguish a repositioning journey from the group departure",
      "text": "If the coach moves from its waiting place to the agreed reunion point, mark that movement separately from the return departure. Confirm that the group is ready before releasing the vehicle for the onward journey. Test this waiting-to-reunion-to-departure sequence with supported trip history, and check location freshness, reporting access and fitting arrangements before rollout."
    }
  ],
  "faqs": [
    {
      "question": "Can a Talwandi Sabo coach location confirm that the group is ready to return?",
      "answer": "No. The coordinator must confirm the returning group and any changed travel plans. Use the vehicle’s latest timestamp to coordinate its approach to the agreed meeting point."
    },
    {
      "question": "Does coach movement near Damdama Sahib mean the return journey has started?",
      "answer": "Not necessarily. It may be moving from its waiting place to the reunion point. Record that movement separately and confirm group boarding before marking the return departure."
    }
  ]
};

