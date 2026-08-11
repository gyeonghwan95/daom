"use client";

import type { ReactNode } from "react";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import type { NaverSmartPlacePlacement } from "@/lib/naver-smartplace/cta";
import { isNaverSmartPlaceConfigured } from "@/lib/naver-smartplace/cta";

type Layout = "row" | "stack";
type Size = "sm" | "md" | "lg";

export type InquiryNaverCtaPairProps = {
  /** 상담 신청(1분 상담 등) 버튼 — Link 또는 button */
  inquiry: ReactNode;
  placement: NaverSmartPlacePlacement;
  layout?: Layout;
  size?: Size;
  /** 네이버 예약 버튼 문구 */
  naverLabel?: string;
  className?: string;
  /** false면 페어 없이 inquiry만 */
  showNaver?: boolean;
};

/**
 * 「1분 상담 신청」류 CTA 옆/아래에
 * 톡톡과 동일 톤의 「네이버 예약」을 붙이는 공통 페어.
 */
export function InquiryNaverCtaPair({
  inquiry,
  placement,
  layout = "row",
  size = "md",
  naverLabel = "네이버 예약",
  className = "",
  showNaver = true,
}: InquiryNaverCtaPairProps) {
  const naverOn = showNaver && isNaverSmartPlaceConfigured();

  if (!naverOn) {
    return <div className={className || undefined}>{inquiry}</div>;
  }

  const isStack = layout === "stack";

  return (
    <div
      className={`inquiry-naver-pair inquiry-naver-pair--${layout} inquiry-naver-pair--${size} ${className}`.trim()}
      data-cta-pair="inquiry-naver"
    >
      <div className="inquiry-naver-pair__inquiry">{inquiry}</div>
      <div className="inquiry-naver-pair__naver">
        <NaverSmartPlaceCta
          variant="reservation"
          placement={placement}
          tone="brand"
          size={size}
          fullWidth={isStack || size !== "sm"}
          label={naverLabel}
          className="inquiry-naver-pair__naver-btn"
        />
      </div>
    </div>
  );
}
