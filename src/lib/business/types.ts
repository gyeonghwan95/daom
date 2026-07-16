import type { ServiceFaq } from "@/types/service";

export type BusinessIntentType =
  | "advisory"
  | "registration"
  | "contract"
  | "debt-collection"
  | "document"
  | "real-estate"
  | "recurring-management"
  | "startup"
  | "institutional"
  | "local"
  | "educational"
  | "urgent";

export type BusinessIntentAction =
  | "strengthen-existing"
  | "create-new"
  | "merge-into-existing"
  | "section-only"
  | "faq-only"
  | "do-not-target";

export type BusinessSearchIntent = {
  id: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  aliases?: string[];
  targetUrl?: string;
  existingUrl?: string;
  intentType: BusinessIntentType;
  businessStage?: string;
  companyType?: string;
  department?: string;
  legalWorkType?: string;
  funnelStage?: "awareness" | "consideration" | "decision";
  priority: 1 | 2 | 3;
  action: BusinessIntentAction;
  parentHub?: string;
  relatedServices?: string[];
  relatedFaqs?: string[];
  relatedCases?: string[];
  relatedTools?: string[];
  relatedLectures?: string[];
  scopeRisk?: boolean;
  notes?: string;
};

export type BusinessScopeLevel =
  | "direct-support"
  | "procedure-guide"
  | "expert-review";

export type BusinessScopeRow = {
  label: string;
  level: BusinessScopeLevel;
  note?: string;
};

export type BusinessStageCard = {
  title: string;
  description: string;
  href?: string;
};

export type BusinessSummaryItem = {
  label: string;
  value: string;
};

export type BusinessPageKind = "hub" | "debt" | "real-estate" | "inquiry";

export type BusinessPageContent = {
  slug: string;
  kind: BusinessPageKind;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroIntro: string;
  heroParagraphs: string[];
  scopeNotice?: string;
  summaryItems: BusinessSummaryItem[];
  stageCards: BusinessStageCard[];
  supportItems: string[];
  scopeRows: BusinessScopeRow[];
  situations: string[];
  documents: string[];
  procedures: string[];
  costFactors: string[];
  deadlineNotes: string[];
  commonMistakes: string[];
  recurringChecks?: string[];
  companyTypeCards?: BusinessStageCard[];
  faqs: ServiceFaq[];
  relatedLinks: { href: string; label: string }[];
  lectureLinks?: { href: string; label: string }[];
  primaryKeywords: string[];
  ctaTitle: string;
  ctaText: string;
  showInquiryForm?: boolean;
};
