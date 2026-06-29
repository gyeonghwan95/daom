"use client";

import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";

type DiagnosisResultConsultCTAProps = {
  pageSlug: string;
  outcomeTitle: string;
};

/** @deprecated Use PageConversionCTA with pageType="diagnosis-result" */
export function DiagnosisResultConsultCTA({
  pageSlug,
  outcomeTitle,
}: DiagnosisResultConsultCTAProps) {
  return (
    <PageConversionCTA
      pageType="diagnosis-result"
      variant="bottom"
      pageSlug={pageSlug}
      description={`「${outcomeTitle}」결과는 일반 안내입니다. 서류·기한·절차를 함께 검토해 드립니다.`}
      documentsHref="#diagnosis-documents"
      showSecondaryLinks
    />
  );
}
