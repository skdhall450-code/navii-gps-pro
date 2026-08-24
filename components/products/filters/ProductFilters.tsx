"use client";

import { motion } from "framer-motion";

const categories = [
  "All Products",
  "Vehicle GPS",
  "AI Dashcam",
  "Fuel Sensor",
  "IoT Solutions",
];

interface ProductFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProductFilters({
  activeCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <section className="py-10">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4 px-6">
        {categories.map((category) => {
          const active = activeCategory === category;

          return (
            <motion.button
              key={category}
              type="button"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() => onCategoryChange(category)}
              aria-pressed={active}
              className={`rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                active
                  ? "border-cyan-500 bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "border-slate-300 bg-white text-slate-700 shadow-sm hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700"
              }`}
            >
              {category}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
