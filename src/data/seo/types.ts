/** SEO 검색 의도 DB 엔티티 유형 */
export type SeoEntityType =
  | "city"
  | "district"
  | "neighborhood"
  | "living-area"
  | "station-area"
  | "new-town"
  | "industrial-zone"
  | "service"
  | "intent"
  | "institution"
  | "special-keyword";

/** 검색 의도 분류 */
export type SearchIntentKind =
  | "cost"
  | "fee-table"
  | "documents"
  | "preparation-documents"
  | "period"
  | "deadline"
  | "penalty"
  | "procedure"
  | "consultation"
  | "case"
  | "faq"
  | "local-discovery"
  | "brand"
  | "institution-proximity"
  | "industry"
  | "demographic";

export type SeoIntentEntity = {
  id: string;
  name: string;
  slug: string;
  type: SeoEntityType;
  /** 상위 지역 id (없으면 null) */
  parentRegion: string | null;
  keywords: string[];
  description: string;
  /** 관련 업무 id (services.ts id 참조) */
  relatedServices: string[];
  /** 관련 지역 id (regions.ts id 참조) */
  relatedRegions: string[];
  searchIntent: SearchIntentKind;
  /** 1–100, 높을수록 페이지 생성·내부링크 우선 */
  priority: number;
};
