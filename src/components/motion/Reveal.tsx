"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  defaultTransition,
  defaultViewport,
  fadeUp,
  fadeIn,
  scaleIn,
} from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  variant?: "fadeUp" | "fadeIn" | "scaleIn" | "slideRight";
  as?: "div" | "section" | "article" | "li" | "ul";
  className?: string;
};

const variants: Record<NonNullable<RevealProps["variant"]>, Variants> = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideRight: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
};

export function Reveal({
  children,
  delay = 0,
  variant = "fadeUp",
  as = "div",
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={variants[variant]}
      transition={{ ...defaultTransition, delay }}
      className={className}
    >
      {children}
    </Component>
  );
}
