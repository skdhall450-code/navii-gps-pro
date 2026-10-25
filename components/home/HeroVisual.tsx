import Image from "next/image";
import { MapPin, Star, Truck } from "lucide-react";
import PremiumReveal from "./PremiumReveal";
import styles from "./premium-home.module.css";

export default function HeroVisual() {
  return (
    <PremiumReveal className={styles.visual} delay={120}>
      <div className={styles.visualLabel}><span aria-hidden="true" /> NAVII GPS INDIA</div>
      <div className={styles.deviceStage}>
        <Image src="/assets/hero/hero.png" alt="NAVII GS900 GPS tracking device" width={560} height={840} priority sizes="(min-width: 1024px) 480px, (min-width: 640px) 520px, 90vw" className={styles.device} />
        <div className={styles.deviceEdge} aria-hidden="true" />
        <div className={styles.floatingFeatures} role="group" aria-label="Illustrative GPS dashboard with sample data">
          <div className={`${styles.floatingCard} ${styles.trackingCard}`} data-hero-feature="tracking">
            <p className={styles.cardLabel}><MapPin aria-hidden="true" size={15} /> Live Tracking</p>
            <strong className={styles.cardValue}>25K+</strong>
            <span className={styles.cardCaption}>Active vehicles · sample</span>
          </div>
          <div className={`${styles.floatingCard} ${styles.experienceCard}`} data-hero-feature="experience">
            <p className={styles.cardLabel}><Star aria-hidden="true" size={14} /> Experience</p>
            <strong className={styles.experienceValue}>GPS &amp; IoT</strong>
            <span className={styles.cardCaption}>Tracking solutions</span>
          </div>
          <div className={`${styles.floatingCard} ${styles.dashboardCard}`} data-hero-feature="dashboard">
            <div className={styles.dashboardHeading}><span>Live Dashboard</span><span className={styles.demoBadge}>DEMO</span></div>
            <p className={styles.sampleNote}>Illustrative data, not live telemetry</p>
            <dl className={styles.dashboardRows}>
              <div><dt>Active vehicles</dt><dd>25,486</dd></div>
              <div><dt>Today&apos;s trips</dt><dd>4,250</dd></div>
              <div><dt>Alerts</dt><dd className={styles.alertValue}>18</dd></div>
            </dl>
          </div>
          <div className={`${styles.floatingCard} ${styles.fleetCard}`} data-hero-feature="fleet">
            <p className={styles.cardLabel}><Truck aria-hidden="true" size={15} /> Fleet Online</p>
            <strong className={`${styles.cardValue} ${styles.connectedValue}`}>98%</strong>
            <span className={styles.cardCaption}>Connected · sample</span>
          </div>
        </div>
      </div>
      <div className={styles.visualFooter}><span>Live GPS Tracking</span><span>Fleet Management</span></div>
    </PremiumReveal>
  );
}
