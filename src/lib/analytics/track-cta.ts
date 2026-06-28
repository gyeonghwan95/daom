export type CTAType =
  | "phone"
  | "kakao"
  | "naver-talk"
  | "contact"
  | "location";

/**
 * CTA 클릭 전환 추적 훅.
 * Google Analytics / 네이버 애널리틱스 연동 전까지는 개발 환경에서만 로그합니다.
 */
export function trackCTA(type: CTAType, pageSlug: string): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[trackCTA]", { type, pageSlug });
  }
}
