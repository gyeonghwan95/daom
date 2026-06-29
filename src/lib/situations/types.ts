import type { PageFaqItem, PageRelatedLink } from "@/lib/pageData/types";
import type { ContentRelations } from "@/types/content-relations";

export type SituationPage = ContentRelations & {
  slug: string;
  path: string;
  cardTitle: string;
  cardDescription: string;
  h1: string;
  metaDescriptionBase: string;
  intro: string;
  situationChecklist: string[];
  firstChecks: string[];
  selfHandleCases: string[];
  lawyerNeededCases: string[];
  documents: string[];
  procedures: string[];
  diagnosisLinks: PageRelatedLink[];
  serviceLinks: PageRelatedLink[];
  faqLinks: PageRelatedLink[];
  extraLinks: PageRelatedLink[];
  faqs: PageFaqItem[];
  serviceSlug?: string;
};

export type SituationsHubConfig = {
  slug: string;
  path: string;
  h1: string;
  intro: string;
  metaDescriptionBase: string;
  faqs: PageFaqItem[];
};
