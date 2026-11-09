"use client";

import { usePathname } from "next/navigation";
import { NaverPlaceReviewLink } from "@/components/reviews/NaverPlaceReviewLink";
import { pickShortReviewQuote } from "@/lib/naver-place-reviews/static-quotes";
import {
  pickReviewQuote,
  type ReviewQuote,
} from "@/lib/naver-place-reviews/topic-quote";

type TrustReviewQuoteProps = {
  quotes: ReviewQuote[];
};

export function TrustReviewQuote({ quotes }: TrustReviewQuoteProps) {
  const pathname = usePathname() ?? "/";
  const used = pickShortReviewQuote(pathname)?.id;
  const quote = pickReviewQuote(
    quotes.filter((q) => q.id !== used),
    pathname,
  );
  if (!quote) return null;

  return (
    <NaverPlaceReviewLink placement="trust_review" className="trust-review-quote">
      <span className="trust-review-quote__label">네이버 플레이스 방문자 후기</span>
      <blockquote className="trust-review-quote__text">“{quote.excerpt}”</blockquote>
      <span className="trust-review-quote__more">
        네이버 플레이스에서 이어서 보기
        <span className="sr-only"> (새 창)</span>
      </span>
    </NaverPlaceReviewLink>
  );
}
