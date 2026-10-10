import Link from "next/link";

const models = [
  {
    name: "G17 GPS Tracker",
    slug: "g17-gps-tracker",
    network: "Confirm the supplied model’s mobile network and supported bands before ordering.",
    application: "Cars, trucks, buses and commercial fleets.",
    setup: "Wired installation; GT06-compatible communication.",
    price: "Published device, first-year SIM/platform, shipping and renewal breakdown.",
  },
  {
    name: "GS900 4G GPS Tracker",
    slug: "gs900-4g-gps-tracker",
    network: "4G mobile connectivity; confirm the supplied model’s bands and local coverage.",
    application: "Vehicle and fleet monitoring.",
    setup: "Wired installation; supported functions depend on configuration.",
    price: "Model-specific quote required for hardware, SIM/platform, shipping and renewal.",
  },
];

export default function ModelComparison() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-extrabold text-slate-950">G17 or GS900? Start with your requirements</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">Compare the information currently published for these two models. Ask for the exact model datasheet, input voltage, network bands, accessories and installation fit before choosing a tracker.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {models.map((model) => (
            <article key={model.slug} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-slate-950">{model.name}</h3>
              <dl className="mt-5 space-y-4 text-sm leading-6">
                {[["Connectivity", model.network], ["Vehicles", model.application], ["Installation and setup", model.setup], ["Cost and renewal", model.price]].map(([label, value]) => (
                  <div key={label}><dt className="font-bold text-slate-900">{label}</dt><dd className="mt-1 text-slate-600">{value}</dd></div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href={`/products/${model.slug}`} className="font-semibold text-blue-800 underline underline-offset-4">Product details</Link>
                <Link href={model.slug === "g17-gps-tracker" ? "/shop-now#g17" : `/contact?intent=product-quote&source=products&product=${model.slug}#contact-form`} className="font-semibold text-blue-800 underline underline-offset-4">{model.slug === "g17-gps-tracker" ? "See Price & Order" : "Request a GS900 quote"}</Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-600">Vehicle count alone does not decide the right model. Share your routes, vehicle electrical system and required alerts. Warranty, delivery, installation charges and return eligibility need written confirmation for either model.</p>
      </div>
    </section>
  );
}
