"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { products } from "./productsData";

export default function ProductsSection() {
  return (
    <section className="relative overflow-hidden bg-[#06142E] py-28">

      {/* Background Glow */}

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
          className="text-center"
        >          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-300 backdrop-blur">
            OUR PRODUCTS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Smart GPS &
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              IoT Solutions
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Explore our complete range of GPS Tracking Devices,
            AIS-140 Solutions, Dash Cameras, Fuel Monitoring,
            Asset Tracking and IoT Products engineered for
            businesses across India.
          </p>

        </motion.div>

        {/* Product Grid */}

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {products.map((product, index) => (

            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />

          ))}

        </div>

        {/* Button */}

        <div className="mt-16 flex justify-center">

          <motion.a
            href="/products"
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: .95,
            }}
            className="rounded-2xl bg-cyan-500 px-10 py-4 font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,.35)] transition hover:bg-cyan-400"
          >
            View All Products →
          </motion.a>

        </div>      </div>
    </section>
  );
}