"use client";

import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { InquiryNaverCtaPair } from "@/components/cta/InquiryNaverCtaPair";
import {
  CONTACT_INQUIRY_PATH,
  consultationInquiryCopy,
  contactInquiryHref,
} from "@/lib/consultation-inquiry";
import { consultWizardCopy as copy } from "@/lib/consult-wizard/copy";
import type { ConsultSituationId } from "@/lib/consult-wizard/catalog";

type ConsultStartButtonProps = {
  pageTitle: string;
  pageUrl?: string;
  presetSituationIds?: ConsultSituationId[];
  className?: string;
  children?: React.ReactNode;
  /** false면 상담 버튼만 (네이버 예약 미표시) */
  showNaverReservation?: boolean;
};

/**
 * 페이지·랜딩용 상담 시작 — 1분 문의 위자드를 연다.
 * 데스크톱 플로팅 패널은 FloatingCTA에서 별도 유지.
 */
export function ConsultStartButton({
  pageTitle,
  pageUrl,
  presetSituationIds,
  className = "btn-primary min-h-11",
  children,
  showNaverReservation = true,
}: ConsultStartButtonProps) {
  void pageUrl;
  return (
    <InquiryNaverCtaPair
      placement="consult_page"
      layout="row"
      size="md"
      showNaver={showNaverReservation}
      inquiry={
        <InquiryStartButton
          className={className}
          source="landing"
          note={pageTitle}
          presetSituationIds={presetSituationIds}
          fallbackHref={CONTACT_INQUIRY_PATH}
        >
          {children ?? consultationInquiryCopy.ctaPrimary}
        </InquiryStartButton>
      }
    />
  );
}

/** @deprecated 카피 호환 — consultWizardCopy.inlineButton 대신 inquiry 카피 사용 */
export const consultStartDefaultLabel = copy.inlineButton;

export function consultStartHrefWithField(field?: string) {
  return field ? contactInquiryHref({ field }) : CONTACT_INQUIRY_PATH;
}
