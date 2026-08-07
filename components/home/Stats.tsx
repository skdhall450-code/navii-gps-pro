const stats = [
  {
    number: "25K+",
    title: "Active Vehicles",
  },
  {
    number: "500+",
    title: "Dealers Network",
  },
  {
    number: "10K+",
    title: "Happy Customers",
  },
  {
    number: "100+",
    title: "Cities Covered",
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
              <h2 className="text-5xl font-extrabold">
                {item.number}
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