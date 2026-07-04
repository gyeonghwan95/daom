import type { PageFaqItem, PageRelatedLink } from "@/lib/pageData/types";

export type ServiceConversionCaseExample = {
  title: string;
  body: string;
};

export type ServiceConversionMidCta = {
  title: string;
  description: string;
  buttonLabel: string;
};

export type ServiceConversionConfig = {
  key: string;
  serviceName: string;
  mainKeyword: string;
  trustMessage: string;
  conversionIntro: string;
  painPoints: string[];
  preparationDocuments: string[];
  costFactors: string[];
  costGuideText: string;
  caseExamples: ServiceConversionCaseExample[];
  additionalFaqs: PageFaqItem[];
  relatedServices: PageRelatedLink[];
  midCta: ServiceConversionMidCta;
  ctaMessages: string[];
  diagnosisHref?: string;
  inquiryField?: string;
};
