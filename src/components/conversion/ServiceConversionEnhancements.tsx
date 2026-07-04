import {
  getServiceConversionConfig,
  RELAXED_INTRO,
} from "@/lib/service-conversion";
import { CaseExampleCards } from "./CaseExampleCards";
import { ConsultationSituationBox } from "./ConsultationSituationBox";
import { ContactCTASection } from "./ContactCTASection";
import { CostGuideBox } from "./CostGuideBox";
import { DocumentPreparationBox } from "./DocumentPreparationBox";
import { RelatedServiceLinks } from "./RelatedServiceLinks";
import { ServiceFAQ } from "./ServiceFAQ";
import { TrustMessageBox } from "./TrustMessageBox";

export type ServiceConversionPlacement =
  | "top"
  | "mid"
  | "detail"
  | "post-faq"
  | "footer";

type ServiceConversionEnhancementsProps = {
  conversionKey: string;
  pageSlug: string;
  serviceSlug?: string;
  placement: ServiceConversionPlacement;
};

export function ServiceConversionEnhancements({
  conversionKey,
  pageSlug,
  serviceSlug,
  placement,
}: ServiceConversionEnhancementsProps) {
  const config = getServiceConversionConfig(conversionKey);
  if (!config) return null;

  switch (placement) {
    case "top":
      return (
        <>
          <TrustMessageBox
            relaxedIntro={RELAXED_INTRO}
            message={config.conversionIntro}
          />
          <ConsultationSituationBox painPoints={config.painPoints} />
        </>
      );
    case "mid":
      return (
        <ContactCTASection
          serviceSlug={serviceSlug ?? config.key}
          pageSlug={pageSlug}
          midCta={config.midCta}
          inquiryField={config.inquiryField}
          diagnosisHref={config.diagnosisHref}
        />
      );
    case "detail":
      return (
        <>
          <DocumentPreparationBox
            documents={config.preparationDocuments}
            serviceName={config.serviceName}
          />
          <CostGuideBox
            guideText={config.costGuideText}
            factors={config.costFactors}
          />
          <CaseExampleCards examples={config.caseExamples} />
          <TrustMessageBox message={config.trustMessage} />
        </>
      );
    case "post-faq":
      return <ServiceFAQ items={config.additionalFaqs} />;
    case "footer":
      return (
        <RelatedServiceLinks
          links={config.relatedServices}
          serviceName={config.serviceName}
        />
      );
    default:
      return null;
  }
}
