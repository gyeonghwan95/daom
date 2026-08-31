import type { PageFaqItem, PageRelatedLink } from "@/lib/pageData/types";
import type { ContentRelations } from "@/types/content-relations";

export type GlossaryCategory =
  | "inheritance"
  | "real-estate"
  | "rights"
  | "civil"
  | "rehab"
  | "corporate"
  | "tax-fee";

export type GlossaryTerm = ContentRelations & {
  slug: string;
  path: string;
  term: string;
  category: GlossaryCategory;
  cardDescription: string;
  oneLineDefinition: string;
  plainExplanation: string;
  whenItMatters: string[];
  checks: string[];
  diagnosisLinks: PageRelatedLink[];
  serviceLinks: PageRelatedLink[];
  faqLinks: PageRelatedLink[];
  caseLinks: PageRelatedLink[];
};

export type GlossaryHubConfig = {
  slug: string;
  path: string;
  h1: string;
  intro: string;
  metaDescriptionBase: string;
  faqs: PageFaqItem[];
};

/** 허브 탐색용 — 검색자 상황. 구 분류명(상속·가사 등)은 내부 키만 유지. */
export const GLOSSARY_CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  inheritance: "상속이 발생한 뒤",
  "real-estate": "부동산 등기가 필요할 때",
  rights: "등기부에 권리 제한이 있을 때",
  civil: "돈을 못 받았거나 서류를 준비할 때",
  rehab: "채무를 갚기 어려울 때",
  corporate: "회사를 만들거나 변경할 때",
  "tax-fee": "등기·법원 비용을 확인할 때",
};

export type GlossaryIndexAction =
  | "KEEP_INDEX"
  | "UPGRADE_INDEX"
  | "SUPPORT_NOINDEX"
  | "MERGE_REDIRECT_CANDIDATE"
  | "REMOVE_FROM_DISCOVERY";
