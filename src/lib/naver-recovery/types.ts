export type NrLink = { href: string; label: string };

export type NrInline = string | NrLink;

/** 경험 항목 공개 기준 — UNVERIFIED는 스펙에 넣지 않는다. */
export type NrEvidenceStatus = "VERIFIED_HANDLED" | "VERIFIED_CONSULTED" | "EXAMPLE";

export type NrBlock =
  | { kind: "p"; parts: readonly NrInline[] }
  | { kind: "list"; items: readonly (readonly NrInline[])[]; ordered?: boolean }
  | { kind: "table"; caption: string; head: readonly string[]; rows: readonly (readonly string[])[] }
  | {
      kind: "cards";
      items: readonly { title: string; body: string; link?: NrLink }[];
    }
  | {
      kind: "records";
      items: readonly {
        status: NrEvidenceStatus;
        title: string;
        body: string;
        link: NrLink;
      }[];
    };

export type NrSection = {
  id: string;
  title: string;
  blocks: readonly NrBlock[];
};

export type NrImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type NaverRecoverySpec = {
  slug: string;
  path: string;
  eyebrow: string;
  /** H1 바로 아래 첫 답변 (first700 대상) */
  lead: readonly string[];
  keyPoints?: { title: string; items: readonly string[] };
  facts?: readonly { label: string; value: string }[];
  image: NrImage;
  ogImage: NrImage;
  sections: readonly NrSection[];
  faqs: readonly { question: string; answer: string }[];
  cta: { title: string; body: string; href: string; label: string };
  /** 하단 전국·원격 안내 — 모든 업무가 원격으로 끝난다고 쓰지 않는다 */
  remoteNote: string;
  reviewNote: string;
  dateModified: string;
};
