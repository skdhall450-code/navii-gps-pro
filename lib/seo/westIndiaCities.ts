import type { PriorityCitySeo } from "./priorityCities";

// Editorial coverage: 100 named cities/towns, not an exhaustive municipal registry.
// Surrounding areas indicate routes to discuss, not confirmed installation offices.
export const westIndiaCities: PriorityCitySeo[] = [
  {
    "areas": [
      "Nani Daman",
      "Moti Daman",
      "Vapi"
    ],
    "localContext": "For vehicles operating between Daman, Nani Daman and Moti Daman, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Daman",
    "planningNote": "Keep local journeys and cross-boundary dispatch separate in reports, using individual pickup and customer geofences.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "daman",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "stateSlug": "dadra-nagar-haveli-daman-diu"
  },
  {
    "areas": [
      "Ghoghla",
      "Fudam",
      "Vanakbara"
    ],
    "localContext": "For vehicles operating between Diu, Ghoghla and Fudam, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Diu",
    "planningNote": "Review passenger itineraries and local service rounds with scheduled pickup records and clear last-update timestamps.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "diu",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "stateSlug": "dadra-nagar-haveli-daman-diu"
  },
  {
    "areas": [
      "Amli",
      "Naroli",
      "Khanvel"
    ],
    "localContext": "For vehicles operating between Silvassa, Amli and Naroli, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Silvassa",
    "planningNote": "Use separate facility boundaries for staff and goods vehicles, and test device reporting on onward routes into Gujarat.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "silvassa",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "stateSlug": "dadra-nagar-haveli-daman-diu"
  },
  {
    "areas": [
      "Silvassa",
      "Naroli",
      "Vapi"
    ],
    "localContext": "For vehicles operating between Dadra, Silvassa and Naroli, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Dadra",
    "planningNote": "Review dispatch departure and receiving-site arrival separately for vehicles crossing between nearby operating areas.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "dadra",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "stateSlug": "dadra-nagar-haveli-daman-diu"
  },
  {
    "areas": [
      "Patto",
      "Miramar",
      "Porvorim"
    ],
    "localContext": "For vehicles operating between Panaji, Patto and Miramar, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Panaji",
    "planningNote": "Use pickup-specific boundaries and authorised location sharing for scheduled passenger journeys and local service vehicles.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "panaji",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Fatorda",
      "Navelim",
      "Colva"
    ],
    "localContext": "For vehicles operating between Margao, Fatorda and Navelim, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Margao",
    "planningNote": "Keep passenger pickup windows separate from delivery rounds so the team can review late departures accurately.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "margao",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Dabolim",
      "Mormugao",
      "Sancoale"
    ],
    "localContext": "For vehicles operating between Vasco da Gama, Dabolim and Mormugao, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Vasco da Gama",
    "planningNote": "Define separate pickup, holding and destination locations for transfer vehicles and review waiting time at each point.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "vasco-da-gama",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Karaswada",
      "Assagao",
      "Calangute"
    ],
    "localContext": "For vehicles operating between Mapusa, Karaswada and Assagao, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Mapusa",
    "planningNote": "Review multi-stop pickup routes with individual destination boundaries rather than a single large service-area geofence.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "mapusa",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Kundaim",
      "Marcaim",
      "Bethora"
    ],
    "localContext": "For vehicles operating between Ponda, Kundaim and Marcaim, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Ponda",
    "planningNote": "Separate staff transport from commercial deliveries and check the vehicle's power supply before finalising tracker hardware.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "ponda",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Mayem",
      "Assonora",
      "Sanquelim"
    ],
    "localContext": "For vehicles operating between Bicholim, Mayem and Assonora, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Bicholim",
    "planningNote": "Test location reporting on the actual town and regional routes and review extended halts against planned collection stops.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "bicholim",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Mopa",
      "Mandrem",
      "Morjim"
    ],
    "localContext": "For vehicles operating between Pernem, Mopa and Mandrem, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Pernem",
    "planningNote": "Keep transfer pickup times and destination arrivals visible as separate events when coordinating scheduled vehicles.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "pernem",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Sanquelim",
      "Bicholim",
      "Valpoi"
    ],
    "localContext": "For vehicles operating between Sankhali, Sanquelim and Bicholim, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Sankhali",
    "planningNote": "Use timestamped journey history to review completed runs and avoid treating a delayed update as a current location.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "sankhali",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Sattari",
      "Honda",
      "Poriem"
    ],
    "localContext": "For vehicles operating between Valpoi, Sattari and Honda, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Valpoi",
    "planningNote": "Pilot connectivity on the fleet's actual inland routes and confirm how missing live reports are shown to dispatchers.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "valpoi",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Balli",
      "Assolna",
      "Chinchinim"
    ],
    "localContext": "For vehicles operating between Cuncolim, Balli and Assolna, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Cuncolim",
    "planningNote": "Group recurring delivery and pickup stops so commercial rounds can be compared by arrival sequence and dwell time.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "cuncolim",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Sanvordem",
      "Quepem",
      "Sanguem"
    ],
    "localContext": "For vehicles operating between Curchorem, Sanvordem and Quepem, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Curchorem",
    "planningNote": "Track collection and depot return as separate events when vehicles serve several nearby destinations in one shift.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "curchorem",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Curchorem",
      "Chandor",
      "Ambaulim"
    ],
    "localContext": "For vehicles operating between Quepem, Curchorem and Chandor, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Quepem",
    "planningNote": "Configure alerts around actual pickup sites and review unusually long stops against the planned journey.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "quepem",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Sanvordem",
      "Neturlim",
      "Collem"
    ],
    "localContext": "For vehicles operating between Sanguem, Sanvordem and Neturlim, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Sanguem",
    "planningNote": "Check mobile-report recovery on longer inland trips and confirm that stored journey records upload as expected.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "sanguem",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Chaudi",
      "Palolem",
      "Agonda"
    ],
    "localContext": "For vehicles operating between Canacona, Chaudi and Palolem, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Canacona",
    "planningNote": "Set separate pickup points for passenger itineraries and test reporting during the fleet's normal coastal routes.",
    "sectors": [
      "scheduled passenger transport",
      "local service vehicles",
      "commercial delivery"
    ],
    "slug": "canacona",
    "state": "Goa",
    "stateSlug": "goa"
  },
  {
    "areas": [
      "Sanand",
      "Naroda",
      "Changodar"
    ],
    "localContext": "For vehicles operating between Ahmedabad, Sanand and Naroda, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Ahmedabad",
    "planningNote": "Compare warehouse departures with customer arrival events and review multi-stop trips separately from longer dispatch runs.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "ahmedabad",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Sachin",
      "Pandesara",
      "Hazira"
    ],
    "localContext": "For vehicles operating between Surat, Sachin and Pandesara, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Surat",
    "planningNote": "Separate city distribution and outstation dispatch in reports so frequent delivery halts do not obscure longer journey delays.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "surat",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Makarpura",
      "Nandesari",
      "Savli"
    ],
    "localContext": "For vehicles operating between Vadodara, Makarpura and Nandesari, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Vadodara",
    "planningNote": "Use individual site geofences for vehicles visiting several facilities and confirm who should receive each arrival notification.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "vadodara",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Shapar",
      "Metoda",
      "Gondal"
    ],
    "localContext": "For vehicles operating between Rajkot, Shapar and Metoda, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Rajkot",
    "planningNote": "Link trip reviews to pickup and delivery destinations to make repeat supplier journeys easier to compare.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "rajkot",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Kalol",
      "Chhatral",
      "Dehgam"
    ],
    "localContext": "For vehicles operating between Gandhinagar, Kalol and Chhatral, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Gandhinagar",
    "planningNote": "Keep staff pickup schedules distinct from goods movement and limit location access to the relevant fleet team.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "gandhinagar",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Dared",
      "Sikka",
      "Dhrol"
    ],
    "localContext": "For vehicles operating between Jamnagar, Dared and Sikka, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Jamnagar",
    "planningNote": "Pilot the tracker on actual operating routes and check reporting intervals, ignition events and delayed data recovery.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "jamnagar",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Sihor",
      "Alang",
      "Ghogha"
    ],
    "localContext": "For vehicles operating between Bhavnagar, Sihor and Alang, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Bhavnagar",
    "planningNote": "Use destination-based trip records and check vehicle power compatibility before adding optional monitoring hardware.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "bhavnagar",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Keshod",
      "Vanthali",
      "Visavadar"
    ],
    "localContext": "For vehicles operating between Junagadh, Keshod and Vanthali, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Junagadh",
    "planningNote": "Compare town delivery rounds with outstation journeys and review long stops against each driver's planned itinerary.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "junagadh",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Adipur",
      "Kandla",
      "Anjar"
    ],
    "localContext": "For vehicles operating between Gandhidham, Adipur and Kandla, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Gandhidham",
    "planningNote": "Separate yard entry, loading waits and onward dispatch in trip reviews so the full vehicle turnaround remains visible.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "gandhidham",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Madhapar",
      "Mundra",
      "Nakhatrana"
    ],
    "localContext": "For vehicles operating between Bhuj, Madhapar and Mundra, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Bhuj",
    "planningNote": "Test live updates and route-history recovery on longer journeys; a last-known position should always be read with its timestamp.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "bhuj",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Karamsad",
      "Vallabh Vidyanagar",
      "Umreth"
    ],
    "localContext": "For vehicles operating between Anand, Karamsad and Vallabh Vidyanagar, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Anand",
    "planningNote": "Group repeat collection and delivery stops so route history supports timing reviews for time-sensitive distribution.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "anand",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Kheda",
      "Mahemdabad",
      "Kapadvanj"
    ],
    "localContext": "For vehicles operating between Nadiad, Kheda and Mahemdabad, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Nadiad",
    "planningNote": "Create recurring destination boundaries and review missed stops against planned daily distribution routes.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "nadiad",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Wankaner",
      "Halvad",
      "Tankara"
    ],
    "localContext": "For vehicles operating between Morbi, Wankaner and Halvad, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Morbi",
    "planningNote": "Review dispatch-to-delivery journeys and loading-yard dwell time separately for commercial vehicles serving multiple customer sites.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "morbi",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Kadi",
      "Visnagar",
      "Unjha"
    ],
    "localContext": "For vehicles operating between Mehsana, Kadi and Visnagar, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Mehsana",
    "planningNote": "Track the sequence of collection visits and depot returns so teams can review a complete working trip.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "mehsana",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Ankleshwar",
      "Dahej",
      "Jambusar"
    ],
    "localContext": "For vehicles operating between Bharuch, Ankleshwar and Dahej, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Bharuch",
    "planningNote": "Keep facility entry alerts distinct from roadside halts and confirm installation access before scheduling multiple vehicles.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "bharuch",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Panoli",
      "Jhagadia",
      "Bharuch"
    ],
    "localContext": "For vehicles operating between Ankleshwar, Panoli and Jhagadia, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Ankleshwar",
    "planningNote": "Test geofence sizes around actual gates to avoid treating vehicles passing nearby as completed site visits.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "ankleshwar",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Daman",
      "Silvassa",
      "Pardi"
    ],
    "localContext": "For vehicles operating between Vapi, Daman and Silvassa, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Vapi",
    "planningNote": "Use a single authorised fleet view for trips crossing state and union-territory boundaries while retaining distinct destination reports.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "vapi",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Vapi",
      "Dharampur",
      "Pardi"
    ],
    "localContext": "For vehicles operating between Valsad, Vapi and Dharampur, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Valsad",
    "planningNote": "Check location-update age during outstation runs and compare planned customer visits with available journey records.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "valsad",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Bilimora",
      "Gandevi",
      "Chikhli"
    ],
    "localContext": "For vehicles operating between Navsari, Bilimora and Gandevi, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Navsari",
    "planningNote": "Separate short town deliveries from longer regional runs when reviewing stop durations and end-of-day vehicle availability.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "navsari",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Ranavav",
      "Kutiyana",
      "Madhavpur"
    ],
    "localContext": "For vehicles operating between Porbandar, Ranavav and Kutiyana, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Porbandar",
    "planningNote": "Pilot reporting on the actual coastal and inland routes used by the fleet and confirm alert delivery before wider deployment.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "porbandar",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Wadhwan",
      "Limbdi",
      "Dhrangadhra"
    ],
    "localContext": "For vehicles operating between Surendranagar, Wadhwan and Limbdi, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Surendranagar",
    "planningNote": "Use recurring pickup boundaries and customer-arrival events to compare route execution across repeat dispatch days.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "surendranagar",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Deesa",
      "Abu Road",
      "Dantiwada"
    ],
    "localContext": "For vehicles operating between Palanpur, Deesa and Abu Road, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Palanpur",
    "planningNote": "Review outstation trips with departure, arrival and extended-stop records so dispatch teams can follow the full journey.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "palanpur",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Sidhpur",
      "Chanasma",
      "Radhanpur"
    ],
    "localContext": "For vehicles operating between Patan, Sidhpur and Chanasma, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Patan",
    "planningNote": "Keep collection visits and depot returns identifiable when one vehicle serves several towns in a single round.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "patan",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Halol",
      "Kalol",
      "Lunawada"
    ],
    "localContext": "For vehicles operating between Godhra, Halol and Kalol, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Godhra",
    "planningNote": "Build destination groups for regional deliveries and test whether alerts reach the team responsible for each route.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "godhra",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Zalod",
      "Limkheda",
      "Devgadh Baria"
    ],
    "localContext": "For vehicles operating between Dahod, Zalod and Limkheda, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Dahod",
    "planningNote": "Confirm tracking behaviour during temporary connectivity gaps and use timestamped route history for completed-trip reviews.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "dahod",
    "state": "Gujarat",
    "stateSlug": "gujarat"
  },
  {
    "areas": [
      "Andheri",
      "Thane",
      "Panvel"
    ],
    "localContext": "For vehicles operating between Mumbai, Andheri and Thane, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Mumbai",
    "planningNote": "Separate last-mile delivery stops from longer warehouse and port-linked journeys when reviewing daily vehicle utilisation.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "mumbai",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Chakan",
      "Hinjawadi",
      "Talegaon"
    ],
    "localContext": "For vehicles operating between Pune, Chakan and Hinjawadi, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Pune",
    "planningNote": "Use separate geofences for factory gates and staff pickup points so shift transport is not mixed with goods dispatch.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "pune",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Hingna",
      "Butibori",
      "Wardha"
    ],
    "localContext": "For vehicles operating between Nagpur, Hingna and Butibori, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Nagpur",
    "planningNote": "Compare arrival and departure times for regional distribution runs instead of relying only on a vehicle's current map position.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "nagpur",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Satpur",
      "Ambad",
      "Sinnar"
    ],
    "localContext": "For vehicles operating between Nashik, Satpur and Ambad, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Nashik",
    "planningNote": "Record depot departures and customer stops separately when a single vehicle combines industrial deliveries with regional trips.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "nashik",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Wagle Estate",
      "Ghodbunder Road",
      "Bhiwandi"
    ],
    "localContext": "For vehicles operating between Thane, Wagle Estate and Ghodbunder Road, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Thane",
    "planningNote": "Set destination boundaries carefully for vehicles moving between dense city streets and warehouse approaches.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "thane",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Vashi",
      "Turbhe",
      "Taloja"
    ],
    "localContext": "For vehicles operating between Navi Mumbai, Vashi and Turbhe, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Navi Mumbai",
    "planningNote": "Keep loading-yard events separate from urban delivery stops to review turnaround time at each stage of a trip.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "navi-mumbai",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Bhosari",
      "Chakan",
      "Talegaon"
    ],
    "localContext": "For vehicles operating between Pimpri-Chinchwad, Bhosari and Chakan, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Pimpri-Chinchwad",
    "planningNote": "Compare factory-to-factory movement with shift pickup schedules using trip history and authorised location sharing.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "pimpri-chinchwad",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Waluj",
      "Shendra",
      "Paithan"
    ],
    "localContext": "For vehicles operating between Chhatrapati Sambhajinagar, Waluj and Shendra, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Chhatrapati Sambhajinagar",
    "planningNote": "Create distinct dispatch and receiving geofences for multi-stop industrial journeys and review unscheduled halts.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "chhatrapati-sambhajinagar",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Akkalkot",
      "Pandharpur",
      "Barshi"
    ],
    "localContext": "For vehicles operating between Solapur, Akkalkot and Pandharpur, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Solapur",
    "planningNote": "Use journey history to separate intercity driving from time spent at local delivery points before comparing vehicle usage.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "solapur",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Shiroli",
      "Gokul Shirgaon",
      "Ichalkaranji"
    ],
    "localContext": "For vehicles operating between Kolhapur, Shiroli and Gokul Shirgaon, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Kolhapur",
    "planningNote": "Test reporting at both workshop yards and outstation delivery destinations before rolling tracking out across the fleet.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "kolhapur",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Badnera",
      "Achalpur",
      "Chandur Railway"
    ],
    "localContext": "For vehicles operating between Amravati, Badnera and Achalpur, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Amravati",
    "planningNote": "Plan depot geofences and a trip review routine for vehicles serving several regional destinations in one shift.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "amravati",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Akot",
      "Balapur",
      "Murtizapur"
    ],
    "localContext": "For vehicles operating between Akola, Akot and Balapur, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Akola",
    "planningNote": "Compare loaded dispatch runs and return journeys separately when evaluating route adherence and vehicle availability.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "akola",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Waghala",
      "Loha",
      "Deglur"
    ],
    "localContext": "For vehicles operating between Nanded, Waghala and Loha, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Nanded",
    "planningNote": "Configure arrival alerts around actual collection points rather than large city-wide boundaries to reduce irrelevant notifications.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "nanded",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Ausa",
      "Udgir",
      "Nilanga"
    ],
    "localContext": "For vehicles operating between Latur, Ausa and Udgir, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Latur",
    "planningNote": "Use scheduled trip reviews to identify vehicles that remain at a pickup point after the expected departure window.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "latur",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Shirpur",
      "Sakri",
      "Shindkheda"
    ],
    "localContext": "For vehicles operating between Dhule, Shirpur and Sakri, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Dhule",
    "planningNote": "For intercity vehicles, test network recovery and stored-trip upload behaviour before depending on continuous live updates.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "dhule",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Bhusawal",
      "Pachora",
      "Chopda"
    ],
    "localContext": "For vehicles operating between Jalgaon, Bhusawal and Pachora, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Jalgaon",
    "planningNote": "Tag repeat delivery destinations so dispatch teams can distinguish routine unloading stops from unexpected halts.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "jalgaon",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Supa",
      "Shirdi",
      "Shrigonda"
    ],
    "localContext": "For vehicles operating between Ahilyanagar, Supa and Shirdi, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Ahilyanagar",
    "planningNote": "Keep customer visits, depot returns and longer regional trips in separate operational reports for clearer daily review.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "ahilyanagar",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Ballarpur",
      "Warora",
      "Bhadravati"
    ],
    "localContext": "For vehicles operating between Chandrapur, Ballarpur and Warora, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Chandrapur",
    "planningNote": "Check hardware mounting, power supply and alert behaviour on the actual commercial vehicle before fleet installation.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "chandrapur",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Kalher",
      "Anjur",
      "Thane"
    ],
    "localContext": "For vehicles operating between Bhiwandi, Kalher and Anjur, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Bhiwandi",
    "planningNote": "Use smaller warehouse geofences and check ignition events to distinguish loading delays from vehicles waiting off-site.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "bhiwandi",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Kalamboli",
      "Taloja",
      "Kharghar"
    ],
    "localContext": "For vehicles operating between Panvel, Kalamboli and Taloja, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Panvel",
    "planningNote": "Review the transition between yard departures and onward trips so dispatch teams can identify delayed starts.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "panvel",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Mira Road",
      "Bhayandar",
      "Dahisar"
    ],
    "localContext": "For vehicles operating between Mira-Bhayandar, Mira Road and Bhayandar, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Mira-Bhayandar",
    "planningNote": "Review short stop events alongside ignition status so normal urban pickups do not appear as unexplained vehicle downtime.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "mira-bhayandar",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Vasai",
      "Nalasopara",
      "Virar"
    ],
    "localContext": "For vehicles operating between Vasai-Virar, Vasai and Nalasopara, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Vasai-Virar",
    "planningNote": "Build separate pickup and delivery groups for vehicles crossing several urban service areas in the same day.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "vasai-virar",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Kalyan",
      "Dombivli",
      "Ambernath"
    ],
    "localContext": "For vehicles operating between Kalyan-Dombivli, Kalyan and Dombivli, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Kalyan-Dombivli",
    "planningNote": "Set route review windows around actual shifts and distinguish scheduled passenger stops from delivery halts.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "kalyan-dombivli",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Kalyan",
      "Ambernath",
      "Badlapur"
    ],
    "localContext": "For vehicles operating between Ulhasnagar, Kalyan and Ambernath, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Ulhasnagar",
    "planningNote": "Compare repeat customer visits by arrival time and stop duration to help coordinate small commercial delivery fleets.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "ulhasnagar",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Miraj",
      "Kupwad",
      "Tasgaon"
    ],
    "localContext": "For vehicles operating between Sangli, Miraj and Kupwad, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Sangli",
    "planningNote": "Use depot-to-customer trip records for regional distribution, keeping collection and delivery visits identifiable.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "sangli",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Karad",
      "Wai",
      "Koregaon"
    ],
    "localContext": "For vehicles operating between Satara, Karad and Wai, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Satara",
    "planningNote": "Test location reporting on both town routes and longer outstation trips before choosing the final device configuration.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "satara",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Chiplun",
      "Sangameshwar",
      "Rajapur"
    ],
    "localContext": "For vehicles operating between Ratnagiri, Chiplun and Sangameshwar, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Ratnagiri",
    "planningNote": "Include coastal and inland journeys in the pilot and confirm how the device handles temporary mobile network gaps.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "ratnagiri",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Ambad",
      "Badnapur",
      "Partur"
    ],
    "localContext": "For vehicles operating between Jalna, Ambad and Badnapur, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Jalna",
    "planningNote": "Track dispatch departure and receiving-yard arrival as separate events to make delivery turnaround easier to review.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "jalna",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Ambajogai",
      "Parli",
      "Georai"
    ],
    "localContext": "For vehicles operating between Beed, Ambajogai and Parli, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Beed",
    "planningNote": "Configure planned collection stops and review route history after multi-stop regional trips instead of judging a single location update.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "beed",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Tuljapur",
      "Omerga",
      "Kalamb"
    ],
    "localContext": "For vehicles operating between Dharashiv, Tuljapur and Omerga, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Dharashiv",
    "planningNote": "Check route history retention and missed-update handling for vehicles returning from longer trips outside the city.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "dharashiv",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Wani",
      "Pusad",
      "Darwha"
    ],
    "localContext": "For vehicles operating between Yavatmal, Wani and Pusad, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Yavatmal",
    "planningNote": "Group vehicles by operating route and review first departure, last return and extended halts for each working day.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "yavatmal",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Hinganghat",
      "Pulgaon",
      "Arvi"
    ],
    "localContext": "For vehicles operating between Wardha, Hinganghat and Pulgaon, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Wardha",
    "planningNote": "Create separate boundaries for pickup yards and receiving destinations so recurring trips can be compared consistently.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "wardha",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Tirora",
      "Amgaon",
      "Goregaon"
    ],
    "localContext": "For vehicles operating between Gondia, Tirora and Amgaon, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Gondia",
    "planningNote": "Test power stability and mobile reporting on representative regional journeys before configuring fleet-wide alerts.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "gondia",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Shahada",
      "Taloda",
      "Navapur"
    ],
    "localContext": "For vehicles operating between Nandurbar, Shahada and Taloda, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Nandurbar",
    "planningNote": "Check latest-update timestamps alongside map positions, especially when vehicles move beyond regular town routes.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "nandurbar",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Boisar",
      "Tarapur",
      "Dahanu"
    ],
    "localContext": "For vehicles operating between Palghar, Boisar and Tarapur, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Palghar",
    "planningNote": "Keep industrial shift movements and commercial goods trips in separate vehicle groups with suitable alert recipients.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "palghar",
    "state": "Maharashtra",
    "stateSlug": "maharashtra"
  },
  {
    "areas": [
      "Sitapura",
      "Vishwakarma Industrial Area",
      "Bagru"
    ],
    "localContext": "For vehicles operating between Jaipur, Sitapura and Vishwakarma Industrial Area, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Jaipur",
    "planningNote": "Separate staff transport, local delivery and outstation vehicle groups so alert rules reflect each operation's actual schedule.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "jaipur",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Basni",
      "Boranada",
      "Pali"
    ],
    "localContext": "For vehicles operating between Jodhpur, Basni and Boranada, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Jodhpur",
    "planningNote": "Compare customer-site arrival with loading-yard departure and review long-distance runs separately from city delivery rounds.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "jodhpur",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Madri",
      "Debari",
      "Nathdwara"
    ],
    "localContext": "For vehicles operating between Udaipur, Madri and Debari, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Udaipur",
    "planningNote": "Keep passenger pickup schedules separate from commercial deliveries and test reporting on representative outstation journeys.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "udaipur",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Ranpur",
      "Ramganj Mandi",
      "Bundi"
    ],
    "localContext": "For vehicles operating between Kota, Ranpur and Ramganj Mandi, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Kota",
    "planningNote": "Use route history and pickup boundaries to review scheduled vehicles without sending unnecessary alerts for every short stop.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "kota",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Kishangarh",
      "Pushkar",
      "Beawar"
    ],
    "localContext": "For vehicles operating between Ajmer, Kishangarh and Pushkar, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Ajmer",
    "planningNote": "Record itinerary stops as individual destinations so planned visits can be distinguished from unscheduled halts.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "ajmer",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Nokha",
      "Deshnoke",
      "Lunkaransar"
    ],
    "localContext": "For vehicles operating between Bikaner, Nokha and Deshnoke, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Bikaner",
    "planningNote": "Test mobile coverage recovery, power stability and trip retention on the actual longer routes used by the fleet.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "bikaner",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Bhiwadi",
      "Neemrana",
      "Behror"
    ],
    "localContext": "For vehicles operating between Alwar, Bhiwadi and Neemrana, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Alwar",
    "planningNote": "Configure separate site boundaries and shift-based reporting for vehicles moving between several commercial destinations.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "alwar",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Deeg",
      "Bayana",
      "Nadbai"
    ],
    "localContext": "For vehicles operating between Bharatpur, Deeg and Bayana, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Bharatpur",
    "planningNote": "Review regional trip completion using destination arrivals and depot returns rather than a single last-known map marker.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "bharatpur",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Mandpiya",
      "Shahpura",
      "Gangapur"
    ],
    "localContext": "For vehicles operating between Bhilwara, Mandpiya and Shahpura, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Bhilwara",
    "planningNote": "Separate collection, dispatch and delivery events to compare turnaround time for repeat commercial journeys.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "bhilwara",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Fatehpur",
      "Neem Ka Thana",
      "Lachhmangarh"
    ],
    "localContext": "For vehicles operating between Sikar, Fatehpur and Neem Ka Thana, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Sikar",
    "planningNote": "Create individual pickup boundaries for scheduled vehicles and review route deviations against the agreed daily itinerary.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "sikar",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Sojat",
      "Sumerpur",
      "Bali"
    ],
    "localContext": "For vehicles operating between Pali, Sojat and Sumerpur, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Pali",
    "planningNote": "Use destination-based trip groups to distinguish local distribution from longer journeys to other commercial centres.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "pali",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Suratgarh",
      "Padampur",
      "Raisinghnagar"
    ],
    "localContext": "For vehicles operating between Sri Ganganagar, Suratgarh and Padampur, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Sri Ganganagar",
    "planningNote": "Compare collection visits and depot return times across regional rounds, with alerts routed to the responsible dispatch team.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "sri-ganganagar",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Sangaria",
      "Pilibanga",
      "Nohar"
    ],
    "localContext": "For vehicles operating between Hanumangarh, Sangaria and Pilibanga, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Hanumangarh",
    "planningNote": "Review the sequence of customer stops and expected return times for vehicles covering several towns per working day.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "hanumangarh",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Chirawa",
      "Pilani",
      "Nawalgarh"
    ],
    "localContext": "For vehicles operating between Jhunjhunu, Chirawa and Pilani, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Jhunjhunu",
    "planningNote": "Keep scheduled passenger stops separate from delivery points and review journey history with the relevant route supervisor.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "jhunjhunu",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Niwai",
      "Deoli",
      "Malpura"
    ],
    "localContext": "For vehicles operating between Tonk, Niwai and Deoli, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Tonk",
    "planningNote": "Set depot and destination boundaries before the pilot so the team can verify departure and arrival events on real trips.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "tonk",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Ajmer",
      "Makrana",
      "Parbatsar"
    ],
    "localContext": "For vehicles operating between Kishangarh, Ajmer and Makrana, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Kishangarh",
    "planningNote": "Track loading-yard waits separately from onward driving when reviewing commercial dispatch turnaround.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "kishangarh",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Ajmer",
      "Vijaynagar",
      "Masuda"
    ],
    "localContext": "For vehicles operating between Beawar, Ajmer and Vijaynagar, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Beawar",
    "planningNote": "Compare outbound delivery and return journeys separately and review unexpected stops against the planned route.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "beawar",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Balotra",
      "Pachpadra",
      "Sheo"
    ],
    "localContext": "For vehicles operating between Barmer, Balotra and Pachpadra, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Barmer",
    "planningNote": "Test device power, network recovery and timestamp visibility on longer journeys before relying on live fleet alerts.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "barmer",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Pokaran",
      "Sam",
      "Ramgarh"
    ],
    "localContext": "For vehicles operating between Jaisalmer, Pokaran and Sam, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Jaisalmer",
    "planningNote": "Include remote-route testing in the pilot and confirm that teams can distinguish fresh reports from older stored locations.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "jaisalmer",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Nimbahera",
      "Kapasan",
      "Rawatbhata"
    ],
    "localContext": "For vehicles operating between Chittorgarh, Nimbahera and Kapasan, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Chittorgarh",
    "planningNote": "Check installation suitability for the actual vehicles and use separate pickup and receiving-yard boundaries.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "chittorgarh",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Kushalgarh",
      "Garhi",
      "Partapur"
    ],
    "localContext": "For vehicles operating between Banswara, Kushalgarh and Garhi, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Banswara",
    "planningNote": "Review available trip history after regional runs and make temporary reporting gaps visible to dispatch teams.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "banswara",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  },
  {
    "areas": [
      "Tapukara",
      "Khushkhera",
      "Neemrana"
    ],
    "localContext": "For vehicles operating between Bhiwadi, Tapukara and Khushkhera, the tracking setup should reflect the actual pickup points, destination stops and return journeys. Discuss your operating routes and vehicle types to confirm a suitable deployment.",
    "name": "Bhiwadi",
    "planningNote": "Use small facility geofences and shift-specific alert rules to distinguish completed site visits from nearby through traffic.",
    "sectors": [
      "commercial distribution",
      "staff transport",
      "regional fleet operations"
    ],
    "slug": "bhiwadi",
    "state": "Rajasthan",
    "stateSlug": "rajasthan"
  }
];

export const westIndiaStateSlugs = ["maharashtra", "gujarat", "rajasthan", "goa", "dadra-nagar-haveli-daman-diu"];
