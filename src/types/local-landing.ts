import type { ServiceFaq } from "@/types/service";

export type LocalLandingPageType =
  | "service-region"
  | "region-hub"
  | "keyword-hub"
  | "neighborhood-hub"
  | "conversion"
  | "court-registry"
  | "business-zone"
  | "real-estate-dev"
  | "preservation-registration"
  | "public-agency-registration";

export type LocalLandingConfig = {
  /** URL 경로 (예: 부산상속등기) */
  slug: string;
  pageType?: LocalLandingPageType;
  /** keyword-hub 전용 콘텐츠 키 (기본값: slug) */
  keywordKey?: string;
  /** neighborhood-hub 전용 콘텐츠 키 (기본값: slug) */
  neighborhoodKey?: string;
  /** region-hub에서 연결할 동네 법무사 페이지 slug */
  linkedNeighborhoodSlugs?: string[];
  serviceSlug: string;
  regionKey: string;
  /** H1·타이틀용 (예: 해운대구) */
  regionLabel: string;
  neighborhoods: string[];
  /** 페이지별 고유 상담 사례 각도 */
  caseAngle?: string;
  /** 관련 사례 MDX slug (optional) */
  relatedCaseSlug?: string;
  institutionKey?: string;
  conversionKey?: string;
  businessZoneKey?: string;
  realEstateDevKey?: string;
};

export type LocalLandingJurisdictionGuide = {
  title: string;
  address?: string;
  accessNote?: string;
  jurisdictionNote: string;
  practicalNotes: string[];
};

export type LocalLandingConsultationCase = {
  title: string;
  summary: string;
  href?: string;
};

export type LocalLandingPage = {
  slug: string;
  path: string;
  pageType: LocalLandingPageType;
  serviceSlug: string;
  title: string;
  h1: string;
  /** SEO title (keyword-hub 등에서 직접 지정) */
  metaTitle?: string;
  description: string;
  /** 상단 요약·히어로용 문단 (keyword-hub) */
  summaryParagraphs?: string[];
  /** 비용 변동 요인 (keyword-hub) */
  costFactors?: string[];
  /** 동네 생활권 설명 (neighborhood-hub) */
  neighborhoodLivingArea?: string;
  primaryKeywords?: string[];
  regionLabel: string;
  regionKey: string;
  neighborhoods: string[];
  problemStatement: string;
  whenNeeded: string[];
  jurisdictionGuide: LocalLandingJurisdictionGuide;
  consultationCase: LocalLandingConsultationCase;
  consultationCases: LocalLandingConsultationCase[];
  legalIssues: string[];
  precautions: string[];
  procedures: string[];
  documents: string[];
  costGuide: string;
  faqs: ServiceFaq[];
  lawyerOpinion: string;
  directionsNote: string;
  ctaDescription: string;
  relatedBlogHrefs: { href: string; label: string }[];
  relatedServiceLinks: { href: string; label: string }[];
  relatedRegionLinks: { href: string; label: string }[];
};
