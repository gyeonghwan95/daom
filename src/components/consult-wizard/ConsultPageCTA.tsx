"use client";

import { consultWizardCopy as copy } from "@/lib/consult-wizard/copy";
import { suggestSituationsFromPath } from "@/lib/consult-wizard/catalog";
import type { ConsultSituationId } from "@/lib/consult-wizard/catalog";
import { useOptionalQuickInquiry } from "@/components/quick-inquiry/QuickInquiryProvider";

type ConsultPageCTAProps = {
  pageTitle: string;
  pageUrl?: string;
  presetSituationIds?: ConsultSituationId[];
  className?: string;
};

/** 페이지당 최대 1회 배치용 문맥형 CTA */
export function ConsultPageCTA({
  pageTitle,
  pageUrl,
  presetSituationIds,
  className = "",
}: ConsultPageCTAProps) {
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
      : pageUrl || (typeof window !== "undefined" ? window.location.pathname : "");

  return (
    <section
      className={`consult-page-cta ${className}`.trim()}
      aria-label="간편 상담"
    >
      <p className="consult-page-cta__eyebrow">간편 상담</p>
      <h2 className="consult-page-cta__title">{copy.ctaMidTitle}</h2>
      <p className="consult-page-cta__body">{copy.ctaMidBody}</p>
      <ul className="consult-page-cta__list">
        <li>업무명을 모르셔도 현재 상황만 선택해 주세요</li>
        <li>준비된 서류가 없어도 문의할 수 있습니다</li>
        <li>약 1분이면 문의를 남길 수 있습니다</li>
      </ul>
      <button
        type="button"
        className="btn-primary consult-page-cta__btn"
        onClick={() =>
          inquiry?.openInquiry({
            pageTitle,
            pageUrl,
            source: "cta",
            presetSituationIds:
              presetSituationIds ?? suggestSituationsFromPath(path),
          })
        }
        disabled={!inquiry}
      >
        {copy.ctaMidButton}
      </button>
    </section>
  );
}
