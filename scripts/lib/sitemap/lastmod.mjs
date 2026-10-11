import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
export const LASTMOD_MANIFEST_FILE = path.join(DIR, "lastmod-manifest.json");

/**
 * 사이트맵 lastmod — 저장소에 버전 관리되는 URL별 manifest(lastmod-manifest.json)만 읽는다.
 *
 * - 파일 mtime·Git 로그·빌드 시각을 읽지 않는다. Cloudflare Pages는 매 배포마다 새로 clone하므로
 *   mtime을 쓰면 모든 URL의 lastmod가 배포일로 바뀐다(2026-10-11 진단).
 * - manifest에 없는 URL은 lastmod를 생략한다(loc는 그대로 사이트맵에 남는다).
 * - 형식이 틀리거나 미래이거나 2000년 이전인 값은 버리고 생략한다.
 * - manifest 갱신 절차: docs/sitemap-lastmod.md (로컬에서 scripts/update-lastmod-manifest.mjs 실행 후 커밋)
 */

/** YYYY-MM-DD — 알 수 없으면 null */
export function formatLastmod(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

/** 한국 시간 기준 오늘 날짜(YYYY-MM-DD). 미래 날짜 검증에만 쓴다. */
export function todayKst(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(now);
}

/** manifest 값 검증: 형식·실재하는 날짜·2000-01-01 이후·오늘(KST) 이전 */
export function validateLastmod(value, today = todayKst()) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) return null;
  if (value < "2000-01-01" || value > today) return null;
  return value;
}

export function readLastmodManifest(file = LASTMOD_MANIFEST_FILE) {
  try {
    if (!fs.existsSync(file)) return {};
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return parsed?.routes ?? {};
  } catch {
    return {};
  }
}

/** route → 검증된 lastmod 또는 null(생략) */
export function resolveLastmod(routes, routePath, today = todayKst()) {
  const value = routes[routePath];
  if (value === undefined) return null;
  const valid = validateLastmod(value, today);
  if (!valid) console.warn(`[sitemap:lastmod] ${routePath}: 잘못된 lastmod "${value}" — 생략`);
  return valid;
}

const ROUTES = readLastmodManifest();

/** route path → lastmod (YYYY-MM-DD) | null */
export function getLastmodForPath(routePath) {
  return resolveLastmod(ROUTES, routePath);
}
