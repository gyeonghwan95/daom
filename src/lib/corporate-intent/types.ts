import type { ServiceFaq } from "@/types/service";

export type CorporateTopicCluster = {
  title: string;
  intro: string;
  links: { href: string; label: string; description: string }[];
};

export type CorporatePageContent = {
  slug: string;
  kind: "hub" | "intent";
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroIntro: string;
  heroParagraphs: string[];
  officeLine: string;
  scopeNotice: string;
  /** 첫 화면에서 검색 질문에 대한 명확한 결론 */
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
  topicClusters?: CorporateTopicCluster[];
};
