/** 법적 고지·약관 경로 (한글 URL — 사이트 관례와 동일) */
export const LEGAL_PATHS = {
  privacy: "/개인정보처리방침",
  terms: "/이용약관",
} as const;

/** 영문·관용 경로 → 정식 한글 경로 (리다이렉트용) */
export const LEGAL_ALIASES = {
  privacy: "/privacy",
  terms: "/terms",
} as const;

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
};

export type LegalDocument = {
  path: string;
  title: string;
  h1: string;
  intro: string;
  /** ISO date YYYY-MM-DD */
  effectiveDate: string;
  lastUpdated: string;
  metaDescription: string;
  keywords: string[];
  sections: LegalSection[];
};
