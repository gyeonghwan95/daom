/**
 * 의뢰 전 준비자료 — 웹 본문·PNG·PDF·인쇄가 함께 쓰는 단일 원본 타입.
 * 근거표: reports/resources-2026-10-11/EVIDENCE.md
 */
export type ResourceCategory = "inheritance" | "corporate" | "receivable" | "real-estate";

export type ResourceCheck = {
  title: string;
  /** 왜 확인하는지 */
  why: string;
  /** 지금 할 수 있는 준비 */
  prepare: string;
  /** 추가 검토가 필요한 경우 */
  review: string;
};

export type ResourceSheet = {
  caption: string;
  columns: string[];
  /** 첫 열에 미리 적어 둘 항목(나머지 칸은 빈칸) */
  rows: string[];
  /** 가상 작성 예시 1행 — 화면·자산에 '가상 작성 예시'로 표시 */
  example?: string[];
};

export type ResourceSource = {
  label: string;
  url: string;
};

export type ResourceGuide = {
  slug: string;
  category: ResourceCategory;
  /** <title> 앞부분(브랜드는 페이지에서 붙임) */
  title: string;
  h1: string;
  /** 홈·카드용 짧은 제목 */
  shortTitle: string;
  description: string;
  /** 카드·도입부의 '이런 상황에 읽으세요' */
  readWhen: string;
  /** 공유자료 짧은 범위 문구 */
  scope: string;
  intro: string;
  checks: ResourceCheck[];
  /** 선택표(예: 변경 유형 → 정리할 것) */
  chooser?: { caption: string; head: [string, string]; rows: [string, string][] };
  sheet: ResourceSheet;
  reviewConditions: { condition: string; why: string }[];
  officeTasks: string[];
  /** 법무사 업무가 아닌 부분·하지 않는 일 */
  outsideScope: string[];
  costNote: string;
  inquiry: {
    /** 버튼 문구 */
    button: string;
    /** 문의 폼 intent */
    intent: string;
    /** 안내 문구(사무소 쪽 설명) */
    message: string;
    /** 첫 문의에 적을 사실 3~4개 — 복사하면 '항목: ' 빈칸 양식이 된다 */
    facts: string[];
  };
  sources: ResourceSource[];
  related: { href: string; label: string }[];
  /** PNG 한 장용 압축 항목(웹 checks 제목과 같은 사실만) */
  shareItems: string[];
  /** PNG 하단 주의 1줄(웹 본문에 있는 내용만) */
  shareNote: string;
};
