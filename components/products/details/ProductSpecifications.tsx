


import type { Product } from "../data/productsData";

interface ProductSpecificationsProps {
  product: Product;
}

export default function ProductSpecifications({
  product,
}: ProductSpecificationsProps) {
  return (
    <section className="bg-white py-20">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            TECHNICAL SPECIFICATIONS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Product Specifications
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Detailed technical information for installation,
            compatibility and fleet deployment.
          </p>

        </div>

        {/* Table */}

        <dl className="mt-16 overflow-hidden rounded-3xl border border-slate-200 shadow-xl"
        >

          {product.specifications.map((item, index) => (

            <div
              key={item.label}
              className={`grid grid-cols-2 border-b border-slate-200 px-8 py-5 transition hover:bg-cyan-50 ${
                index % 2 === 0
                  ? "bg-white"
                  : "bg-slate-50"
              }`}
            >

              <dt className="font-semibold text-slate-700">
                {item.label}</dt>

              <dd className="text-right font-bold text-slate-900">
                {item.value}</dd>

            </div>

          ))}

        </dl>

      </div>

    </section>
  );
}