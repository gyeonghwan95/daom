#!/usr/bin/env node
/**
 * SEO 품질·중복·sitemap·내부링크 자동 검증
 * - 중복 title / description / canonical
 * - 누락 h1, CTA, FAQ, 내부링크, JSON-LD
 * - sitemap 누락·인코딩
 * - broken internal link
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getIndexablePaths } from "./lib/indexable-paths.mjs";
import { getAllPublishedPaths, normalizeRouteSlug } from "./lib/published-paths.mjs";
import { getSiteUrl } from "./lib/site-url.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "out");
const SEO_MANIFEST = path.join(ROOT, "scripts/output/seo-pages-manifest.json");
const SITEMAP_PATH = path.join(OUT_DIR, "sitemap.xml");
const ROBOTS_PATH = path.join(OUT_DIR, "robots.txt");
const SITE_URL = getSiteUrl().replace(/\/$/, "");

const MIN_INTERNAL_LINKS_DEFAULT = 8;
const MIN_INTERNAL_LINKS_HUB = 20;
const MIN_FAQ_COUNT = 2;

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function normalizePath(routePath) {
  if (routePath === "/") return "/";
  return routePath.replace(/\/+$/, "") || "/";
}

function loadSeoManifest() {
  if (!fs.existsSync(SEO_MANIFEST)) {
    fail(
      "seo-pages-manifest.json 없음 — npm run generate:seo-pages 또는 prebuild 실행",
    );
    return null;
  }

  const data = JSON.parse(fs.readFileSync(SEO_MANIFEST, "utf8"));
  if (!Array.isArray(data.pages) || data.pages.length === 0) {
    fail("seo-pages-manifest.json pages 배열이 비어 있습니다.");
    return null;
  }
  return data;
}

function findDuplicates(items, keyFn) {
  const map = new Map();
  const duplicates = [];

  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    if (map.has(key)) {
      duplicates.push({ key, paths: [map.get(key), item.path] });
    } else {
      map.set(key, item.path);
    }
  }

  const grouped = new Map();
  for (const dup of duplicates) {
    const existing = grouped.get(dup.key) ?? [];
    grouped.set(dup.key, [...new Set([...existing, ...dup.paths])]);
  }

  return grouped;
}

function pathToSitemapUrl(routePath) {
  if (routePath === "/") return SITE_URL;
  const segments = routePath.split("/").filter(Boolean);
  const encoded = segments.map((s) => encodeURIComponent(s)).join("/");
  return `${SITE_URL}/${encoded}`;
}

function decodeSitemapUrl(url) {
  if (url === SITE_URL || url === `${SITE_URL}/`) return "/";
  const relative = url.startsWith(SITE_URL)
    ? url.slice(SITE_URL.length)
    : url;
  const decoded = relative
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");
  return normalizePath(`/${decoded}`);
}

function isExternalHref(href) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:")
  );
}

function resolveInternalPath(href) {
  if (!href || !href.startsWith("/")) return null;
  const [pathPart] = href.split("#");
  return normalizePath(pathPart || "/");
}

function minInternalLinks(page) {
  if (page.isCoreHub) return MIN_INTERNAL_LINKS_HUB;
  if (["blog", "case", "media", "external", "core"].includes(page.category)) {
    return 4;
  }
  return MIN_INTERNAL_LINKS_DEFAULT;
}

function requiresFaq(page) {
  return !["blog", "case", "media", "external"].includes(page.category);
}

function checkDuplicateSeo(pages) {
  const titleDups = findDuplicates(pages, (p) => p.metaTitle);
  for (const [title, paths] of titleDups) {
    if (paths.length > 1) {
      fail(`중복 metaTitle (${paths.length}건): "${title}" → ${paths.join(", ")}`);
    }
  }

  const descDups = findDuplicates(pages, (p) => p.metaDescription);
  for (const [desc, paths] of descDups) {
    if (paths.length > 1) {
      const preview = desc.length > 60 ? `${desc.slice(0, 60)}…` : desc;
      fail(
        `중복 metaDescription (${paths.length}건): "${preview}" → ${paths.slice(0, 5).join(", ")}${paths.length > 5 ? ` 외 ${paths.length - 5}건` : ""}`,
      );
    }
  }

  const canonicalDups = findDuplicates(pages, (p) => p.canonical);
  for (const [canonical, paths] of canonicalDups) {
    if (paths.length > 1) {
      fail(
        `중복 canonical (${paths.length}건): ${canonical} → ${paths.join(", ")}`,
      );
    }
  }
}

function checkRequiredFields(pages) {
  for (const page of pages) {
    if (!page.h1) {
      fail(`누락 h1: ${page.path}`);
    }
    if (!page.metaTitle) {
      fail(`누락 metaTitle: ${page.path}`);
    }
    if (!page.metaDescription) {
      fail(`누락 metaDescription: ${page.path}`);
    }
    if (!page.ctaTitle || !page.ctaText) {
      fail(`누락 CTA: ${page.path}`);
    }
    if (requiresFaq(page) && page.faqCount < MIN_FAQ_COUNT) {
      fail(
        `누락 FAQ (${page.faqCount}/${MIN_FAQ_COUNT}): ${page.path}`,
      );
    }
    const minLinks = minInternalLinks(page);
    if (page.internalLinkCount < minLinks) {
      fail(
        `누락 내부링크 (${page.internalLinkCount}/${minLinks}): ${page.path}`,
      );
    }
    if (!page.jsonLdCount || page.jsonLdCount < 1) {
      fail(`누락 JSON-LD: ${page.path}`);
    }
  }
}

function checkBrokenInternalLinks(pages, validPaths) {
  const broken = [];

  for (const page of pages) {
    const hrefs = [...new Set([...page.internalLinks, ...page.relatedLinks])];

    for (const href of hrefs) {
      if (isExternalHref(href)) continue;

      const target = resolveInternalPath(href);
      if (!target) continue;

      const key = normalizeRouteSlug(target);
      if (!validPaths.has(key)) {
        broken.push({ from: page.path, href, target });
      }
    }
  }

  if (broken.length > 0) {
    for (const item of broken.slice(0, 30)) {
      fail(`broken internal link: ${item.from} → ${item.href} (없는 경로: ${item.target})`);
    }
    if (broken.length > 30) {
      fail(`broken internal link 외 ${broken.length - 30}건`);
    }
  }
}

function checkSitemap(pages) {
  if (!fs.existsSync(SITEMAP_PATH)) {
    fail("out/sitemap.xml 없음 — npm run build 먼저 실행");
    return;
  }

  const indexablePaths = getIndexablePaths().map(normalizePath);
  const indexableSet = new Set(indexablePaths.map(normalizeRouteSlug));

  if (pages.length !== indexablePaths.length) {
    fail(
      `SEO manifest(${pages.length}) ≠ 색인 경로(${indexablePaths.length})`,
    );
  }

  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sitemapPaths = locs.map(decodeSitemapUrl);

  if (sitemapPaths.length !== indexablePaths.length) {
    fail(
      `sitemap URL 수(${sitemapPaths.length}) ≠ 색인(${indexablePaths.length})`,
    );
  }

  const sitemapSet = new Set(sitemapPaths.map(normalizeRouteSlug));
  const missingFromSitemap = indexablePaths.filter(
    (p) => !sitemapSet.has(normalizeRouteSlug(p)),
  );
  if (missingFromSitemap.length > 0) {
    fail(
      `sitemap 누락 ${missingFromSitemap.length}건: ${missingFromSitemap.slice(0, 10).join(", ")}`,
    );
  }

  for (const page of pages) {
    const expected = pathToSitemapUrl(page.path);
    if (!locs.includes(expected)) {
      const hasNonAscii = /[^\x00-\x7F]/.test(page.path);
      if (hasNonAscii) {
        fail(
          `sitemap 한글 URL 인코딩 누락: ${page.path} (기대: ${expected})`,
        );
      }
    }
  }

  const priorityByPath = new Map(
    pages.map((p) => [normalizeRouteSlug(p.path), p.sitemapPriority]),
  );

  for (const match of xml.matchAll(
    /<loc>([^<]+)<\/loc>\s*<lastmod>[^<]*<\/lastmod>\s*<changefreq>[^<]*<\/changefreq>\s*<priority>([^<]+)<\/priority>/g,
  )) {
    const loc = match[1];
    const priority = Number(match[2]);
    const routePath = normalizeRouteSlug(decodeSitemapUrl(loc));
    const expected = priorityByPath.get(routePath);
    if (expected !== undefined && Math.abs(expected - priority) > 0.001) {
      fail(
        `sitemap priority 불일치 ${routePath}: XML=${priority}, pageData=${expected}`,
      );
    }
  }
}

function checkRobots() {
  if (!fs.existsSync(ROBOTS_PATH)) {
    fail("out/robots.txt 없음");
    return;
  }

  const robots = fs.readFileSync(ROBOTS_PATH, "utf8");

  if (!/User-agent:\s*\*/i.test(robots)) {
    fail("robots.txt에 User-agent: * 없음");
  }
  if (!robots.includes("Allow: /")) {
    fail("robots.txt에 Allow: / 없음");
  }
  if (!robots.includes("Sitemap:") || !robots.includes("sitemap.xml")) {
    fail(`robots.txt에 Sitemap: ${SITE_URL}/sitemap.xml 필요`);
  }
}

function main() {
  console.log("[check-seo] SEO manifest 로드…");
  const manifest = loadSeoManifest();
  if (!manifest) {
    reportAndExit();
    return;
  }

  const pages = manifest.pages;
  const publishedPaths = new Set(
    getAllPublishedPaths().map((p) => normalizeRouteSlug(normalizePath(p))),
  );

  console.log(`[check-seo] ${pages.length}개 색인 페이지 검사…`);

  checkDuplicateSeo(pages);
  checkRequiredFields(pages);
  checkBrokenInternalLinks(pages, publishedPaths);
  checkSitemap(pages);
  checkRobots();

  reportAndExit(manifest);
}

function reportAndExit(manifest) {
  if (warnings.length > 0) {
    console.warn(`\n[check-seo] 경고 ${warnings.length}건:`);
    for (const w of warnings.slice(0, 10)) {
      console.warn(`  ⚠ ${w}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n[check-seo] 실패 — ${errors.length}건:\n`);
    for (const e of errors.slice(0, 50)) {
      console.error(`  ✗ ${e}`);
    }
    if (errors.length > 50) {
      console.error(`  … 외 ${errors.length - 50}건`);
    }
    process.exit(1);
  }

  console.log("");
  console.log("[check-seo] OK — 중복 title 0 / 중복 description 0 / sitemap 누락 0 / broken link 0");
  console.log(`[check-seo] 색인 페이지 ${manifest?.pages?.length ?? "?"}건 검증 완료`);
}

main();
