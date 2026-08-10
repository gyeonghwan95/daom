"use client";

import Link from "next/link";
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
};

/**
 * 페이지·랜딩용 상담 시작 — 신청서(/contact/inquiry)로 이동.
 * 플로팅 팝업은 FloatingCTA에서 별도 유지.
 */
export function ConsultStartButton({
  pageTitle,
  pageUrl,
  presetSituationIds: _presetSituationIds,
  className = "btn-primary min-h-11",
  children,
}: ConsultStartButtonProps) {
  void pageTitle;
  void pageUrl;
  void _presetSituationIds;
  return (
    <Link href={CONTACT_INQUIRY_PATH} className={className}>
      {children ?? consultationInquiryCopy.ctaPrimary}
    </Link>
  );
}

/** @deprecated 카피 호환 — consultWizardCopy.inlineButton 대신 inquiry 카피 사용 */
export const consultStartDefaultLabel = copy.inlineButton;

export function consultStartHrefWithField(field?: string) {
  return field ? contactInquiryHref({ field }) : CONTACT_INQUIRY_PATH;
}
