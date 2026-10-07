"use client";

import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import {
  isNaverSmartPlaceConfigured,
  type NaverSmartPlacePlacement,
} from "@/lib/naver-smartplace/cta";

type NaverPlaceActionsProps = {
  placement: NaverSmartPlacePlacement;
  /** dark — 네이비 배경 위 (지도 버튼을 반투명 테두리로) */
  theme?: "light" | "dark";
  size?: "sm" | "md";
  reservationLabel?: string;
  mapLabel?: string;
  className?: string;
  buttonClassName?: string;
};

/**
 * 상담 채널(전화·카카오톡·톡톡) 옆에 붙이는 「네이버 예약 · 네이버 지도」 한 쌍.
 * 두 버튼 모두 스마트플레이스 단축 URL(네이버 지도 플레이스 화면)로 연결된다.
 */
export function NaverPlaceActions({
  placement,
  theme = "light",
  size = "md",
  reservationLabel = "네이버 예약",
  mapLabel = "네이버 지도",
  className = "",
  buttonClassName = "",
}: NaverPlaceActionsProps) {
  if (!isNaverSmartPlaceConfigured()) return null;

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
        variant="map"
        placement={placement}
        tone={theme === "dark" ? "onDark" : "soft"}
        size={size}
        fullWidth
        label={mapLabel}
        className={buttonClassName}
      />
    </div>
  );
}
