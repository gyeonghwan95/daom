"use client";

import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import type { ConversionPageType } from "@/lib/conversion-cta";

type LawyerConsultationGuideProps = {
  title?: string;
  description?: string;
  hint?: string;
  showFeeNotice?: boolean;
  showSecondaryLinks?: boolean;
  compact?: boolean;
  className?: string;
  pageSlug?: string;
  pageType?: ConversionPageType;
  documentsHref?: string;
  diagnosisHref?: string;
  serviceSlug?: string;
};

/** @deprecated props `channels`, `compact` — use PageConversionCTA directly for new code */
export function LawyerConsultationGuide({
  title,
  description,
  hint,
  showFeeNotice = true,
  showSecondaryLinks = false,
  className = "",
  pageSlug,
  pageType = "default",
  documentsHref,
  diagnosisHref,
  serviceSlug,
}: LawyerConsultationGuideProps) {
  return (
    <PageConversionCTA
      pageType={pageType}
      variant="bottom"
      title={title}
      description={description}
      hint={hint}
      documentsHref={documentsHref}
      diagnosisHref={diagnosisHref}
      serviceSlug={serviceSlug}
      pageSlug={pageSlug}
      showFeeNotice={showFeeNotice}
      showSecondaryLinks={showSecondaryLinks}
      className={className}
    />
  );
}
