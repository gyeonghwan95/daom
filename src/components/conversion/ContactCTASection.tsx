import Link from "next/link";
import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import { MID_CTA_HINT } from "@/lib/service-conversion/copy";
import type { ServiceConversionMidCta } from "@/lib/service-conversion/types";
import {
  consultationInquiryCopy,
  contactInquiryHref,
} from "@/lib/consultation-inquiry";

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
    ? contactInquiryHref({ field: inquiryField })
    : contactInquiryHref();

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
          {consultationInquiryCopy.ctaPrimary}
        </Link>
        <Link
          href={inquiryHref}
          className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-5 text-sm"
        >
          {consultationInquiryCopy.ctaForm}
        </Link>
      </div>
      <p className="text-center text-sm text-navy/65">
        {consultationInquiryCopy.oneMinuteShort}
      </p>
    </section>
  );
}
