import { officeHours } from "@/lib/office-location";
import { REVIEW_PAGE_URL, REVIEW_TOTAL } from "@/lib/naver-place-reviews/static-quotes";

export function HeroTrustLine() {
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
          <span className="sr-only"> (새 창)</span>
        </a>
      ) : null}
      <span>해운대 센텀 사무소</span>
      <span className="hidden sm:inline">{officeHours.weekday} 상담</span>
    </p>
  );
}
