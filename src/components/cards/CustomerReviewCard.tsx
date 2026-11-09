import { NaverPlaceReviewLink } from "@/components/reviews/NaverPlaceReviewLink";
import type { NaverPlaceReview } from "@/lib/naver-place-reviews/types";
import { truncateWithEllipsis } from "@/lib/text";

const REVIEW_PREVIEW_MAX = 50;

type CustomerReviewCardProps = {
  review: NaverPlaceReview;
  variant?: "default" | "compact";
};

export function CustomerReviewCard({
  review,
  variant = "default",
}: CustomerReviewCardProps) {
  const isCompact = variant === "compact";
  const preview = truncateWithEllipsis(review.body, REVIEW_PREVIEW_MAX);

  return (
    <NaverPlaceReviewLink
      placement="homepage_reviews"
      className={
        isCompact
          ? "home-review-card home-review-card--compact"
          : "home-review-card card-surface flex h-full flex-col p-5 md:p-6"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy">{review.nickname}</p>
          <p className="mt-1 text-xs text-navy/55">
            {review.created}
            {review.visitCount && review.visitCount > 1
              ? ` · ${review.visitCount}번째 방문`
              : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#03C75A]/10 px-2.5 py-1 text-xs font-semibold text-[var(--naver-green-strong)]">
          네이버
        </span>
      </div>

      <p
        className={
          isCompact
            ? "mt-2 text-sm leading-snug text-navy/80"
            : "mt-4 flex-1 text-sm leading-relaxed text-navy/80 md:text-base"
        }
      >
        {preview}
      </p>

      <span className="home-review-card__more">
        네이버 플레이스에서 이어서 보기
        <span className="sr-only"> (새 창)</span>
      </span>
    </NaverPlaceReviewLink>
  );
}
