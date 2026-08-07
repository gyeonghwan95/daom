import type { ServiceFaq } from "@/types/service";

export type CorporateTopicCluster = {
  title: string;
  intro: string;
  links: { href: string; label: string; description: string }[];
};

export type CorporateInfoTable = {
  title: string;
  caption?: string;
  headers: string[];
  rows: string[][];
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
  /** 공증·인증 안내 페이지용. 공증 수행 주체를 명확히 구분 */
  notaryBoundaryNote?: string;
  /** 페이지별 고유 표·체크리스트 모듈 */
  infoTables?: CorporateInfoTable[];
  reviewedAt?: string;
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
