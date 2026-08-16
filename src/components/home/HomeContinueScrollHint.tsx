"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scrollToNextHomeSection } from "@/lib/home-scroll";

export function HomeContinueScrollHint() {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      className="home-continue-hint"
      onClick={() => scrollToNextHomeSection(reduced ? 0 : 750)}
      aria-label="다음 섹션으로 스크롤"
    >
      <span className="home-continue-hint__label">아래로 더 보기</span>
      <span className="home-hero__scroll-motion" aria-hidden>
        <span className="home-hero__scroll-mouse">
          <span className="home-hero__scroll-wheel" />
        </span>
        <span className="home-hero__scroll-chevrons">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
