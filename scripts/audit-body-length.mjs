/**
 * 본문형 페이지 콘텐츠 길이 감사.
 * 출력: scripts/output/body-length-audit.json
 *
 * 기준: 조합된 본문 텍스트 1,500자 미만 → short 목록
 * (상황·법인·특수법인·상담 의도 콘텐츠의 실제 필드 합산)
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "scripts/output/body-length-audit.json");
const require = createRequire(import.meta.url);

function strip(s) {
  return String(s || "")
    .replace(/[`*_#>[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function joinLen(parts) {
  return strip(parts.filter(Boolean).join(" ")).length;
}

function loadTsViaJiti(rel) {
  // Prefer compiled/runtime import through next/tsx if available; else regex fallback
  try {
    const jiti = require("jiti")(__filename, {
      interopDefault: true,
      esmResolve: true,
    });
    return jiti(path.join(ROOT, rel));
  } catch {
    return null;
  }
}

/** Fallback: extract string fields from TS object literals (rough). */
function approxFromFile(filePath, slug) {
  const text = fs.readFileSync(filePath, "utf8");
  // Find block starting at slug: "..."
  const re = new RegExp(
    `slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?(?=slug:\\s*"|$|];)`,
  );
  const m = text.match(re);
  const block = m ? m[0] : text;
  const longStrings = [...block.matchAll(/"((?:[^"\\]|\\.){20,})"/g)].map((x) =>
    strip(x[1]),
  );
  return joinLen(longStrings);
}

function measureSituation(page) {
  const solutionText = (page.solutions || [])
    .map((s) => `${s.title} ${s.body} ${s.whenToChoose}`)
    .join(" ");
  return joinLen([
    page.intro,
    page.conclusion,
    ...(page.situationChecklist || []),
    ...(page.firstChecks || []),
    solutionText,
    ...(page.selfHandleCases || []),
    ...(page.lawyerNeededCases || []),
    ...(page.costFactors || []),
    ...(page.commonMistakes || []),
    page.caseExample?.title,
    page.caseExample?.body,
    ...(page.documents || []),
    ...(page.procedures || []),
    ...(page.faqs || []).flatMap((f) => [f.question, f.answer]),
  ]);
}

function measureIntentContent(c) {
  return joinLen([
    c.heroIntro,
    ...(c.heroParagraphs || []),
    c.conclusion,
    ...(c.whoNeedsThis || []),
    ...(c.whenAndDeadline || []),
    ...(c.decisionBodies || []),
    ...(c.documents || []),
    ...(c.procedures || []),
    ...(c.costFactors || []),
    ...(c.penaltyRisks || []),
    ...(c.commonConfusions || []),
    ...(c.diyErrors || []),
    c.anonymousCase,
    ...(c.faqs || []).flatMap((f) => [f.question, f.answer]),
  ]);
}

function measureCounsel(c) {
  return joinLen([
    c.heroIntro,
    ...(c.heroParagraphs || []),
    ...(c.summaryItems || []).map((i) => `${i.label} ${i.value}`),
    ...(c.situationCards || []).map((i) => `${i.title} ${i.description}`),
    ...(c.supportItems || []),
    ...(c.documents || []),
    ...(c.procedures || []),
    ...(c.commonMistakes || []),
    ...(c.costFactors || []),
    ...(c.faqs || []).flatMap((f) => [f.question, f.answer]),
    c.ctaText,
  ]);
}

const rows = [];

// Situations via jiti or file scan
try {
  const sitMod = loadTsViaJiti("src/lib/situations/index.ts");
  const pages =
    sitMod?.getAllSituationPages?.() ||
    sitMod?.allSituationPages ||
    [];
  for (const page of pages) {
    const chars = measureSituation(page);
    rows.push({
      slug: page.slug,
      path: page.path,
      source: "situations",
      approxChars: chars,
      short: chars < 1500,
    });
  }
} catch (e) {
  console.warn("[audit] situations jiti failed:", e.message);
}

try {
  const corp = loadTsViaJiti("src/lib/corporate-intent/content/index.ts");
  const list =
    corp?.corporatePages ||
    corp?.corporateIntentPages ||
    corp?.allCorporateContent ||
    corp?.default ||
    [];
  const pages = Array.isArray(list) ? list : Object.values(list).flat();
  for (const c of pages) {
    if (!c?.slug) continue;
    const chars = measureIntentContent(c);
    rows.push({
      slug: c.slug,
      path: `/${c.slug}`,
      source: "corporate-intent",
      approxChars: chars,
      short: chars < 1500,
    });
  }
} catch (e) {
  console.warn("[audit] corporate jiti failed:", e.message);
}

try {
  const building = loadTsViaJiti("src/lib/building-intent/content/index.ts");
  const list =
    building?.buildingPages ||
    building?.default ||
    [];
  const pages = Array.isArray(list) ? list : Object.values(list).flat();
  for (const c of pages) {
    if (!c?.slug) continue;
    const chars = measureIntentContent(c);
    rows.push({
      slug: c.slug,
      path: `/${c.slug}`,
      source: "building-intent",
      approxChars: chars,
      short: chars < 1500,
    });
  }
} catch (e) {
  console.warn("[audit] building jiti failed:", e.message);
}

try {
  const special = loadTsViaJiti(
    "src/lib/special-entity-intent/content/index.ts",
  );
  const list =
    special?.allSpecialEntityContent ||
    special?.specialEntityPages ||
    special?.default ||
    [];
  const pages = Array.isArray(list) ? list : Object.values(list).flat();
  for (const c of pages) {
    if (!c?.slug) continue;
    const chars = measureIntentContent(c);
    rows.push({
      slug: c.slug,
      path: `/${c.slug}`,
      source: "special-entity-intent",
      approxChars: chars,
      short: chars < 1500,
    });
  }
} catch (e) {
  console.warn("[audit] special jiti failed:", e.message);
}

// Regex fallback pools if jiti returned nothing for a family
if (!rows.some((r) => r.source === "special-entity-intent")) {
  const dir = path.join(ROOT, "src/lib/special-entity-intent/content");
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".ts") || name === "shared.ts" || name === "index.ts")
      continue;
    const full = path.join(dir, name);
    const text = fs.readFileSync(full, "utf8");
    const slugs = [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
    for (const slug of slugs) {
      const chars = approxFromFile(full, slug);
      rows.push({
        slug,
        path: `/${slug}`,
        source: `special-entity-intent/${name}`,
        approxChars: chars,
        short: chars < 1500,
      });
    }
  }
}

if (!rows.some((r) => r.source === "corporate-intent")) {
  const full = path.join(ROOT, "src/lib/corporate-intent/content/intents.ts");
  if (fs.existsSync(full)) {
    const text = fs.readFileSync(full, "utf8");
    const slugs = [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
    for (const slug of slugs) {
      const chars = approxFromFile(full, slug);
      rows.push({
        slug,
        path: `/${slug}`,
        source: "corporate-intent/intents.ts",
        approxChars: chars,
        short: chars < 1500,
      });
    }
  }
}

if (!rows.some((r) => r.source === "situations")) {
  const dir = path.join(ROOT, "src/lib/situations/pages");
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".ts") || name === "index.ts") continue;
    const full = path.join(dir, name);
    const text = fs.readFileSync(full, "utf8");
    const slugs = [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
    for (const slug of slugs) {
      const chars = approxFromFile(full, slug);
      rows.push({
        slug,
        path: `/situations/${slug}`,
        source: `situations/${name}`,
        approxChars: chars,
        short: chars < 1500,
      });
    }
  }
}

const bySlug = new Map();
for (const row of rows) {
  const prev = bySlug.get(row.slug);
  if (!prev || row.approxChars > prev.approxChars) bySlug.set(row.slug, row);
}

const sorted = [...bySlug.values()].sort((a, b) => a.approxChars - b.approxChars);
const short = sorted.filter((r) => r.short);

const report = {
  generatedAt: new Date().toISOString(),
  threshold: 1500,
  method:
    "콘텐츠 객체 필드 합산(가능 시) 또는 슬러그 블록 문자열 근사. SSR 렌더 글자 수와 다를 수 있음.",
  totalPages: sorted.length,
  shortCount: short.length,
  shortPages: short.map((r) => ({
    slug: r.slug,
    path: r.path,
    approxChars: r.approxChars,
    source: r.source,
    recommendation:
      r.approxChars < 800
        ? "본문 보강 우선 또는 상위 허브 통합·noindex 검토"
        : "본문 줄글 보강 권장",
  })),
  okSample: sorted
    .filter((r) => !r.short)
    .slice(0, 15)
    .map((r) => ({ slug: r.slug, approxChars: r.approxChars })),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
console.log(
  `[body-length-audit] total=${report.totalPages} short=${report.shortCount} → ${OUT}`,
);
