#!/usr/bin/env node
/**
 * 자가진단 페이지 검증
 * - diagnosis 데이터 ↔ out/ HTML ↔ sitemap
 * - SEO·콘텐츠·CTA·중복 title/description
 */
import { createJiti } from "jiti";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findOutHtmlForRoute } from "./lib/out-route.mjs";
import { normalizeRouteSlug } from "./lib/published-paths.mjs";
import { getSiteUrl } from "./lib/site-url.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "out");
const SITEMAP_PATH = path.join(OUT_DIR, "sitemap.xml");
const ROBOTS_PATH = path.join(OUT_DIR, "robots.txt");
const SITE_URL = getSiteUrl().replace(/\/$/, "");

const MIN_QUESTIONS = 4;
const MIN_OUTCOMES = 3;
const MIN_RELATED_LINKS = 5;
const MIN_FAQ = 3;

const CTA_SOURCE_FILES = [
  "src/components/consultation/LawyerConsultationGuide.tsx",
  "src/components/consultation/ConsultationPanel.tsx",
  "src/components/consultation/ConsultationChatTile.tsx",
  "src/components/diagnosis/StickyMobileCTA.tsx",
];

const REQUIRED_DATA_CTA = ["phone", "kakao", "contact"];

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function loadDiagnosisExport() {
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
    alias: {
      "@": path.join(ROOT, "src"),
    },
  });

  const mod = jiti("./export-diagnosis-pages.ts");
  const payload = mod.default ?? mod;

  if (!payload?.ok || !Array.isArray(payload.diagnoses)) {
    fail("export-diagnosis-pages.ts 로드 실패");
    return null;
  }

  return payload;
}

function canonicalPathname(url) {
  try {
    const parsed = new URL(url);
    const pathname = decodeURIComponent(parsed.pathname);
    return pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  } catch {
    return url;
  }
}

function decodeSitemapUrl(url) {
  if (url === SITE_URL || url === `${SITE_URL}/`) return "/";
  const relative = url.startsWith(SITE_URL) ? url.slice(SITE_URL.length) : url;
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

function readSitemapPaths() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    fail("out/sitemap.xml 없음 — npm run build 먼저 실행");
    return new Set();
  }

  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return new Set(locs.map(decodeSitemapUrl).map(normalizeRouteSlug));
}

function findDuplicates(items, keyFn) {
  const map = new Map();
  const grouped = new Map();

  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    if (map.has(key)) {
      const paths = grouped.get(key) ?? [map.get(key)];
      if (!paths.includes(item.path)) {
        paths.push(item.path);
      }
      grouped.set(key, paths);
    } else {
      map.set(key, item.path);
    }
  }

  return grouped;
}

function checkDataFields(diagnoses) {
  for (const item of diagnoses) {
    if (!item.h1) fail(`누락 h1: ${item.path}`);
    if (!item.metaTitle) fail(`누락 metaTitle: ${item.path}`);
    if (!item.metaDescription) fail(`누락 metaDescription: ${item.path}`);
    if (!item.ctaTitle || !item.ctaText) fail(`누락 CTA: ${item.path}`);
    if (item.faqCount < MIN_FAQ) {
      fail(`FAQ 부족 (${item.faqCount}/${MIN_FAQ}): ${item.path}`);
    }
    if (item.relatedLinkCount < MIN_RELATED_LINKS) {
      fail(
        `relatedLinks 부족 (${item.relatedLinkCount}/${MIN_RELATED_LINKS}): ${item.path}`,
      );
    }
    if (!item.isHub) {
      if (item.questionCount < MIN_QUESTIONS) {
        fail(
          `questions 부족 (${item.questionCount}/${MIN_QUESTIONS}): ${item.path}`,
        );
      }
      if (item.outcomeCount < MIN_OUTCOMES) {
        fail(
          `outcomes 부족 (${item.outcomeCount}/${MIN_OUTCOMES}): ${item.path}`,
        );
      }
    }
    if (!item.canonical) fail(`누락 canonical: ${item.path}`);
    if (!item.sitemapUrl) fail(`누락 sitemapUrl: ${item.path}`);
    if (!item.jsonLdCount || item.jsonLdCount < 1) {
      fail(`누락 JSON-LD: ${item.path}`);
    }
    if (!item.hasOgImage) {
      fail(`누락 ogImage(pageData): ${item.path}`);
    }
  }
}

function checkDuplicates(diagnoses) {
  const titleDups = findDuplicates(diagnoses, (item) => item.metaTitle);
  for (const [title, paths] of titleDups) {
    if (paths.length > 1) {
      fail(`중복 metaTitle: "${title}" → ${paths.join(", ")}`);
    }
  }

  const descDups = findDuplicates(diagnoses, (item) => item.metaDescription);
  for (const [desc, paths] of descDups) {
    if (paths.length > 1) {
      const preview = desc.length > 60 ? `${desc.slice(0, 60)}…` : desc;
      fail(`중복 metaDescription: "${preview}" → ${paths.join(", ")}`);
    }
  }
}

function checkOutHtml(diagnoses) {
  if (!fs.existsSync(OUT_DIR)) {
    fail("out/ 폴더 없음 — npm run build 먼저 실행");
    return;
  }

  for (const item of diagnoses) {
    const result = findOutHtmlForRoute(OUT_DIR, item.path);
    if (!result.ok || !result.matched?.[0]) {
      fail(`404 / HTML 없음: ${item.path}`);
      continue;
    }

    const html = fs.readFileSync(path.join(OUT_DIR, result.matched[0]), "utf8");

    if (!/<h1\b/i.test(html)) {
      fail(`빌드 HTML에 h1 없음: ${item.path}`);
    }

    const canonicalMatch = html.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
    );
    if (!canonicalMatch) {
      fail(`빌드 HTML에 canonical 없음: ${item.path}`);
    } else if (
      canonicalPathname(canonicalMatch[1]) !== canonicalPathname(item.canonical)
    ) {
      fail(
        `canonical 불일치 ${item.path}: HTML=${canonicalMatch[1]} 기대=${item.canonical}`,
      );
    }

    if (
      !html.includes('property="og:title"') &&
      !html.includes("property='og:title'")
    ) {
      fail(`빌드 HTML에 OpenGraph title 없음: ${item.path}`);
    }

    if (
      !html.includes('property="og:description"') &&
      !html.includes("property='og:description'")
    ) {
      fail(`빌드 HTML에 OpenGraph description 없음: ${item.path}`);
    }

    if (!html.includes("application/ld+json")) {
      fail(`빌드 HTML에 JSON-LD 없음: ${item.path}`);
    }

    if (!html.includes('data-cta="contact"')) {
      fail(`빌드 HTML에 CTA(data-cta) 없음: ${item.path}`);
    }
  }
}

function checkSitemap(diagnoses, sitemapPaths) {
  for (const item of diagnoses) {
    const key = normalizeRouteSlug(item.path);
    if (!sitemapPaths.has(key)) {
      fail(`sitemap 누락: ${item.path}`);
    }

    if (!fs.existsSync(SITEMAP_PATH)) return;

    const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
    if (!xml.includes(`<loc>${item.sitemapUrl}</loc>`)) {
      fail(`sitemap URL 인코딩 누락: ${item.path} (기대 ${item.sitemapUrl})`);
    }
  }
}

function checkRobots() {
  if (!fs.existsSync(ROBOTS_PATH)) {
    fail("out/robots.txt 없음");
    return;
  }

  const robots = fs.readFileSync(ROBOTS_PATH, "utf8");
  if (!robots.includes("Sitemap:") || !robots.includes("sitemap.xml")) {
    fail(`robots.txt에 Sitemap: ${SITE_URL}/sitemap.xml 필요`);
  }
}

function checkCtaSourceAttributes() {
  const combined = CTA_SOURCE_FILES.map((relativePath) => {
    const filePath = path.join(ROOT, relativePath);
    if (!fs.existsSync(filePath)) {
      fail(`CTA 소스 없음: ${relativePath}`);
      return "";
    }
    return fs.readFileSync(filePath, "utf8");
  }).join("\n");

  for (const attr of REQUIRED_DATA_CTA) {
    if (!combined.includes(`data-cta="${attr}"`)) {
      fail(`CTA 소스에 data-cta="${attr}" 없음 (${CTA_SOURCE_FILES.join(", ")})`);
    }
  }

  if (!combined.includes("trackCTA")) {
    fail(`CTA 소스에 trackCTA 연결 없음 (${CTA_SOURCE_FILES.join(", ")})`);
  }

  const trackPath = path.join(ROOT, "src/lib/analytics/track-cta.ts");
  if (!fs.existsSync(trackPath)) {
    fail("src/lib/analytics/track-cta.ts 없음");
  }
}

function main() {
  console.log("[check-diagnosis] diagnosis 데이터 로드…");
  const payload = loadDiagnosisExport();
  if (!payload) {
    reportAndExit();
    return;
  }

  const diagnoses = payload.diagnoses;
  console.log(`[check-diagnosis] ${diagnoses.length}개 자가진단 페이지 검사…`);

  checkDataFields(diagnoses);
  checkDuplicates(diagnoses);
  checkCtaSourceAttributes();

  const sitemapPaths = readSitemapPaths();
  checkSitemap(diagnoses, sitemapPaths);
  checkRobots();
  checkOutHtml(diagnoses);

  reportAndExit(diagnoses.length);
}

function reportAndExit(total = 0) {
  if (warnings.length > 0) {
    console.warn(`\n[check-diagnosis] 경고 ${warnings.length}건:`);
    for (const item of warnings.slice(0, 10)) {
      console.warn(`  ⚠ ${item}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n[check-diagnosis] 실패 — ${errors.length}건:\n`);
    for (const item of errors.slice(0, 50)) {
      console.error(`  ✗ ${item}`);
    }
    if (errors.length > 50) {
      console.error(`  … 외 ${errors.length - 50}건`);
    }
    process.exit(1);
  }

  console.log("");
  console.log(
    `[check-diagnosis] OK — ${total}개 자가진단 / 404 0 / sitemap 포함 / 중복 title·description 0 / CTA·JSON-LD·OG·canonical 확인`,
  );
}

main();
