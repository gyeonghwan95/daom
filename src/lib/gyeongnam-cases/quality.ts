import type { GyeongnamLandingDef } from "./types";

export type GyeongnamQualityBreakdown = {
  uniqueTitle: number;
  uniqueMeta: number;
  uniqueH1: number;
  uniqueIntro: number;
  scenarios: number;
  propertyOrIssue: number;
  faqs: number;
  regionLinks: number;
  serviceLinks: number;
  disclosure: number;
  practical: number;
  conversion: number;
  total: number;
};

const FORBIDDEN =
  /경남 1위|최고|무조건 성공|전국 최저가|경남 현지 법무사|경남지점|김해지점|양산지점|창원지점|분사무소/;

function uniqueField(
  value: string,
  field: keyof Pick<
    GyeongnamLandingDef,
    "seoTitle" | "metaDescription" | "h1" | "heroDescription"
  >,
  self: GyeongnamLandingDef,
  all: GyeongnamLandingDef[],
): boolean {
  const v = value.trim();
  if (!v) return false;
  return !all.some((o) => o.slug !== self.slug && o[field].trim() === v);
}

export function scoreGyeongnamLanding(
  def: GyeongnamLandingDef,
  all: GyeongnamLandingDef[],
): GyeongnamQualityBreakdown {
  const uniqueTitle = uniqueField(def.seoTitle, "seoTitle", def, all) ? 8 : 0;
  const uniqueMeta = uniqueField(def.metaDescription, "metaDescription", def, all)
    ? 8
    : 0;
  const uniqueH1 = uniqueField(def.h1, "h1", def, all) ? 8 : 0;
  const uniqueIntro =
    uniqueField(def.heroDescription, "heroDescription", def, all) &&
    def.heroDescription.trim().length >= 100
      ? 12
      : 0;

  const scenarios =
    def.scenarioTitles.length >= 2 && def.scenarioBodies.length >= 2 ? 12 : 0;
  const propertyOrIssue =
    def.propertyTypes.length >= 1 && def.jurisdictionNote.trim().length >= 40
      ? 10
      : 0;
  const faqs = def.uniqueFaqs.length >= 3 ? 10 : def.uniqueFaqs.length >= 2 ? 6 : 0;
  const regionLinks = def.relatedRegionSlugs.length >= 1 ? 6 : 0;
  const serviceLinks = def.relatedServiceSlugs.length >= 1 ? 6 : 0;
  const disclosure =
    /부산\s*해운대|지점이 있는 것은 아닙니다|별도 지점/.test(
      def.officeDisclosure,
    ) && !FORBIDDEN.test(def.officeDisclosure)
      ? 5
      : 0;

  const practicalBlob = [
    def.heroDescription,
    def.jurisdictionNote,
    ...def.scenarioBodies,
    ...def.uniqueFaqs.map((f) => f.answer),
  ].join("");
  const practical =
    /서류|취득세|보수|공과금|절차|관할|위임|국민주택/.test(practicalBlob)
      ? 10
      : 0;

  const conversion =
    def.ctaTitle.trim().length > 0 &&
    def.visitHint.trim().length > 0 &&
    def.remoteHint.trim().length > 0
      ? 5
      : 0;

  const forbiddenPenalty = FORBIDDEN.test(
    [def.seoTitle, def.h1, def.heroDescription, def.metaDescription].join(" "),
  )
    ? 80
    : 0;

  const total = Math.max(
    0,
    uniqueTitle +
      uniqueMeta +
      uniqueH1 +
      uniqueIntro +
      scenarios +
      propertyOrIssue +
      faqs +
      regionLinks +
      serviceLinks +
      disclosure +
      practical +
      conversion -
      forbiddenPenalty,
  );

  return {
    uniqueTitle,
    uniqueMeta,
    uniqueH1,
    uniqueIntro,
    scenarios,
    propertyOrIssue,
    faqs,
    regionLinks,
    serviceLinks,
    disclosure,
    practical,
    conversion,
    total,
  };
}

export const GYEONGNAM_PUBLISH_THRESHOLD = 80;

export function isGyeongnamPublishable(
  def: GyeongnamLandingDef,
  all: GyeongnamLandingDef[],
): boolean {
  if (!def.published) return false;
  return scoreGyeongnamLanding(def, all).total >= GYEONGNAM_PUBLISH_THRESHOLD;
}
