import { buildSearchIntentContent } from "./factory";
import { searchIntentSeeds } from "./seeds";
import type { SearchIntentContent } from "./types";
import { 부산등기복대리Override } from "./overrides/busan-subproxy";
import { 부산집단등기Override } from "./overrides/busan-mass-registry";

export type {
  SearchGuideEntry,
  SearchIntentCategory,
  SearchIntentContent,
  SearchIntentSeed,
} from "./types";

export {
  getAllSearchGuideEntries,
  getSearchGuideCategoryLabel,
  getSearchGuideEntriesByCategory,
} from "./hub-catalog";

export { searchIntentSeeds } from "./seeds";
export { subproxyJurisdictionData } from "./overrides/busan-subproxy";

const CONTENT_OVERRIDES: Record<string, SearchIntentContent> = {
  부산등기복대리: 부산등기복대리Override,
  부산집단등기: 부산집단등기Override,
};

const contentCache = new Map<string, SearchIntentContent>();

function ensureCache(): Map<string, SearchIntentContent> {
  if (contentCache.size === 0) {
    for (const seed of searchIntentSeeds) {
      contentCache.set(
        seed.slug,
        CONTENT_OVERRIDES[seed.slug] ?? buildSearchIntentContent(seed),
      );
    }
  }
  return contentCache;
}

export function getSearchIntentContent(
  key: string,
): SearchIntentContent | undefined {
  return ensureCache().get(key);
}

export function getAllSearchIntentSlugs(): string[] {
  return searchIntentSeeds.map((s) => s.slug);
}

export function getAllSearchIntentContents(): SearchIntentContent[] {
  return [...ensureCache().values()];
}
