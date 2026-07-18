import { buildCourtEntries } from "./courts";
import { DISTRICT_METAS } from "./districts";
import { buildIndustrialEntries } from "./industrial";
import { buildLivingAreaEntries } from "./living-areas";
import type { CaseRegionEntry, DistrictKey, DistrictMeta } from "./types";

export type * from "./types";
export { DISTRICT_METAS } from "./districts";

function dongSlug(dongName: string): string {
  return `부산${dongName}법무사`;
}

function buildDistrictTree(): CaseRegionEntry[] {
  const entries: CaseRegionEntry[] = [];

  entries.push({
    slug: "부산법무사",
    name: "부산",
    displayName: "부산",
    kind: "city",
    parentDistrictKey: null,
    traits: ["commercial", "residential", "coastal"],
    keywords: ["부산 법무사", "부산법무사", "부산 업무 사례"],
    context:
      "해운대·센텀 사무소를 기준으로 부산 전역의 상속등기·부동산등기·법인등기·개인회생 상담을 진행합니다. 구·군과 생활권마다 관할·일정이 달라 지역 맥락을 함께 확인합니다.",
    indexable: true,
  });

  for (const district of DISTRICT_METAS) {
    entries.push({
      slug: district.slug,
      name: district.name,
      displayName: district.name,
      kind: "district",
      parentDistrictKey: district.key,
      traits: district.traits,
      keywords: [
        `${district.name} 법무사`,
        `부산 ${district.name} 법무사`,
        district.name,
      ],
      context: district.context,
      indexable: true,
    });

    for (const dong of district.dongs) {
      entries.push({
        slug: dongSlug(dong),
        name: dong,
        displayName: `부산 ${dong}`,
        kind: district.key === "gijang" ? "living" : "dong",
        parentDistrictKey: district.key,
        traits: district.traits.slice(0, 3),
        keywords: [dong, `부산 ${dong}`, `${dong} 법무사`],
        context: `${district.name} ${dong} 일대는 ${district.context}`,
        indexable: true,
      });
    }

    for (const admin of district.adminDongs ?? []) {
      const baseDong = admin.replace(/\d+동$/, "동");
      entries.push({
        slug: dongSlug(admin),
        name: admin,
        displayName: `부산 ${admin}`,
        kind: "admin-dong",
        parentDistrictKey: district.key,
        traits: district.traits.slice(0, 2),
        keywords: [admin, `부산 ${admin}`, `${admin} 법무사`],
        context: `${district.name} ${admin}은(는) ${baseDong} 생활권의 행정동으로, 주거 밀집지의 이전·상속등기 상담이 이어집니다.`,
        indexable: false,
        canonicalSlug: dongSlug(baseDong),
      });
    }
  }

  return entries;
}

let cached: CaseRegionEntry[] | null = null;
let bySlugCache: Map<string, CaseRegionEntry> | null = null;

export function getAllCaseRegionEntries(): CaseRegionEntry[] {
  if (cached) return cached;
  const merged = [
    ...buildDistrictTree(),
    ...buildLivingAreaEntries(),
    ...buildIndustrialEntries(),
    ...buildCourtEntries(),
  ];

  const seen = new Set<string>();
  const unique: CaseRegionEntry[] = [];
  for (const entry of merged) {
    if (seen.has(entry.slug)) continue;
    seen.add(entry.slug);
    unique.push(entry);
  }
  cached = unique;
  return unique;
}

export function getCaseRegionBySlug(slug: string): CaseRegionEntry | undefined {
  if (!bySlugCache) {
    bySlugCache = new Map(
      getAllCaseRegionEntries().map((entry) => [entry.slug, entry]),
    );
  }
  return bySlugCache.get(slug);
}

export function getIndexableCaseRegions(): CaseRegionEntry[] {
  return getAllCaseRegionEntries().filter((entry) => {
    if (!entry.indexable) return false;
    if (entry.canonicalSlug && entry.canonicalSlug !== entry.slug) return false;
    return true;
  });
}

export function getDistrictMeta(key: DistrictKey): DistrictMeta | undefined {
  return DISTRICT_METAS.find((d) => d.key === key);
}

export function getChildrenOfDistrict(key: DistrictKey): CaseRegionEntry[] {
  return getIndexableCaseRegions().filter(
    (entry) =>
      entry.parentDistrictKey === key &&
      entry.kind !== "district" &&
      entry.kind !== "city",
  );
}

export function getRelatedRegions(
  entry: CaseRegionEntry,
  limit = 6,
): CaseRegionEntry[] {
  const all = getIndexableCaseRegions();
  const related: CaseRegionEntry[] = [];

  if (entry.parentDistrictKey) {
    const parent = all.find(
      (e) =>
        e.kind === "district" && e.parentDistrictKey === entry.parentDistrictKey,
    );
    if (parent && parent.slug !== entry.slug) related.push(parent);

    const siblings = all.filter(
      (e) =>
        e.parentDistrictKey === entry.parentDistrictKey &&
        e.slug !== entry.slug &&
        e.kind !== "district",
    );
    related.push(...siblings.slice(0, limit));
  } else if (entry.kind === "city") {
    related.push(...all.filter((e) => e.kind === "district").slice(0, limit));
  }

  const deduped = [...new Map(related.map((r) => [r.slug, r])).values()];
  return deduped.slice(0, limit);
}

export function caseRegionPath(slug: string): string {
  return `/업무사례/${slug}`;
}

export function searchCaseRegions(query: string): CaseRegionEntry[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, "");
  if (!q) return [];
  return getIndexableCaseRegions()
    .filter((entry) => {
      const hay = [entry.name, entry.displayName, entry.slug, ...entry.keywords]
        .join(" ")
        .toLowerCase()
        .replace(/\s+/g, "");
      return hay.includes(q);
    })
    .slice(0, 40);
}
