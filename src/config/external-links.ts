/**
 * External profile / place URLs — single source of truth.
 * Do not hardcode SmartPlace URLs in page components.
 */

export const EXTERNAL_LINKS = {
  /** 다옴법무사사무소 네이버 스마트플레이스 */
  naverSmartPlace: "https://naver.me/58j9SzPA",
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
