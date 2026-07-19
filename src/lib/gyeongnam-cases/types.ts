/**
 * 업무사례 하위 경남 전용 랜딩 (`/업무사례/...`)
 * 기존 nationwide-cases의 김해·양산·창원·경남 상속등기 URL과 슬러그를 중복하지 않는다.
 */

export const CASE_BASE = "/업무사례" as const;

export type GyeongnamRegionType =
  | "도"
  | "시"
  | "군"
  | "구"
  | "읍"
  | "면"
  | "동"
  | "생활권"
  | "지역조합"
  | "허브";

export type GyeongnamPageType =
  | "region-hub"
  | "inheritance"
  | "inheritance-cost"
  | "inheritance-documents"
  | "inheritance-property"
  | "complex-inheritance"
  | "residence-mismatch"
  | "legacy"
  | "renunciation"
  | "limited-acceptance"
  | "corporate"
  | "corporate-relocation"
  | "joint-mortgage"
  | "rehabilitation";

export type GyeongnamLandingDef = {
  slug: string;
  regionName: string;
  parentRegion?: string;
  regionType: GyeongnamRegionType;
  pageType: GyeongnamPageType;
  priority: 1 | 2 | 3 | 4;
  primaryKeyword: string;
  secondaryKeywords: string[];
  seoTitle: string;
  metaDescription: string;
  h1: string;
  heroDescription: string;
  officeDisclosure: string;
  propertyTypes: string[];
  scenarioTitles: [string, string, ...string[]];
  scenarioBodies: [string, string, ...string[]];
  uniqueFaqs: Array<{ question: string; answer: string }>;
  relatedRegionSlugs: string[];
  relatedServiceSlugs: string[];
  ctaTitle: string;
  ctaDescription: string;
  /** 관할 특례 / 법정관할유지 / 묶음검토 */
  jurisdictionNote: string;
  visitHint: string;
  remoteHint: string;
  published: boolean;
};

export function gyeongnamPath(slug: string): string {
  return `${CASE_BASE}/${slug}`;
}

export function inquiryRegionFromDef(def: GyeongnamLandingDef): string {
  if (def.regionName === "경남" && def.pageType === "region-hub") return "경남";
  if (def.parentRegion && def.parentRegion !== def.regionName) {
    return `${def.parentRegion} ${def.regionName}`;
  }
  if (def.regionName.startsWith("경남") || def.regionName === "경남") {
    return def.regionName;
  }
  return `경남 ${def.regionName}`;
}
