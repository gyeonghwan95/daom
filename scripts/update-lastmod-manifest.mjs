#!/usr/bin/env node
/**
 * 사이트맵 lastmod manifest 갱신 — 로컬 전용(Cloudflare 빌드에서는 실행하지 않는다).
 * 절차: docs/sitemap-lastmod.md
 *
 *   npm run build                                   # out/ 생성
 *   node scripts/update-lastmod-manifest.mjs        # 지문이 바뀐 URL만 오늘(KST) 날짜로 갱신
 *   node scripts/update-lastmod-manifest.mjs --date 2026-10-11
 *   node scripts/update-lastmod-manifest.mjs --paths /부산상속포기,/한정승인기간 --date 2026-10-11
 *   node scripts/update-lastmod-manifest.mjs --dry-run
 *
 * 바뀐 URL이 사이트맵의 25%를 넘으면 공통 템플릿 변경일 가능성이 커서 중단한다(--allow-mass로 강제).
 * 결과 파일(커밋 대상): scripts/lib/sitemap/lastmod-manifest.json, scripts/lib/sitemap/lastmod-fingerprints.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LASTMOD_MANIFEST_FILE, todayKst, validateLastmod } from "./lib/sitemap/lastmod.mjs";
import { applyFingerprintUpdate, buildFingerprints, extractPageText } from "./lib/sitemap/page-fingerprint.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
export const FINGERPRINT_FILE = path.join(ROOT, "scripts/lib/sitemap/lastmod-fingerprints.json");
const MASS_SHARE = 0.25;

const args = process.argv.slice(2);
const arg = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
const date = arg("--date") ?? todayKst();
const explicitPaths = arg("--paths")?.split(",").map((p) => p.trim().normalize("NFC")).filter(Boolean);
const dryRun = args.includes("--dry-run");

if (!validateLastmod(date)) {
  console.error(`잘못된 날짜이거나 미래 날짜입니다: ${date}`);
  process.exit(1);
}
if (!fs.existsSync(path.join(OUT, "sitemap.xml"))) {
  console.error("out/sitemap.xml이 없습니다. 먼저 npm run build를 실행하세요.");
  process.exit(1);
}

const sortObj = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
const readJson = (f, fallback) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : fallback);

// 사이트맵에 실린 URL만 대상
const sitemapRoutes = [...fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const p = decodeURI(new URL(m[1]).pathname).normalize("NFC");
  return p.length > 1 ? p.replace(/\/$/, "") : "/";
});
const htmlFor = (route) => {
  const candidates = route === "/" ? ["index.html"] : [`${route.slice(1)}.html`, `${route.slice(1)}/index.html`];
  for (const c of candidates) {
    const f = path.join(OUT, c);
    if (fs.existsSync(f)) return fs.readFileSync(f, "utf8");
  }
  return null;
};
const pages = {};
for (const r of sitemapRoutes) {
  const html = htmlFor(r);
  if (html) pages[r] = extractPageText(html);
}
const current = buildFingerprints(pages);

const manifest = readJson(LASTMOD_MANIFEST_FILE, { routes: {} });
const previous = readJson(FINGERPRINT_FILE, { fingerprints: {} }).fingerprints;

let result;
if (explicitPaths) {
  const unknown = explicitPaths.filter((p) => !current[p]);
  if (unknown.length) {
    console.error(`사이트맵에 없는 경로: ${unknown.join(", ")}`);
    process.exit(1);
  }
  const routes = { ...manifest.routes };
  for (const p of explicitPaths) routes[p] = date;
  result = applyFingerprintUpdate({ previous, routes, current, date, onlyRoutes: new Set(explicitPaths) });
  result.routes = routes;
  result.changed = explicitPaths;
} else {
  result = applyFingerprintUpdate({ previous, routes: manifest.routes, current, date });
  const share = result.changed.length / Math.max(1, Object.keys(current).length);
  if (Object.keys(previous).length && share > MASS_SHARE && !args.includes("--allow-mass")) {
    console.error(
      `바뀐 URL ${result.changed.length}개(${(share * 100).toFixed(1)}%) — 공통 템플릿 변경일 수 있어 중단합니다. ` +
        "실제로 본문이 바뀐 URL만 --paths로 지정하거나, 확인 후 --allow-mass를 쓰세요.",
    );
    process.exit(2);
  }
}

console.log(`date ${date} · changed ${result.changed.length} · new routes(no date) ${result.added.length} · sitemap routes ${Object.keys(current).length}`);
if (result.changed.length) console.log("changed sample:", result.changed.slice(0, 10).join(" "));
if (!dryRun) {
  fs.writeFileSync(
    LASTMOD_MANIFEST_FILE,
    JSON.stringify({ note: manifest.note ?? "", routes: sortObj(result.routes) }, null, 1) + "\n",
  );
  fs.writeFileSync(FINGERPRINT_FILE, JSON.stringify({ fingerprints: sortObj(result.fingerprints) }, null, 0) + "\n");
  console.log("written: lastmod-manifest.json, lastmod-fingerprints.json");
}
