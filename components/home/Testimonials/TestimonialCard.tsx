"use client";

import styles from "../sections-premium.module.css";
import PremiumReveal from "../PremiumReveal";


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
}: Props) {
  return (
    <PremiumReveal
      className={`${styles.card} group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8  transition-all duration-500 hover:border-cyan-400/40`}
    >
      {/* Glow */}

      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-500/10 blur-[80px]" />

      <div className="relative z-10">

        {/* Avatar */}

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xl font-semibold text-white">
            {testimonial.name.charAt(0)}
          </div>

          <div>

            <h3 className="text-xl font-bold text-white">
              {testimonial.name}
            </h3>

            <p className="text-blue-300">
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

    </PremiumReveal>
  );
}