"use client";

import {
  BookOpen,
  Download,
  FileText,
  MessageCircle,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "../data/productsData";

interface ProductDownloadsProps {
  product: Product;
}

export default function ProductDownloads({ product }: ProductDownloadsProps) {
  const createRequestUrl = (resourceName: string) => {
    const message = encodeURIComponent(
      `Hello NAVII GPS, I need the ${resourceName} for ${product.name}. Please share availability and details.`,
    );

    return `https://wa.me/${product.whatsapp}?text=${message}`;
  };

  const downloads = [
    {
      title: "Product Brochure",
      description: product.brochure
        ? "Download the available product brochure."
        : "Request the latest product brochure from our sales team.",
      icon: FileText,
      href: product.brochure || createRequestUrl("product brochure"),
      isDownload: Boolean(product.brochure),
    },
    {
      title: "User Manual",
      description: "Request user manual availability for this product.",
      icon: BookOpen,
      href: createRequestUrl("user manual"),
      isDownload: false,
    },
    {
      title: "Installation Guide",
      description: "Request installation guidance from our support team.",
      icon: Wrench,
      href: createRequestUrl("installation guide"),
      isDownload: false,
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            PRODUCT SUPPORT
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Resources & Documentation
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Download available documents or request the latest product resources
            directly from NAVII GPS.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {downloads.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{
                  once: true,
                }}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 flex-1 leading-7 text-slate-600">
                  {item.description}
                </p>

                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition ${
                    item.isDownload
                      ? "bg-cyan-600 hover:bg-cyan-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {item.isDownload ? (
                    <>
                      <Download size={18} />
                      Download
                    </>
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      Request on WhatsApp
                    </>
                  )}
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
