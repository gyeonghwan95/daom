"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import type { Swiper as SwiperInstance } from "swiper";

type HomeSwiperProgressProps = {
  swiper: SwiperInstance | null;
  sectionCount: number;
};

export function HomeSwiperProgress({
  swiper,
  sectionCount,
}: HomeSwiperProgressProps) {
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(progress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!swiper || sectionCount <= 1) return;

    const update = () => {
      setProgress(swiper.activeIndex / (sectionCount - 1));
    };

    update();
    swiper.on("slideChange", update);
    return () => {
      swiper.off("slideChange", update);
    };
  }, [swiper, sectionCount]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-navy/40"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
