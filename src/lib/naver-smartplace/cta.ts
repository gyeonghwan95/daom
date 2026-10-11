import { EXTERNAL_LINKS, getNaverSmartPlaceUrl } from "@/config/external-links";

export type NaverSmartPlaceVariant =
  | "reservation"
  | "map"
  | "review"
  | "place";

export type NaverSmartPlacePlacement =
  | "homepage_hero"
  | "homepage_reviews"
  | "homepage_location"
  | "homepage_closing"
  | "contact_page"
  | "location_page"
  | "office_page"
  | "profile_page"
  | "service_end"
  | "conversion_actions"
  | "mobile_bottom"
  | "floating_panel"
  | "footer"
  | "map_widget"
  | "reviews_hub"
  | "trust_review"
  | "page_hero"
  | "readability_cta"
  | "consult_inline"
  | "consult_page"
  | "contact_cta_section"
  | "page_conversion"
  | "sidebar"
  | "case_region"
  | "nationwide_card"
  | "search_empty"
  | "other";

const LABELS: Record<
  NaverSmartPlaceVariant,
  { label: string; aria: string; hint?: string }
> = {
  reservation: {
    label: "네이버 예약",
    aria: "네이버에서 다옴법무사사무소 상담 예약 열기 (새 창)",
    hint: "네이버 플레이스에서 방문상담 일정을 확인할 수 있습니다.",
  },
  map: {
    label: "네이버 지도",
    aria: "네이버 지도에서 다옴법무사사무소 위치 확인 (새 창)",
  },
  review: {
    label: "후기·사진 보기",
    aria: "네이버 플레이스에서 후기·사무소 정보 보기 (새 창)",
  },
  place: {
    label: "네이버 플레이스",
    aria: "네이버에서 다옴법무사사무소 확인 (새 창)",
  },
};

export function getNaverSmartPlaceCopy(variant: NaverSmartPlaceVariant) {
  return LABELS[variant];
}

/**
 * 버튼 목적에 맞는 플레이스 탭으로 연결한다(예약 → 예약 탭, 후기 → 후기 탭, 지도·소개 → 홈 단축 링크).
 * 스마트플레이스 노출을 끄는 스위치·주소 재정의가 있으면 모두 단축 링크 규칙을 따른다.
 */
export function resolveNaverSmartPlaceHref(variant?: NaverSmartPlaceVariant): string {
  const home = getNaverSmartPlaceUrl();
  if (!home || process.env.NEXT_PUBLIC_NAVER_PLACE_URL?.trim()) return home;
  if (variant === "reservation") return EXTERNAL_LINKS.naverPlaceBooking;
  if (variant === "review") return EXTERNAL_LINKS.naverPlaceReview;
  return home;
}

export function isNaverSmartPlaceConfigured(): boolean {
  return Boolean(resolveNaverSmartPlaceHref());
}
