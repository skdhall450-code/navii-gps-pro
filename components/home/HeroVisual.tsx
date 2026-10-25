import Image from "next/image";
import { MapPin, Truck } from "lucide-react";
import PremiumReveal from "./PremiumReveal";
import styles from "./premium-home.module.css";

export default function HeroVisual() {
  return (
    <PremiumReveal className={styles.visual} delay={120}>
      <div className={styles.visualLabel}><span aria-hidden="true" /> NAVII GPS INDIA</div>
      <div className={styles.deviceStage}>
        <Image src="/assets/hero/hero.png" alt="NAVII GS900 GPS tracking device" width={560} height={840} priority sizes="(min-width: 1024px) 480px, (min-width: 640px) 520px, 90vw" className={styles.device} />
        <div className={styles.deviceEdge} aria-hidden="true" />
        <div className={styles.floatingFeatures} role="group" aria-label="GPS tracking features">
          <div className={styles.floatingSign} data-hero-feature="tracking"><MapPin aria-hidden="true" size={20} strokeWidth={1.8} /><span>Live GPS Tracking</span></div>
          <div className={styles.floatingSign} data-hero-feature="fleet"><Truck aria-hidden="true" size={20} strokeWidth={1.8} /><span>Fleet Management</span></div>
        </div>
      </div>
      <div className={styles.visualFooter}><span>Live GPS Tracking</span><span>Fleet Management</span></div>
    </PremiumReveal>
  );
}
