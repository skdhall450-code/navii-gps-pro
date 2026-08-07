"use client";

import { useMemo, useState } from "react";

import ProductCard from "../cards/ProductCard";
import ProductFilters from "../filters/ProductFilters";

import { products } from "../data/productsData";

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] =
    useState("All Products");

  const [search] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "All Products" ||
        product.category === activeCategory;

      const searchMatch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.shortDescription
          .toLowerCase()
          .includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  return (
    <section className="bg-white py-20">

      {/* Filters */}

      <ProductFilters
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Products Grid */}

      <div className="mx-auto mt-14 max-w-7xl px-6">

        {filteredProducts.length > 0 ? (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {filteredProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        ) : (

          <div className="rounded-3xl border border-cyan-200 bg-cyan-50 py-20 text-center">

            <h3 className="text-3xl font-bold text-slate-800">
              No Products Found
            </h3>

            <p className="mt-4 text-slate-600">
              Please try another category.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}