#!/usr/bin/env node
/**
 * Tier 기반 sitemap 인덱스 + 하위 sitemap XML 생성
 *   public/sitemap.xml
 *   public/sitemaps/tier-*.xml
 *   scripts/output/sitemap-manifest.json
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

  const indexXml = buildSitemapIndexXml(
    indexSitemaps.map(({ loc, lastmod }) => ({ loc, lastmod })),
  );
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), indexXml, "utf8");

  const manifest = {
    generatedAt: new Date().toISOString(),
    siteUrl: SITE,
    totalUrls: entries.length,
    tierCounts: tierStats,
    excluded: excluded.sort((a, b) => a.path.localeCompare(b.path, "ko")),
    sitemapIndex: `${SITE}/sitemap.xml`,
    subSitemaps: indexSitemaps,
    entries: entries.map(({ path: routePath, tier, loc, lastmod }) => ({
      path: routePath,
      tier,
      loc,
      lastmod,
    })),
  };

  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`[sitemap:generate] index → public/sitemap.xml (${indexSitemaps.length} sub-sitemaps)`);
  console.log(`[sitemap:generate] total ${entries.length} URLs, excluded ${excluded.length}`);
}

main();
