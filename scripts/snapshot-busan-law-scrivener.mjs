#!/usr/bin/env node
/**
 * 「부산 법무사」 Recovery snapshot.
 * Usage:
 *   node scripts/snapshot-busan-law-scrivener.mjs --before
 *   node scripts/snapshot-busan-law-scrivener.mjs --after
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS = path.join(ROOT, "reports", "seo");
const MANIFEST = path.join(ROOT, "scripts", "output", "seo-pages-manifest.json");
const PATHS = path.join(ROOT, "scripts", "output", "seo-paths.json");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const PROTECTED = path.join(ROOT, "config", "seo-protected-assets.json");
const RANKING = path.join(ROOT, "data", "seo", "ranking-observations.json");

const PRIORITY = [
  "/",
  "/부산법무사",
  "/부산법무사추천",
  "/부산법무사비교",
  "/부산법무사상담",
  "/부산등기법무사",
  "/부산법무사비용",
  "/부산법인법무사",
  "/해운대법무사",
  "/센텀법무사",
];

const args = new Set(process.argv.slice(2));
const phase = args.has("--after") ? "after" : "before";

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function hash(s) {
  return createHash("sha256").update(s || "").digest("hex").slice(0, 16);
}

function extractSitemap() {
  if (!fs.existsSync(SITEMAP)) return { urls: [], lastmodByPath: {} };
  const xml = fs.readFileSync(SITEMAP, "utf8");
  const lastmodByPath = {};
  const urls = [];
  const re =
    /<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]*)<\/lastmod>)?/g;
  let m;
  while ((m = re.exec(xml))) {
    try {
      const u = new URL(m[1]);
      const p = decodeURIComponent(u.pathname).replace(/\/$/, "") || "/";
      urls.push(p);
      if (m[2]) lastmodByPath[p] = m[2];
    } catch {
      /* ignore */
    }
  }
  return { urls: [...new Set(urls)], lastmodByPath };
}

function extractSourceIdentity() {
  const flagship = fs.readFileSync(
    path.join(ROOT, "src/lib/local-landing/flagship-busan-lawyer.ts"),
    "utf8",
  );
  const title = flagship.match(/\btitle:\s*"([^"]+)"/)?.[1] ?? null;
  const metaTitle = flagship.match(/metaTitle:\s*"([^"]+)"/)?.[1] ?? null;
  const h1 = flagship.match(/\bh1:\s*"([^"]+)"/)?.[1] ?? null;
  const desc =
    flagship.match(/description:\s*\n\s*"([^"]+)"/)?.[1] ??
    flagship.match(/description:\s*"([^"]+)"/)?.[1] ??
    null;
  const paras = [
    ...(flagship.match(/summaryParagraphs:\s*\[[\s\S]*?\]/)?.[0].matchAll(
      /"([^"]{20,})"/g,
    ) ?? []),
  ].map((x) => x[1]);
  const docs = flagship.includes("제적등본")
    ? ["제적등본"]
    : flagship.match(/상속: 피상속인/)
      ? ["inheritance-docs-mixed"]
      : [];
  const keywordBadges = [
    ...(flagship.match(/primaryKeywords:\s*\[[\s\S]*?\]/)?.[0].matchAll(
      /"([^"]+)"/g,
    ) ?? []),
  ].map((x) => x[1]);
  return {
    title,
    metaTitle,
    h1,
    description: desc,
    firstMeaningfulParagraph: paras[0] ?? null,
    summaryParagraphs: paras.slice(0, 4),
    documentsHint: docs,
    keywordBadges,
  };
}

function main() {
  const manifest = readJson(MANIFEST, { pages: [], paths: [], total: 0 });
  const pathsFile = readJson(PATHS, { paths: [] });
  const protectedCfg = readJson(PROTECTED, { pages: [] });
  const ranking = readJson(RANKING, []);
  const sitemap = extractSitemap();
  const sitemapSet = new Set(sitemap.urls);
  const inbound = new Map();
  const byPath = new Map();

  for (const page of manifest.pages || []) {
    byPath.set(page.path, page);
    for (const href of page.internalLinks || []) {
      const key = String(href).split("?")[0];
      if (!inbound.has(key)) inbound.set(key, []);
      inbound.get(key).push(page.path);
    }
  }

  const allPaths = [
    ...new Set([...(pathsFile.paths || []), ...(manifest.paths || [])]),
  ].sort();

  const pages = allPaths.map((url) => {
    const page = byPath.get(url) || {};
    const seed = [
      page.metaTitle,
      page.h1,
      page.metaDescription,
      page.canonical,
      ...(page.internalLinks || []),
    ]
      .filter(Boolean)
      .join("|");
    return {
      url,
      status: page.path ? "manifest-indexable" : "path-only",
      title: page.metaTitle || null,
      description: page.metaDescription || null,
      H1: page.h1 || null,
      H2: [],
      canonical: page.canonical || null,
      robots: "index,follow (site default unless page override)",
      "og:title": page.metaTitle || null,
      "og:description": page.metaDescription || null,
      "og:image": null,
      firstMeaningfulParagraph: null,
      bodyTextHash: hash(seed),
      bodyTextLength: seed.length,
      internalInboundLinks: inbound.get(url)?.length ?? 0,
      internalOutboundLinks: page.internalLinkCount ?? (page.internalLinks || []).length,
      anchorTexts: [],
      schemaTypes: page.jsonLdCount != null ? [`count:${page.jsonLdCount}`] : [],
      sitemapIncluded: sitemapSet.has(url),
      lastmod: sitemap.lastmodByPath[url] || null,
      pageType: page.category || null,
      performanceClass: (protectedCfg.pages || []).some((p) => p.url === url)
        ? "SEO_PROTECTED"
        : "UNKNOWN_PERFORMANCE",
    };
  });

  const identity = extractSourceIdentity();
  const champ = pages.find((p) => p.url === "/부산법무사");
  if (champ) {
    champ.firstMeaningfulParagraph = identity.firstMeaningfulParagraph;
    champ.H1 = identity.h1 || champ.H1;
    champ.title = identity.metaTitle || champ.title;
    champ.description = identity.description || champ.description;
  }

  const htmlDir = path.join(REPORTS, `busan-law-scrivener-html-${phase}`);
  fs.mkdirSync(htmlDir, { recursive: true });
  const recovered = path.join(REPORTS, "recovered-html");
  const copies = [
    ["busan-general-champion.html", "부산법무사.html"],
    ["homepage.html", "homepage.html"],
    ["busan-corporate-champion.html", "부산법인법무사.html"],
  ];
  for (const [from, to] of copies) {
    const src = path.join(recovered, from);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(htmlDir, to));
    }
  }
  fs.writeFileSync(
    path.join(htmlDir, "부산법무사.source-identity.html"),
    `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${identity.metaTitle || ""}</title><meta name="description" content="${identity.description || ""}"></head><body><h1>${identity.h1 || ""}</h1>${(identity.summaryParagraphs || []).map((p) => `<p>${p}</p>`).join("")}</body></html>\n`,
    "utf8",
  );

  const out = {
    generatedAt: new Date().toISOString(),
    phase,
    source:
      "scripts/output/seo-pages-manifest.json + sitemap + flagship source (full SSG HTML dump unavailable unless out/ exists)",
    liveNaverSerp: "LIVE_NAVER_SERP_UNAVAILABLE",
    rankingObservations: ranking.filter((r) =>
      String(r.query || "").includes("부산 법무사"),
    ),
    seoKnownGoodCommit: "e064454fd0aeac6fc60bb6010c364aee37c51f3b",
    champion: {
      role: "BUSAN_LAW_SCRIVENER_CHAMPION",
      url: "/부산법무사",
      identity,
    },
    totals: {
      indexablePaths: allPaths.length,
      sitemapUrls: sitemap.urls.length,
      protectedPages: (protectedCfg.pages || []).length,
    },
    priorityUrls: PRIORITY,
    pages,
  };

  const file = path.join(REPORTS, `busan-law-scrivener-${phase}.json`);
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(
    `[snapshot ${phase}] ${allPaths.length} URLs → ${path.relative(ROOT, file)}`,
  );
}

main();
