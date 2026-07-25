"use client";

import { consultWizardCopy as copy } from "@/lib/consult-wizard/copy";
import type { ConsultSituationId } from "@/lib/consult-wizard/catalog";
import { useOptionalQuickInquiry } from "@/components/quick-inquiry/QuickInquiryProvider";

type ConsultStartButtonProps = {
  pageTitle: string;
  pageUrl?: string;
  presetSituationIds?: ConsultSituationId[];
  className?: string;
  children?: React.ReactNode;
};

export function ConsultStartButton({
  pageTitle,
  pageUrl,
  presetSituationIds,
  className = "btn-primary min-h-11",
  children,
}: ConsultStartButtonProps) {
  const inquiry = useOptionalQuickInquiry();
  return (
    <button
      type="button"
      className={className}
      disabled={!inquiry}
      onClick={() =>
        inquiry?.openInquiry({
          pageTitle,
          pageUrl,
          source: "landing",
          presetSituationIds,
        })
      }
    >
      {children ?? copy.inlineButton}
    </button>
  );
}
