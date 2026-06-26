import type { ServiceFaq } from "@/types/service";

export type LocalLandingPageType =
  | "service-region"
  | "region-hub"
  | "conversion"
  | "court-registry"
  | "business-zone"
  | "real-estate-dev";

export type LocalLandingConfig = {
  /** URL 경로 (예: 부산상속등기) */
  slug: string;
  pageType?: LocalLandingPageType;
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
  description: string;
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
