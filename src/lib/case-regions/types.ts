/**
 * 업무사례 지역 랜딩 — 타입 정의
 * URL: /업무사례/{slug}  (예: /업무사례/해운대구법무사)
 */

export type CaseRegionKind =
  | "city"
  | "district"
  | "dong"
  | "admin-dong"
  | "living"
  | "industrial"
  | "court";

/** 지역 특성 — 본문·사례·문의유형 차별화에 사용 */
export type CaseRegionTrait =
  | "coastal"
  | "port"
  | "residential"
  | "commercial"
  | "industrial"
  | "newtown"
  | "tourism"
  | "university"
  | "finance"
  | "court"
  | "registry"
  | "station"
  | "market"
  | "oldtown";

export type CaseRegionEntry = {
  /** URL 슬러그 (확장자 없이). 예: 해운대구법무사, 부산반여동법무사 */
  slug: string;
  /** 화면에 쓰는 지역명. 예: 해운대구, 반여동, 센텀 */
  name: string;
  /** 문장에 넣는 표기. 예: 해운대구, 부산 반여동 */
  displayName: string;
  kind: CaseRegionKind;
  /** 상위 구·군 키 (haeundae, yeonje …). city는 null */
  parentDistrictKey: string | null;
  traits: CaseRegionTrait[];
  /** 검색·필터용 키워드 */
  keywords: string[];
  /** 짧은 지역 맥락 (고유 본문 생성용) */
  context: string;
  /** 색인 여부. 행정동 세분화 등 유사도가 높은 경우 false 가능 */
  indexable: boolean;
  /** 동일 의도 통합 시 canonical 대상 slug (업무사례 하위) */
  canonicalSlug?: string;
};

export type DistrictKey =
  | "jung"
  | "seo"
  | "dong"
  | "yeongdo"
  | "busanjin"
  | "dongnae"
  | "nam"
  | "buk"
  | "haeundae"
  | "saha"
  | "geumjeong"
  | "gangseo"
  | "yeonje"
  | "suyeong"
  | "sasang"
  | "gijang";

export type DistrictMeta = {
  key: DistrictKey;
  name: string;
  /** 예: 해운대구법무사 */
  slug: string;
  traits: CaseRegionTrait[];
  context: string;
  dongs: string[];
  adminDongs?: string[];
};
