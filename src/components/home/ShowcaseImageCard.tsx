"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ShowcaseImage } from "@/lib/home-showcase";

type ShowcaseImageCardProps = {
  image: ShowcaseImage;
  category: string;
  title: string;
  subtitle: string;
  meta?: string;
  href?: string;
  variant?: "activity" | "press";
};

export function ShowcaseImageCard({
  image,
  category,
  title,
  subtitle,
  meta,
  href,
  variant = "activity",
}: ShowcaseImageCardProps) {
  const width = variant === "press" ? 340 : 300;

  const inner = (
    <motion.article
      className={`showcase-card group relative w-[min(280px,calc(100vw-2.5rem))] shrink-0 overflow-hidden rounded-2xl border border-beige-dark/80 bg-white sm:w-[300px] md:w-[320px] ${href && href !== "#" ? "" : "cursor-default"}`}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-beige">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={`${width}px`}
        />
        <div className="showcase-card__shine pointer-events-none absolute inset-0" aria-hidden />
        {image.placeholder && (
          <span className="absolute left-3 top-3 rounded-full bg-navy/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            임시
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur-sm">
          {category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-navy group-hover:text-navy-light">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/60">
          {subtitle}
        </p>
        {meta && (
          <p className="mt-3 text-xs font-medium text-navy/40">{meta}</p>
        )}
      </div>
    </motion.article>
  );

  if (href && href !== "#") {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
        {inner}
      </Link>
    );
  }

  return inner;
}
