import { trackEvent } from "@/lib/admin-ops/beacon";

/** Privacy-safe page_view + CTA helpers for public site */

export function trackPageView(path?: string) {
  const p =
    path ||
    (typeof window !== "undefined" ? window.location.pathname : "/");
  void trackEvent({
    type: "page_view",
    path: p,
  });
}

export function trackCtaEvent(
  kind: "contact" | "phone" | "kakao" | "naver-talk" | "location" | string,
  pageSlug?: string,
) {
  const path =
    typeof window !== "undefined" ? window.location.pathname : pageSlug || "/";
  if (kind === "phone") {
    void trackEvent({ type: "phone_click", path });
    return;
  }
  if (kind === "kakao") {
    void trackEvent({ type: "kakao_click", path });
    return;
  }
  if (kind === "naver-talk" || kind === "naver") {
    void trackEvent({ type: "naver_click", path });
    return;
  }
  void trackEvent({ type: "cta_click", path, meta: { kind } });
}

export { trackEvent };
