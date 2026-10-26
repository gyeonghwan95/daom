import Link from "next/link";
import { officeHours } from "@/lib/office-location";
import { REVIEW_TOTAL } from "@/lib/naver-place-reviews/static-quotes";

/**
 * H1 바로 아래 한 줄 신뢰 띠 — 첫 화면 안에서 "실제 후기가 있는 사무소"임을 보이게 한다.
 * 결정 카드(대표 직접 진행·표창·후기 인용)와 겹치지 않게 후기 수·위치·상담 시간만 둔다.
 */
export function HeroTrustLine() {
  return (
    <p className="hero-trust-line">
      {REVIEW_TOTAL > 0 ? (
        <Link href="/reviews" prefetch={false} className="hero-trust-line__reviews">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-3.5 w-3.5 text-[#c9a86a]">
            <path d="M10 1.8l2.5 5.1 5.6.8-4.1 4 1 5.6L10 14.6l-5 2.7 1-5.6-4.1-4 5.6-.8L10 1.8z" />
          </svg>
          네이버 방문자 후기 {REVIEW_TOTAL}건
        </Link>
      ) : null}
      <span>해운대 센텀 사무소</span>
      {/* 좁은 화면에서 줄바꿈되면 구분점이 줄 앞에 남으므로 상담 시간은 sm 이상에서만 */}
      <span className="hidden sm:inline">{officeHours.weekday} 상담</span>
    </p>
  );
}
