import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "./productsData";
import styles from "@/components/products/product-showcase.module.css";

export default function ProductCard({ product, index }: { product: (typeof products)[number]; index: number }) {
  return <article className={styles.card}>
    <div className={styles.stage}>
      <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <Image src={product.image} alt={product.title} width={420} height={420} sizes="(max-width: 639px) 90vw, (max-width: 1279px) 45vw, 390px" />
    </div>
    <div className={styles.body}>
      <span className={styles.category}>NAVII GPS COLLECTION</span>
      <h3 className={styles.title}>{product.title}</h3>
      <p className={styles.description}>{product.description}</p>
      <ul className={styles.features}>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
      <div className={styles.actions}><Link href={product.href} className={`${styles.primary} ${styles.full}`}>Learn More <ArrowRight size={16} aria-hidden="true" /></Link></div>
    </div>
  </article>;
}
