import type { ServiceFaq } from "@/types/service";

export type SearchIntentCategory =
  | "recommend"
  | "expertise"
  | "keyword"
  | "rehab"
  | "concern"
  | "public"
  | "builder"
  | "mistakes"
  | "checklist"
  | "cost-why";

/** Hub listing entry — existing URL or new search-intent slug */
export type SearchGuideEntry = {
  label: string;
  category: SearchIntentCategory;
  /** Prefer existing path when URL already exists */
  href: string;
  /** True when page already existed before this hub */
  existing?: boolean;
};

export type SearchIntentContent = {
  slug: string;
  category: SearchIntentCategory;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroParagraphs: string[];
  summaryBullets: string[];
  primaryKeywords: string[];
  searchIntents: string[];
  whenNeeded: string[];
  documents: string[];
  documentsNote: string;
  procedures: string[];
  commonMistakes: string[];
  faqs: ServiceFaq[];
  relatedCaseLinks: { href: string; label: string }[];
  relatedServiceLinks: { href: string; label: string }[];
  relatedGuideLinks: { href: string; label: string }[];
  bottomCtaText: string;
  serviceSlug: string;
};

export type SearchIntentSeed = {
  slug: string;
  label: string;
  category: SearchIntentCategory;
  serviceSlug: string;
  keywords: string[];
  /** Short focus phrase for template sentences */
  focus: string;
  caseHref?: string;
  caseLabel?: string;
  diagnosisHref?: string;
  diagnosisLabel?: string;
  toolHref?: string;
  toolLabel?: string;
  glossaryHref?: string;
  glossaryLabel?: string;
  /** Include one limited 변호 FAQ (global budget ≤5) */
  includeLawyerScopeFaq?: boolean;
};
