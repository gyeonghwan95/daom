import type { SoutheastLandingDef } from "./types";

export type SoutheastQualityBreakdown = {
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
  /1위|최고|무조건 성공|전국 최저가|보정 없이 완료|울산지점|대구지점|경북지점|분사무소|현지 법무사입니다|현지 법무사로서|저희는 .{0,12}현지 법무사/;

function uniqueField(
  value: string,
  field: keyof Pick<
    SoutheastLandingDef,
    "seoTitle" | "metaDescription" | "h1" | "heroDescription"
  >,
  self: SoutheastLandingDef,
  all: SoutheastLandingDef[],
): boolean {
  const v = value.trim();
  if (!v) return false;
  return !all.some((o) => o.slug !== self.slug && o[field].trim() === v);
}

export function scoreSoutheastLanding(
  def: SoutheastLandingDef,
  all: SoutheastLandingDef[],
): SoutheastQualityBreakdown {
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
    def.propertyTypes.length >= 1 && def.legalScopeNotice.trim().length >= 40
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
    def.legalScopeNotice,
    ...def.scenarioBodies,
    ...def.uniqueFaqs.map((f) => f.answer),
  ].join("");
  const practical =
    /서류|취득세|보수|공과금|절차|관할|위임|국민주택/.test(practicalBlob)
      ? 10
      : 0;
  const conversion =
    def.ctaTitle && def.visitHint && def.remoteHint ? 5 : 0;
  const penalty = FORBIDDEN.test(
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
      penalty,
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

export const SOUTHEAST_PUBLISH_THRESHOLD = 80;

export function isSoutheastPublishable(
  def: SoutheastLandingDef,
  all: SoutheastLandingDef[],
): boolean {
  if (!def.published) return false;
  return scoreSoutheastLanding(def, all).total >= SOUTHEAST_PUBLISH_THRESHOLD;
}
