"use client";

import Link from "next/link";
import { CustomerReviewCard } from "@/components/cards/CustomerReviewCard";
import { InfiniteVerticalMarquee } from "@/components/motion/InfiniteVerticalMarquee";
import type { NaverPlaceReview } from "@/lib/naver-place-reviews/types";

type HomeReviewsMarqueeProps = {
  reviews: NaverPlaceReview[];
};

export function HomeReviewsMarquee({ reviews }: HomeReviewsMarqueeProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex h-full min-h-[18rem] flex-col justify-center rounded-2xl border border-dashed border-beige-dark bg-cream/60 px-6 py-8 text-center">
        <p className="text-sm font-semibold text-navy">고객 후기</p>
        <p className="mt-2 text-sm leading-relaxed text-navy/65">
          네이버 플레이스 방문자 리뷰를 준비 중입니다.
        </p>
        <Link
          href="/reviews"
          className="mt-4 inline-flex min-h-10 items-center justify-center text-sm font-semibold text-navy-light underline-offset-4 hover:text-navy hover:underline"
        >
          고객후기 페이지 보기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[18rem] flex-col">
      <div className="mb-4 flex shrink-0 items-end justify-between gap-3">
        <div>
          <p className="home-section-label text-navy-light">Reviews</p>
          <h3 className="mt-1 text-lg font-bold text-navy md:text-xl">고객 후기</h3>
        </div>
        <Link
          href="/reviews"
          className="shrink-0 text-sm font-semibold text-navy-light underline-offset-4 transition-colors hover:text-navy hover:underline"
        >
          후기 더보기 →
        </Link>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
        <InfiniteVerticalMarquee
          speed={reviews.length <= 3 ? 28 : 40}
          direction="up"
          ariaLabel="네이버 플레이스 고객 후기"
          className="home-reviews-marquee"
        >
          {reviews.map((review) => (
            <CustomerReviewCard key={review.id} review={review} variant="compact" />
          ))}
        </InfiniteVerticalMarquee>
      </div>
    </div>
  );
}
