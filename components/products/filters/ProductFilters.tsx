"use client";
import styles from "../product-showcase.module.css";
const categories = ["All Products", "Vehicle GPS", "AI Dashcam", "Fuel Sensor", "IoT Solutions"];
export default function ProductFilters({ activeCategory, onCategoryChange }: { activeCategory: string; onCategoryChange: (category: string) => void }) {
  return <div className={styles.filters} role="group" aria-label="Filter products by category">{categories.map(category => <button key={category} type="button" onClick={() => onCategoryChange(category)} aria-pressed={activeCategory === category} className={styles.filter}>{category}</button>)}</div>;
}
