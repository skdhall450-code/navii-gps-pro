"use client";

import { motion } from "framer-motion";

const categories = [
  "All Products",
  "Vehicle GPS",
  "OBD GPS",
  "AI Dashcam",
  "Asset Tracker",
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
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              activeCategory === category
                ? "border-cyan-400 bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "border-cyan-400/20 bg-white/5 text-slate-300 hover:border-cyan-400 hover:bg-cyan-500/10"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </section>
  );
}