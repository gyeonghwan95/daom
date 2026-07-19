/**
 * 업무사례 하위 전국·지역 랜딩 (`/업무사례/...`)
 * 기존 루트 `/전국*` 페이지와 URL을 분리한다.
 */

export const CASE_BASE = "/업무사례" as const;

export type RegionType = "시도" | "시" | "구" | "군" | "생활권" | "권역허브" | "전국허브";

export type NationwideCaseKind =
  | "hub"
  | "service"
  | "region-hub"
  | "region";

export type RegionLandingDef = {
  slug: string;
  regionName: string;
  parentRegion?: string;
  regionType: RegionType;
  priority: 1 | 2 | 3;
  primaryKeyword: string;
  secondaryKeywords: string[];
  seoTitle: string;
  metaDescription: string;
  h1: string;
  disclosure: string;
  localIntro: string;
  scenarioIds: string[];
  propertyTypeIds: string[];
  uniqueFaqIds: string[];
  relatedRegionSlugs: string[];
  relatedServiceSlugs: string[];
  ctaTitle: string;
  ctaDescription: string;
  /** 품질 점수 80 미만이거나 미완성이면 false */
  published: boolean;
  kind: NationwideCaseKind;
  noticeType?: "jurisdiction-exception" | "bundled-jurisdiction" | "expandable-jurisdiction" | "remote-accept";
};

export function caseNationwidePath(slug: string): string {
  return `${CASE_BASE}/${slug}`;
}
