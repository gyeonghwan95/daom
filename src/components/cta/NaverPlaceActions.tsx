"use client";

import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import {
  isNaverSmartPlaceConfigured,
  type NaverSmartPlacePlacement,
} from "@/lib/naver-smartplace/cta";

/** 방문·위치를 찾는 화면 — 둘째 버튼을 '네이버 지도'로 둔다. 나머지는 '후기·사진 보기'. */
const MAP_PLACEMENTS = new Set<NaverSmartPlacePlacement>([
  "homepage_location",
  "contact_page",
  "location_page",
  "office_page",
  "map_widget",
  "page_conversion",
  "service_end",
]);

type NaverPlaceActionsProps = {
  placement: NaverSmartPlacePlacement;
  /** dark — 네이비 배경 위 (지도 버튼을 반투명 테두리로) */
  theme?: "light" | "dark";
  size?: "sm" | "md";
  reservationLabel?: string;
  mapLabel?: string;
  /** 둘째 버튼 — 지정하지 않으면 placement로 정한다 */
  secondary?: "map" | "review";
  reviewLabel?: string;
  className?: string;
  buttonClassName?: string;
};

/**
 * 상담 채널(전화·카카오톡·톡톡) 옆에 붙이는 「네이버 예약 · 네이버 지도(또는 후기·사진 보기)」 한 쌍.
 * 두 버튼 모두 스마트플레이스 단축 URL(네이버 지도 플레이스 화면)로 연결된다.
 */
export function NaverPlaceActions({
  placement,
  theme = "light",
  size = "md",
  reservationLabel = "네이버 예약",
  mapLabel = "네이버 지도",
  secondary,
  reviewLabel = "후기·사진 보기",
  className = "",
  buttonClassName = "",
}: NaverPlaceActionsProps) {
  if (!isNaverSmartPlaceConfigured()) return null;
  const second = secondary ?? (MAP_PLACEMENTS.has(placement) ? "map" : "review");

  return (
    <div
      className={`grid grid-cols-2 gap-2 ${className}`.trim()}
      data-cta-group="naver-place"
    >
      <NaverSmartPlaceCta
        variant="reservation"
        placement={placement}
        tone="brand"
        size={size}
        fullWidth
        label={reservationLabel}
        className={buttonClassName}
      />
      <NaverSmartPlaceCta
        variant={second}
        placement={placement}
        tone={theme === "dark" ? "onDark" : "soft"}
        size={size}
        fullWidth
        label={second === "map" ? mapLabel : reviewLabel}
        className={buttonClassName}
      />
    </div>
  );
}
