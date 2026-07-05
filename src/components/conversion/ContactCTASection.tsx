import Link from "next/link";
import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import { MID_CTA_HINT } from "@/lib/service-conversion/copy";
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
        hint={MID_CTA_HINT}
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
