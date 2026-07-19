import type { RegionLandingDef } from "./types";
import { pickByIds, SCENARIOS, FAQS } from "./content-pools";

export type QualityBreakdown = {
  uniqueTitle: number;
  uniqueMeta: number;
  uniqueH1: number;
  uniqueIntro: number;
  scenarios: number;
  faqs: number;
  regionLinks: number;
  serviceLinks: number;
  practical: number;
  disclosure: number;
  noFakeCase: number;
  total: number;
};

const FAKE_CASE_PATTERNS =
  /성공사례로 완료|100% 완료|무조건 완료|전국 최저가|아무 등기소|지점 개설|서울지점|경기지점/;

function hasUnique(
  value: string,
  field: keyof Pick<
    RegionLandingDef,
    "seoTitle" | "metaDescription" | "h1" | "localIntro"
  >,
  self: RegionLandingDef,
  all: RegionLandingDef[],
): boolean {
  const normalized = value.trim();
  if (!normalized) return false;
  return !all.some(
    (other) =>
      other.slug !== self.slug && other[field].trim() === normalized,
  );
}

/** 페이지 품질 점수 (80 미만은 비공개) */
export function scoreRegionLanding(
  def: RegionLandingDef,
  all: RegionLandingDef[],
): QualityBreakdown {
  const uniqueTitle = hasUnique(def.seoTitle, "seoTitle", def, all) ? 10 : 0;
  const uniqueMeta = hasUnique(def.metaDescription, "metaDescription", def, all)
    ? 10
    : 0;
  const uniqueH1 = hasUnique(def.h1, "h1", def, all) ? 10 : 0;
  const uniqueIntro =
    hasUnique(def.localIntro, "localIntro", def, all) &&
    def.localIntro.trim().length >= 80
      ? 15
      : 0;

  const scenarios = pickByIds(SCENARIOS, def.scenarioIds);
  const faqs = pickByIds(FAQS, def.uniqueFaqIds);
  const scenarioScore = scenarios.length >= 2 ? 15 : scenarios.length === 1 ? 7 : 0;
  const faqScore = faqs.length >= 2 ? 10 : faqs.length === 1 ? 5 : 0;

  const regionLinks =
    def.relatedRegionSlugs.filter(Boolean).length >= 1 ? 5 : 0;
  const serviceLinks =
    def.relatedServiceSlugs.filter(Boolean).length >= 1 ? 5 : 0;

  const practicalBlob = [
    def.localIntro,
    def.ctaDescription,
    ...scenarios.map((s) => s.body),
    ...faqs.map((f) => f.body),
  ].join("");
  const practical =
    /서류|취득세|국민주택|보수|공과금|절차|관할|위임/.test(practicalBlob)
      ? 10
      : 0;

  const disclosure =
    /부산\s*해운대|지점이 있는 것은 아닙니다|별도 지점/.test(def.disclosure)
      ? 5
      : 0;

  const noFakeCase = FAKE_CASE_PATTERNS.test(
    [def.seoTitle, def.h1, def.localIntro, def.metaDescription].join(" "),
  )
    ? 0
    : 5;

  const total =
    uniqueTitle +
    uniqueMeta +
    uniqueH1 +
    uniqueIntro +
    scenarioScore +
    faqScore +
    regionLinks +
    serviceLinks +
    practical +
    disclosure +
    noFakeCase;

  return {
    uniqueTitle,
    uniqueMeta,
    uniqueH1,
    uniqueIntro,
    scenarios: scenarioScore,
    faqs: faqScore,
    regionLinks,
    serviceLinks,
    practical,
    disclosure,
    noFakeCase,
    total,
  };
}

export const QUALITY_PUBLISH_THRESHOLD = 80;

export function isPublishable(
  def: RegionLandingDef,
  all: RegionLandingDef[],
): boolean {
  if (!def.published) return false;
  return scoreRegionLanding(def, all).total >= QUALITY_PUBLISH_THRESHOLD;
}
