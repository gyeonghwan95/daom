import { NaverIcon } from "@/components/consultation/ConsultationIcons";
import { reviewMonthLabel, reviewTopicLabel } from "@/lib/naver-place-reviews/topic-label";
import type { NaverPlaceReviewsFeed } from "@/lib/naver-place-reviews/types";

type NaverPlaceReviewsLinkHubProps = {
  feed: NaverPlaceReviewsFeed;
};

/**
 * 고객후기 페이지 본문 — 네이버 플레이스 방문자 후기를 잘라 내지 않고 전문으로 보여 준다.
 * 후기 수를 앞세우기보다 의뢰인이 직접 쓴 말을 먼저 읽게 한다. 본문은 고치지 않는다.
 */
export function NaverPlaceReviewsLinkHub({ feed }: NaverPlaceReviewsLinkHubProps) {
  const reviews = [...feed.items]
    .filter((r) => r.body && r.body.trim().length > 0)
    .sort((a, b) => b.createdSortKey.localeCompare(a.createdSortKey));

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
        네이버 플레이스에 남은 방문자 후기를 고치지 않고 옮겼습니다. 사진 후기와 사무소 답글은
        네이버 플레이스에서 함께 보실 수 있습니다.
      </p>

      {reviews.length > 0 ? (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <li key={review.id} className="about-voices__card review-full__card">
              <span className="about-voices__topic">{reviewTopicLabel(review.body)}</span>
              <blockquote className="about-voices__quote">
                <p className="whitespace-pre-line">{review.body.trim()}</p>
              </blockquote>
              <p className="about-voices__meta">
                {review.nickname} · {reviewMonthLabel(review.createdSortKey)} · 네이버 플레이스
              </p>
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
        네이버 플레이스에서 원문 보기
        <span className="sr-only"> (새 창)</span>
      </a>
    </section>
  );
}
