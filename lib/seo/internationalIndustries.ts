export const internationalIndustries = [
  { slug: "freight-logistics", name: "Freight and port logistics", description: "Plan international truck GPS tracking around loading appointments, port collections, depot geofences and complete outward and return journeys.", sectors: ["freight logistics", "port distribution"], countries: ["south-africa", "kenya", "nigeria", "ghana"], steps: [
    "Record the loading appointment, collection terminal, customer destination and return depot before dispatch. A location inside a port boundary is not confirmation that cargo has been released.",
    "Configure separate geofences for approved loading and unloading premises. Review trip timestamps with dispatch documents so waiting time and travel time can be assessed separately.",
    "For cross-border routes, confirm the carrier plan and any roaming arrangement before rollout. Test network gaps, available stored records and the process for contacting the driver when updates stop.",
    "Review a pilot across representative loaded and return journeys. Agree which dispatcher checks exceptions, and retain the receiver acknowledgement separately from GPS trip evidence.",
  ] },
  { slug: "delivery-service-fleets", name: "Delivery and field-service fleets", description: "Plan international delivery vehicle tracking with customer-stop geofences, route history, dispatcher responsibilities and mobile reporting checks.", sectors: ["delivery fleets", "commercial service"], countries: ["egypt", "nigeria", "morocco", "ghana"], steps: [
    "Build the daily stop list around actual customer premises, service windows and the return location. Decide how failed visits and schedule changes will be recorded by the dispatch team.",
    "Set customer geofences narrowly enough to distinguish nearby stops. Check arrival and departure events during a pilot, and compare them with the service record rather than automatically treating every stop as a completed job.",
    "Confirm reporting intervals, device power supply and the selected mobile-network plan. Review the age of the last position before changing a route based on a map update.",
    "Give authorized teams access to the vehicles they manage. Define who follows up on a long stop or missing update, and review the process before expanding to additional cities.",
  ] },
  { slug: "staff-passenger-transport", name: "Staff and passenger transport", description: "Evaluate international passenger fleet GPS tracking with pickup schedules, authorized transport-team access, route records and supported alerts.", sectors: ["staff transport", "passenger vehicles"], countries: ["south-africa", "egypt", "kenya", "morocco"], steps: [
    "List the pickup locations, planned departure times and final drop-off points for each shift. Keep depot movements separate from journeys carrying passengers.",
    "Test pickup geofences and any supported alerts with the actual vehicle and route. Confirm who receives notifications and how the transport team responds when a pickup is delayed.",
    "Review employee or passenger data handling with the operator before deployment. Limit access to authorized transport staff and confirm the applicable retention and sharing arrangements.",
    "Run representative shifts before scaling. Compare recorded journeys with the schedule, discuss exceptions with the dispatcher and confirm platform features in the quotation.",
  ] },
  { slug: "rental-tourism-vehicles", name: "Rental and tourism vehicles", description: "Review international rental car GPS tracking and tourism transfer workflows, including handover records, trip access and vehicle compatibility.", sectors: ["rental vehicles", "tourism transport"], countries: ["south-africa", "egypt", "morocco", "kenya"], steps: [
    "Define the vehicle handover, pickup and return locations before activating tracking. Agree how customers and drivers are informed about vehicle tracking under the operator's policies.",
    "Match the device to the vehicle power supply and installation requirements. Confirm the effects of parking periods and any supported power alerts with the installer.",
    "For tourism transfers, separate passenger collection windows from vehicle handover records. Check the latest reporting timestamp when reviewing an airport or hotel pickup.",
    "Confirm who can view trips and how long records are retained. Test the agreed workflow on representative journeys, including any cross-border use allowed by the operator.",
  ] },
] as const;
