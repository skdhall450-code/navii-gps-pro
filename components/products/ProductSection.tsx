"use client";

import ProductHero from "./hero/ProductHero";
import ProductGrid from "./grid/ProductGrid";
import CTA from "./CTA";

export default function ProductSection() {
  return (
    <>
      <ProductHero />

      <ProductGrid />

      <CTA />
    </>
  );
}