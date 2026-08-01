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

function assertUrlEntry(loc, allUrls) {
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

function main() {
  const rootPath = path.join(OUT_ROOT, "sitemap.xml");
  const rootXml = read(rootPath);
  assertValidXmlPrologue(rootXml);

  // GSC 발견 0 이슈 회피: 루트는 urlset(전체 URL). sitemapindex는 /sitemaps/index.xml 보조.
  if (!rootXml.includes("<urlset")) {
    fail("sitemap.xml must be a urlset (<urlset>) listing all indexable URLs");
  }
  if (rootXml.includes("<sitemapindex")) {
    fail("sitemap.xml must not be a sitemapindex — use public/sitemaps/index.xml for tier index");
  }

  if (rootXml.includes("<priority>") || rootXml.includes("<changefreq>")) {
    fail("sitemap must not include priority or changefreq");
  }

  const rootLocs = parseLocTags(rootXml);
  if (rootLocs.length === 0) {
    fail("sitemap.xml urlset has no URLs");
  }

  if (rootLocs.length > 50000) {
    fail(`sitemap.xml exceeds 50,000 URL limit (${rootLocs.length})`);
  }

  if (Buffer.byteLength(rootXml, "utf8") > 50 * 1024 * 1024) {
    fail("sitemap.xml exceeds 50MB size limit");
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

  for (const loc of rootLocs) {
    assertUrlEntry(loc, allUrls);
  }

  if (rootLocs.length !== manifest.totalUrls) {
    fail(
      `root sitemap URL count mismatch: file ${rootLocs.length}, manifest ${manifest.totalUrls}`,
    );
  }

  const tierUrls = new Set();
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
      if (tierUrls.has(loc)) {
        fail(`duplicate URL across tier sitemaps: ${loc}`);
      }
      tierUrls.add(loc);

      if (!allUrls.has(loc)) {
        fail(`tier sitemap URL missing from root sitemap.xml: ${loc}`);
      }

      const decoded = normalizeRoutePath(decodeUrlPath(loc, SITE));
      const expected = pathToAbsoluteUrl(decoded, SITE);
      if (loc !== expected) {
        fail(`encoding mismatch for ${decoded}: expected ${expected}, got ${loc}`);
      }
    }
  }

  if (totalFromFiles !== manifest.totalUrls) {
    fail(`total URL count mismatch: tier files ${totalFromFiles}, manifest ${manifest.totalUrls}`);
  }

  if (tierUrls.size !== allUrls.size) {
    fail(
      `root vs tier URL set size mismatch: root ${allUrls.size}, tiers ${tierUrls.size}`,
    );
  }

  for (const required of TIER1_REQUIRED) {
    const loc = pathToAbsoluteUrl(required, SITE);
    if (!allUrls.has(loc)) {
      fail(`missing Tier 1 URL: ${required}`);
    }
  }

  const tierIndexPath = path.join(OUT_ROOT, "sitemaps", "index.xml");
  const tierIndexXml = read(tierIndexPath);
  assertValidXmlPrologue(tierIndexXml);
  if (!tierIndexXml.includes("<sitemapindex")) {
    fail("sitemaps/index.xml must be a sitemap index (<sitemapindex>)");
  }
  const tierIndexLocs = parseLocTags(tierIndexXml);
  for (const sub of manifest.subSitemaps) {
    const expectedLoc = `${SITE}/sitemaps/${sub.filename}`;
    if (!tierIndexLocs.includes(expectedLoc)) {
      fail(`tier sitemap index missing sub-sitemap: ${expectedLoc}`);
    }
  }
  if (tierIndexLocs.length !== manifest.subSitemaps.length) {
    fail(
      `tier index sub-sitemap count mismatch: index ${tierIndexLocs.length}, manifest ${manifest.subSitemaps.length}`,
    );
  }

  const robotsPath = path.join(OUT_ROOT, "robots.txt");
  if (fs.existsSync(robotsPath)) {
    const robots = read(robotsPath);
    if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) {
      fail(`robots.txt must include: Sitemap: ${SITE}/sitemap.xml`);
    }
  }

  console.log(
    `[sitemap:validate] OK — root urlset ${rootLocs.length} URLs + ${manifest.subSitemaps.length} tier sitemaps`,
  );
  console.log("[sitemap:validate] Tier counts:", tierCountsFromFiles);
  if (manifest.excluded?.length) {
    console.log(`[sitemap:validate] excluded ${manifest.excluded.length} paths (see sitemap-manifest.json)`);
  }
}

main();
