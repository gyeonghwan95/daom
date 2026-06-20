/** Smooth deceleration — natural scroll reveals */
export const easeSmooth = [0.33, 1, 0.68, 1] as const;

/** Cinematic opening */
export const easeOutSoft = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpSubtle = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 1.03 },
  visible: { opacity: 1, scale: 1 },
};

export const defaultViewport = { once: true, margin: "-10% 0px -8% 0px" as const };

export const defaultTransition = {
  duration: 0.85,
  ease: easeSmooth,
};

export const heroTransition = {
  duration: 1,
  ease: easeOutSoft,
};
