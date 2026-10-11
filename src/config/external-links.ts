/**
 * External profile / place URLs — single source of truth.
 * Do not hardcode SmartPlace URLs in page components.
 */

export const EXTERNAL_LINKS = {
  /** 다옴법무사사무소 네이버 스마트플레이스 */
  naverSmartPlace: "https://naver.me/58j9SzPA",
  /**
   * 같은 플레이스(2035745096)의 탭 직접 주소 — 2026-10-11 브라우저에서 확인:
   * 단축 링크는 placePath=/home(홈 탭), /booking은 예약 탭, /review는 방문자 후기 탭을 연다.
   */
  naverPlaceBooking: "https://map.naver.com/p/entry/place/2035745096?placePath=/booking",
  naverPlaceReview: "https://map.naver.com/p/entry/place/2035745096?placePath=/review",
} as const;

export type ExternalLinkKey = keyof typeof EXTERNAL_LINKS;

/** Kill-switch: set NEXT_PUBLIC_NAVER_SMARTPLACE_ENABLED=false to hide all SmartPlace CTAs */
export function isNaverSmartPlaceEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_NAVER_SMARTPLACE_ENABLED?.trim().toLowerCase();
  if (flag === "0" || flag === "false" || flag === "off") return false;
  return true;
}

export function getNaverSmartPlaceUrl(): string {
  if (!isNaverSmartPlaceEnabled()) return "";
  const override = process.env.NEXT_PUBLIC_NAVER_PLACE_URL?.trim();
  return override || EXTERNAL_LINKS.naverSmartPlace;
}
