"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { products, type Product } from "../data/productsData";

interface RelatedProductsProps {
  product: Product;
}

export default function RelatedProducts({
  product,
}: RelatedProductsProps) {
  const relatedProducts = products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            RELATED PRODUCTS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            You May Also Like
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Explore more GPS tracking devices and IoT solutions from NAVII GPS.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {relatedProducts.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-2xl"
            >

              <div className="bg-slate-50 p-8">

                <Image
                  src={item.image}
                  alt={item.name}
                  width={320}
                  height={320}
                  className="mx-auto h-56 w-auto object-contain"
                />

              </div>

              <div className="p-6">

                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                  {item.category}
                </span>

                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-3 text-slate-600">
                  {item.shortDescription}
                </p>

                <Link
                  href={`/products/${item.slug}`}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700"
                >
                  View Details

                  <ArrowRight size={18} />
                </Link>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}