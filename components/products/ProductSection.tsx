"use client";

import { useState } from "react";

import ProductHero from "./hero/ProductHero";
import ProductGrid from "./grid/ProductGrid";
import CTA from "./CTA";

export default function ProductSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <ProductHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ProductGrid searchQuery={searchQuery} />

      <CTA />
    </>
  );
}
