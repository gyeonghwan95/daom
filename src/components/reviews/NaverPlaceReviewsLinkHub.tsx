import { NaverIcon } from "@/components/consultation/ConsultationIcons";
import { reviewMonthLabel } from "@/lib/naver-place-reviews/topic-label";
import type { NaverPlaceReviewsPreviewFeed } from "@/lib/naver-place-reviews/types";

type NaverPlaceReviewsLinkHubProps = {
  feed: NaverPlaceReviewsPreviewFeed;
};

export function NaverPlaceReviewsLinkHub({ feed }: NaverPlaceReviewsLinkHubProps) {
  return (
    <section id="naver-place-reviews" aria-labelledby="naver-place-reviews-heading">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--naver-green-strong)]">
        <NaverIcon className="h-4 w-4" />
        네이버 플레이스 방문자 후기
      </p>
      <h2 id="naver-place-reviews-heading" className="section-heading mt-2">
        맡겨 본 분들이 남긴 말
      </h2>
      <p className="body-text mt-3 max-w-3xl text-navy/75">
        후기 원문은 이 페이지에 싣지 않습니다. 앞부분만 미리 보여 드리니, 전체 글과 사진·답글은
        네이버 플레이스에서 이어서 보세요.
      </p>

      {feed.items.length > 0 ? (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {feed.items.map((review) => (
            <li key={review.id}>
              <a
                href={feed.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-voices__card review-preview__card"
              >
                <span className="about-voices__topic">{review.topic}</span>
                <blockquote className="about-voices__quote">
                  <p>{review.excerpt}</p>
                </blockquote>
                <p className="about-voices__meta">
                  {review.nickname} · {reviewMonthLabel(review.createdSortKey)} · 네이버
                  플레이스
                </p>
                <span className="review-preview__more">
                  네이버 플레이스에서 이어서 보기
                  <span className="sr-only"> (새 창)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <a
        href={feed.reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--naver-green-strong)] px-5 text-[0.95rem] font-bold text-white no-underline shadow-sm transition hover:bg-[#026a30]"
      >
        <NaverIcon className="h-5 w-5" />
        네이버 플레이스에서 후기 원문 보기
        <span className="sr-only"> (새 창)</span>
      </a>
    </section>
  );
}
