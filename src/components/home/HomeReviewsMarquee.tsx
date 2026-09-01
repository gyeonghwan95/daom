"use client";

import Link from "next/link";
import { CustomerReviewCard } from "@/components/cards/CustomerReviewCard";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import { InfiniteVerticalMarquee } from "@/components/motion/InfiniteVerticalMarquee";
import type { NaverPlaceReview } from "@/lib/naver-place-reviews/types";

type HomeReviewsMarqueeProps = {
  reviews: NaverPlaceReview[];
  /** 네이버 플레이스 방문자 후기 건수(평점 스키마 없이 건수만 표시) */
  reviewCount?: number;
};

export function HomeReviewsMarquee({
  reviews,
  reviewCount,
}: HomeReviewsMarqueeProps) {
  const countLabel =
    typeof reviewCount === "number" && reviewCount > 0
      ? `방문자 후기 ${reviewCount.toLocaleString("ko-KR")}건`
      : null;

  if (reviews.length === 0) {
    return (
      <div className="flex h-[14rem] flex-col justify-center rounded-2xl border border-dashed border-beige-dark bg-cream/60 px-5 py-6 text-center md:h-[15.5rem]">
        <p className="text-sm font-semibold text-navy">고객 후기</p>
        <p className="mt-2 text-sm leading-relaxed text-navy/65">
          네이버 플레이스 방문자 리뷰를 준비 중입니다.
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <NaverSmartPlaceCta
            variant="place"
            placement="homepage_reviews"
            tone="text"
            size="sm"
            label="네이버에서 사무소 정보 확인"
          />
          <Link
            href="/reviews"
            className="inline-flex min-h-10 items-center justify-center text-sm font-semibold text-navy-light underline-offset-4 hover:text-navy hover:underline"
          >
            고객후기 페이지 보기 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[14rem] flex-col md:h-[15.5rem]">
      <div className="mb-3 flex shrink-0 items-end justify-between gap-3">
        <div>
          <p className="home-section-label text-navy-light">Reviews</p>
          <h3 className="mt-0.5 text-base font-bold text-navy md:text-lg">
            고객 후기
          </h3>
          {countLabel ? (
            <p className="mt-0.5 text-xs font-medium text-navy/55">{countLabel}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
          <NaverSmartPlaceCta
            variant="place"
            placement="homepage_reviews"
            tone="text"
            size="sm"
            label="네이버에서 확인"
          />
          <Link
            href="/reviews"
            className="text-sm font-semibold text-navy-light underline-offset-4 transition-colors hover:text-navy hover:underline"
          >
            후기 더보기 →
          </Link>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
        <InfiniteVerticalMarquee
          speed={reviews.length <= 3 ? 24 : 34}
          direction="up"
          ariaLabel="네이버 플레이스 고객 후기"
          className="home-reviews-marquee"
        >
          {reviews.map((review) => (
            <CustomerReviewCard
              key={review.id}
              review={review}
              variant="compact"
            />
          ))}
        </InfiniteVerticalMarquee>
      </div>
    </div>
  );
}
