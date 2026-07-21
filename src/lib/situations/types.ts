import type { PageFaqItem, PageRelatedLink } from "@/lib/pageData/types";
import type { ContentRelations } from "@/types/content-relations";
import type { SituationCategoryId } from "./categories";

export type SituationSolution = {
  title: string;
  body: string;
  whenToChoose: string;
};

export type SituationCaseExample = {
  title: string;
  body: string;
};

export type SituationPage = ContentRelations & {
  slug: string;
  path: string;
  cardTitle: string;
  cardDescription: string;
  h1: string;
  metaDescriptionBase: string;
  intro: string;
  situationCategory: SituationCategoryId;
  searchIntent: string;
  conclusion: string;
  situationChecklist: string[];
  firstChecks: string[];
  solutions: SituationSolution[];
  selfHandleCases: string[];
  lawyerNeededCases: string[];
  costFactors: string[];
  commonMistakes: string[];
  caseExample: SituationCaseExample;
  documents: string[];
  procedures: string[];
  diagnosisLinks: PageRelatedLink[];
  serviceLinks: PageRelatedLink[];
  faqLinks: PageRelatedLink[];
  extraLinks: PageRelatedLink[];
  faqs: PageFaqItem[];
  relatedSituationSlugs: string[];
  priority: number;
  urgent?: boolean;
  isNew?: boolean;
  addedAt?: string;
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

/** legacy config entries before normalization */
export type LegacySituationPageInput = Omit<
  SituationPage,
  | "situationCategory"
  | "searchIntent"
  | "conclusion"
  | "solutions"
  | "costFactors"
  | "commonMistakes"
  | "caseExample"
  | "relatedSituationSlugs"
  | "priority"
> & {
  situationCategory?: SituationCategoryId;
  searchIntent?: string;
  conclusion?: string;
  solutions?: SituationSolution[];
  costFactors?: string[];
  commonMistakes?: string[];
  caseExample?: SituationCaseExample;
  relatedSituationSlugs?: string[];
  priority?: number;
  urgent?: boolean;
  isNew?: boolean;
  addedAt?: string;
};
