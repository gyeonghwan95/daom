"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import type { ThumbnailCardItem } from "@/lib/seo/page-thumbnails";
import { ThumbnailCard } from "./ThumbnailCard";

export type ThumbnailCarouselProps = {
  heading: string;
  description?: string;
  items: ThumbnailCardItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  /** 첫 카드만 eager (LCP 보호 — hero보다 우선하지 않음) */
  prioritizeFirst?: boolean;
};

/**
 * 가벼운 scroll-snap 썸네일 캐러셀.
 * autoplay 없음. 실제 <a href> 카드로 crawlable.
 */
export function ThumbnailCarousel({
  heading,
  description,
  items,
  viewAllHref,
  viewAllLabel = "전체보기",
  className,
  prioritizeFirst = false,
}: ThumbnailCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const card = list.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : 280;
    list.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  if (items.length === 0) return null;

  const headingId = `thumbnail-carousel-${heading.replace(/\s+/g, "-").slice(0, 40)}`;

  return (
    <section
      aria-labelledby={headingId}
      data-thumbnail-carousel="root"
      className={className ?? "mt-12"}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2
            id={headingId}
            className="text-xl font-bold text-[var(--navy,#1e3a5f)] sm:text-2xl"
          >
            {heading}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-neutral-600">{description}</p>
          ) : null}
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            aria-label="이전 썸네일"
            onClick={() => scrollByCard(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border,#e5e0d8)] bg-white text-[var(--navy,#1e3a5f)] transition-colors hover:bg-[#f0ebe3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy,#1e3a5f)]"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            aria-label="다음 썸네일"
            onClick={() => scrollByCard(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border,#e5e0d8)] bg-white text-[var(--navy,#1e3a5f)] transition-colors hover:bg-[#f0ebe3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy,#1e3a5f)]"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <ul
        ref={listRef}
        tabIndex={0}
        aria-label={heading}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:thin] motion-reduce:scroll-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy,#1e3a5f)]"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollByCard(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollByCard(-1);
          }
        }}
      >
        {items.map((item, index) => (
          <ThumbnailCard
            key={item.id}
            item={item}
            priority={prioritizeFirst && index === 0}
          />
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
