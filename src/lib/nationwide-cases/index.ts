import { nationwideServiceDefs } from "./service-defs";
import { metroRegionDefs } from "./metro-defs";
import { cityRegionDefs } from "./city-defs";
import { isPublishable, scoreRegionLanding } from "./quality";
import {
  buildAllNationwideCasePageData,
  buildNationwideCasePageData,
} from "./builder";
import { type RegionLandingDef } from "./types";
import type { PageData } from "@/lib/pageData/types";

export type * from "./types";
export { CASE_BASE, caseNationwidePath } from "./types";
export { scoreRegionLanding, QUALITY_PUBLISH_THRESHOLD } from "./quality";

function allDefsRaw(): RegionLandingDef[] {
  return [...nationwideServiceDefs, ...metroRegionDefs, ...cityRegionDefs];
}

let cachedAll: RegionLandingDef[] | null = null;
let cachedPublished: RegionLandingDef[] | null = null;
let bySlug: Map<string, RegionLandingDef> | null = null;

export function getAllNationwideCaseDefs(): RegionLandingDef[] {
  if (!cachedAll) cachedAll = allDefsRaw();
  return cachedAll;
}

/** 품질 80점 이상 + published:true 만 공개 */
export function getPublishedNationwideCaseDefs(): RegionLandingDef[] {
  if (!cachedPublished) {
    const all = getAllNationwideCaseDefs();
    cachedPublished = all.filter((def) => isPublishable(def, all));
  }
  return cachedPublished;
}

export function getNationwideCaseBySlug(
  slug: string,
): RegionLandingDef | undefined {
  if (!bySlug) {
    bySlug = new Map(
      getPublishedNationwideCaseDefs().map((d) => [d.slug, d]),
    );
  }
  return bySlug.get(slug);
}

export function getPublishedNationwideCaseSlugs(): string[] {
  return getPublishedNationwideCaseDefs().map((d) => d.slug);
}

export function getNationwideCasePageDataBySlug(
  slug: string,
): PageData | undefined {
  const def = getNationwideCaseBySlug(slug);
  if (!def) return undefined;
  const catalog = new Map(
    getAllNationwideCaseDefs().map((d) => [d.slug, d]),
  );
  return buildNationwideCasePageData(def, catalog);
}

export function buildAllPublishedNationwideCasePageData(): PageData[] {
  return buildAllNationwideCasePageData(getPublishedNationwideCaseDefs());
}

export function getUnpublishedNationwideCaseDefs(): Array<{
  slug: string;
  score: number;
  reason: string;
}> {
  const all = getAllNationwideCaseDefs();
  return all
    .filter((def) => !isPublishable(def, all))
    .map((def) => {
      const score = scoreRegionLanding(def, all).total;
      return {
        slug: def.slug,
        score,
        reason: !def.published
          ? "published:false"
          : `quality ${score} < 80`,
      };
    });
}

export function searchNationwideRegions(query: string): RegionLandingDef[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, "");
  if (!q) return [];
  return getPublishedNationwideCaseDefs()
    .filter((d) => d.kind === "region")
    .filter((d) => {
      const hay = [
        d.regionName,
        d.parentRegion ?? "",
        d.slug,
        d.primaryKeyword,
        ...d.secondaryKeywords,
      ]
        .join(" ")
        .toLowerCase()
        .replace(/\s+/g, "");
      return hay.includes(q);
    })
    .slice(0, 40);
}

export function getMetroRegionCards(): RegionLandingDef[] {
  return getPublishedNationwideCaseDefs().filter(
    (d) => d.kind === "region" && d.priority === 1,
  );
}

export function getRegionHubGroups(): Array<{
  label: string;
  slugs: string[];
}> {
  return [
    { label: "서울", slugs: ["서울상속등기법무사"] },
    { label: "경기", slugs: ["경기상속등기법무사"] },
    { label: "인천", slugs: ["인천상속등기법무사"] },
    { label: "충청", slugs: ["충남상속등기법무사", "충북상속등기법무사"] },
    { label: "대전·세종", slugs: ["대전상속등기법무사", "세종상속등기법무사"] },
    {
      label: "대구·경북",
      slugs: ["대구상속등기법무사", "경북상속등기법무사"],
    },
    {
      label: "울산·경남",
      slugs: ["울산상속등기법무사", "경남상속등기법무사"],
    },
    {
      label: "광주·전남",
      slugs: ["광주상속등기법무사", "전남상속등기법무사"],
    },
    { label: "전북", slugs: ["전북상속등기법무사"] },
    { label: "강원", slugs: ["강원상속등기법무사"] },
    { label: "제주", slugs: ["제주상속등기법무사"] },
  ];
}

export function inquiryRegionParam(def: RegionLandingDef): string {
  if (def.regionName === "전국") return "";
  if (def.parentRegion && def.parentRegion !== def.regionName) {
    return `${def.parentRegion} ${def.regionName}`;
  }
  return def.regionName;
}
