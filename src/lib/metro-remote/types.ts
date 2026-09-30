import type { NrBlock, NrImage, NrSection } from "@/lib/naver-recovery/types";

export type MetroRemoteRegionGroup = "SEOUL" | "GYEONGGI" | "CHUNGCHEONG" | "INCHEON_TEST";

export type MetroRemoteCarouselItem = {
  href: string;
  title: string;
  image: string;
  imageAlt: string;
};

/**
 * 수도권·충청 원거리 상속등기 대표 URL 전용 스펙.
 * 경상권 지역 템플릿(RegionalInheritanceTarget)과 섹션 순서·문장·FAQ 제목을 공유하지 않는다.
 */
export type MetroRemoteSpec = {
  slug: string;
  path: string;
  region: string;
  group: MetroRemoteRegionGroup;
  metaTitle: string;
  description: string;
  kicker: string;
  h1: string;
  /** H1 바로 아래 직접 답변 (first700 대상) */
  lead: readonly string[];
  /** 리드 바로 아래 비대면 의뢰 패널(RemoteServicePanel) + 첫 화면 상담 버튼 */
  remotePanel: {
    badge: string;
    title: string;
    lead: string;
    points: readonly string[];
    footnote: string;
    ctaLabel: string;
    ctaHref: string;
  };
  /** 리드 아래 한눈 요약 — 표 한 개 */
  glance?: Extract<NrBlock, { kind: "table" }>;
  image: NrImage;
  ogImage: NrImage;
  sections: readonly NrSection[];
  faqTitle: string;
  faqs: readonly { question: string; answer: string }[];
  cta: { title: string; body: string; href: string; label: string };
  author: {
    name: string;
    role: string;
    officeNote: string;
    sources: readonly string[];
  };
  nextSteps: {
    heading: string;
    description: string;
    items: readonly MetroRemoteCarouselItem[];
  };
  dateModified: string;
};
