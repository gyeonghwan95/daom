/**
 * 전국 수임 가능 업무 — 법적 성격에 따른 유형 구분
 * A 관할 특례 / B 복수 관할 묶음 검토 / C 관할 선택·확대 / D 법정 관할 유지·비대면 수임
 */

export type NationwideServiceType =
  | "jurisdiction-exception" // A
  | "bundled-jurisdiction" // B
  | "expandable-jurisdiction" // C
  | "remote-accept"; // D

export type VisitNeed = "often-remote" | "sometimes-visit" | "case-by-case";

export type NationwideServiceCard = {
  id: string;
  name: string;
  type: NationwideServiceType;
  typeLabel: string;
  visitNeed: VisitNeed;
  visitLabel: string;
  jurisdictionNote: string;
  documents: string[];
  href: string;
  summary: string;
};

export type NationwidePageSlug =
  | "전국업무"
  | "전국상속등기"
  | "전국유증등기"
  | "여러지역상속부동산등기"
  | "전국법인본점이전등기"
  | "전국공동담보등기";

export type NationwideNoticeConfig = {
  type: NationwideServiceType;
  badge: string;
  title: string;
  /** 패널에 항상 보이는 한두 줄 요약 — 세부 문단은 접힌 영역에 둔다 */
  summary: string;
  paragraphs: string[];
  steps: [string, string, string];
  caution: string;
  ctaLabel: string;
  ctaHref: string;
};
