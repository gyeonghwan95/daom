#!/usr/bin/env node
/**
 * sitemap 구조·Tier·도메인·XML·manifest 일치 검증
 * prebuild(public/) 또는 postbuild(out/) 모두 지원
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./lib/site-url.mjs";
import { TIER_FILES, TIER1_REQUIRED } from "./lib/sitemap/tiers.mjs";
import {
  assertValidXmlPrologue,
  parseLocTags,
} from "./lib/sitemap/xml.mjs";
import {
  decodeUrlPath,
  normalizeRoutePath,
  pathToAbsoluteUrl,
  assertCanonicalSiteUrl,
} from "./lib/sitemap/urls.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = getSiteUrl().replace(/\/$/, "");
const OUT_ROOT = process.argv.includes("--out")
  ? path.join(ROOT, "out")
  : path.join(ROOT, "public");
const MANIFEST = path.join(ROOT, "scripts/output/sitemap-manifest.json");

function fail(message) {
  console.error(`[sitemap:validate] ERROR: ${message}`);
  process.exit(1);
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`missing file: ${path.relative(ROOT, filePath)}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function main() {
  const indexPath = path.join(OUT_ROOT, "sitemap.xml");
  const indexXml = read(indexPath);
  assertValidXmlPrologue(indexXml);

  if (!indexXml.includes("<sitemapindex")) {
    fail("sitemap.xml must be a sitemap index (<sitemapindex>)");
  }

  if (indexXml.includes("<priority>") || indexXml.includes("<changefreq>")) {
    fail("sitemap must not include priority or changefreq");
  }

  const indexLocs = parseLocTags(indexXml);
  if (indexLocs.length === 0) {
    fail("sitemap index has no sub-sitemaps");
  }

  if (!fs.existsSync(MANIFEST)) {
    fail("scripts/output/sitemap-manifest.json not found — run npm run sitemap:generate");
  }

  const manifest = JSON.parse(read(MANIFEST));

  if (manifest.siteUrl !== SITE) {
    fail(`manifest siteUrl mismatch: ${manifest.siteUrl} vs ${SITE}`);
  }

  const allUrls = new Set();
  let totalFromFiles = 0;
  const tierCountsFromFiles = {};

  for (const sub of manifest.subSitemaps) {
    const rel = sub.filename;
    const tier = Object.entries(TIER_FILES).find(([, f]) => f === rel)?.[0];
    const filePath = path.join(OUT_ROOT, "sitemaps", rel);
    const xml = read(filePath);
    assertValidXmlPrologue(xml);

    if (!xml.includes("<urlset")) {
      fail(`${rel} must be a urlset sitemap`);
    }

    const locs = parseLocTags(xml);
    if (locs.length !== sub.count) {
      fail(`${rel}: file has ${locs.length} URLs, manifest expects ${sub.count}`);
    }

    if (locs.length > 50000) {
      fail(`${rel}: exceeds 50,000 URL limit`);
    }

    if (Buffer.byteLength(xml, "utf8") > 50 * 1024 * 1024) {
      fail(`${rel}: exceeds 50MB size limit`);
    }

    tierCountsFromFiles[tier] = locs.length;
    totalFromFiles += locs.length;

    for (const loc of locs) {
      assertCanonicalSiteUrl(loc);
      if (allUrls.has(loc)) {
        fail(`duplicate URL across sitemaps: ${loc}`);
      }
      allUrls.add(loc);

      const decoded = normalizeRoutePath(decodeUrlPath(loc, SITE));
      const expected = pathToAbsoluteUrl(decoded, SITE);
      if (loc !== expected) {
        fail(`encoding mismatch for ${decoded}: expected ${expected}, got ${loc}`);
      }
    }
  }

  if (totalFromFiles !== manifest.totalUrls) {
    fail(`total URL count mismatch: files ${totalFromFiles}, manifest ${manifest.totalUrls}`);
  }

  for (const required of TIER1_REQUIRED) {
    const loc = pathToAbsoluteUrl(required, SITE);
    if (!allUrls.has(loc)) {
      fail(`missing Tier 1 URL: ${required}`);
    }
  }

  const indexSubPaths = indexLocs.map((loc) => loc.replace(`${SITE}/`, ""));
  for (const sub of manifest.subSitemaps) {
    const expectedLoc = `${SITE}/sitemaps/${sub.filename}`;
    if (!indexLocs.includes(expectedLoc)) {
      fail(`sitemap index missing sub-sitemap: ${expectedLoc}`);
    }
  }

  if (indexLocs.length !== manifest.subSitemaps.length) {
    fail(
      `index sub-sitemap count mismatch: index ${indexLocs.length}, manifest ${manifest.subSitemaps.length}`,
    );
  }

  const robotsPath = path.join(OUT_ROOT, "robots.txt");
  if (fs.existsSync(robotsPath)) {
    const robots = read(robotsPath);
    if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) {
      fail(`robots.txt must include: Sitemap: ${SITE}/sitemap.xml`);
    }
  }

  console.log(`[sitemap:validate] OK — ${totalFromFiles} URLs in ${manifest.subSitemaps.length} tier sitemaps`);
  console.log("[sitemap:validate] Tier counts:", tierCountsFromFiles);
  if (manifest.excluded?.length) {
    console.log(`[sitemap:validate] excluded ${manifest.excluded.length} paths (see sitemap-manifest.json)`);
  }
}

main();
