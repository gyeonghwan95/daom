#!/usr/bin/env node
/**
 * 빌드 산출물 sitemap.xml ↔ pageData 색인 URL 일치 검증
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./lib/site-url.mjs";
import { getIndexablePaths } from "./lib/indexable-paths.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = getSiteUrl().replace(/\/$/, "");
const SITEMAP_PATH = path.join(ROOT, "out/sitemap.xml");

function fail(message) {
  console.error(`[validate-sitemap] ${message}`);
  process.exit(1);
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
  return `/${decoded}`;
}

function normalizePath(p) {
  if (p === "/") return "/";
  return p.replace(/\/+$/, "") || "/";
}

function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    fail("out/sitemap.xml not found — run npm run build first");
  }

  const expectedPaths = getIndexablePaths().map(normalizePath);
  const expectedCount = expectedPaths.length;

  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (locs.length !== expectedCount) {
    fail(
      `URL count mismatch: sitemap has ${locs.length}, pageData indexable has ${expectedCount}`,
    );
  }

  const sitemapPathSet = new Set();
  const canonicalByPath = new Map();

  for (const loc of locs) {
    const decodedPath = normalizePath(decodeSitemapUrl(loc));

    if (sitemapPathSet.has(decodedPath)) {
      fail(`duplicate sitemap entry for path: ${decodedPath}`);
    }
    sitemapPathSet.add(decodedPath);

    if (canonicalByPath.has(decodedPath) && canonicalByPath.get(decodedPath) !== loc) {
      fail(
        `duplicate canonical encoding for ${decodedPath}: ${canonicalByPath.get(decodedPath)} vs ${loc}`,
      );
    }
    canonicalByPath.set(decodedPath, loc);

    if (!loc.startsWith(SITE_URL)) {
      fail(`sitemap loc must use site URL ${SITE_URL}: ${loc}`);
    }

    const reencoded = pathToSitemapUrl(decodedPath);
    if (loc !== reencoded && loc !== `${SITE_URL}${decodedPath}`) {
      const hasNonAscii = /[^\x00-\x7F]/.test(decodedPath);
      if (hasNonAscii && loc !== reencoded) {
        fail(
          `korean path encoding mismatch for ${decodedPath}: expected ${reencoded}, got ${loc}`,
        );
      }
    }
  }

  const missing = [];
  for (const routePath of expectedPaths) {
    if (!sitemapPathSet.has(routePath)) {
      missing.push(routePath);
    }
  }

  if (missing.length > 0) {
    fail(
      `missing from sitemap (${missing.length}):\n${missing.slice(0, 20).join("\n")}${missing.length > 20 ? `\n... 외 ${missing.length - 20}건` : ""}`,
    );
  }

  const extra = [...sitemapPathSet].filter(
    (p) => !expectedPaths.includes(p),
  );
  if (extra.length > 0) {
    fail(
      `unexpected sitemap paths (${extra.length}):\n${extra.slice(0, 20).join("\n")}`,
    );
  }

  if (!xml.includes(`${SITE_URL}/sitemap.xml`) && !fs.existsSync(path.join(ROOT, "out/robots.txt"))) {
    // robots checked separately
  }

  const robotsPath = path.join(ROOT, "out/robots.txt");
  if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, "utf8");
    if (!robots.includes("Sitemap:") || !robots.includes("sitemap.xml")) {
      fail("out/robots.txt must include Sitemap: .../sitemap.xml");
    }
    if (!robots.includes("Allow: /")) {
      fail("out/robots.txt must include Allow: /");
    }
  }

  console.log(
    `[validate-sitemap] OK — ${expectedCount} indexable URLs in sitemap.xml (pageData match)`,
  );
}

main();
