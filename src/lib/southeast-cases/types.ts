/**
 * 업무사례 하위 울산·대구·경북 랜딩 (`/업무사례/...`)
 * 기존 nationwide-cases / gyeongnam-cases 슬러그와 중복하지 않는다.
 */

export const CASE_BASE = "/업무사례" as const;

export type SoutheastRegionGroup = "울산" | "대구" | "경북";

export type SoutheastRegionType =
  | "광역시"
  | "도"
  | "시"
  | "군"
  | "구"
  | "읍"
  | "면"
  | "동"
  | "생활권"
  | "산업권"
  | "지역조합"
  | "허브";

export type SoutheastPageType =
  | "region-hub"
  | "inheritance"
  | "inheritance-cost"
  | "inheritance-documents"
  | "apartment-inheritance"
  | "land-inheritance"
  | "farmland-inheritance"
  | "forest-inheritance"
  | "factory-inheritance"
  | "complex-inheritance"
  | "residence-mismatch"
  | "legacy"
  | "bequest"
  | "renunciation"
  | "limited-acceptance"
  | "corporate"
  | "corporate-relocation"
  | "joint-mortgage"
  | "rehabilitation";

export type SoutheastLandingDef = {
  slug: string;
  regionGroup: SoutheastRegionGroup;
  regionName: string;
  parentRegion?: string;
  regionType: SoutheastRegionType;
  pageType: SoutheastPageType;
  priority: 1 | 2 | 3 | 4;
  primaryKeyword: string;
  secondaryKeywords: string[];
  seoTitle: string;
  metaDescription: string;
  h1: string;
  heroDescription: string;
  officeDisclosure: string;
  legalScopeNotice: string;
  propertyTypes: string[];
  scenarioTitles: [string, string, ...string[]];
  scenarioBodies: [string, string, ...string[]];
  uniqueFaqs: Array<{ question: string; answer: string }>;
  relatedRegionSlugs: string[];
  relatedServiceSlugs: string[];
  ctaTitle: string;
  ctaDescription: string;
  visitHint: string;
  remoteHint: string;
  published: boolean;
};

export function southeastPath(slug: string): string {
  return `${CASE_BASE}/${slug}`;
}

export function inquiryRegionFromSoutheast(def: SoutheastLandingDef): string {
  if (def.pageType === "region-hub") return def.regionGroup;
  if (def.parentRegion) {
    return `${def.parentRegion} ${def.regionName}`.replace(/\s+/g, " ").trim();
  }
  if (
    def.regionName.startsWith("울산") ||
    def.regionName.startsWith("대구") ||
    def.regionName.startsWith("경북") ||
    def.regionName === def.regionGroup
  ) {
    return def.regionName;
  }
  return `${def.regionGroup} ${def.regionName}`;
}

/** nationwide에 이미 있어 southeast에서 생성하지 않는 슬러그 */
export const SOUTHEAST_RESERVED_SLUGS = new Set([
  "울산상속등기법무사",
  "대구상속등기법무사",
  "경북상속등기법무사",
  "울산남구상속등기법무사",
  "울주군상속등기법무사",
  "대구수성구상속등기법무사",
  "대구달서구상속등기법무사",
  "포항상속등기법무사",
  "구미상속등기법무사",
  "경산상속등기법무사",
  "경주상속등기법무사",
]);
