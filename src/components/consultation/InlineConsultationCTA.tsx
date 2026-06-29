import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import type { ConversionPageType } from "@/lib/conversion-cta";

type InlineConsultationCTAProps = {
  description?: string;
  title?: string;
  pageType?: ConversionPageType;
  pageSlug?: string;
  documentsHref?: string;
  diagnosisHref?: string;
  serviceSlug?: string;
};

export function InlineConsultationCTA({
  description,
  title,
  pageType = "default",
  pageSlug,
  documentsHref,
  diagnosisHref,
  serviceSlug,
}: InlineConsultationCTAProps) {
  return (
    <PageConversionCTA
      pageType={pageType}
      variant="mid"
      title={title}
      description={description}
      pageSlug={pageSlug}
      documentsHref={documentsHref}
      diagnosisHref={diagnosisHref}
      serviceSlug={serviceSlug}
      showFeeNotice={false}
    />
  );
}
