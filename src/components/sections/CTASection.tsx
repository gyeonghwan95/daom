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
  /** false면 푸터와 중복되는 전화·카카오·톡톡 버튼을 숨기고 상담 문의 CTA만 표시 */
  showChannelButtons?: boolean;
};

export function CTASection({
  title,
  description,
  pageType = "default",
  pageSlug,
  documentsHref,
  diagnosisHref,
  serviceSlug,
  showChannelButtons = true,
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
      showChannelButtons={showChannelButtons}
    />
  );
}
