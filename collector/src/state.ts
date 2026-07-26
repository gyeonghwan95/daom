/**
 * 상태 저장 — collector/data/state.json.
 *
 * 공개 저장소에 DB를 커밋하지 않는다 (collector/data는 .gitignore 대상).
 * GitHub Actions에서는 actions/cache로 실행 간 상태를 유지한다.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { CollectionRun, CollectorState } from "./types";

const DEFAULT_STATE_PATH = join(process.cwd(), "collector", "data", "state.json");
const MAX_RUNS = 200;
/** 마감 후 30일 지난 공고는 상태에서 정리한다. */
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

export function statePath(): string {
  return process.env.BID_STATE_PATH?.trim() || DEFAULT_STATE_PATH;
}

export function loadState(path: string = statePath()): CollectorState {
  if (!existsSync(path)) {
    return { version: 1, opportunities: {}, runs: [] };
  }
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as CollectorState;
    if (parsed.version !== 1 || typeof parsed.opportunities !== "object") {
      throw new Error("unexpected state shape");
    }
    return parsed;
  } catch {
    // 손상된 상태 파일은 새로 시작한다 (수집 자체를 중단하지 않는다).
    return { version: 1, opportunities: {}, runs: [] };
  }
}

export function saveState(state: CollectorState, path: string = statePath()): void {
  mkdirSync(dirname(path), { recursive: true });
  const pruned = pruneState(state);
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, JSON.stringify(pruned, null, 2), "utf8");
  renameSync(tmp, path);
}

function pruneState(state: CollectorState): CollectorState {
  const cutoff = Date.now() - RETENTION_MS;
  const opportunities: CollectorState["opportunities"] = {};
  for (const [id, opp] of Object.entries(state.opportunities)) {
    const lastSeen = Date.parse(opp.lastSeenAt);
    if (Number.isFinite(lastSeen) && lastSeen < cutoff) continue;
    opportunities[id] = opp;
  }
  return {
    ...state,
    opportunities,
    runs: state.runs.slice(-MAX_RUNS),
  };
}

export function appendRuns(state: CollectorState, runs: CollectionRun[]): void {
  state.runs.push(...runs);
  if (state.runs.length > MAX_RUNS) {
    state.runs = state.runs.slice(-MAX_RUNS);
  }
}

/** 소스별 마지막 정상 수집 시각 (실패 안내용) */
export function lastSuccessAt(state: CollectorState, sourceId: string): string | undefined {
  for (let i = state.runs.length - 1; i >= 0; i -= 1) {
    const run = state.runs[i];
    if (run.sourceId === sourceId && run.status === "success") {
      return run.startedAt;
    }
  }
  return undefined;
}
