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

/** 본문 표 — 법정 수치·단계·서류처럼 비교가 필요한 내용을 목록 대신 표로 보인다(ComparisonTable) */
export type ContentTable = {
  /** 표 이름(화면 읽기용 caption) */
  caption: string;
  columns: { key: string; header: string }[];
  rows: Record<string, string>[];
  /** 표 아래 기준일·근거 한 줄 */
  note?: string;
};

export type PageSection = {
  /** 앵커 id (station-seomyeon 등). 없으면 section-{index} */
  id?: string;
  title: string;
  body: string;
  items?: string[];
  table?: ContentTable;
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
  /** documents 섹션 제목(기본 '필요 서류'). 상담 기초정보 목록이면 '첫 상담에 알려주실 정보'처럼 바꾼다 */
  documentsTitle?: string;
  consultationPoints: string[];
  faqs: PageFaqItem[];
  consultationExample: PageConsultationExample;
  /** 대표 owner에서 함께 보여 줄 검증 가능한 익명 상담 사례 */
  consultationExamples?: PageConsultationExample[];
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
  /** Service 스키마 이름. 없으면 title */
  serviceSchemaName?: string;
};
