import Link from "next/link";
import PremiumReveal from "./PremiumReveal";
import styles from "./premium-home.module.css";

export default function HeroContent() {
  return (
    <PremiumReveal className={styles.heroContent}>
      {/* Badge */}

      <div className={styles.eyebrow}>
        🚀 India&apos;s Trusted GPS Tracking Company
      </div>

      {/* Heading */}

      <h1 id="home-hero-title" className={styles.heroTitle}>
        <span className="block">Smart GPS Tracker</span>
        <span className={styles.titleAccent}>
          &amp; Tracking Solutions
        </span>
      </h1>

      {/* Description */}

      <p className={styles.heroDescription}>
        GPS tracking devices for cars and commercial fleets with live
        vehicle tracking, fleet management, AIS-140 GPS, dash cameras,
        fuel monitoring and connected IoT solutions across India.
      </p>

      {/* Buttons */}

      <div className={styles.heroActions}>

        <Link
          href="/products"
          className={styles.primaryButton}
        >
          Explore Products
        </Link>

        <Link
          href="/contact"
          aria-label="Book a free NAVII GPS product and software demo"
          className={styles.secondaryButton}
        >
          Book Demo
        </Link>

      </div>

      {/* Statistics */}

      <div className={styles.heroStats}>

        <div>
          <h2 className={styles.heroStatNumber}>
            25K+
          </h2>

          <p className={styles.heroStatLabel}>
            Vehicles Tracked
          </p>
        </div>

        <div>
          <h2 className={styles.heroStatNumber}>
            500+
          </h2>

          <p className={styles.heroStatLabel}>
            Business Clients
          </p>
        </div>

        <div>
          <h2 className={styles.heroStatNumber}>
            98%
          </h2>

          <p className={styles.heroStatLabel}>
            Satisfaction
          </p>
        </div>

      </div>

      {/* Badges */}

      <div className={styles.heroBadges}>

        <span >
          🇮🇳 Made in India
        </span>

        <span >
          ✔ AIS-140 Certified
        </span>

        <span >
          🚚 Fleet Management
        </span>

        <span >
          📡 Live GPS Tracking
        </span>

      </div>

    </PremiumReveal>
  );
}
