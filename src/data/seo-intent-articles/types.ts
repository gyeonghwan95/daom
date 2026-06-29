import type { SearchIntentKind } from "@/data/seo/types";

export type SeoIntentArticleFaq = {
  question: string;
  answer: string;
};

/** 블로그 MDX 본문 섹션 (템플릿 구조와 1:1 대응) */
export type SeoIntentArticleSections = {
  problem: string[];
  summary: string[];
  procedure: string[];
  documents: string[];
  caution: string[];
  faq: SeoIntentArticleFaq[];
};

export type SeoIntentArticleCta = {
  title: string;
  description: string;
};

/**
 * SEO 유입용 칼럼 데이터.
 * scripts/generate-seo-intent-blog.mjs 로 blog MDX 생성.
 */
export type SeoIntentArticle = {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  searchIntent: SearchIntentKind;
  date: string;
  area: string;
  region?: string;
  seoTitle: string;
  seoDescription: string;
  relatedServices: string[];
  relatedFaqs: string[];
  relatedDiagnosis: string[];
  relatedSituations?: string[];
  relatedTools?: string[];
  relatedGlossary?: string[];
  sections: SeoIntentArticleSections;
  cta: SeoIntentArticleCta;
  /** true면 기존 MDX 유지 (중복 생성 방지) */
  skipGeneration?: boolean;
};

export const SEO_INTENT_ARTICLE_AUTHOR = "안윤정 법무사";
export const SEO_INTENT_ARTICLE_OFFICE = "다옴법무사사무소";
