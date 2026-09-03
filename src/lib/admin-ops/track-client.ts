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

function sanitizeSearchQuery(raw: string): string {
  const q = raw.trim().slice(0, 40);
  if (!q) return "";
  if (/@|\d{8,}/.test(q)) return "(filtered)";
  return q;
}

/** 사이트 검색 결과 클릭·추천 링크. 질의는 40자 제한, 연락처 패턴은 저장하지 않음. */
export function trackSearchUsed(input: {
  query?: string;
  hits?: number;
  dest?: string;
  kind?: "result" | "popular" | "all";
}) {
  const path =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const dest = sanitizeOutboundHref(
    input.dest,
    typeof window !== "undefined" ? window.location.origin : undefined,
  );
  const meta: Record<string, string> = {
    kind: input.kind || "result",
  };
  const q = sanitizeSearchQuery(input.query || "");
  if (q) meta.q = q;
  if (typeof input.hits === "number") meta.hits = String(input.hits);
  if (dest) meta.dest = dest;
  void trackEvent({ type: "search_used", path, meta });
}

export function trackToolUsed(toolSlug: string) {
  const path =
    typeof window !== "undefined" ? window.location.pathname : "/";
  void trackEvent({
    type: "tool_used",
    path,
    meta: { tool: String(toolSlug).slice(0, 80), kind: "calculator" },
  });
}

export function trackDiagnosisComplete(input: {
  slug: string;
  risk?: string;
}) {
  const path =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const meta: Record<string, string> = {
    slug: String(input.slug).slice(0, 80),
  };
  if (input.risk) meta.risk = String(input.risk).slice(0, 40);
  void trackEvent({ type: "diagnosis_complete", path, meta });
}

export { trackEvent };
