"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Product = {
  id: number;
  title: string;
  image: string;
  description: string;
  features: string[];
  href: string;
};

type Props = {
  product: Product;
  index: number;
};

export default function ProductCard({
  product,
  index,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -10,
      }}
      className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-xl"
    >      {/* Background Glow */}

      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-[90px]" />

      {/* Hover Border */}

      <div className="absolute inset-0 rounded-3xl border border-transparent transition duration-500 group-hover:border-cyan-400/40" />

      <div className="relative p-6">        {/* Product Image */}

        <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10">

          <Image
            src={product.image}
            alt={product.title}
            width={240}
            height={240}
            className="h-auto w-auto object-contain transition duration-500 group-hover:scale-110"
          />

        </div>

        {/* Product Title */}

        <h3 className="mt-6 text-2xl font-bold text-white">
          {product.title}
        </h3>

        {/* Description */}

        <p className="mt-3 text-sm leading-7 text-slate-300">
          {product.description}
        </p>

        {/* Features */}

        <div className="mt-6 space-y-3">

          {product.features.map((feature, i) => (

            <div
              key={i}
              className="flex items-center gap-3"
            >

              <div className="h-2 w-2 rounded-full bg-cyan-400" />

              <span className="text-sm text-slate-200">
                {feature}
              </span>

            </div>

          ))}

        </div>

        {/* Button */}

        <Link
          href={product.href}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,.45)]"
        >
          Learn More

          <span className="transition group-hover:translate-x-1">
            →
          </span>

        </Link>      </div>

      {/* Bottom Glow */}

      <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

    </motion.div>
  );
}