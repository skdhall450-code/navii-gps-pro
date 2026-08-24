"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileText,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import type { Product } from "../data/productsData";

interface ProductHeroProps {
  product: Product;
}

export default function ProductHero({ product }: ProductHeroProps) {
  const enquiryMessage = encodeURIComponent(
    `Hello NAVII GPS, I am interested in ${product.name}. Please share price, availability and installation details.`,
  );

  const brochureMessage = encodeURIComponent(
    `Hello NAVII GPS, please share the latest brochure and specifications for ${product.name}.`,
  );

  const enquiryUrl = `https://wa.me/${product.whatsapp}?text=${enquiryMessage}`;

  const brochureRequestUrl = `https://wa.me/${product.whatsapp}?text=${brochureMessage}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06142E] via-[#081C3D] to-[#0B254F] py-20">
      <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-center gap-3 text-sm text-cyan-300">
          <Link
            href="/products"
            className="flex items-center gap-2 hover:text-white"
          >
            <ArrowLeft size={16} />
            Products
          </Link>

          <span>/</span>

          <span className="text-white">{product.name}</span>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="max-w-4xl"
        >
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            {product.category}
          </span>

          <h1 className="mt-6 text-5xl font-extrabold text-white lg:text-6xl">
            {product.name}
          </h1>

          {product.badge && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-5 py-2 text-green-300">
              <ShieldCheck size={18} />
              {product.badge}
            </div>
          )}

          <p className="mt-8 max-w-3xl text-lg leading-9 text-slate-300">
            {product.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={enquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-green-600 px-7 py-4 font-semibold text-white transition hover:bg-green-700"
            >
              <MessageCircle size={20} />
              WhatsApp Enquiry
            </a>

            <a
              href="tel:+918899729705"
              aria-label="Call NAVII GPS sales at +91 88997 29705"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-600"
            >
              <Phone size={20} />
              Call Sales
            </a>

            {product.brochure ? (
              <a
                href={product.brochure}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-cyan-400/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                <Download size={20} />
                Download Brochure
              </a>
            ) : (
              <a
                href={brochureRequestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-cyan-400/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                <FileText size={20} />
                Request Brochure
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
