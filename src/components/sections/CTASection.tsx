import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import type { ConversionPageType } from "@/lib/conversion-cta";

type CTASectionProps = {
  title?: string;
  description?: string;
  pageType?: ConversionPageType;
  pageSlug?: string;
  documentsHref?: string;
  diagnosisHref?: string;
  serviceSlug?: string;
};

export function CTASection({
  title,
  description,
  pageType = "default",
  pageSlug,
  documentsHref,
  diagnosisHref,
  serviceSlug,
}: CTASectionProps) {
  return (
    <PageConversionCTA
      pageType={pageType}
      variant="bottom"
      tone="dark"
      title={title}
      description={description}
      pageSlug={pageSlug}
      documentsHref={documentsHref}
      diagnosisHref={diagnosisHref}
      serviceSlug={serviceSlug}
      showFeeNotice
    />
  );
}
