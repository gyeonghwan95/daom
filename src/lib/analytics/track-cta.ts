import { trackCtaEvent } from "@/lib/admin-ops/track-client";

export type CTAType =
  | "phone"
  | "kakao"
  | "naver-talk"
  | "contact"
  | "location";

/**
 * CTA 클릭 전환 추적.
 * Admin Ops(`/api/analytics/collect`)로 익명 집계. PII 없음.
 */
export function trackCTA(type: CTAType, pageSlug: string): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[trackCTA]", { type, pageSlug });
  }
  trackCtaEvent(type, pageSlug);
}
