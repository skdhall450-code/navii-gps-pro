export const trackingSolutions = [
  {
    id: "software", title: "Fleet management software", href: "/software",
    description: "Compare trip history, geofences, fleet reports and access for dispatch teams. List the alerts and reports your team needs before selecting a plan.",
    sectors: /fleet|transport|logistics|distribution|delivery|vehicles/i,
  },
  {
    id: "truck", title: "Truck GPS tracking", href: "/truck-gps",
    description: "Plan location reporting and journey review for goods vehicles. Confirm power input, installation access and mobile coverage along the full route.",
    sectors: /freight|mining|construction|industrial|manufacturing|agri|\bport\b|warehouse|logistics/i,
  },
  {
    id: "school", title: "School bus GPS tracking", href: "/school-bus-gps",
    description: "Discuss pickup and drop-off geofences, route history and alerts for authorized school staff. Confirm vehicle compatibility and who receives each alert.",
    sectors: /school|institutional/i,
  },
  {
    id: "fuel", title: "Fuel monitoring system", href: "/fuel-monitoring-system",
    description: "Review fuel-level and refill monitoring for suitable commercial vehicles. Sensor compatibility, tank calibration and reporting requirements need assessment.",
    sectors: /mining|construction|long-haul|heavy|freight/i,
  },
  {
    id: "car", title: "Car GPS tracker", href: "/gps-tracker-for-car",
    description: "Compare location updates, trip history and supported vehicle alerts. Confirm the tracker wiring, SIM connectivity and app access for your car.",
    sectors: /tourism|rental|corporate|employee|staff|hospitality|service|passenger/i,
  },
  {
    id: "commercial", title: "Commercial vehicle tracking", href: "/commercial-vehicle-tracking",
    description: "Coordinate multi-stop deliveries and field vehicles using available journey records. Define reporting frequency, driver access and alert responsibilities.",
    sectors: /delivery|distribution|retail|commercial|service|urban/i,
  },
  {
    id: "4g", title: "4G GPS tracker", href: "/4g-gps-tracker",
    description: "Compare 4G tracking hardware for the intended vehicle. Check supported networks, power requirements and installation arrangements before ordering.",
    sectors: /./,
  },
] as const;

export function uniqueKeywords(keywords: readonly string[] | string | null | undefined) {
  const result = new Map<string, string>();
  const values = typeof keywords === "string" ? [keywords] : keywords || [];
  for (const value of values) {
    const clean = value.trim().replace(/\s+/g, " ");
    if (clean && !result.has(clean.toLowerCase())) result.set(clean.toLowerCase(), clean);
  }
  return [...result.values()];
}

export function getTrackingSolutions(sectors: readonly string[]) {
  const profile = sectors.join(" ");
  // Always include the software workflow, followed by three relevant device/use-case guides.
  return [trackingSolutions[0], ...trackingSolutions.slice(1).filter((solution) => solution.sectors.test(profile))].slice(0, 4);
}

export function generateLocalKeywords(name: string, sectors: readonly string[]) {
  return [...new Set([
    `GPS tracker in ${name}`,
    `vehicle tracking system ${name}`,
    ...getTrackingSolutions(sectors).map((solution) => `${solution.title} ${name}`),
  ])];
}
