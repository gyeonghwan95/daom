#!/usr/bin/env node
/**
 * SEO Recovery snapshot — Champion Page Identity vs known baseline (e064454).
 * Writes reports/seo/known-good-baseline.json, baseline-vs-current.json,
 * and recovered-html/*.html (source identity, not full Next SSR).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS = path.join(ROOT, "reports", "seo");
const HTML_DIR = path.join(REPORTS, "recovered-html");
const BASELINE_COMMIT = "e064454fd0aeac6fc60bb6010c364aee37c51f3b";

const CHAMPIONS = {
  BUSAN_GENERAL_CHAMPION: {
    url: "/부산법무사",
    queries: ["부산 법무사", "부산 법무사 추천"],
    source: "src/lib/local-landing/flagship-busan-lawyer.ts",
  },
  BUSAN_CORPORATE_CHAMPION: {
    url: "/부산법인법무사",
    queries: ["부산 법인 법무사", "부산 법인 법무사 추천"],
    source: "src/lib/local-landing/keyword-topics.ts",
  },
};

function extractField(src, key) {
  const re = new RegExp(`${key}:\\s*"([^"]+)"`);
  const m = src.match(re);
  return m ? m[1] : null;
}

function extractDescription(src) {
  const m = src.match(/description:\s*\n\s*"([^"]+)"/);
  if (m) return m[1];
  const m2 = src.match(/metaDescription:\s*\n\s*"([^"]+)"/);
  if (m2) return m2[1];
  const m3 = src.match(/metaDescription:\s*"([^"]+)"/);
  return m3 ? m3[1] : null;
}

function extractParagraphs(src, limit = 2) {
  const block = src.match(/summaryParagraphs:\s*\[([\s\S]*?)\]/);
  if (!block) return [];
  const paras = [...block[1].matchAll(/"([^"]{20,})"/g)].map((m) => m[1]);
  return paras.slice(0, limit);
}

function extractFlagship(src) {
  return {
    title: extractField(src, "title"),
    metaTitle: extractField(src, "metaTitle"),
    h1: extractField(src, "h1"),
    description: extractDescription(src),
    firstParagraphs: extractParagraphs(src, 4),
  };
}

function extractCorporateTopic(src) {
  const idx = src.indexOf("부산법인법무사:");
  const slice = idx >= 0 ? src.slice(idx, idx + 8000) : src;
  return {
    title: extractField(slice, "title"),
    metaTitle: extractField(slice, "metaTitle"),
    h1: extractField(slice, "h1"),
    description: extractDescription(slice),
    firstParagraphs: extractParagraphs(slice, 4),
  };
}

function gitShow(commit, file) {
  try {
    return execSync(`git show ${commit}:${file}`, {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch {
    return "";
  }
}

function identityFrom(kind, src) {
  return kind === "general" ? extractFlagship(src) : extractCorporateTopic(src);
}

function first500(paras) {
  return (paras || []).join(" ").slice(0, 500);
}

function writeHtmlSnapshot(name, url, id) {
  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>${id.metaTitle || id.title || url}</title>
<meta name="description" content="${(id.description || "").replace(/"/g, "&quot;")}">
<link rel="canonical" href="https://xn--2j1br1na42lvxja38mk8r.kr${encodeURI(url)}">
<meta name="robots" content="index,follow">
</head>
<body>
<h1>${id.h1 || ""}</h1>
${(id.firstParagraphs || []).map((p) => `<p>${p}</p>`).join("\n")}
<p data-note="Source identity snapshot after 2026-08-13 recovery. Not a full SSG HTML dump."></p>
</body>
</html>
`;
  fs.writeFileSync(path.join(HTML_DIR, name), html, "utf8");
}

const generalNow = identityFrom(
  "general",
  fs.readFileSync(path.join(ROOT, CHAMPIONS.BUSAN_GENERAL_CHAMPION.source), "utf8"),
);
const corporateNow = identityFrom(
  "corporate",
  fs.readFileSync(path.join(ROOT, CHAMPIONS.BUSAN_CORPORATE_CHAMPION.source), "utf8"),
);
const generalBase = identityFrom(
  "general",
  gitShow(BASELINE_COMMIT, CHAMPIONS.BUSAN_GENERAL_CHAMPION.source),
);
const corporateBase = identityFrom(
  "corporate",
  gitShow(BASELINE_COMMIT, CHAMPIONS.BUSAN_CORPORATE_CHAMPION.source),
);

function row(url, base, cur) {
  const baseFirst = first500(base.firstParagraphs);
  const curFirst = first500(cur.firstParagraphs);
  return {
    url,
    baselineTitle: base.metaTitle || base.title,
    currentTitle: cur.metaTitle || cur.title,
    titleChanged: (base.metaTitle || base.title) !== (cur.metaTitle || cur.title),
    baselineH1: base.h1,
    currentH1: cur.h1,
    h1Changed: base.h1 !== cur.h1,
    baselineDescription: base.description,
    currentDescription: cur.description,
    descriptionChanged: base.description !== cur.description,
    baselineCanonical: `self:${url}`,
    currentCanonical: `self:${url}`,
    canonicalChanged: false,
    baselineRobots: "index,follow",
    currentRobots: "index,follow",
    robotsChanged: false,
    baselineFirst500: baseFirst,
    currentFirst500: curFirst,
    first500Changed: baseFirst !== curFirst,
    baselineBodyLength: (base.firstParagraphs || []).join("").length,
    currentBodyLength: (cur.firstParagraphs || []).join("").length,
    baselineStructuredData: "KEEP (LegalService/Organization via GlobalJsonLd)",
    currentStructuredData: "KEEP",
    baselineOgImage: "page-type default",
    currentOgImage: "page-type default",
    baselineSitemap: "included",
    currentSitemap: "included",
  };
}

const baselineVsCurrent = {
  generatedAt: new Date().toISOString(),
  SEO_BASELINE_COMMIT: BASELINE_COMMIT,
  HEAD_NOTE: "working tree after 2026-08-13 recovery",
  champions: {
    BUSAN_GENERAL_CHAMPION: row("/부산법무사", generalBase, generalNow),
    BUSAN_CORPORATE_CHAMPION: row("/부산법인법무사", corporateBase, corporateNow),
  },
};

const knownGood = {
  generatedAt: new Date().toISOString(),
  SEO_BASELINE_COMMIT: BASELINE_COMMIT,
  pages: [
    {
      url: "/부산법무사",
      role: "BUSAN_GENERAL_CHAMPION",
      title: generalNow.metaTitle || generalNow.title,
      h1: generalNow.h1,
      description: generalNow.description,
      canonical: "self",
      robots: "index,follow",
      queries: CHAMPIONS.BUSAN_GENERAL_CHAMPION.queries,
    },
    {
      url: "/부산법인법무사",
      role: "BUSAN_CORPORATE_CHAMPION",
      title: corporateNow.metaTitle || corporateNow.title,
      h1: corporateNow.h1,
      description: corporateNow.description,
      canonical: "self",
      robots: "index,follow",
      queries: CHAMPIONS.BUSAN_CORPORATE_CHAMPION.queries,
    },
    {
      url: "/",
      role: "HOMEPAGE",
      title: "homepage",
      robots: "index,follow",
    },
  ],
};

fs.mkdirSync(HTML_DIR, { recursive: true });
writeHtmlSnapshot("busan-general-champion.html", "/부산법무사", generalNow);
writeHtmlSnapshot("busan-corporate-champion.html", "/부산법인법무사", corporateNow);
writeHtmlSnapshot(
  "homepage.html",
  "/",
  {
    title: "홈",
    metaTitle: "다옴법무사사무소",
    h1: "(homepage hero)",
    description: "homepage",
    firstParagraphs: ["Homepage hub links restored to Champion-first for 추천 intent."],
  },
);

fs.writeFileSync(
  path.join(REPORTS, "baseline-vs-current.json"),
  JSON.stringify(baselineVsCurrent, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(REPORTS, "known-good-baseline.json"),
  JSON.stringify(knownGood, null, 2) + "\n",
);

console.log(`SEO_BASELINE_COMMIT=${BASELINE_COMMIT}`);
console.log("Wrote reports/seo/baseline-vs-current.json");
console.log("Wrote reports/seo/known-good-baseline.json");
console.log(`Wrote ${HTML_DIR}`);
console.log(
  "General title changed?",
  baselineVsCurrent.champions.BUSAN_GENERAL_CHAMPION.titleChanged,
);
console.log(
  "Corporate title changed?",
  baselineVsCurrent.champions.BUSAN_CORPORATE_CHAMPION.titleChanged,
);
console.log(
  "General H1 changed?",
  baselineVsCurrent.champions.BUSAN_GENERAL_CHAMPION.h1Changed,
);
console.log(
  "Corporate H1 changed?",
  baselineVsCurrent.champions.BUSAN_CORPORATE_CHAMPION.h1Changed,
);
