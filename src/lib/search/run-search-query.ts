import { countSearchResults, searchSite, type SearchSiteOptions } from "./search-site";
import type { SearchIndexItem, SearchResult } from "./types";

export type SearchQueryResult = {
  query: string;
  hits: SearchResult[];
  total: number;
};

/** 워커와 메인 스레드가 같이 쓰는 채점 진입점. 점수는 search-site.ts 그대로다. */
export function runSearchQuery(
  items: SearchIndexItem[],
  query: string,
  options: SearchSiteOptions = {},
): SearchQueryResult {
  return {
    query,
    hits: searchSite(items, query, options),
    total: countSearchResults(items, query, options.filter ?? "all"),
  };
}

export function searchHitsMatch(
  a: Pick<SearchResult, "href" | "score">[],
  b: Pick<SearchResult, "href" | "score">[],
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].href !== b[i].href || a[i].score !== b[i].score) return false;
  }
  return true;
}
