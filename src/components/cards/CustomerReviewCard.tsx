import type { NaverPlaceReview } from "@/lib/naver-place-reviews/types";

type CustomerReviewCardProps = {
  review: NaverPlaceReview;
  variant?: "default" | "compact";
};

export function CustomerReviewCard({
  review,
  variant = "default",
}: CustomerReviewCardProps) {
  const isCompact = variant === "compact";

  return (
    <article
      className={
        isCompact
          ? "w-full shrink-0 rounded-2xl border border-beige-dark bg-white p-4 shadow-sm shadow-navy/5"
          : "card-surface flex h-full flex-col p-5 md:p-6"
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
        <span className="shrink-0 rounded-full bg-[#03C75A]/10 px-2.5 py-1 text-[11px] font-semibold text-[#03C75A]">
          네이버
        </span>
      </div>

      <p
        className={
          isCompact
            ? "mt-3 line-clamp-5 whitespace-pre-line text-sm leading-relaxed text-navy/80"
            : "mt-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-navy/80 md:text-base"
        }
      >
        {review.body}
      </p>

      {!isCompact && review.reply && (
        <div className="mt-4 rounded-lg border border-beige-dark bg-beige/40 px-4 py-3">
          <p className="text-xs font-semibold text-navy/70">사업자 답글</p>
          <p className="mt-1 text-sm leading-relaxed text-navy/75">
            {review.reply}
          </p>
        </div>
      )}
    </article>
  );
}
