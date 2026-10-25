"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { products } from "../data/productsData";
import styles from "../product-showcase.module.css";

type ProductHeroProps = { searchQuery: string; onSearchChange: (value: string) => void };

export default function ProductHero({ searchQuery, onSearchChange }: ProductHeroProps) {
  const featured = products.find(product => product.slug === "g17-gps-tracker")!;
  return <section className={styles.section}>
    <div className={`${styles.container} ${styles.heroGrid}`}>
      <div>
        <span className={styles.eyebrow}>NAVII GPS PRODUCT RANGE</span>
        <h1 className={styles.heading}>GPS Tracking Devices<br /><span>for Cars &amp; Fleets</span></h1>
        <p className={styles.intro}>Explore GPS trackers for cars and commercial vehicles, plus AI dash cameras, fuel sensors, smart e-locks and connected IoT solutions for intelligent fleet management.</p>
        <div className={styles.search}>
          <Search size={20} aria-hidden="true" />
          <input type="search" aria-label="Search NAVII GPS products" placeholder="Find your tracking solution..." value={searchQuery} onChange={event => onSearchChange(event.target.value)} aria-controls="product-catalog" />
        </div>
        <div className={styles.heroButtons}>
          <a href="#product-catalog" className={styles.primary}>Browse Products <ArrowRight size={16} aria-hidden="true" /></a>
          <Link href="/ais-140-gps" className={styles.secondary}>AIS-140 GPS Solutions <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className={styles.stats}>{[[`${products.length}`, "Featured Products"], ["500+", "Clients"], ["25K+", "Vehicles"], ["24×7", "Support"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </div>
      <div className={styles.heroStage}>
        <div className={styles.heroStageInner}>
          <span className={styles.number}>THE COLLECTION / 01</span>
          <Image src={featured.image} alt={featured.name} fill priority sizes="(max-width: 639px) 90vw, (max-width: 1279px) 45vw, 500px" />
        </div>
        <div className={styles.heroCaption}><div><span className={styles.category}>VEHICLE GPS</span><h2 className={styles.title}>G17 GPS Tracker</h2><p>GT06-compatible wired tracking</p></div><Link href={`/products/${featured.slug}`} className={styles.primary} aria-label="Explore G17 GPS Tracker"><ArrowRight size={20} aria-hidden="true" /></Link></div>
      </div>
    </div>
  </section>;
}
