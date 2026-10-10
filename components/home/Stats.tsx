const stats = [
  {
    feature: "Live Tracking",
    title: "Vehicle location visibility",
  },
  {
    feature: "Route History",
    title: "Review vehicle journeys",
  },
  {
    feature: "Fleet Alerts",
    title: "Monitor vehicle events",
  },
  {
    feature: "Web & App",
    title: "Access your fleet dashboard",
  },
];

export default function Stats() {
  return (
    <section className="bg-blue-700 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-8 text-center md:grid-cols-2 lg:grid-cols-4">

          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm"
            >
              <h2 className="text-3xl font-extrabold">
                {item.feature}
              </h2>

              <p className="mt-4 text-xl text-blue-100">
                {item.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
