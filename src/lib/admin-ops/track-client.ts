import { trackEvent } from "@/lib/admin-ops/beacon";
import { sanitizeOutboundHref } from "@/lib/admin-ops/outbound-href";
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
  href?: string,
) {
  const path =
    typeof window !== "undefined" ? window.location.pathname : pageSlug || "/";
  const dest = sanitizeOutboundHref(
    href,
    typeof window !== "undefined" ? window.location.origin : undefined,
  );
  const meta: Record<string, string> = { kind };
  if (dest) meta.dest = dest;

  if (kind === "phone") {
    void trackEvent({ type: "phone_click", path, meta });
    return;
  }
  if (kind === "kakao") {
    void trackEvent({ type: "kakao_click", path, meta });
    return;
  }
  if (kind === "naver-talk" || kind === "naver") {
    void trackEvent({ type: "naver_click", path, meta });
    return;
  }
  if (kind === "location") {
    void trackEvent({
      type: "naver_place_click",
      path,
      meta: { ...meta, variant: "map", placement: "other" },
    });
    return;
  }
  void trackEvent({ type: "cta_click", path, meta });
}

/** SmartPlace outbound click — never blocks navigation */
export function trackNaverPlaceClick(input: {
  variant: NaverSmartPlaceVariant;
  placement: NaverSmartPlacePlacement;
  path?: string;
  href?: string;
}) {
  const path =
    input.path ||
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const dest = sanitizeOutboundHref(
    input.href,
    typeof window !== "undefined" ? window.location.origin : undefined,
  );
  const meta: Record<string, string> = {
    variant: input.variant,
    placement: input.placement,
    kind: input.variant === "reservation" ? "naver-reservation" : "naver-place",
  };
  if (dest) meta.dest = dest;
  void trackEvent({
    type: "naver_place_click",
    path,
    meta,
  });
}

export { trackEvent };
