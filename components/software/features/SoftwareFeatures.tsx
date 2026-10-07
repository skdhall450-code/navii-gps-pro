import { MapPinned, Route, MapPin, Bell, BarChart3, FileDown } from "lucide-react";

const features = [
  {
    title: "Live vehicle view",
    description: "Locate connected vehicles on the map and check their latest reported status. Location freshness depends on the device and network connection.",
    icon: MapPinned,
  },
  {
    title: "Route history and playback",
    description: "Select a vehicle and time period to review its recorded route. Replay available location records when checking a past journey.",
    icon: Route,
  },
  {
    title: "Geofence visibility",
    description: "View configured location boundaries for your vehicles. Authorised management accounts handle geofence creation and changes.",
    icon: MapPin,
  },
  {
    title: "Geofence event alerts",
    description: "Review entry and exit alerts from configured geofences to see when a vehicle crossed a monitored boundary.",
    icon: Bell,
  },
  {
    title: "Vehicle activity reports",
    description: "Review recorded distance, speed, running time and ignition activity for a selected vehicle and period. Results depend on data received from the tracker.",
    icon: BarChart3,
  },
  {
    title: "CSV export from the web dashboard",
    description: "Export recorded trip data, including location, speed and available ignition and battery fields, for review in a spreadsheet.",
    icon: FileDown,
  },
];

export default function SoftwareFeatures() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Vehicle tracking tools for daily fleet checks
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Open a vehicle record to check its latest reported position, review a recorded journey or inspect available activity data. Use these tools for the vehicles assigned to your account.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition-colors hover:border-cyan-400 sm:p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <Icon size={30} aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-4 leading-7 text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
