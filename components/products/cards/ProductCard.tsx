import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, FileText, MessageCircle } from "lucide-react";
import type { Product } from "../data/productsData";
import styles from "../product-showcase.module.css";

export default function ProductCard({ product }: { product: Product }) {
  const enquiryUrl = `https://wa.me/${product.whatsapp}?text=${encodeURIComponent(`Hello NAVII GPS, I am interested in ${product.name}. Please share price, availability and installation details.`)}`;
  const brochureRequestUrl = `https://wa.me/${product.whatsapp}?text=${encodeURIComponent(`Hello NAVII GPS, please share the latest brochure and specifications for ${product.name}.`)}`;
  return (
    <article className={styles.card}>
      <div className={styles.stage}>
        <span className={styles.number} aria-hidden="true">{String(product.id).padStart(2, "0")}</span>
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <Image src={product.image} alt={product.name} width={420} height={420} sizes="(max-width: 639px) 90vw, (max-width: 1279px) 45vw, 390px" />
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.shortDescription}</p>
        <ul className={styles.features}>{product.features.slice(0, 4).map(feature => <li key={feature}>{feature}</li>)}</ul>
        <details className={styles.specs}>
          <summary>Technical overview</summary>
          <dl>{product.specifications.slice(0, 4).map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
        </details>
        <div className={styles.actions}>
          <Link href={`/products/${product.slug}`} className={`${styles.primary} ${styles.full}`}>View Details <ArrowRight size={16} aria-hidden="true" /></Link>
          <div className={styles.secondaryRow}>
            <a href={enquiryUrl} target="_blank" rel="noopener noreferrer" aria-label={`Enquire about ${product.name} on WhatsApp`} className={styles.secondary}><MessageCircle size={15} aria-hidden="true" />Enquire</a>
            <a href={product.brochure || brochureRequestUrl} target="_blank" rel="noopener noreferrer" aria-label={`${product.brochure ? "Download" : "Request"} ${product.name} brochure`} className={styles.secondary}>
              {product.brochure ? <Download size={15} aria-hidden="true" /> : <FileText size={15} aria-hidden="true" />}{product.brochure ? "Brochure" : "Request brochure"}
            </a>
          </div>
        </div>
        <div className={styles.footer}><span>NAVII GPS INDIA</span><span>PRODUCT SUPPORT</span></div>
      </div>
    </article>
  );
}
