import type { NrImage, NrLink, NrSection } from "@/lib/naver-recovery/types";

export type ShipCluster =
  | "CORE"
  | "INHERITANCE"
  | "MANAGER"
  | "OWNERSHIP"
  | "MORTGAGE"
  | "FISHING_VESSEL"
  | "REGIONAL";

/**
 * 선박등기 클러스터 전용 스펙. 이 스펙을 가진 slug만 ShipSeoPageView로 렌더된다.
 * 지역 페이지도 first700·FAQ·CTA를 지역별로 새로 쓴다(지역명 치환 금지).
 */
export type ShipSeoSpec = {
  slug: string;
  path: string;
  cluster: ShipCluster;
  /** 지역 페이지만 */
  region?: string;
  metaTitle: string;
  description: string;
  h1: string;
  eyebrow: string;
  /** H1 바로 아래 직접 답변 (first700 대상) */
  lead: readonly string[];
  checkFirst: { title: string; items: readonly string[] };
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
