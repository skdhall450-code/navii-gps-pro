"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import type { Product } from "../data/productsData";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({
  product,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    product.gallery[0]
  );

  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-5">

        {/* Thumbnails */}

        <div className="order-2 flex gap-4 overflow-x-auto lg:order-1 lg:col-span-1 lg:flex-col">
          {product.gallery.map((image) => (
            <button
              key={image}
              onClick={() => setSelectedImage(image)}
              className={`overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                selectedImage === image
                  ? "border-cyan-500"
                  : "border-slate-200 hover:border-cyan-300"
              }`}
            >
              <Image
                src={image}
                alt={product.name}
                width={120}
                height={120}
                className="h-24 w-24 bg-white object-contain p-2"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}

        <div className="order-1 lg:order-2 lg:col-span-4">

          <div className="rounded-[32px] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-10 shadow-xl">

            <AnimatePresence mode="wait">

              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <Image
                  src={selectedImage}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="mx-auto h-[500px] w-auto object-contain"
                />
              </motion.div>

            </AnimatePresence>

          </div>

          {/* Gallery Info */}

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row">

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {product.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {product.category}
              </p>
            </div>

            <div className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              Image {product.gallery.indexOf(selectedImage) + 1} of{" "}
              {product.gallery.length}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}