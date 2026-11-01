"use client";

import { usePathname } from "next/navigation";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import { pickShortReviewQuote } from "@/lib/naver-place-reviews/static-quotes";
import {
  pickReviewQuote,
  type ReviewQuote,
} from "@/lib/naver-place-reviews/topic-quote";

type TrustReviewQuoteProps = {
  quotes: ReviewQuote[];
};

/**
 * 신뢰 블록 안의 방문자 후기 한 줄 — 같은 업무 후기를 보여 주고
 * 「후기 전체 보기」로 네이버 플레이스에 연결한다(별점 스키마 없음).
 */
export function TrustReviewQuote({ quotes }: TrustReviewQuoteProps) {
  const pathname = usePathname() ?? "/";
  // 같은 페이지 위쪽 결정 카드가 인용한 후기는 다시 보여 주지 않는다
  const used = pickShortReviewQuote(pathname)?.id;
  const quote = pickReviewQuote(
    quotes.filter((q) => q.id !== used),
    pathname,
  );
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
          label="후기 전체 보기"
        />
      </figcaption>
      <blockquote className="mt-1.5 text-[0.95rem] leading-relaxed text-navy/85">
        “{quote.excerpt}”
      </blockquote>
    </figure>
  );
}
