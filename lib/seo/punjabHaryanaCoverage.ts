import type { Metadata } from "next";
import { haryanaDistricts } from "./haryanaDistricts";
import { punjabDistricts } from "./punjabDistricts";

export function getPunjabHaryanaCoverage(slug: string) {
  if (slug === "punjab") return {
    slug, name: "Punjab", otherSlug: "haryana", otherName: "Haryana",
    districts: punjabDistricts,
    description: "GPS trackers in Punjab for cars, trucks and school buses. Explore district and city guides, fleet software and installation enquiries with NAVII GPS INDIA.",
    intro: "Choose GPS tracking around the journeys your vehicles actually make: urban deliveries, factory dispatches, school transport or agricultural collection routes. Punjab fleets can use vehicle location, recorded trips and supported alerts to coordinate drivers and review journeys through NAVII GPS software.",
    cases: [
      { title: "Ludhiana and Jalandhar business fleets", text: "For manufacturing dispatches and multi-stop deliveries, record the loading point, customer stops and return destination before the vehicle leaves. Compare the reported journey with the dispatch plan, and use warehouse geofences to help review arrivals. A map position supports coordination; the receiver's acknowledgement remains the evidence of delivery." },
      { title: "Mohali, Zirakpur and Dera Bassi routes", text: "For employee transport and warehouse vehicles moving through the Tricity area, separate scheduled pickup points from depot locations. Give dispatchers access to the vehicles they manage and decide who responds to missed stops or route changes. Test the device on the actual route before relying on automatic arrival alerts." },
      { title: "Malwa agricultural and regional transport", text: "For produce collection or town-to-village deliveries around Bathinda, Mansa and Sangrur, review the last-report time alongside the vehicle position. An old location can reflect a network gap rather than a stopped vehicle. Check available trip records when connectivity returns, and keep seasonal collection points current in the dispatch plan." },
    ],
    faqs: [
      { question: "How do I arrange a GPS tracker in Punjab?", answer: "Share your city, vehicle type, number of vehicles and tracking requirements with NAVII GPS sales. The team can discuss a compatible device, SIM plan, platform subscription and installation arrangements for your location before booking." },
      { question: "Can I track vehicles travelling between Punjab and Haryana?", answer: "Compatible connected devices can report journeys across state boundaries when the configured network is available. Confirm the expected routes, SIM coverage and reporting needs, then review location timestamps and recorded trips in the fleet platform." },
      { question: "What should a Punjab fleet quotation include?", answer: "Ask for the hardware, SIM or data plan, platform subscription, installation, shipping and applicable taxes as separate items. Also confirm the renewal period, device warranty and the features included for your selected hardware." },
    ],
  };
  if (slug === "haryana") return {
    slug, name: "Haryana", otherSlug: "punjab", otherName: "Punjab",
    districts: haryanaDistricts,
    description: "GPS trackers in Haryana for cars, trucks and school buses. Explore district and city guides, fleet software and installation enquiries with NAVII GPS INDIA.",
    intro: "A Haryana fleet may combine NCR warehouse runs, employee transport, highway freight and rural service visits. Select a tracker and reporting setup that suit these journeys, then use NAVII GPS vehicle location, trip history and supported alerts to coordinate authorized fleet teams.",
    cases: [
      { title: "Gurugram, Faridabad and NCR fleets", text: "For delivery and employee transport vehicles, define the depot, pickup sequence and authorized route before each shift. Review supported movement and ignition alerts with the dispatcher responsible for that vehicle. Configure access by operational responsibility so drivers and customer location details are available only to the appropriate users." },
      { title: "Ambala, Karnal and Panipat highway operations", text: "For freight moving between northern depots and NCR, compare actual trip history with the planned loading and unloading sequence. Use geofences around agreed depot entrances rather than a broad city boundary. Check the location timestamp before interpreting a delay, and confirm an unexpected route change with the driver or dispatcher." },
      { title: "Hisar, Hansi and western Haryana visits", text: "For agricultural transport and field-service vehicles, test network availability on town-to-village routes. Review both the last reported position and its time when coverage is intermittent. Keep customer stops, return journeys and the contact responsible for an alert in the dispatch plan so a missed update can be investigated consistently." },
    ],
    faqs: [
      { question: "How do I arrange a GPS tracker in Haryana?", answer: "Tell NAVII GPS sales your district or city, vehicle type, fleet size and the features you need. Device compatibility, SIM coverage, subscription and installation arrangements are discussed for the actual operating location before booking." },
      { question: "Can Haryana school buses use GPS tracking?", answer: "Compatible school-vehicle solutions can support location, trip history and configured route alerts for authorized transport teams. Agree on reporting intervals, pickup geofences and who responds to alerts. Confirm the selected device and platform features before deployment." },
      { question: "Does GPS tracking continue outside Haryana?", answer: "State boundaries do not define the tracker coverage. Reporting depends on the device, configured SIM network and connectivity on the actual journey. Discuss routes into Punjab, Delhi or Rajasthan and test the installation before relying on its alerts." },
    ],
  };
  return null;
}

export type PunjabHaryanaCoverage = NonNullable<ReturnType<typeof getPunjabHaryanaCoverage>>;

export function generatePunjabHaryanaMetadata(coverage: PunjabHaryanaCoverage): Metadata {
  const url = `https://naviigps.com/gps-tracker/${coverage.slug}`;
  const title = `GPS Tracker in ${coverage.name} | Vehicle Tracking System`;
  return {
    title, description: coverage.description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | NAVII GPS`, description: coverage.description, url, type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${title} | NAVII GPS`, description: coverage.description, images: ["/og-image.jpg"] },
  };
}
