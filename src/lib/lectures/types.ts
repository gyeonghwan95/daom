import type { ServiceFaq } from "@/types/service";

/** 강의 실적(history) 항목이 속한 기관 유형 */
export type LectureInstitutionType =
  | "public"
  | "local-government"
  | "school"
  | "university"
  | "library"
  | "youth-center"
  | "startup-support"
  | "welfare"
  | "corporate"
  | "association"
  | "other"
  /** @deprecated 하위 호환 — library로 매핑 */
  | "public-library"
  /** @deprecated 하위 호환 — public으로 매핑 */
  | "public-agency"
  /** @deprecated 하위 호환 — youth-center로 매핑 */
  | "youth-agency"
  /** @deprecated 하위 호환 — other로 매핑 */
  | "community";

export type LectureFormatKind =
  | "lecture"
  | "special-lecture"
  | "workshop"
  | "seminar"
  | "discussion"
  | "career-talk"
  | "multi-session";

export type LectureHistoryImage = {
  src: string;
  alt: string;
  caption?: string;
};

/**
 * 검증된 강의·특강 실적 1건.
 * 확인되지 않은 날짜·인원·시간은 비워 둡니다. 네이버 본문을 복제하지 않습니다.
 */
export type LectureHistoryEntry = {
  id: string;
  /** /강의이력/[slug] */
  slug: string;
  title: string;
  shortTitle?: string;
  institution: string;
  institutionType: LectureInstitutionType;
  /**
   * 확인된 일자·기간만 기재.
   * ISO 날짜(YYYY-MM-DD), 연도(YYYY), 기간(YYYY~YYYY) 등.
   * 미확인 시 생략.
   */
  date?: string;
  endDate?: string;
  year?: number;
  city: string;
  district?: string;
  venue?: string;
  /** 표시용 대상 요약 (하위 호환) */
  audience?: string;
  audiences?: string[];
  participantCount?: number;
  durationMinutes?: number;
  durationLabel?: string;
  topics: string[];
  lectureCategory: string[];
  /** 표시용 형식 문구 (하위 호환) */
  format: string;
  formatKind?: LectureFormatKind;
  summary: string;
  objectives?: string[];
  curriculum?: string[];
  highlights?: string[];
  frequentlyAskedQuestions?: string[];
  /** 대표 이미지 (하위 호환) */
  imageSrc?: string;
  images?: LectureHistoryImage[];
  blogUrl?: string;
  relatedLecturePages?: string[];
  featured: boolean;
  verified: boolean;
  verificationNote?: string;
  /** 내부 출처 메모 (화면 비노출) */
  sourceNote: string;
};

export type LectureSearchIntentAction =
  | "create-new"
  | "merge-into-existing"
  | "section-only"
  | "strengthen-existing"
  | "do-not-target";

export type LectureSearchIntent = {
  id: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  targetUrl?: string;
  intentType?: string;
  audience?: string;
  institutionType?: string;
  lectureTopic?: string;
  format?: string;
  region?: string;
  funnelStage?: string;
  priority: 1 | 2 | 3;
  action: LectureSearchIntentAction;
  parentHub?: string;
  relatedLectures?: string[];
  relatedHistory?: string[];
  relatedServices?: string[];
  legalQualificationRisk?: boolean;
  notes?: string;
  existingUrl?: string;
  keyword?: string;
  existingPath?: string;
  relatedPageSlug?: string;
  note?: string;
  targetPath?: string;
};

export type LecturePageKind = "hub" | "topic" | "hiring" | "speaker" | "inquiry";

export type LectureLinkItem = {
  href: string;
  label: string;
};

export type LectureSummaryItem = {
  label: string;
  value: string;
};

export type LectureTopicCard = {
  title: string;
  description: string;
  href?: string;
};

export type LectureAudienceCard = {
  title: string;
  description: string;
};

export type LectureInstitutionCard = {
  title: string;
  topics: string[];
};

export type LectureFormatOption = {
  title: string;
  description: string;
};

export type LectureDurationOption = {
  label: string;
  outline: string[];
};

export type LectureModule = {
  title: string;
  description: string;
  bullets?: string[];
};

export type LecturePageContent = {
  slug: string;
  kind: LecturePageKind;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroIntro: string;
  heroParagraphs: string[];
  summaryItems: LectureSummaryItem[];
  topicCards: LectureTopicCard[];
  audienceCards: LectureAudienceCard[];
  institutionCards: LectureInstitutionCard[];
  formats: LectureFormatOption[];
  durationOptions: LectureDurationOption[];
  modules: string[];
  processSteps: string[];
  preparationChecklist: string[];
  materialExamples: string[];
  faqs: ServiceFaq[];
  relatedLectureLinks: LectureLinkItem[];
  relatedServiceLinks: LectureLinkItem[];
  historyIds: string[];
  ctaTitle: string;
  ctaText: string;
  disclaimer?: string;
  showInquiryForm?: boolean;
  showRecommendTool?: boolean;
  showPrintProfile?: boolean;
  primaryKeywords?: string[];
};

export const LECTURE_INSTITUTION_TYPE_LABELS: Record<
  LectureInstitutionType,
  string
> = {
  public: "공공기관",
  "local-government": "지자체",
  school: "학교",
  university: "대학",
  library: "도서관",
  "youth-center": "청년기관",
  "startup-support": "창업지원",
  welfare: "복지기관",
  corporate: "기업",
  association: "협회·단체",
  other: "기타",
  "public-library": "도서관",
  "public-agency": "공공기관",
  "youth-agency": "청년기관",
  community: "지역·찾아가는 교육",
};

export const LECTURE_FORMAT_KIND_LABELS: Record<LectureFormatKind, string> = {
  lecture: "강의",
  "special-lecture": "특강",
  workshop: "워크숍",
  seminar: "세미나",
  discussion: "토론형",
  "career-talk": "진로특강",
  "multi-session": "연속 과정",
};

export const LECTURE_CATEGORY_FILTERS = [
  { id: "all", label: "전체" },
  { id: "생활법률", label: "생활법률" },
  { id: "전세사기·주거", label: "전세사기·주거" },
  { id: "청년", label: "청년" },
  { id: "디지털 법률", label: "디지털 법률" },
  { id: "창업·기업", label: "창업·기업" },
  { id: "학교·진로", label: "학교·진로" },
  { id: "기관 맞춤형", label: "기관 맞춤형 교육" },
] as const;
