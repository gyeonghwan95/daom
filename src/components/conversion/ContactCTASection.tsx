import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import { MID_CTA_HINT } from "@/lib/service-conversion/copy";
import type { ServiceConversionMidCta } from "@/lib/service-conversion/types";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";

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
  diagnosisHref,
}: ContactCTASectionProps) {
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
      <p className="text-center text-sm text-navy/65">
        {consultationInquiryCopy.oneMinuteShort}
      </p>
    </section>
  );
}
