"use client";

import { useMemo, useState } from "react";

import ProductCard from "../cards/ProductCard";
import ProductFilters from "../filters/ProductFilters";

import { products } from "../data/productsData";
import styles from "../product-showcase.module.css";

export default function ProductGrid({ searchQuery }: { searchQuery: string }) {
  const [activeCategory, setActiveCategory] =
    useState("All Products");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "All Products" ||
        product.category === activeCategory;

      const searchMatch =
        product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.shortDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="product-catalog" className={`${styles.section} scroll-mt-24`} aria-label="Product catalogue">
      <div className={styles.container}>
        <div className={styles.catalogTop}>
          <ProductFilters activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <p className={styles.count} role="status" aria-live="polite">{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</p>
        </div>
        {filteredProducts.length > 0 ? (
          <div className={styles.grid}>{filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}</div>
        ) : (
          <div className={styles.empty}><h3>No Products Found</h3><p>Please try another product name or category.</p></div>
        )}
      </div>
    </section>
  );
}
