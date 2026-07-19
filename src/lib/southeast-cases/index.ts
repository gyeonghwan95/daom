import { ulsanPhase1Defs } from "./ulsan-phase1";
import { daeguPhase1Defs } from "./daegu-phase1";
import { gyeongbukPhase1Defs } from "./gyeongbuk-phase1";
import { southeastPhase2Defs } from "./phase2-defs";
import { isSoutheastPublishable, scoreSoutheastLanding } from "./quality";
import {
  buildAllSoutheastPageData,
  buildSoutheastPageData,
} from "./builder";
import {
  SOUTHEAST_RESERVED_SLUGS,
  type SoutheastLandingDef,
  type SoutheastRegionGroup,
} from "./types";
import type { PageData } from "@/lib/pageData/types";

export type * from "./types";
export {
  CASE_BASE,
  southeastPath,
  inquiryRegionFromSoutheast,
  SOUTHEAST_RESERVED_SLUGS,
} from "./types";
export {
  scoreSoutheastLanding,
  SOUTHEAST_PUBLISH_THRESHOLD,
} from "./quality";

function allDefsRaw(): SoutheastLandingDef[] {
  return [
    ...ulsanPhase1Defs,
    ...daeguPhase1Defs,
    ...gyeongbukPhase1Defs,
    ...southeastPhase2Defs,
  ];
}

let cachedAll: SoutheastLandingDef[] | null = null;
let cachedPublished: SoutheastLandingDef[] | null = null;
let bySlug: Map<string, SoutheastLandingDef> | null = null;

export function getAllSoutheastDefs(): SoutheastLandingDef[] {
  if (!cachedAll) {
    const raw = allDefsRaw();
    const seen = new Set<string>();
    cachedAll = [];
    for (const def of raw) {
      if (SOUTHEAST_RESERVED_SLUGS.has(def.slug)) continue;
      if (seen.has(def.slug)) continue;
      seen.add(def.slug);
      cachedAll.push(def);
    }
  }
  return cachedAll;
}

export function getPublishedSoutheastDefs(): SoutheastLandingDef[] {
  if (!cachedPublished) {
    const all = getAllSoutheastDefs();
    cachedPublished = all.filter((d) => isSoutheastPublishable(d, all));
  }
  return cachedPublished;
}

export function getSoutheastBySlug(
  slug: string,
): SoutheastLandingDef | undefined {
  if (!bySlug) {
    bySlug = new Map(getPublishedSoutheastDefs().map((d) => [d.slug, d]));
  }
  return bySlug.get(slug);
}

export function getPublishedSoutheastSlugs(): string[] {
  return getPublishedSoutheastDefs().map((d) => d.slug);
}

export function getSoutheastPageDataBySlug(slug: string): PageData | undefined {
  const def = getSoutheastBySlug(slug);
  if (!def) return undefined;
  const catalog = new Map(getAllSoutheastDefs().map((d) => [d.slug, d]));
  return buildSoutheastPageData(def, catalog);
}

export function buildAllPublishedSoutheastPageData(): PageData[] {
  return buildAllSoutheastPageData(getPublishedSoutheastDefs());
}

export function getUnpublishedSoutheastDefs(): Array<{
  slug: string;
  score: number;
  reason: string;
}> {
  const all = getAllSoutheastDefs();
  return all
    .filter((d) => !isSoutheastPublishable(d, all))
    .map((d) => {
      const score = scoreSoutheastLanding(d, all).total;
      return {
        slug: d.slug,
        score,
        reason: !d.published ? "published:false" : `quality ${score} < 80`,
      };
    });
}

export const SOUTHEAST_HUB_LINKS: Record<
  SoutheastRegionGroup,
  Array<{ href: string; label: string }>
> = {
  울산: [
    { href: "/업무사례/울산상속등기법무사", label: "울산 상속등기" },
    { href: "/업무사례/울산남구상속등기법무사", label: "울산 남구 상속등기" },
    { href: "/업무사례/울주군상속등기법무사", label: "울주군 상속등기" },
    { href: "/업무사례/울산중구상속등기법무사", label: "울산 중구 상속등기" },
    { href: "/업무사례/울산동구상속등기법무사", label: "울산 동구 상속등기" },
    { href: "/업무사례/울산북구상속등기법무사", label: "울산 북구 상속등기" },
    { href: "/부산상속등기", label: "부산 상속등기" },
  ],
  대구: [
    { href: "/업무사례/대구상속등기법무사", label: "대구 상속등기" },
    { href: "/업무사례/대구수성구상속등기법무사", label: "대구 수성구" },
    { href: "/업무사례/대구달서구상속등기법무사", label: "대구 달서구" },
    { href: "/업무사례/대구달성군상속등기법무사", label: "달성군 상속등기" },
    { href: "/업무사례/대구군위군상속등기법무사", label: "군위군 상속등기" },
    { href: "/부산상속등기", label: "부산 상속등기" },
  ],
  경북: [
    { href: "/업무사례/경북상속등기법무사", label: "경북 상속등기" },
    { href: "/업무사례/포항상속등기법무사", label: "포항 상속등기" },
    { href: "/업무사례/경주상속등기법무사", label: "경주 상속등기" },
    { href: "/업무사례/구미상속등기법무사", label: "구미 상속등기" },
    { href: "/업무사례/경산상속등기법무사", label: "경산 상속등기" },
    { href: "/업무사례/안동상속등기법무사", label: "안동 상속등기" },
    { href: "/업무사례/칠곡상속등기법무사", label: "칠곡 상속등기" },
  ],
};

export type SoutheastHubFilter = { id: string; label: string };

export function getSoutheastHubFilters(
  group: SoutheastRegionGroup,
): SoutheastHubFilter[] {
  const common: SoutheastHubFilter[] = [
    { id: "inheritance", label: "상속등기" },
    { id: "cost-docs", label: "비용·서류" },
    { id: "land", label: "토지·농지·임야" },
    { id: "factory", label: "공장·산업" },
    { id: "corporate", label: "법인·본점이전" },
    { id: "joint", label: "공동담보" },
  ];
  if (group === "울산") {
    return [
      { id: "jung", label: "중구" },
      { id: "nam", label: "남구" },
      { id: "dong", label: "동구" },
      { id: "buk", label: "북구" },
      { id: "ulju", label: "울주군" },
      ...common,
    ];
  }
  if (group === "대구") {
    return [
      { id: "suseong", label: "수성구" },
      { id: "dalseo", label: "달서구" },
      { id: "dalseong", label: "달성군" },
      { id: "gunwi", label: "군위군" },
      ...common,
    ];
  }
  return [
    { id: "east", label: "포항·경주" },
    { id: "west", label: "구미·김천·칠곡" },
    { id: "daegu-adj", label: "경산·영천" },
    { id: "andong", label: "안동·예천" },
    { id: "old", label: "오래된 상속" },
    ...common,
  ];
}
