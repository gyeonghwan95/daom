import { officeHours } from "@/lib/office-location";
import {
  REVIEW_AVG_RATING,
  REVIEW_PAGE_URL,
  REVIEW_TOTAL,
} from "@/lib/naver-place-reviews/static-quotes";

/**
 * H1 바로 아래 신뢰 띠 — 실제 값만 보여 준다(후기 평점·건수는 빌드 시점 네이버 플레이스 값).
 * 모바일은 후기·사무소·표창을 한두 줄로, PC는 직접 진행·상담 시간까지 한 줄에 늘어놓는다.
 */
export function HeroTrustLine() {
  const rating = REVIEW_AVG_RATING > 0 ? REVIEW_AVG_RATING.toFixed(1) : null;
  return (
    <p className="hero-trust-line">
      {REVIEW_TOTAL > 0 ? (
        <a
          href={REVIEW_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-trust-line__reviews"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-3.5 w-3.5 text-[#c9a86a]">
            <path d="M10 1.8l2.5 5.1 5.6.8-4.1 4 1 5.6L10 14.6l-5 2.7 1-5.6-4.1-4 5.6-.8L10 1.8z" />
          </svg>
          네이버 방문자 후기
          {rating ? (
            <span className="hero-trust-line__score">{` ${rating}(${REVIEW_TOTAL}건)`}</span>
          ) : null}
          <span className="sr-only"> (새 창)</span>
        </a>
      ) : null}
      <span>해운대 센텀 사무소</span>
      <span>대한법무사협회장 표창</span>
      <span className="hidden lg:inline">대표 법무사가 직접 진행</span>
      <span className="hidden sm:inline">{officeHours.weekday} 상담</span>
    </p>
  );
}
