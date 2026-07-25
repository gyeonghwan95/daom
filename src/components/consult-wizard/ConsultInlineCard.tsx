"use client";

import { consultWizardCopy as copy } from "@/lib/consult-wizard/copy";
import { suggestSituationsFromPath } from "@/lib/consult-wizard/catalog";
import { useOptionalQuickInquiry } from "@/components/quick-inquiry/QuickInquiryProvider";

type ConsultInlineCardProps = {
  pageTitle: string;
  pageUrl?: string;
  className?: string;
};

export function ConsultInlineCard({
  pageTitle,
  pageUrl,
  className = "",
}: ConsultInlineCardProps) {
  const inquiry = useOptionalQuickInquiry();
  const path =
    pageUrl?.startsWith("http")
      ? (() => {
          try {
            return new URL(pageUrl).pathname;
          } catch {
            return pageUrl;
          }
        })()
      : pageUrl || "";

  return (
    <aside
      className={`consult-inline ${className}`.trim()}
      aria-label="상담하기"
    >
      <p className="consult-inline__eyebrow">간편 상담</p>
      <h2 className="consult-inline__title">{copy.inlineTitle}</h2>
      <p className="consult-inline__desc">{copy.inlineDescription}</p>
      <button
        type="button"
        className="btn-primary consult-inline__btn"
        onClick={() =>
          inquiry?.openInquiry({
            pageTitle,
            pageUrl,
            source: "inline",
            presetSituationIds: suggestSituationsFromPath(path),
          })
        }
        disabled={!inquiry}
      >
        {copy.inlineButton}
      </button>
    </aside>
  );
}
