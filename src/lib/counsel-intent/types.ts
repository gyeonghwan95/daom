import type { ServiceFaq } from "@/types/service";

export type CounselScopeLevel =
  | "direct-support"
  | "procedure-guide"
  | "expert-review";

export type CounselScopeRow = {
  label: string;
  level: CounselScopeLevel;
  note?: string;
};

export type CounselSituationCard = {
  title: string;
  description: string;
  href: string;
};

export type CounselSummaryItem = {
  label: string;
  value: string;
};

export type CounselIntentCategory =
  | "inheritance"
  | "real-estate"
  | "corporate"
  | "debt"
  | "collection"
  | "court-docs"
  | "unknown";

export type CounselIntentStage =
  | "before"
  | "planned"
  | "deadline"
  | "dispute"
  | "court-notice"
  | "preparing"
  | "unsure";

export type CounselSelectorResult = {
  title: string;
  href: string;
  note: string;
  documents?: string[];
  deadlineHint?: string;
};

export type CounselPageContent = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroIntro: string;
  heroParagraphs: string[];
  officeLine: string;
  scopeNotice: string;
  summaryItems: CounselSummaryItem[];
  situationCards: CounselSituationCard[];
  supportItems: string[];
  scopeRows: CounselScopeRow[];
  documents: string[];
  procedures: string[];
  costFactors: string[];
  commonMistakes: string[];
  faqs: ServiceFaq[];
  relatedLinks: { href: string; label: string }[];
  primaryKeywords: string[];
  ctaTitle: string;
  ctaText: string;
};
