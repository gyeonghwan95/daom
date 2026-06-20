"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { easeOutSoft } from "@/lib/motion";

type HomeSectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  dark?: boolean;
  centered?: boolean;
  action?: ReactNode;
};

export function HomeSectionHeader({
  label,
  title,
  description,
  dark = false,
  centered = false,
  action,
}: HomeSectionHeaderProps) {
  const reduced = useReducedMotion();
  const textAlign = centered ? "text-center lg:text-left" : "";

  return (
    <Reveal>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className={`min-w-0 max-w-3xl ${textAlign}`}>
          <motion.p
            className={`home-section-label ${dark ? "text-white/50" : "text-navy-light"}`}
            initial={reduced ? false : { opacity: 0, letterSpacing: "0.3em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.22em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutSoft }}
          >
            {label}
          </motion.p>
          <h2
            className={`mt-3 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl ${
              dark ? "text-white" : "text-navy"
            }`}
          >
            {title}
          </h2>
          {description && (
            <p
              className={`mt-4 max-w-3xl text-base leading-relaxed md:text-lg ${
                dark ? "text-white/70" : "text-navy/65"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="flex shrink-0 flex-wrap items-center gap-4 sm:justify-end sm:pb-1">
            {action}
          </div>
        )}
      </div>
    </Reveal>
  );
}
