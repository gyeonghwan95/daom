"use client";

import { useEffect, useState } from "react";
import { loadSearchIndex } from "./load-search-index";
import { scoreSearchOffMain } from "./search-worker-client";
import type { SearchCategoryFilter, SearchIndexItem, SearchResult } from "./types";

type UseSiteSearchOptions = {
  query: string;
  filter?: SearchCategoryFilter;
  limit?: number;
  enabled: boolean;
};

export function useSiteSearch({
  query,
  filter = "all",
  limit,
  enabled,
}: UseSiteSearchOptions): {
  results: SearchResult[];
  totalCount: number;
  loading: boolean;
} {
  const [index, setIndex] = useState<SearchIndexItem[] | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [appliedKey, setAppliedKey] = useState("");

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void loadSearchIndex().then((items) => {
      if (!cancelled) setIndex(items);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const requestKey = `${query}\0${filter}\0${limit ?? ""}`;

  useEffect(() => {
    if (!enabled || !index) return;

    if (!query) {
      setResults([]);
      setTotalCount(0);
      setAppliedKey(requestKey);
      return;
    }

    let cancelled = false;
    void scoreSearchOffMain(index, query, { limit, filter }).then((result) => {
      if (cancelled) return;
      setResults(result.hits);
      setTotalCount(result.total);
      setAppliedKey(requestKey);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, index, query, filter, limit, requestKey]);

  const loading =
    enabled && (!index || (Boolean(query) && appliedKey !== requestKey));

  return { results, totalCount, loading };
}
