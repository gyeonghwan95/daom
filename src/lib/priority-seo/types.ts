import type { NrImage, NrLink, NrSection } from "@/lib/naver-recovery/types";

export type PriorityCluster = "INHERITANCE" | "LOCAL" | "DEPOSIT";

/**
 * 부산 상속·법무사·공탁 우선순위 대상 전용 스펙. 이 스펙을 가진 slug만 PrioritySeoPageView로 렌더된다.
 * 한 검색의도에는 이 폴더의 URL 하나만 대표로 둔다.
 */
export type PrioritySeoSpec = {
  slug: string;
  path: string;
  cluster: PriorityCluster;
  metaTitle: string;
  description: string;
  h1: string;
  eyebrow: string;
  /** 브레드크럼에 쓰는 짧은 이름 */
  shortName: string;
  /** H1 바로 아래 직접 답변 (first700 대상) */
  lead: readonly string[];
  checkFirst: { title: string; items: readonly string[] };
  /** 첫 화면의 작은 CTA 한 개 — 하단 CTA와 같은 문의 경로를 쓴다 */
  topCta?: { label: string; href: string };
  image: NrImage;
  ogImage: NrImage;
  sections: readonly NrSection[];
  faqTitle: string;
  faqs: readonly { question: string; answer: string }[];
  related: { title: string; links: readonly (NrLink & { note: string })[] };
  cta: {
    title: string;
    body: string;
    /** 상담 시 알려주면 되는 항목 — 페이지에 개인정보를 적게 하지 않는다 */
    checklist: readonly string[];
    href: string;
    label: string;
  };
  officeNote: string;
  reviewNote: string;
  dateModified: string;
};
