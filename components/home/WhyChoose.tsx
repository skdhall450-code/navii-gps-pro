const features = [
  {
    title: "Real-Time Tracking",
    icon: "📍",
    description: "Track your vehicles live with high accuracy.",
  },
  {
    title: "24×7 Support",
    icon: "🎧",
    description: "Dedicated technical support whenever you need it.",
  },
  {
    title: "AIS-140 Certified",
    icon: "✅",
    description: "Government compliant GPS tracking devices.",
  },
  {
    title: "Fleet Management",
    icon: "🚚",
    description: "Manage your complete fleet from one dashboard.",
  },
  {
    title: "Fuel Monitoring",
    icon: "⛽",
    description: "Monitor fuel usage and reduce operational costs.",
  },
  {
    title: "Mobile App",
    icon: "📱",
    description: "Track your vehicles anytime using Android & iOS.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-slate-100 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-5xl font-bold text-slate-900">
            Why Choose NAVII GPS
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Smart GPS Tracking Solutions trusted by businesses across India.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-6 text-5xl">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold">
                {item.title}
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                {item.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}