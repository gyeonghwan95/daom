import type { ServiceFaq } from "@/types/service";

export type SpecialEntityTopicCluster = {
  title: string;
  intro: string;
  links: { href: string; label: string; description: string }[];
};

export type ComparisonPoint = {
  aspect: string;
  optionA: string;
  optionB: string;
};

export type SpecialEntityLegalProfile = {
  entityName: string;
  legalBasis: string[];
  establishmentMethod: string;
  competentAuthority: string[];
  preRegistrationSteps: string[];
  registrationDeadline: string;
  registrableMatters: string[];
  lawyerScope: string[];
  excludedScope: string[];
  lastLegalReview: string;
  regionalNotes?: string[];
};

export type SpecialEntityPageContent = {
  slug: string;
  kind: "hub" | "intent" | "comparison";
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroIntro: string;
  heroParagraphs: string[];
  officeLine: string;
  scopeNotice: string;
  conclusion: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  questionKeywords: string[];
  searchIntent: string;
  whoNeedsThis: string[];
  whenAndDeadline: string[];
  decisionBodies: string[];
  documents: string[];
  procedures: string[];
  costFactors: string[];
  penaltyRisks: string[];
  commonConfusions: string[];
  anonymousCase?: string;
  diyErrors: string[];
  faqs: ServiceFaq[];
  relatedLinks: { href: string; label: string }[];
  ctaTitle: string;
  ctaText: string;
  topicClusters?: SpecialEntityTopicCluster[];
  legalProfile?: SpecialEntityLegalProfile;
  comparisonPoints?: ComparisonPoint[];
  comparisonSummary?: string[];
};
