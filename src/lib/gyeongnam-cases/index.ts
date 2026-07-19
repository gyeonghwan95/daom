import { phase1GyeongnamDefs } from "./phase1-defs";
import { phase2GyeongnamDefs } from "./phase2-defs";
import { isGyeongnamPublishable, scoreGyeongnamLanding } from "./quality";
import {
  buildAllGyeongnamPageData,
  buildGyeongnamPageData,
} from "./builder";
import {
  CASE_BASE,
  gyeongnamPath,
  inquiryRegionFromDef,
  type GyeongnamLandingDef,
} from "./types";
import type { PageData } from "@/lib/pageData/types";

export type * from "./types";
export { CASE_BASE, gyeongnamPath, inquiryRegionFromDef } from "./types";
export {
  scoreGyeongnamLanding,
  GYEONGNAM_PUBLISH_THRESHOLD,
} from "./quality";

function allDefsRaw(): GyeongnamLandingDef[] {
  return [...phase1GyeongnamDefs, ...phase2GyeongnamDefs];
}

let cachedAll: GyeongnamLandingDef[] | null = null;
let cachedPublished: GyeongnamLandingDef[] | null = null;
let bySlug: Map<string, GyeongnamLandingDef> | null = null;

export function getAllGyeongnamDefs(): GyeongnamLandingDef[] {
  if (!cachedAll) cachedAll = allDefsRaw();
  return cachedAll;
}

export function getPublishedGyeongnamDefs(): GyeongnamLandingDef[] {
  if (!cachedPublished) {
    const all = getAllGyeongnamDefs();
    cachedPublished = all.filter((d) => isGyeongnamPublishable(d, all));
  }
  return cachedPublished;
}

export function getGyeongnamBySlug(
  slug: string,
): GyeongnamLandingDef | undefined {
  if (!bySlug) {
    bySlug = new Map(getPublishedGyeongnamDefs().map((d) => [d.slug, d]));
  }
  return bySlug.get(slug);
}

export function getPublishedGyeongnamSlugs(): string[] {
  return getPublishedGyeongnamDefs().map((d) => d.slug);
}

export function getGyeongnamPageDataBySlug(slug: string): PageData | undefined {
  const def = getGyeongnamBySlug(slug);
  if (!def) return undefined;
  const catalog = new Map(getAllGyeongnamDefs().map((d) => [d.slug, d]));
  return buildGyeongnamPageData(def, catalog);
}

export function buildAllPublishedGyeongnamPageData(): PageData[] {
  return buildAllGyeongnamPageData(getPublishedGyeongnamDefs());
}

export function getUnpublishedGyeongnamDefs(): Array<{
  slug: string;
  score: number;
  reason: string;
}> {
  const all = getAllGyeongnamDefs();
  return all
    .filter((d) => !isGyeongnamPublishable(d, all))
    .map((d) => {
      const score = scoreGyeongnamLanding(d, all).total;
      return {
        slug: d.slug,
        score,
        reason: !d.published ? "published:false" : `quality ${score} < 80`,
      };
    });
}

export type GyeongnamHubFilter = {
  id: string;
  label: string;
  match: (d: GyeongnamLandingDef) => boolean;
};

export const GYEONGNAM_HUB_FILTERS: GyeongnamHubFilter[] = [
  {
    id: "gimhae-yangsan",
    label: "김해·양산",
    match: (d) =>
      /김해|장유|율하|주촌|진영|양산|물금|증산|사송|웅상/.test(
        `${d.regionName} ${d.parentRegion ?? ""} ${d.slug}`,
      ),
  },
  {
    id: "changwon",
    label: "창원",
    match: (d) =>
      /창원|마산|진해|의창|성산/.test(
        `${d.regionName} ${d.parentRegion ?? ""} ${d.slug}`,
      ),
  },
  {
    id: "geoje-tongyeong",
    label: "거제·통영·고성",
    match: (d) => /거제|통영|고성/.test(`${d.regionName} ${d.slug}`),
  },
  {
    id: "jinju-sacheon",
    label: "진주·사천",
    match: (d) => /진주|사천|삼천포/.test(`${d.regionName} ${d.slug}`),
  },
  {
    id: "miryang",
    label: "밀양·창녕",
    match: (d) => /밀양|창녕|삼랑진/.test(`${d.regionName} ${d.slug}`),
  },
  {
    id: "haman",
    label: "함안·의령",
    match: (d) => /함안|의령/.test(`${d.regionName} ${d.slug}`),
  },
  {
    id: "namhae",
    label: "남해·하동",
    match: (d) => /남해|하동/.test(`${d.regionName} ${d.slug}`),
  },
  {
    id: "west",
    label: "산청·함양·거창·합천",
    match: (d) => /산청|함양|거창|합천/.test(`${d.regionName} ${d.slug}`),
  },
  {
    id: "inheritance",
    label: "상속등기",
    match: (d) =>
      d.pageType === "inheritance" ||
      d.pageType === "inheritance-property" ||
      d.pageType === "complex-inheritance",
  },
  {
    id: "renunciation",
    label: "상속포기·한정승인",
    match: (d) =>
      d.pageType === "renunciation" || d.pageType === "limited-acceptance",
  },
  {
    id: "corporate",
    label: "법인등기",
    match: (d) =>
      d.pageType === "corporate" || d.pageType === "corporate-relocation",
  },
  {
    id: "joint",
    label: "기업·공동담보",
    match: (d) => d.pageType === "joint-mortgage",
  },
  {
    id: "cost-docs",
    label: "비용·서류",
    match: (d) =>
      d.pageType === "inheritance-cost" ||
      d.pageType === "inheritance-documents",
  },
];

/** 허브에서 연결할 기존 nationwide 경남 시 페이지 */
export const GYEONGNAM_CORE_CITY_LINKS = [
  { href: "/업무사례/경남상속등기법무사", label: "경남 상속등기" },
  { href: "/업무사례/김해상속등기법무사", label: "김해 상속등기" },
  { href: "/업무사례/양산상속등기법무사", label: "양산 상속등기" },
  { href: "/업무사례/창원상속등기법무사", label: "창원 상속등기" },
  { href: "/업무사례/거제상속등기법무사", label: "거제 상속등기" },
  { href: "/업무사례/진주상속등기법무사", label: "진주 상속등기" },
  { href: "/부산상속등기", label: "부산 상속등기" },
] as const;
