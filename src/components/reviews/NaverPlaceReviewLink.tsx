"use client";

import type { ReactNode } from "react";
import { trackNaverPlaceClick } from "@/lib/admin-ops/track-client";
import { REVIEW_PAGE_URL } from "@/lib/naver-place-reviews/static-quotes";
import type { NaverSmartPlacePlacement } from "@/lib/naver-smartplace/cta";

type NaverPlaceReviewLinkProps = {
  className?: string;
  placement: NaverSmartPlacePlacement;
  children: ReactNode;
};

export function NaverPlaceReviewLink({
  className = "",
  placement,
  children,
}: NaverPlaceReviewLinkProps) {
  return (
    <a
      href={REVIEW_PAGE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="naver-place"
      data-cta-variant="review"
      data-cta-placement={placement}
      className={className}
      onClick={() => {
        trackNaverPlaceClick({
          variant: "review",
          placement,
          href: REVIEW_PAGE_URL,
        });
      }}
    >
      {children}
    </a>
  );
}
