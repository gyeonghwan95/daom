import type { SearchIndexItem } from "./types";

let loadPromise: Promise<SearchIndexItem[]> | null = null;

/** 검색을 열 때 한 번만 JSON을 불러 재사용한다. */
export function loadSearchIndex(): Promise<SearchIndexItem[]> {
  if (!loadPromise) {
    loadPromise = import("@/generated/search-index.json").then(
      (data) => (data.default ?? data) as SearchIndexItem[],
    );
  }
  return loadPromise;
}
