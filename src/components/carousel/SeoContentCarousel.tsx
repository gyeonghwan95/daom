"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import type { SeoCarouselItem } from "@/lib/seo/carousel-images";
import { SeoCarouselCard } from "./SeoCarouselCard";

export type SeoContentCarouselProps = {
  heading: string;
  description?: string;
  items: SeoCarouselItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
};

export function SeoContentCarousel({
  heading,
  description,
  items,
  viewAllHref,
  viewAllLabel = "전체보기",
  className,
}: SeoContentCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const card = list.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : 320;
    list.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="seo-carousel-heading"
      className={className ?? "mt-12"}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2
            id="seo-carousel-heading"
            className="text-xl font-bold text-[var(--navy,#1e3a5f)] sm:text-2xl"
          >
            {heading}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-neutral-600">{description}</p>
          ) : null}
        </div>
        <div className="hidden shrink-0 gap-2 lg:flex">
          <button
            type="button"
            aria-label="이전 카드"
            onClick={() => scrollByCard(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border,#e5e0d8)] bg-white text-[var(--navy,#1e3a5f)] transition-colors hover:bg-[#f0ebe3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy,#1e3a5f)]"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            aria-label="다음 카드"
            onClick={() => scrollByCard(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border,#e5e0d8)] bg-white text-[var(--navy,#1e3a5f)] transition-colors hover:bg-[#f0ebe3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy,#1e3a5f)]"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <ul
        ref={listRef}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:thin] motion-reduce:scroll-auto"
      >
        {items.map((item) => (
          <SeoCarouselCard key={item.id} item={item} />
        ))}
      </ul>

      {viewAllHref ? (
        <div className="mt-3 text-right">
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[var(--navy,#1e3a5f)] underline-offset-4 hover:underline"
          >
            {viewAllLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
