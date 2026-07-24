import type { BreadcrumbItem } from "@/types/breadcrumb";

export type PageCategory =
  | "core"
  | "service"
  | "local"
  | "cost"
  | "court"
  | "businessDistrict"
  | "realEstate"
  | "pillar"
  | "blog"
  | "case"
  | "faq"
  | "media"
  | "external"
  | "diagnosis"
  | "situation"
  | "tool"
  | "glossary";

export type PageRelatedLink = {
  href: string;
  label: string;
};

export type PageSection = {
  title: string;
  body: string;
  items?: string[];
  links?: PageRelatedLink[];
};

export type PageFaqItem = {
  question: string;
  answer: string;
};

export type PageConsultationExample = {
  title: string;
  body: string;
};

/** 사이트 전체 URL의 중앙 페이지 데이터 */
export type PageData = {
  slug: string;
  path: string;
  category: PageCategory;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  breadcrumbs: BreadcrumbItem[];
  introParagraphs: string[];
  procedures: string[];
  documents: string[];
  consultationPoints: string[];
  faqs: PageFaqItem[];
  consultationExample: PageConsultationExample;
  sections: PageSection[];
  primaryKeywords: string[];
  /** 내부 네비게이션 링크 (4~8개) */
  internalLinks: PageRelatedLink[];
  /** CTA·NAP 포함 전체 하단 링크 */
  relatedLinks: PageRelatedLink[];
  ctaTitle: string;
  ctaText: string;
  ogImage?: string;
  includeFaqSchema?: boolean;
  openGraphType?: "website" | "article";
  /** 연관 업무 슬러그 (전국 배너·내부링크용) */
  serviceSlug?: string;
};
