#!/usr/bin/env node
/**
 * Tier 기반 sitemap 생성
 *   public/sitemap.xml          — 전체 URL urlset (GSC 제출용, 발견 카운트 안정)
 *   public/sitemaps/tier-*.xml  — Tier별 분할
 *   public/sitemaps/index.xml   — Tier 인덱스(선택 제출용)
 *   scripts/output/sitemap-manifest.json
 *
 * GSC가 sitemapindex만 "성공"으로 읽고 child를 집계하지 않아
 * 발견 페이지 0으로 남는 사례가 있어, 루트는 urlset으로 둔다.
 * (URL 수는 50k 미만이므로 단일 파일이 프로토콜상 안전하다.)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./lib/site-url.mjs";
import { collectSitemapEntries, groupEntriesByTier } from "./lib/sitemap/collect.mjs";
import { TIER_FILES } from "./lib/sitemap/tiers.mjs";
import { buildSitemapIndexXml, buildUrlSetXml } from "./lib/sitemap/xml.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const SITEMAPS_DIR = path.join(PUBLIC_DIR, "sitemaps");
const MANIFEST = path.join(ROOT, "scripts/output/sitemap-manifest.json");
const SITE = getSiteUrl().replace(/\/$/, "");

function maxLastmod(entries) {
  const dates = entries.map((e) => e.lastmod).filter(Boolean);
  if (dates.length === 0) return null;
  return dates.sort().at(-1);
}

function main() {
  const { entries, excluded } = collectSitemapEntries();
  const byTier = groupEntriesByTier(entries);

  fs.mkdirSync(SITEMAPS_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });

  const indexSitemaps = [];
  const tierStats = {};

  for (const [tierKey, filename] of Object.entries(TIER_FILES)) {
    const tier = Number(tierKey);
    const tierEntries = byTier[tier] ?? [];

    if (tierEntries.length === 0) {
      console.warn(`[sitemap:generate] Tier ${tier} (${filename}) — 0 URLs, skipping file`);
      continue;
    }

    const xml = buildUrlSetXml(tierEntries);
    const outPath = path.join(SITEMAPS_DIR, filename);
    fs.writeFileSync(outPath, xml, "utf8");

    const subLoc = `${SITE}/sitemaps/${filename}`;
    indexSitemaps.push({
      loc: subLoc,
      lastmod: maxLastmod(tierEntries),
      filename,
      count: tierEntries.length,
    });

    tierStats[tier] = tierEntries.length;
    console.log(`[sitemap:generate] ${filename} — ${tierEntries.length} URLs`);
  }

  // GSC 제출 루트: 전체 URL을 한 urlset에 넣어 바로 파싱되게 한다.
  const rootXml = buildUrlSetXml(entries);
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), rootXml, "utf8");

  // Tier 인덱스(보조). 루트 sitemap.xml 과 혼동되지 않도록 /sitemaps/index.xml 에만 둔다.
  const tierIndexXml = buildSitemapIndexXml(
    indexSitemaps.map(({ loc, lastmod }) => ({ loc, lastmod })),
  );
  fs.writeFileSync(path.join(SITEMAPS_DIR, "index.xml"), tierIndexXml, "utf8");

  const manifest = {
    generatedAt: new Date().toISOString(),
    siteUrl: SITE,
    totalUrls: entries.length,
    format: "urlset",
    tierCounts: tierStats,
    excluded: excluded.sort((a, b) => a.path.localeCompare(b.path, "ko")),
    sitemapIndex: `${SITE}/sitemap.xml`,
    tierSitemapIndex: `${SITE}/sitemaps/index.xml`,
    subSitemaps: indexSitemaps,
    entries: entries.map(({ path: routePath, tier, loc, lastmod }) => ({
      path: routePath,
      tier,
      loc,
      lastmod,
    })),
  };

  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(
    `[sitemap:generate] root urlset → public/sitemap.xml (${entries.length} URLs)`,
  );
  console.log(
    `[sitemap:generate] tier index → public/sitemaps/index.xml (${indexSitemaps.length} sub-sitemaps)`,
  );
  console.log(`[sitemap:generate] total ${entries.length} URLs, excluded ${excluded.length}`);
}

main();
