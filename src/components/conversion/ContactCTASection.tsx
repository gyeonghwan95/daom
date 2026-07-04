import Link from "next/link";
import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import type { ServiceConversionMidCta } from "@/lib/service-conversion/types";

type ContactCTASectionProps = {
  serviceSlug?: string;
  pageSlug: string;
  midCta: ServiceConversionMidCta;
  inquiryField?: string;
  diagnosisHref?: string;
};

export function ContactCTASection({
  serviceSlug,
  pageSlug,
  midCta,
  inquiryField,
  diagnosisHref,
}: ContactCTASectionProps) {
  const inquiryHref = inquiryField
    ? `/contact/inquiry?field=${encodeURIComponent(inquiryField)}`
    : "/contact/inquiry";

  return (
    <section id="conversion-mid-cta" className="space-y-4">
      <PageConversionCTA
        pageType={serviceSlug ? "service" : "default"}
        variant="mid"
        title={midCta.title}
        description={midCta.description}
        hint="강한 광고가 아니라, 지금 상황만 알려주셔도 1차로 정리해 드립니다."
        serviceSlug={serviceSlug}
        pageSlug={pageSlug}
        diagnosisHref={diagnosisHref}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href={inquiryHref}
          className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center px-5 text-sm"
        >
          {midCta.buttonLabel}
        </Link>
        <Link
          href={inquiryHref}
          className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-5 text-sm"
        >
          상담 신청서 작성하기
        </Link>
      </div>
    </section>
  );
}
