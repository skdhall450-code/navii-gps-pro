"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import type { Product } from "../data/productsData";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl"
    >
      {/* Product Image */}

      <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white p-8">

        {product.badge && (
          <span className="absolute left-5 top-5 z-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold tracking-wide text-white shadow-lg">
            {product.badge}
          </span>
        )}

        <motion.div
          whileHover={{
            scale: 1.08,
          }}
          transition={{
            duration: 0.35,
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={420}
            height={420}
            className="mx-auto h-64 w-auto object-contain"
          />
        </motion.div>

      </div>

      {/* Content */}

      <div className="p-7">

        <div className="mb-3 flex items-center justify-between">

          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            {product.category}
          </span>

          <ShieldCheck
            size={20}
            className="text-cyan-600"
          />

        </div>

        <h3 className="text-2xl font-bold text-slate-900">
          {product.name}
        </h3>

        <p className="mt-4 text-[15px] leading-7 text-slate-600">
          {product.shortDescription}
        </p>

        {/* Features */}

        <div className="mt-6 space-y-3">

          {product.features.slice(0, 4).map((feature) => (

            <div
              key={feature}
              className="flex items-center gap-3"
            >

              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />

              <span className="text-sm text-slate-700">
                {feature}
              </span>

            </div>

          ))}

        </div>

        {/* Specifications */}

        <div className="mt-8 grid grid-cols-2 gap-3">

          {product.specifications.slice(0, 4).map((item) => (

            <div
              key={item.label}
              className="rounded-xl bg-slate-50 p-3"
            >

              <p className="text-xs font-semibold uppercase text-slate-500">
                {item.label}
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {item.value}
              </p>

            </div>

          ))}

        </div>

        {/* Action Buttons */}

        <div className="mt-8 grid grid-cols-3 gap-3">          {/* View Details */}

          <Link
            href={`/products/${product.slug}`}
            className="col-span-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:from-cyan-600 hover:to-blue-700"
          >
            View Details

            <ArrowRight size={18} />
          </Link>

          {/* WhatsApp */}

          <a
            href={`https://wa.me/${product.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl border border-green-300 bg-green-50 py-3 text-green-700 transition-all duration-300 hover:bg-green-100"
          >
            <MessageCircle size={20} />
          </a>

          {/* Brochure */}

          <a
            href={product.brochure}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 py-3 text-blue-700 transition-all duration-300 hover:bg-blue-100"
          >
            <Download size={20} />
          </a>

          {/* Certification */}

          <div className="flex items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 py-3">
            <ShieldCheck
              size={20}
              className="text-cyan-600"
            />
          </div>

        </div>

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">

          <span className="text-sm font-medium text-slate-500">
            NAVII GPS INDIA
          </span>

          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
            Premium Quality
          </span>

        </div>

      </div>

      {/* Hover Border */}

      <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent transition-all duration-300 group-hover:border-cyan-400/40" />

    </motion.article>
  );
}