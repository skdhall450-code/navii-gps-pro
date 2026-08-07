const products = [
  {
    title: "GPS Vehicle Tracker",
    description: "Real-time GPS tracking for cars, trucks and buses.",
    icon: "📍",
  },
  {
    title: "AIS-140 GPS",
    description: "Government approved AIS-140 compliant tracking device.",
    icon: "🚛",
  },
  {
    title: "Dash Camera",
    description: "HD recording with GPS and driver monitoring.",
    icon: "📷",
  },
  {
    title: "Fuel Sensor",
    description: "Monitor fuel level and prevent fuel theft.",
    icon: "⛽",
  },
  {
    title: "OBD Tracker",
    description: "Plug & Play GPS tracker for personal vehicles.",
    icon: "🚗",
  },
  {
    title: "Smart E-Lock",
    description: "IoT-enabled smart lock for logistics and transport.",
    icon: "🔒",
  },
];

export default function Products() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-5xl font-bold text-slate-900">
            Our Products
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            GPS Tracking Devices & IoT Solutions for Every Business
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {products.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-4xl">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {item.description}
              </p>

              <button className="mt-8 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">
                View Details
              </button>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}