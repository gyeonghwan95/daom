import type { ServiceFaq } from "@/types/service";

export type SearchIntentCategory =
  | "recommend"
  | "expertise"
  | "keyword"
  | "rehab"
  | "concern"
  | "public"
  | "builder"
  | "mistakes"
  | "checklist"
  | "cost-why";

/** Hub listing entry — existing URL or new search-intent slug */
export type SearchGuideEntry = {
  label: string;
  category: SearchIntentCategory;
  /** Prefer existing path when URL already exists */
  href: string;
  /** True when page already existed before this hub */
  existing?: boolean;
};

export type SearchIntentContent = {
  slug: string;
  category: SearchIntentCategory;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroParagraphs: string[];
  summaryBullets: string[];
  primaryKeywords: string[];
  searchIntents: string[];
  whenNeeded: string[];
  documents: string[];
  documentsNote: string;
  procedures: string[];
  commonMistakes: string[];
  faqs: ServiceFaq[];
  relatedCaseLinks: { href: string; label: string }[];
  relatedServiceLinks: { href: string; label: string }[];
  relatedGuideLinks: { href: string; label: string }[];
  bottomCtaText: string;
  serviceSlug: string;
  /** 비대면 상속 절차 안내 컴포넌트 표시 */
  showRemoteInheritance?: boolean;
  /** 상속 비용 안내 컴포넌트 표시 */
  showInheritanceCostGuide?: boolean;
  /** 전국·원격 공통 RemoteLegalProcess 표시 */
  showRemoteLegalProcess?: boolean;
  /** 비용 확인 체크리스트 표시 */
  showRemoteCostChecklist?: boolean;
  /** RemoteCostChecklist 업무 유형 */
  remoteCostChecklistVariant?:
    | "inheritance"
    | "corporate"
    | "real-estate"
    | "civil";
  /** 상속 여정 네비 표시 (기본: journey 맵에 있으면 자동) */
  showInheritanceJourney?: boolean;
  /** 요약 카드 이후 고유 소제목 줄글 — 카드 나열 대신 문단 중심 */
  proseSections?: {
    id: string;
    title: string;
    paragraphs: string[];
  }[];
};

export type SearchIntentSeed = {
  slug: string;
  label: string;
  category: SearchIntentCategory;
  serviceSlug: string;
  keywords: string[];
  /** Short focus phrase for template sentences */
  focus: string;
  caseHref?: string;
  caseLabel?: string;
  diagnosisHref?: string;
  diagnosisLabel?: string;
  toolHref?: string;
  toolLabel?: string;
  glossaryHref?: string;
  glossaryLabel?: string;
  /** Include one limited 변호 FAQ (global budget ≤5) */
  includeLawyerScopeFaq?: boolean;
};
