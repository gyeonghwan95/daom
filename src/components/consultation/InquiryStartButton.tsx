"use client";

import type { ReactNode } from "react";
import { useOptionalQuickInquiry } from "@/components/quick-inquiry/QuickInquiryProvider";
import type { ConsultSituationId } from "@/lib/consult-wizard/catalog";
import { trackCTA } from "@/lib/analytics/track-cta";
import {
  CONTACT_INQUIRY_PATH,
  consultationInquiryCopy,
} from "@/lib/consultation-inquiry";
import type { QuickInquiryOpenOptions } from "@/components/quick-inquiry/QuickInquiryProvider";

type InquiryStartButtonProps = {
  className?: string;
  children?: ReactNode;
  source?: QuickInquiryOpenOptions["source"];
  note?: string;
  presetSituationIds?: ConsultSituationId[];
  fallbackHref?: string;
  pageSlug?: string;
  role?: string;
  onClick?: () => void;
};

/**
 * 「1분만에 문의하기」 — 위자드를 연다.
 * 공급자가 없으면 신청서 페이지로 보낸다.
 */
export function InquiryStartButton({
  className = "",
  children,
  source = "cta",
  note,
  presetSituationIds,
  fallbackHref = CONTACT_INQUIRY_PATH,
  pageSlug,
  role,
  onClick,
}: InquiryStartButtonProps) {
  const inquiry = useOptionalQuickInquiry();

  return (
    <button
      type="button"
      className={className}
      data-cta="contact"
      role={role}
      aria-haspopup="dialog"
      aria-label={consultationInquiryCopy.ctaPrimary}
      onClick={() => {
        onClick?.();
        if (pageSlug) trackCTA("contact", pageSlug, "#inquiry");
        if (inquiry) {
          inquiry.openInquiry({ source, note, presetSituationIds });
          return;
        }
        window.location.href = fallbackHref;
      }}
    >
      {children ?? consultationInquiryCopy.ctaPrimary}
    </button>
  );
}
