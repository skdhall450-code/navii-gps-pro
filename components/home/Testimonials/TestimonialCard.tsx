"use client";

import { motion } from "framer-motion";

type Testimonial = {
  id: number;
  name: string;
  company: string;
  location: string;
  rating: number;
  review: string;
};

type Props = {
  testimonial: Testimonial;
  index: number;
};

export default function TestimonialCard({
  testimonial,
  index,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/40"
    >
      {/* Glow */}

      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-500/20 blur-[80px]" />

      <div className="relative z-10">

        {/* Avatar */}

        <div className="flex items-center gap-4">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-2xl font-bold text-white">
            {testimonial.name.charAt(0)}
          </div>

          <div>

            <h3 className="text-xl font-bold text-white">
              {testimonial.name}
            </h3>

            <p className="text-cyan-300">
              {testimonial.company}
            </p>

            <p className="text-sm text-slate-400">
              📍 {testimonial.location}
            </p>

          </div>

        </div>

        {/* Rating */}

        <div className="mt-6 flex gap-1 text-yellow-400 text-xl">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>

        {/* Review */}

        <p className="mt-6 leading-8 text-slate-300">
  &ldquo;{testimonial.review}&rdquo;
</p>

      </div>

      {/* Hover Border */}

      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition-all duration-500 group-hover:border-cyan-400/40" />

    </motion.div>
  );
}