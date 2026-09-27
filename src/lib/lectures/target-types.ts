import type { LectureEvidenceGroup } from "@/data/lectures/lecture-evidence-registry";

export type LectureTargetPhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type LectureTargetCurriculum = {
  length: string;
  title: string;
  fit: string;
  outline: string[];
};

export type LectureTargetCard = {
  title: string;
  description: string;
  bullets?: string[];
  href?: string;
};

export type LectureTargetLink = {
  href: string;
  label: string;
  description: string;
};

/** 강의 target 페이지 전용 본문 구성. 공용 LecturePageContent와 함께 쓴다. */
export type LectureTargetSpec = {
  path: string;
  group: LectureEvidenceGroup;
  primaryQuery: string;
  /** 페이지 전용 강의 CTA 문구 */
  ctaLabel: string;
  ctaNote: string;
  /** 첫 화면: 담당자 상황에서 시작하는 리드 */
  lead: string;
  quickFacts: Array<{ label: string; value: string }>;
  situationTitle: string;
  situations: LectureTargetCard[];
  selectorTitle?: string;
  selectorIntro?: string;
  selectors?: LectureTargetCard[];
  curriculumIntro: string;
  curricula: LectureTargetCurriculum[];
  evidenceIntro: string;
  evidenceGap?: string;
  approachTitle: string;
  approach: string[];
  scopeExclusions: string[];
  feeFactors: string[];
  profileGuide: string[];
  photos: LectureTargetPhoto[];
  related: LectureTargetLink[];
  inquiryTopic: string;
  inquiryAudience?: string;
};
