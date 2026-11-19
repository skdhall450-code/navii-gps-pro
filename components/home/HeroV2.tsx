"use client";

import { useEffect, useState } from "react";
import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";
import styles from "./premium-home.module.css";

export default function HeroV2() {
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title" data-motion-ready={ready} data-motion-paused={paused}>
      <div className={styles.heroGlow} data-hero-glow aria-hidden="true" />
      <div className={`${styles.heroGlow} ${styles.heroGlowSecondary}`} aria-hidden="true" />
      <div className={styles.heroGrid}><HeroContent /><HeroVisual /></div>
      {ready && <div className={styles.motionControlRow}><button type="button" className={styles.motionControl} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Resume hero animation" : "Pause hero animation"}</button></div>}
      <div className={styles.heroLine} aria-hidden="true" />
    </section>
  );
}
