"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { defaultTransition, defaultViewport, fadeUpSubtle } from "@/lib/motion";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "ul" | "div";
};

export function Stagger({
  children,
  className,
  stagger = 0.06,
  as = "div",
}: StaggerProps) {
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
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "li" | "div";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      variants={fadeUpSubtle}
      transition={defaultTransition}
      className={className}
    >
      {children}
    </Component>
  );
}
