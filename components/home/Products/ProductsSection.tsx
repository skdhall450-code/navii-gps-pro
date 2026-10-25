import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "./productsData";
import styles from "@/components/products/product-showcase.module.css";

export default function ProductsSection() {
  return <section className={styles.section} aria-labelledby="home-products-heading">
    <div className={styles.container}>
      <div className={styles.topline}>
        <div>
          <span className={styles.eyebrow}>Our products</span>
          <h2 id="home-products-heading" className={styles.heading}>GPS Tracking Devices &amp;<br /><span>IoT Solutions</span></h2>
          <p className={styles.intro}>Explore GPS tracking devices for cars, trucks, buses and commercial fleets, plus fleet management software, video telematics, fuel monitoring and connected security solutions.</p>
        </div>
        <Link href="/products" className={styles.primary}>Explore the collection <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className={styles.grid}>{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
      <p className={styles.links}>Looking for complete vehicle tracking and fleet management? <Link href="/software">Explore our GPS fleet management software</Link> or browse all <Link href="/products">vehicle GPS tracking devices</Link>.</p>
    </div>
  </section>;
}
