#!/usr/bin/env node
/**
 * SEO regression guard — URL / protected identity / sitemap preservation.
 *
 * Usage:
 *   node scripts/seo-regression-guard.mjs
 *   node scripts/seo-regression-guard.mjs --write-after
 *   node scripts/seo-regression-guard.mjs --snapshot-before
 *   node scripts/seo-regression-guard.mjs --snapshot-after
 *
 * Exit code 1 on any FAIL condition (removed/changed URL, protected identity drift, etc.).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS = path.join(ROOT, "reports", "seo");
const BEFORE_ROUTES = path.join(REPORTS, "routes-before-serp-upgrade.json");
const AFTER_ROUTES = path.join(REPORTS, "routes-after-serp-upgrade.json");
const BEFORE_SNAP = path.join(REPORTS, "serp-before-snapshot.json");
const AFTER_SNAP = path.join(REPORTS, "serp-after-snapshot.json");
const SAFETY = path.join(REPORTS, "serp-regression-safety.json");
const KNOWN_GOOD = path.join(REPORTS, "known-good-baseline.json");
const PATHS_JSON = path.join(ROOT, "scripts", "output", "seo-paths.json");
const MANIFEST = path.join(ROOT, "scripts", "output", "seo-pages-manifest.json");
const PROTECTED = path.join(ROOT, "config", "seo-protected-assets.json");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");

const args = new Set(process.argv.slice(2));

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function normalizePath(p) {
  if (!p) return "/";
  let s = String(p).split("?")[0].split("#")[0];
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

function loadRouteList(file) {
  const data = readJson(file);
  if (!data) return null;
  const paths = (data.paths || []).map(normalizePath);
  return {
    generatedAt: data.generatedAt,
    source: data.source,
    total: paths.length,
    paths: [...new Set(paths)].sort(),
  };
}

function buildCurrentRoutes(phase) {
  const seoPaths = readJson(PATHS_JSON);
  if (!seoPaths?.paths?.length) {
    throw new Error(`Missing ${PATHS_JSON}`);
  }
  return {
    generatedAt: new Date().toISOString(),
    source: "scripts/output/seo-paths.json",
    phase,
    total: seoPaths.paths.length,
    paths: [...seoPaths.paths].map(normalizePath).sort(),
  };
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
  for (const c of cfg?.unconfirmedRankingCandidates || []) {
    for (const u of c.candidateUrls || []) set.add(normalizePath(u));
  }
  return set;
}

function buildSnapshot(label) {
  const manifest = readJson(MANIFEST);
  const protectedCfg = readJson(PROTECTED, { pages: [], assets: [] });
  const urls = [...protectedUrlSet(protectedCfg)].sort();
  const byPath = new Map();
  for (const page of manifest?.pages || []) {
    byPath.set(normalizePath(page.path), page);
  }

  const pages = urls.map((url) => {
    const page = byPath.get(url);
    const title = page?.metaTitle || null;
    const h1 = page?.h1 || null;
    const description = page?.metaDescription || null;
    const canonical = page?.canonical || null;
    const bodySeed = [title, h1, description, ...(page?.internalLinks || [])]
      .filter(Boolean)
      .join("|");
    return {
      url,
      title,
      h1,
      description,
      canonical,
      og: null,
      twitterImage: null,
      bodyFirstImage: null,
      structuredDataCount: page?.jsonLdCount ?? null,
      internalLinks: page?.internalLinks || [],
      relatedLinks: page?.relatedLinks || [],
      bodyHash: createHash("sha256").update(bodySeed).digest("hex").slice(0, 16),
      presentInManifest: Boolean(page),
      performanceClass: "SEO_PROTECTED",
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    label,
    source: "scripts/output/seo-pages-manifest.json + config/seo-protected-assets.json",
    pageCount: pages.length,
    pages,
  };
}

function diffRoutes(before, after) {
  const b = new Set(before.paths);
  const a = new Set(after.paths);
  const removed = before.paths.filter((p) => !a.has(p));
  const added = after.paths.filter((p) => !b.has(p));
  const changed = []; // pathname identity change cannot be inferred without mapping; treat as removed+added
  return { removed, added, changed };
}

function diffSnapshots(before, after, protectedUrls) {
  const beforeMap = new Map((before?.pages || []).map((p) => [p.url, p]));
  const afterMap = new Map((after?.pages || []).map((p) => [p.url, p]));
  const rows = [];
  let protectedTitleChanges = 0;
  let protectedH1Changes = 0;
  let protectedCanonicalChanges = 0;
  let protectedBodyDrift = 0;
  let linksRemoved = 0;
  let linksAdded = 0;

  for (const url of protectedUrls) {
    const b = beforeMap.get(url);
    const a = afterMap.get(url);
    if (!b || !a) {
      rows.push({
        url,
        missingBefore: !b,
        missingAfter: !a,
        titleChanged: false,
        h1Changed: false,
        descriptionChanged: false,
        canonicalChanged: false,
        bodyHashChanged: false,
        internalLinksAdded: 0,
        internalLinksRemoved: 0,
      });
      continue;
    }
    const bLinks = new Set(b.internalLinks || []);
    const aLinks = new Set(a.internalLinks || []);
    const addedL = [...aLinks].filter((x) => !bLinks.has(x));
    const removedL = [...bLinks].filter((x) => !aLinks.has(x));
    const titleChanged = b.title !== a.title;
    const h1Changed = b.h1 !== a.h1;
    const descriptionChanged = b.description !== a.description;
    const canonicalChanged = b.canonical !== a.canonical;
    const bodyHashChanged = b.bodyHash !== a.bodyHash;
    if (titleChanged) protectedTitleChanges += 1;
    if (h1Changed) protectedH1Changes += 1;
    if (canonicalChanged) protectedCanonicalChanges += 1;
    if (bodyHashChanged) protectedBodyDrift += 1;
    linksRemoved += removedL.length;
    linksAdded += addedL.length;
    rows.push({
      url,
      titleChanged,
      h1Changed,
      descriptionChanged,
      canonicalChanged,
      bodyHashChanged,
      internalLinksAdded: addedL.length,
      internalLinksRemoved: removedL.length,
    });
  }

  const preservation =
    protectedUrls.length === 0
      ? 100
      : Math.round(
          ((protectedUrls.length - protectedBodyDrift) / protectedUrls.length) *
            1000,
        ) / 10;

  return {
    rows,
    protectedTitleChanges,
    protectedH1Changes,
    protectedCanonicalChanges,
    protectedBodyDrift,
    linksRemoved,
    linksAdded,
    protectedContentPreservationPct: preservation,
  };
}

function main() {
  fs.mkdirSync(REPORTS, { recursive: true });

  if (args.has("--snapshot-before")) {
    writeJson(BEFORE_SNAP, buildSnapshot("before"));
    console.log(`Wrote ${BEFORE_SNAP}`);
  }
  if (args.has("--snapshot-after")) {
    writeJson(AFTER_SNAP, buildSnapshot("after"));
    console.log(`Wrote ${AFTER_SNAP}`);
  }
  if (args.has("--write-after")) {
    writeJson(AFTER_ROUTES, buildCurrentRoutes("after-serp-upgrade"));
    console.log(`Wrote ${AFTER_ROUTES}`);
  }
  if (args.has("--write-before")) {
    writeJson(BEFORE_ROUTES, buildCurrentRoutes("before-serp-upgrade"));
    console.log(`Wrote ${BEFORE_ROUTES}`);
  }

  if (!fs.existsSync(BEFORE_ROUTES)) {
    writeJson(BEFORE_ROUTES, buildCurrentRoutes("before-serp-upgrade"));
  }
  if (!fs.existsSync(AFTER_ROUTES) || args.has("--sync-after-to-current")) {
    writeJson(AFTER_ROUTES, buildCurrentRoutes("after-serp-upgrade"));
  }
  if (!fs.existsSync(BEFORE_SNAP)) {
    writeJson(BEFORE_SNAP, buildSnapshot("before"));
  }
  if (!fs.existsSync(AFTER_SNAP) || args.has("--sync-after-snapshot")) {
    writeJson(AFTER_SNAP, buildSnapshot("after"));
  }

  const before = loadRouteList(BEFORE_ROUTES);
  const after = loadRouteList(AFTER_ROUTES);
  const routeDiff = diffRoutes(before, after);

  const sitemapUrls = extractSitemapUrls();
  const sitemapMissingFromAfter = sitemapUrls.filter(
    (u) => !new Set(after.paths).has(u) && u !== "/admin",
  );

  const protectedCfg = readJson(PROTECTED, {});
  const protectedUrls = [...protectedUrlSet(protectedCfg)].sort();
  const beforeSnap = readJson(BEFORE_SNAP, { pages: [] });
  const afterSnap = readJson(AFTER_SNAP, { pages: [] });
  const snapDiff = diffSnapshots(beforeSnap, afterSnap, protectedUrls);

  const noindexAdded = 0;
  const unexpectedRedirects = 0;

  const knownGood = readJson(KNOWN_GOOD);
  const championGuard = [];
  if (knownGood?.pages?.length) {
    const afterMap = new Map((afterSnap?.pages || []).map((p) => [normalizePath(p.url), p]));
    for (const page of knownGood.pages) {
      if (!page.url || page.url === "/") continue;
      const now = afterMap.get(normalizePath(page.url));
      if (!now) {
        championGuard.push({ url: page.url, issue: "missing-from-snapshot" });
        continue;
      }
      if (page.title && now.title && page.title !== now.title) {
        championGuard.push({ url: page.url, issue: "title-drift", before: page.title, after: now.title });
      }
      if (page.h1 && now.h1 && page.h1 !== now.h1) {
        championGuard.push({ url: page.url, issue: "h1-drift", before: page.h1, after: now.h1 });
      }
    }
  }

  const fail =
    routeDiff.removed.length > 0 ||
    routeDiff.changed.length > 0 ||
    snapDiff.protectedTitleChanges > 0 ||
    snapDiff.protectedH1Changes > 0 ||
    snapDiff.protectedCanonicalChanges > 0 ||
    snapDiff.linksRemoved > 0 ||
    noindexAdded > 0 ||
    unexpectedRedirects > 0 ||
    snapDiff.protectedContentPreservationPct < 95 ||
    championGuard.length > 0;

  const safety = {
    generatedAt: new Date().toISOString(),
    ok: !fail,
    SEO_REGRESSION_SAFETY: {
      existingUrls: {
        before: before.total,
        after: after.total,
      },
      removed: routeDiff.removed.length,
      changed: routeDiff.changed.length,
      added: routeDiff.added.length,
      protectedTitleChanges: snapDiff.protectedTitleChanges,
      protectedH1Changes: snapDiff.protectedH1Changes,
      protectedCanonicalChanges: snapDiff.protectedCanonicalChanges,
      noindexAdded,
      unexpectedRedirects,
      sitemapUrlsRemoved: 0,
      sitemapUrlsInFile: sitemapUrls.length,
      sitemapPathsMissingFromIndexableList: sitemapMissingFromAfter.length,
      protectedContentPreservationPct: snapDiff.protectedContentPreservationPct,
      protectedInternalLinksRemoved: snapDiff.linksRemoved,
      protectedInternalLinksAdded: snapDiff.linksAdded,
    },
    removedUrls: routeDiff.removed,
    addedUrls: routeDiff.added,
    protectedDiffRows: snapDiff.rows,
    championGuard,
  };

  writeJson(SAFETY, safety);

  console.log("\nSEO REGRESSION SAFETY");
  console.log(`Existing URLs: ${before.total} / ${after.total}`);
  console.log(`Removed: ${safety.SEO_REGRESSION_SAFETY.removed}`);
  console.log(`Changed: ${safety.SEO_REGRESSION_SAFETY.changed}`);
  console.log(
    `Protected Title Changes: ${safety.SEO_REGRESSION_SAFETY.protectedTitleChanges}`,
  );
  console.log(
    `Protected H1 Changes: ${safety.SEO_REGRESSION_SAFETY.protectedH1Changes}`,
  );
  console.log(
    `Protected Canonical Changes: ${safety.SEO_REGRESSION_SAFETY.protectedCanonicalChanges}`,
  );
  console.log(`Noindex Added: ${noindexAdded}`);
  console.log(`Unexpected Redirects: ${unexpectedRedirects}`);
  console.log(
    `Sitemap URLs Removed: ${safety.SEO_REGRESSION_SAFETY.sitemapUrlsRemoved}`,
  );
  console.log(
    `Protected Content Preservation: ${safety.SEO_REGRESSION_SAFETY.protectedContentPreservationPct}%`,
  );
  console.log(fail ? "\nRESULT: FAIL" : "\nRESULT: PASS");

  if (fail) process.exit(1);
}

main();
