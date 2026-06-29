import type { PageRelatedLink } from "@/lib/pageData/types";
import type { ContentRelations } from "@/types/content-relations";

export type LinkContentKind =
  | "service"
  | "situation"
  | "faq"
  | "case"
  | "blog"
  | "glossary"
  | "diagnosis"
  | "tool";

export type LinkCatalogItem = ContentRelations & {
  kind: LinkContentKind;
  slug: string;
  href: string;
  label: string;
};

export type RecommendationSource = ContentRelations & {
  kind: LinkContentKind;
  slug: string;
  path: string;
};

export type RecommendationGroupKey =
  | "diagnosis"
  | "cases"
  | "faqs"
  | "glossary"
  | "services"
  | "blogs"
  | "situations"
  | "tools";

export type RecommendationGroups = Partial<
  Record<RecommendationGroupKey, PageRelatedLink[]>
>;

export const RECOMMENDATION_GROUP_LABELS: Record<RecommendationGroupKey, string> = {
  diagnosis: "관련 자가진단",
  cases: "관련 사례",
  faqs: "관련 FAQ",
  glossary: "관련 법률용어",
  services: "관련 서비스",
  blogs: "관련 블로그",
  situations: "관련 상황별 안내",
  tools: "관련 법률 계산기",
};

export const RECOMMENDATION_GROUP_ORDER: RecommendationGroupKey[] = [
  "diagnosis",
  "cases",
  "faqs",
  "glossary",
  "services",
  "blogs",
  "situations",
  "tools",
];

export const MAX_LINKS_PER_GROUP = 4;
