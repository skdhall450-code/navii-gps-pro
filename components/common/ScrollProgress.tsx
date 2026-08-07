"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[99999] h-1 w-full origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 shadow-lg shadow-cyan-500/50"
    />
  );
}