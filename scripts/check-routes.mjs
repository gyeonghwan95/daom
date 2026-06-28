#!/usr/bin/env node
/**
 * pageData 전체 path ↔ 정적 빌드(out/) 일치 검증
 * - 한글 URL encode/decode 변형
 * - 중복 slug
 * - sitemap 색인 URL ↔ 실제 HTML
 * - Cloudflare Pages _redirects (레거시 /cases, /press)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getIndexablePaths } from "./lib/indexable-paths.mjs";
import { assertOutDirExists, findOutHtmlForRoute } from "./lib/out-route.mjs";
import {
  getAllPublishedPaths,
  normalizeRouteSlug,
} from "./lib/published-paths.mjs";
import { getSiteUrl } from "./lib/site-url.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "out");
const MANIFEST_PATH = path.join(ROOT, "scripts/output/page-manifest.json");
const REDIRECTS_PUBLIC = path.join(ROOT, "public/_redirects");
const REDIRECTS_OUT = path.join(OUT_DIR, "_redirects");
const SITEMAP_PATH = path.join(OUT_DIR, "sitemap.xml");
const SITE_URL = getSiteUrl().replace(/\/$/, "");

const SAMPLE_PATHS = [
  "/about",
  "/services",
  "/faq",
  "/부산상속등기",
  "/services/inheritance-registration",
];

function fail(message) {
  console.error(`[check-routes] ERROR: ${message}`);
  process.exit(1);
}

function normalizePath(routePath) {
  if (routePath === "/") return "/";
  return routePath.replace(/\/+$/, "") || "/";
}

function loadPageDataPaths() {
  const registryPaths = getAllPublishedPaths().map(normalizePath);

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.warn(
      "[check-routes] page-manifest.json 없음 — getAllPublishedPaths() 사용 (prebuild 권장)",
    );
    return registryPaths;
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const manifestPaths = (manifest.paths ?? []).map(normalizePath);

  if (manifestPaths.length !== registryPaths.length) {
    fail(
      `pageData manifest(${manifestPaths.length}) ≠ registry(${registryPaths.length}) — npm run validate:page-data 실행 후 재시도`,
    );
  }

  const manifestSet = new Set(manifestPaths.map(normalizeRouteSlug));
  const registrySet = new Set(registryPaths.map(normalizeRouteSlug));

  const onlyManifest = manifestPaths.filter(
    (p) => !registrySet.has(normalizeRouteSlug(p)),
  );
  const onlyRegistry = registryPaths.filter(
    (p) => !manifestSet.has(normalizeRouteSlug(p)),
  );

  if (onlyManifest.length > 0 || onlyRegistry.length > 0) {
    fail(
      `pageData manifest ↔ registry 불일치\n` +
        `  manifest only: ${onlyManifest.slice(0, 5).join(", ")}\n` +
        `  registry only: ${onlyRegistry.slice(0, 5).join(", ")}`,
    );
  }

  return manifestPaths;
}

function assertNoDuplicatePaths(paths) {
  const seen = new Map();
  const duplicates = [];

  for (const routePath of paths) {
    const key = normalizeRouteSlug(routePath);
    if (seen.has(key)) {
      duplicates.push({ path: routePath, existing: seen.get(key) });
    } else {
      seen.set(key, routePath);
    }
  }

  if (duplicates.length > 0) {
    fail(
      `중복 slug ${duplicates.length}건:\n${duplicates
        .map((d) => `  ${d.path} ↔ ${d.existing}`)
        .join("\n")}`,
    );
  }
}

function assertTrailingSlashConfig() {
  const nextConfig = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
  if (/trailingSlash:\s*true/.test(nextConfig)) {
    fail(
      "next.config.ts trailingSlash: true — Cloudflare 정적 export와 path 검증 규칙이 맞지 않습니다.",
    );
  }
}

function assertStaticExportConfig() {
  const nextConfig = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
  if (!nextConfig.includes('output: "export"') && !nextConfig.includes("output: 'export'")) {
    console.warn(
      "[check-routes] next.config에 output: export 가 조건부(STATIC_EXPORT)로 설정됨 — build-static.mjs 사용 확인",
    );
  }
  if (!nextConfig.includes("unoptimized: true")) {
    fail("next.config images.unoptimized: true 필요 (static export)");
  }
}

function assertOutRoutes(paths) {
  const missing = [];

  for (const routePath of paths) {
    const result = findOutHtmlForRoute(OUT_DIR, routePath);
    if (!result.ok) {
      missing.push({ path: routePath, tried: result.candidates });
    }
  }

  if (missing.length > 0) {
    console.error(
      `[check-routes] ${missing.length}/${paths.length} 경로에 HTML 없음:\n`,
    );
    for (const item of missing.slice(0, 40)) {
      console.error(`  ${item.path}`);
      console.error(`    tried: ${item.tried.slice(0, 4).join(", ")}...`);
    }
    if (missing.length > 40) {
      console.error(`  ... 외 ${missing.length - 40}건`);
    }
    process.exit(1);
  }
}

function pickSampleDynamicPath(paths, prefix) {
  return paths.find((p) => p.startsWith(prefix) && p !== prefix);
}

function assertSampleRoutes(allPaths) {
  const checks = [...SAMPLE_PATHS];

  const blog = pickSampleDynamicPath(allPaths, "/blog/");
  const faq = pickSampleDynamicPath(allPaths, "/faq/");
  const media = pickSampleDynamicPath(allPaths, "/media/");
  const external = pickSampleDynamicPath(allPaths, "/blog/external/");

  if (blog) checks.push(blog);
  if (faq) checks.push(faq);
  if (media) checks.push(media);
  if (external) checks.push(external);

  const failed = [];
  for (const routePath of checks) {
    const result = findOutHtmlForRoute(OUT_DIR, routePath);
    if (!result.ok) {
      failed.push(routePath);
    }
  }

  if (failed.length > 0) {
    fail(`샘플 경로 HTML 누락: ${failed.join(", ")}`);
  }

  console.log(`[check-routes] 샘플 경로 ${checks.length}건 OK`);
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

function assertSitemapMatchesBuild(indexablePaths) {
  if (!fs.existsSync(SITEMAP_PATH)) {
    fail("out/sitemap.xml 없음");
  }

  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sitemapPaths = locs.map(decodeSitemapUrl);
  const indexableSet = new Set(indexablePaths.map(normalizePath));

  if (sitemapPaths.length !== indexablePaths.length) {
    fail(
      `sitemap URL 수(${sitemapPaths.length}) ≠ 색인 pageData(${indexablePaths.length})`,
    );
  }

  const sitemapSet = new Set(sitemapPaths);
  const missingFromSitemap = indexablePaths.filter(
    (p) => !sitemapSet.has(normalizePath(p)),
  );
  if (missingFromSitemap.length > 0) {
    fail(
      `sitemap 누락 ${missingFromSitemap.length}건: ${missingFromSitemap.slice(0, 10).join(", ")}`,
    );
  }

  const missingHtml = [];
  for (const routePath of indexablePaths) {
    const result = findOutHtmlForRoute(OUT_DIR, routePath);
    if (!result.ok) {
      missingHtml.push(routePath);
    }
  }

  if (missingHtml.length > 0) {
    fail(
      `sitemap 색인 URL 중 HTML 없음 ${missingHtml.length}건: ${missingHtml.slice(0, 10).join(", ")}`,
    );
  }

  const dupSitemap = sitemapPaths.filter(
    (p, i) => sitemapPaths.indexOf(p) !== i,
  );
  if (dupSitemap.length > 0) {
    fail(`sitemap 중복 URL: ${[...new Set(dupSitemap)].join(", ")}`);
  }

  console.log(
    `[check-routes] sitemap ${indexablePaths.length}건 = 색인 pageData = out HTML`,
  );
}

function assertCloudflareRedirects() {
  const requiredRules = [
    ["/cases", "/services"],
    ["/press", "/media"],
  ];

  for (const file of [REDIRECTS_PUBLIC, REDIRECTS_OUT]) {
    if (!fs.existsSync(file)) {
      if (file === REDIRECTS_OUT) {
        fail("out/_redirects 없음 — public/_redirects 가 빌드에 복사되지 않았습니다.");
      }
      fail("public/_redirects 없음");
    }

    const content = fs.readFileSync(file, "utf8");
    for (const [from, to] of requiredRules) {
      if (!content.includes(from) || !content.includes(to)) {
        fail(`${path.basename(file)} 에 ${from} → ${to} 리다이렉트 규칙 필요`);
      }
    }
  }

  console.log("[check-routes] Cloudflare _redirects OK (/cases, /press)");
}

function main() {
  console.log("[check-routes] pageData 경로 로드 중…");
  const allPaths = loadPageDataPaths();
  const indexablePaths = getIndexablePaths().map(normalizePath);

  assertNoDuplicatePaths(allPaths);
  assertTrailingSlashConfig();
  assertStaticExportConfig();

  const outCheck = assertOutDirExists(OUT_DIR);
  if (!outCheck.ok) {
    fail(outCheck.message);
  }

  console.log(`[check-routes] out/ HTML 검증 (${allPaths.length} paths)…`);
  assertOutRoutes(allPaths);

  assertSampleRoutes(allPaths);
  assertSitemapMatchesBuild(indexablePaths);
  assertCloudflareRedirects();

  console.log("");
  console.log(`[check-routes] OK — 누락 0 / 중복 0 / 전체 ${allPaths.length} paths`);
  console.log(`[check-routes] 색인 ${indexablePaths.length} URLs = sitemap = HTML`);
}

main();
