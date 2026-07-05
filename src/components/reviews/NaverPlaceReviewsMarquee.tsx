"use client";

import { InfiniteMarquee } from "@/components/motion/InfiniteMarquee";
import type { NaverPlaceReview } from "@/lib/naver-place-reviews/types";

type NaverPlaceReviewsMarqueeProps = {
  reviews: NaverPlaceReview[];
  reviewUrl: string;
};

function ReviewPreviewCard({
  review,
  reviewUrl,
}: {
  review: NaverPlaceReview;
  reviewUrl: string;
}) {
  return (
    <a
      href={reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="naver-place-reviews-marquee__card group"
      title={`${review.nickname}님의 후기 — 네이버 플레이스에서 보기`}
    >
      <span className="naver-place-reviews-marquee__card-head">
        <span className="naver-place-reviews-marquee__badge">네이버</span>
        <span className="naver-place-reviews-marquee__date">{review.created}</span>
      </span>
      <span className="naver-place-reviews-marquee__nickname">
        {review.nickname}
      </span>
      <span className="naver-place-reviews-marquee__body">{review.body}</span>
      <span className="naver-place-reviews-marquee__more">플레이스에서 전체 보기</span>
    </a>
  );
}

export function NaverPlaceReviewsMarquee({
  reviews,
  reviewUrl,
}: NaverPlaceReviewsMarqueeProps) {
  if (reviews.length === 0) {
    return (
      <div className="naver-place-reviews-marquee__empty">
        <p>네이버 플레이스에서 최신 방문자 후기를 확인하실 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="naver-place-reviews-marquee">
      <p className="naver-place-reviews-marquee__hint">
        최신 후기 미리보기 — 클릭하면 네이버 플레이스 리뷰로 이동합니다
      </p>
      <InfiniteMarquee
        speed={38}
        direction="left"
        className="naver-place-reviews-marquee__track"
      >
        {reviews.map((review) => (
          <ReviewPreviewCard
            key={review.id}
            review={review}
            reviewUrl={reviewUrl}
          />
        ))}
      </InfiniteMarquee>
    </div>
  );
}
