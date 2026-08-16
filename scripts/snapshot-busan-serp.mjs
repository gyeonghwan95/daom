#!/usr/bin/env node
/**
 * 「부산 법무사」 SERP recovery snapshot — inventory + live priority HTML.
 * Does not scrape Naver search. Does not change URLs.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "reports", "seo", "busan-serp");
const HTML_DIR = path.join(OUT, "html-before");
const ORIGIN = "https://xn--2j1br1na42lvxja38mk8r.kr";
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const MANIFEST = path.join(ROOT, "scripts", "output", "seo-pages-manifest.json");
const PROTECTED = path.join(ROOT, "config", "seo-protected-assets.json");
const RANKING = path.join(ROOT, "data", "seo", "ranking-observations.json");

const PRIORITY = [
  "/",
  "/부산법무사",
  "/부산법무사추천",
  "/부산법무사비교",
  "/부산법무사상담",
  "/부산법무사비용",
  "/부산등기법무사",
];

function hash(s) {
  return createHash("sha256").update(s || "").digest("hex").slice(0, 16);
}

function attr(html, tag, name) {
  const re = new RegExp(
    `<${tag}[^>]*\\s${name}=["']([^"']+)["'][^>]*>`,
    "i",
  );
  return html.match(re)?.[1] ?? null;
}

function meta(html, key, by = "name") {
  const re = new RegExp(
    `<meta[^>]*${by}=["']${key}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${by}=["']${key}["']`,
    "i",
  );
  return html.match(re)?.[1] ?? html.match(re2)?.[1] ?? null;
}

function all(html, re) {
  return [...html.matchAll(re)].map((m) => m[1]);
}

function extract(url, html, lastmod) {
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map((s) =>
    s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
  const h2s = all(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).map((s) =>
    s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
  const canonical = attr(html, "link", "href") &&
    html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1] ||
    html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1] ||
    null;
  const robots =
    meta(html, "robots") ||
    html.match(/<meta[^>]*name=["']robots["'][^>]*>/i)?.[0] ||
    null;
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const anchors = all(html, /<a[^>]*href=["']([^"'#?]*)/gi);
  const internal = anchors.filter((h) => h.startsWith("/") || h.includes("xn--"));
  const schemaTypes = all(
    html,
    /"@type"\s*:\s*"([^"]+)"/g,
  );
  return {
    url,
    status: 200,
    title,
    description: meta(html, "description"),
    H1: h1s[0] || null,
    h1Count: h1s.length,
    h1All: h1s,
    H2: h2s.slice(0, 20),
    canonical,
    robots: robots ? String(robots).slice(0, 200) : null,
    ogTitle: meta(html, "og:title", "property"),
    ogDescription: meta(html, "og:description", "property"),
    ogImage: meta(html, "og:image", "property"),
    bodyHash: hash(bodyText),
    wordCount: bodyText.split(/\s+/).filter(Boolean).length,
    first500Characters: bodyText.slice(0, 500),
    internalOutboundLinks: [...new Set(internal)].length,
    schemaTypes: [...new Set(schemaTypes)],
    sitemap: true,
    lastmod: lastmod || null,
    tocDomCount: (html.match(/data-page-toc/g) || []).length,
    keywordBadgeCount: (html.match(/readability-badges__item/g) || []).length,
    stationSection: /도시철도|전철 안내|station-rail-nav/.test(html),
    placeholderCount: (html.match(/페이지를 불러오는 중입니다/g) || []).length,
    htmlBytes: Buffer.byteLength(html),
  };
}

function sitemapIndex() {
  if (!fs.existsSync(SITEMAP)) return { urls: [], lastmodByPath: {} };
  const xml = fs.readFileSync(SITEMAP, "utf8");
  const lastmodByPath = {};
  const urls = [];
  const re = /<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]*)<\/lastmod>)?/g;
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

async function fetchHtml(pathname) {
  const encoded =
    pathname === "/"
      ? `${ORIGIN}/`
      : `${ORIGIN}${pathname.split("/").map((seg) => (seg ? encodeURIComponent(seg) : "")).join("/")}`;
  const res = await fetch(encoded, {
    headers: { "User-Agent": "DaomSeoSnapshot/1.0 (internal audit; not a rank scraper)" },
    redirect: "manual",
  });
  const html = await res.text();
  return { status: res.status, html, location: res.headers.get("location") };
}

async function main() {
  fs.mkdirSync(HTML_DIR, { recursive: true });
  const { urls, lastmodByPath } = sitemapIndex();
  const manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
    : null;
  const protectedAssets = fs.existsSync(PROTECTED)
    ? JSON.parse(fs.readFileSync(PROTECTED, "utf8"))
    : null;
  const ranking = fs.existsSync(RANKING)
    ? JSON.parse(fs.readFileSync(RANKING, "utf8"))
    : [];

  const pages = [];
  for (const p of PRIORITY) {
    const live = await fetchHtml(p);
    const file = path.join(
      HTML_DIR,
      `${p === "/" ? "homepage" : p.replace(/^\//, "")}.html`,
    );
    fs.writeFileSync(file, live.html, "utf8");
    pages.push({
      ...extract(p, live.html, lastmodByPath[p]),
      httpStatus: live.status,
      redirectLocation: live.location,
    });
  }

  const state = {
    generatedAt: new Date().toISOString(),
    liveNaverSerp: "LIVE_NAVER_SERP_UNAVAILABLE",
    note: "Full indexable inventory from sitemap/manifest. Live HTML fetched for PRIORITY only. Naver SERP not scraped.",
    origin: ORIGIN,
    seoKnownGoodCommit: "e064454fd0aeac6fc60bb6010c364aee37c51f3b",
    champion: {
      role: "BUSAN_GENERAL_CHAMPION",
      url: "/부산법무사",
      query: "부산 법무사",
    },
    totals: {
      sitemapUrls: urls.length,
      manifestPaths: Array.isArray(manifest)
        ? manifest.length
        : manifest?.paths?.length || manifest?.pages?.length || null,
      protectedPages: protectedAssets?.pages?.length ?? null,
    },
    rankingObservations: ranking.filter((r) =>
      String(r.query || "").includes("부산 법무사"),
    ),
    priorityUrls: PRIORITY,
    pages,
    sitemapUrlSample: urls.slice(0, 5),
  };

  fs.writeFileSync(
    path.join(OUT, "current-state.json"),
    JSON.stringify(state, null, 2) + "\n",
    "utf8",
  );
  console.log(
    `wrote ${path.join(OUT, "current-state.json")} sitemap=${urls.length} live=${pages.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
