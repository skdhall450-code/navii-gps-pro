import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";
import styles from "./premium-home.module.css";

export default function HeroV2() {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.heroGrid}><HeroContent /><HeroVisual /></div>
      <div className={styles.heroLine} aria-hidden="true" />
    </section>
  );
}
