"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-navy/40"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
