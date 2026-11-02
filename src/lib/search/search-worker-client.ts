"use client";

import { runSearchQuery, searchHitsMatch } from "./run-search-query";
import type { SearchSiteOptions } from "./search-site";
import type { SearchIndexItem, SearchResult } from "./types";

type WorkerResultMessage = {
  type: "result";
  id: number;
  query: string;
  hits: SearchResult[];
  total: number;
  ready: boolean;
};

type PendingJob = {
  id: number;
  query: string;
  resolve: (value: { hits: SearchResult[]; total: number } | null) => void;
};

let worker: Worker | null | undefined;
let postedIndex: SearchIndexItem[] | null = null;
let nextId = 1;
const pending = new Map<number, PendingJob>();

function handleWorkerMessage(event: MessageEvent<WorkerResultMessage>) {
  const data = event.data;
  if (!data || data.type !== "result") return;
  const job = pending.get(data.id);
  if (!job) return;
  pending.delete(data.id);
  if (!data.ready || data.query !== job.query) {
    job.resolve(null);
    return;
  }
  job.resolve({ hits: data.hits, total: data.total });
}

function disableWorker() {
  for (const job of pending.values()) job.resolve(null);
  pending.clear();
  postedIndex = null;
  if (worker) {
    worker.terminate();
  }
  worker = null;
}

function getSearchWorker(): Worker | null {
  if (typeof window === "undefined") return null;
  if (worker !== undefined) return worker;
  if (typeof Worker === "undefined") {
    worker = null;
    return null;
  }
  try {
    const nextWorker = new Worker(
      new URL("./search-score.worker.ts", import.meta.url),
      { type: "module" },
    );
    nextWorker.onmessage = handleWorkerMessage;
    nextWorker.onerror = () => {
      disableWorker();
    };
    worker = nextWorker;
    return nextWorker;
  } catch {
    worker = null;
    return null;
  }
}

function ensureWorkerIndex(target: Worker, index: SearchIndexItem[]) {
  if (postedIndex === index) return;
  target.postMessage({ type: "setIndex", index });
  postedIndex = index;
}

function requestWorkerSearch(
  target: Worker,
  query: string,
  options: SearchSiteOptions,
): Promise<{ hits: SearchResult[]; total: number } | null> {
  const id = nextId;
  nextId += 1;
  return new Promise((resolve) => {
    pending.set(id, { id, query, resolve });
    target.postMessage({ type: "search", id, query, options });
  });
}

/**
 * 워커가 있으면 채점은 워커에서 하고, 같은 질의의 href·score가
 * 현재 함수(runSearchQuery)와 같을 때만 워커 결과를 쓴다.
 * 워커가 없거나 불일치면 메인 스레드 채점.
 */
export async function scoreSearchOffMain(
  index: SearchIndexItem[],
  query: string,
  options: SearchSiteOptions = {},
): Promise<{ hits: SearchResult[]; total: number; source: "worker" | "main" }> {
  const target = getSearchWorker();
  if (!target) {
    const expected = runSearchQuery(index, query, options);
    return { hits: expected.hits, total: expected.total, source: "main" };
  }

  ensureWorkerIndex(target, index);
  const workerResultPromise = requestWorkerSearch(target, query, options);
  const expected = runSearchQuery(index, query, options);
  const workerResult = await workerResultPromise;
  if (
    workerResult &&
    workerResult.total === expected.total &&
    searchHitsMatch(workerResult.hits, expected.hits)
  ) {
    return { hits: workerResult.hits, total: workerResult.total, source: "worker" };
  }

  return { hits: expected.hits, total: expected.total, source: "main" };
}
