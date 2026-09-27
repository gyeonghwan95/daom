import type { NrImage, NrSection } from "@/lib/naver-recovery/types";

/** 타지역 상속등기 대표 URL 전용 스펙 — 지역별 first700·FAQ·CTA가 모두 달라야 한다. */
export type RegionalInheritanceSpec = {
  region: string;
  metaTitle: string;
  description: string;
  h1: string;
  eyebrow: string;
  /** H1 바로 아래 직접 답변 (first700 대상) */
  lead: readonly string[];
  facts: readonly { label: string; value: string }[];
  image: NrImage;
  ogImage: NrImage;
  sections: readonly NrSection[];
  faqs: readonly { question: string; answer: string }[];
  cta: {
    title: string;
    body: string;
    /** 상담 시 알려주면 되는 최소 항목 */
    checklist: readonly string[];
    href: string;
    label: string;
  };
  /** 사무소 위치·지점 없음 고지 */
  officeNote: string;
  reviewNote: string;
  dateModified: string;
};

export type RegionalInheritanceTarget = RegionalInheritanceSpec & {
  slug: string;
  path: string;
};
