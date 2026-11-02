/// <reference lib="webworker" />

import { runSearchQuery } from "./run-search-query";
import type { SearchSiteOptions } from "./search-site";
import type { SearchIndexItem } from "./types";

let index: SearchIndexItem[] | null = null;

type WorkerInbound =
  | { type: "setIndex"; index: SearchIndexItem[] }
  | {
      type: "search";
      id: number;
      query: string;
      options?: SearchSiteOptions;
    };

self.onmessage = (event: MessageEvent<WorkerInbound>) => {
  const data = event.data;
  if (data.type === "setIndex") {
    index = data.index;
    return;
  }

  if (data.type !== "search") return;

  if (!index) {
    self.postMessage({
      type: "result",
      id: data.id,
      query: data.query,
      hits: [],
      total: 0,
      ready: false,
    });
    return;
  }

  const result = runSearchQuery(index, data.query, data.options ?? {});
  self.postMessage({
    type: "result",
    id: data.id,
    query: data.query,
    hits: result.hits,
    total: result.total,
    ready: true,
  });
};
