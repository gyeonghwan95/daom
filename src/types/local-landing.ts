import type { ServiceFaq } from "@/types/service";

export type LocalLandingConfig = {
  /** URL 경로 (예: 부산상속등기) */
  slug: string;
  serviceSlug: string;
  regionKey: string;
  /** H1·타이틀용 (예: 해운대구) */
  regionLabel: string;
  neighborhoods: string[];
  /** 페이지별 고유 상담 사례 각도 */
  caseAngle: string;
  /** 관련 사례 MDX slug (optional) */
  relatedCaseSlug?: string;
};

export type LocalLandingConsultationCase = {
  title: string;
  summary: string;
  href?: string;
};

export type LocalLandingPage = {
  slug: string;
  path: string;
  serviceSlug: string;
  title: string;
  h1: string;
  description: string;
  regionLabel: string;
  regionKey: string;
  neighborhoods: string[];
  problemStatement: string;
  consultationCase: LocalLandingConsultationCase;
  legalIssues: string[];
  procedures: string[];
  documents: string[];
  costGuide: string;
  faqs: ServiceFaq[];
  lawyerOpinion: string;
  relatedBlogHrefs: { href: string; label: string }[];
};
