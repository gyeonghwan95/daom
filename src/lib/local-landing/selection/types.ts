import type { ServiceFaq } from "@/types/service";

export type SelectionComparisonRow = {
  aspect: string;
  left: string;
  right: string;
};

export type SelectionServiceCheckpoint = {
  title: string;
  items: string[];
};

export type SelectionExtraSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
  links?: { href: string; label: string }[];
};

export type SelectionHubContent = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroParagraphs: string[];
  summaryBullets: string[];
  primaryKeywords: string[];
  searchIntents: string[];
  selectionCriteria: string[];
  serviceCheckpoints: SelectionServiceCheckpoint[];
  comparisonTitle?: string;
  comparisonRows?: SelectionComparisonRow[];
  comparisonNote?: string;
  preparationDocs: string[];
  preparationNote: string;
  extraSections: SelectionExtraSection[];
  relatedLinks: { href: string; label: string }[];
  faqs: ServiceFaq[];
  bottomCtaText: string;
  serviceSlug: string;
};
