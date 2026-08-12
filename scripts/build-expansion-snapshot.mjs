#!/usr/bin/env node
/**
 * Full indexable SEO snapshot for expansion safety checks.
 *
 * Usage:
 *   node scripts/build-expansion-snapshot.mjs --before
 *   node scripts/build-expansion-snapshot.mjs --after
 *   node scripts/build-expansion-snapshot.mjs --diff
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS = path.join(ROOT, "reports", "seo");
const BEFORE = path.join(REPORTS, "pre-expansion-snapshot.json");
const AFTER = path.join(REPORTS, "post-expansion-snapshot.json");
const MANIFEST = path.join(ROOT, "scripts", "output", "seo-pages-manifest.json");
const PATHS_JSON = path.join(ROOT, "scripts", "output", "seo-paths.json");
const PROTECTED = path.join(ROOT, "config", "seo-protected-assets.json");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");

const args = new Set(process.argv.slice(2));

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function normalizePath(p) {
  if (!p) return "/";
  let s = String(p).split("?")[0].split("#")[0];
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

function extractSitemapUrls() {
  if (!fs.existsSync(SITEMAP)) return [];
  const xml = fs.readFileSync(SITEMAP, "utf8");
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) {
    try {
      const u = new URL(m[1]);
      urls.push(normalizePath(decodeURIComponent(u.pathname)));
    } catch {
      /* ignore */
    }
  }
  return [...new Set(urls)].sort();
}

function protectedUrlSet(cfg) {
  const set = new Set();
  for (const p of cfg?.pages || []) {
    if (p.url) set.add(normalizePath(p.url));
  }
  for (const a of cfg?.assets || []) {
    if (a.path) set.add(normalizePath(a.path));
  }
  return set;
}

function bodyHash(page) {
  const seed = [
    page?.metaTitle,
    page?.h1,
    page?.metaDescription,
    ...(page?.internalLinks || []),
  ]
    .filter(Boolean)
    .join("|");
  return createHash("sha256").update(seed).digest("hex").slice(0, 16);
}

function buildSnapshot(label) {
  const manifest = readJson(MANIFEST);
  const seoPaths = readJson(PATHS_JSON);
  const protectedCfg = readJson(PROTECTED, { pages: [], assets: [] });
  const protectedUrls = protectedUrlSet(protectedCfg);
  const sitemapUrls = extractSitemapUrls();
  const paths = (seoPaths?.paths || []).map(normalizePath).sort();
  const byPath = new Map();
  for (const page of manifest?.pages || []) {
    byPath.set(normalizePath(page.path), page);
  }

  const pages = paths.map((url) => {
    const page = byPath.get(url);
    const isProtected = protectedUrls.has(url);
    return {
      url,
      title: page?.metaTitle ?? null,
      h1: page?.h1 ?? null,
      description: page?.metaDescription ?? null,
      canonical: page?.canonical ?? null,
      og: null,
      bodyHash: page ? bodyHash(page) : null,
      internalLinks: page?.internalLinks || [],
      relatedLinks: page?.relatedLinks || [],
      faqCount: page?.faqCount ?? null,
      indexability: page ? "indexable" : "missing-manifest",
      inSitemap: sitemapUrls.includes(url),
      performanceClass: isProtected ? "FULLY_PROTECTED" : "UNKNOWN_PERFORMANCE",
      presentInManifest: Boolean(page),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    label,
    source: "scripts/output/seo-paths.json + seo-pages-manifest.json",
    totalUrls: paths.length,
    sitemapUrlCount: sitemapUrls.length,
    protectedUrlCount: protectedUrls.size,
    pages,
  };
}

function diffSnapshots(before, after) {
  const bMap = new Map((before?.pages || []).map((p) => [p.url, p]));
  const aMap = new Map((after?.pages || []).map((p) => [p.url, p]));
  const allUrls = [...new Set([...bMap.keys(), ...aMap.keys()])].sort();

  let removed = 0;
  let added = 0;
  let urlChanged = 0;
  let protectedTitleChanges = 0;
  let protectedH1Changes = 0;
  let protectedCanonicalChanges = 0;
  let protectedTitleDrift = 0;
  let protectedH1Drift = 0;
  const rows = [];

  for (const url of allUrls) {
    const b = bMap.get(url);
    const a = aMap.get(url);
    if (!b && a) {
      added += 1;
      rows.push({ url, change: "ADDED" });
      continue;
    }
    if (b && !a) {
      removed += 1;
      rows.push({ url, change: "REMOVED" });
      continue;
    }
    if (!b || !a) continue;

    const titleChanged = b.title !== a.title;
    const h1Changed = b.h1 !== a.h1;
    const canonicalChanged = b.canonical !== a.canonical;
    const bodyHashChanged = b.bodyHash !== a.bodyHash;
    const isProtected =
      b.performanceClass === "FULLY_PROTECTED" ||
      a.performanceClass === "FULLY_PROTECTED";

    if (titleChanged && isProtected) protectedTitleChanges += 1;
    if (h1Changed && isProtected) protectedH1Changes += 1;
    if (canonicalChanged && isProtected) protectedCanonicalChanges += 1;
    if (titleChanged) protectedTitleDrift += 1;
    if (h1Changed) protectedH1Drift += 1;

    if (titleChanged || h1Changed || canonicalChanged || bodyHashChanged) {
      rows.push({
        url,
        change: "MODIFIED",
        titleChanged,
        h1Changed,
        canonicalChanged,
        bodyHashChanged,
        protected: isProtected,
      });
    }
  }

  const sitemapBefore = new Set(
    (before?.pages || []).filter((p) => p.inSitemap).map((p) => p.url),
  );
  const sitemapAfter = new Set(
    (after?.pages || []).filter((p) => p.inSitemap).map((p) => p.url),
  );
  const sitemapRemoved = [...sitemapBefore].filter((u) => !sitemapAfter.has(u));

  return {
    existingUrlsBefore: before?.totalUrls ?? 0,
    existingUrlsAfter: after?.totalUrls ?? 0,
    removed,
    added,
    urlChanged,
    protectedTitleChanges,
    protectedH1Changes,
    protectedCanonicalChanges,
    sitemapRemoved: sitemapRemoved.length,
    sitemapRemovedUrls: sitemapRemoved,
    modifiedRows: rows.filter((r) => r.change === "MODIFIED"),
    summary: rows,
  };
}

function main() {
  fs.mkdirSync(REPORTS, { recursive: true });

  if (args.has("--before")) {
    const snap = buildSnapshot("pre-expansion");
    writeJson(BEFORE, snap);
    console.log(`Wrote ${BEFORE} (${snap.totalUrls} URLs)`);
  }

  if (args.has("--after")) {
    const snap = buildSnapshot("post-expansion");
    writeJson(AFTER, snap);
    console.log(`Wrote ${AFTER} (${snap.totalUrls} URLs)`);
  }

  if (args.has("--diff")) {
    const before = readJson(BEFORE);
    const after = readJson(AFTER);
    if (!before || !after) {
      console.error("Missing before/after snapshot. Run --before and --after first.");
      process.exit(1);
    }
    const diff = diffSnapshots(before, after);
    const out = path.join(REPORTS, "expansion-snapshot-diff.json");
    writeJson(out, diff);
    console.log(JSON.stringify(diff, null, 2));
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

main();
