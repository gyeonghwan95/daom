import { getNaverSmartPlaceUrl } from "@/config/external-links";

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
    label: "네이버에서 후기·정보 보기",
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

/** All SmartPlace CTAs share one destination (user-specified short URL). */
export function resolveNaverSmartPlaceHref(): string {
  return getNaverSmartPlaceUrl();
}

export function isNaverSmartPlaceConfigured(): boolean {
  return Boolean(resolveNaverSmartPlaceHref());
}
