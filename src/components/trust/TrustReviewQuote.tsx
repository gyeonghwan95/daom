"use client";

import { usePathname } from "next/navigation";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import {
  pickReviewQuote,
  type ReviewQuote,
} from "@/lib/naver-place-reviews/topic-quote";

type TrustReviewQuoteProps = {
  quotes: ReviewQuote[];
  totalCount: number;
};

/**
 * 신뢰 블록 안의 방문자 후기 한 줄 — 같은 업무 후기를 보여 주고
 * 「후기 n건 보기」로 네이버 플레이스에 연결한다(별점 스키마 없음).
 */
export function TrustReviewQuote({ quotes, totalCount }: TrustReviewQuoteProps) {
  const pathname = usePathname() ?? "/";
  const quote = pickReviewQuote(quotes, pathname);
  if (!quote) return null;

  return (
    <figure className="mt-5 rounded-xl border border-[#03C75A]/25 bg-white px-4 py-3.5">
      <figcaption className="flex items-center justify-between gap-3 text-xs font-semibold text-navy-light">
        <span>네이버 플레이스 방문자 후기</span>
        <NaverSmartPlaceCta
          variant="review"
          placement="trust_review"
          tone="text"
          size="sm"
          className="!min-h-8 shrink-0 !px-0 text-xs"
          label={totalCount > 0 ? `후기 ${totalCount}건 보기` : "후기 보기"}
        />
      </figcaption>
      <blockquote className="mt-1.5 text-[0.95rem] leading-relaxed text-navy/85">
        “{quote.excerpt}”
      </blockquote>
    </figure>
  );
}
