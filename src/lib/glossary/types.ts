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

export const GLOSSARY_CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  inheritance: "상속·가사",
  "real-estate": "부동산·등기",
  rights: "채권·권리",
  civil: "민사·소송",
  rehab: "회생·파산",
  corporate: "법인·등기",
  "tax-fee": "세금·비용",
};
