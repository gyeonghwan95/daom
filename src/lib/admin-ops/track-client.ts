import { trackEvent } from "@/lib/admin-ops/beacon";
import type {
  NaverSmartPlacePlacement,
  NaverSmartPlaceVariant,
} from "@/lib/naver-smartplace/cta";

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
  if (kind === "location") {
    void trackEvent({
      type: "naver_place_click",
      path,
      meta: { variant: "map", placement: "other" },
    });
    return;
  }
  void trackEvent({ type: "cta_click", path, meta: { kind } });
}

/** SmartPlace outbound click — never blocks navigation */
export function trackNaverPlaceClick(input: {
  variant: NaverSmartPlaceVariant;
  placement: NaverSmartPlacePlacement;
  path?: string;
}) {
  const path =
    input.path ||
    (typeof window !== "undefined" ? window.location.pathname : "/");
  void trackEvent({
    type: "naver_place_click",
    path,
    meta: {
      variant: input.variant,
      placement: input.placement,
    },
  });
}

export { trackEvent };
