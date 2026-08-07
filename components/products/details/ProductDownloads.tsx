"use client";

import { Download, FileText, BookOpen, Wrench } from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "../data/productsData";

interface ProductDownloadsProps {
  product: Product;
}

export default function ProductDownloads({
  product,
}: ProductDownloadsProps) {
  const downloads = [
    {
      title: "Product Brochure",
      description: "Complete product information and specifications.",
      icon: FileText,
      href: product.brochure,
    },
    {
      title: "User Manual",
      description: "Coming Soon",
      icon: BookOpen,
      href: "#",
      disabled: true,
    },
    {
      title: "Installation Guide",
      description: "Coming Soon",
      icon: Wrench,
      href: "#",
      disabled: true,
    },
  ];

  return (
    <section className="bg-slate-50 py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            DOWNLOADS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Product Resources
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Download brochures and documentation for your GPS device.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {downloads.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-slate-600">
                  {item.description}
                </p>

                {item.disabled ? (
                  <button
                    disabled
                    className="mt-8 w-full cursor-not-allowed rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-500"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700"
                  >
                    <Download size={18} />

                    Download
                  </a>
                )}

              </motion.div>
            );
          })}

        </div>

      </div>

    </section>
  );
}