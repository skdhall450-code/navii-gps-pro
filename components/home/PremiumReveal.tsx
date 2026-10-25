"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./premium-home.module.css";

/** Content is visible in SSR and without JavaScript. Motion is progressive enhancement. */
export default function PremiumReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || preference.matches || !("IntersectionObserver" in window) || !element.animate) return;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      animation = element.animate([{ transform: "translateY(18px)" }, { transform: "translateY(0)" }], { duration: 650, delay: Math.min(Math.max(delay, 0), 180), easing: "cubic-bezier(.2,.7,.2,1)" });
      observer.disconnect();
    }, { threshold: 0.08 });
    const stopMotion = () => { if (preference.matches) { animation?.cancel(); observer.disconnect(); } };
    preference.addEventListener("change", stopMotion);
    observer.observe(element);
    return () => { observer.disconnect(); animation?.cancel(); preference.removeEventListener("change", stopMotion); };
  }, [delay]);
  return <div ref={ref} className={`${styles.reveal} ${className}`}>{children}</div>;
}
