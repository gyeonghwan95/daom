/**
 * NAVER SEO Master Rebuild — Phase 0 audit artifacts → seo-audit/
 * Run: npx tsx scripts/seo-master-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath, pathToSitemapUrl } from "../src/lib/pageData/sitemap";
import { DEFAULT_SITE_URL_ASCII } from "../src/lib/site-url";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "seo-audit");
const SITE = DEFAULT_SITE_URL_ASCII.replace(/\/$/, "");
const LOCAL_OUT = path.join(ROOT, "out");

const PRIORITY_A = [
  "/",
  "/부산법무사",
  "/부산법무사추천",
  "/부산법무사상담",
  "/부산상속법무사",
  "/부산상속포기",
  "/부산등기법무사",
  "/상속",
] as const;

const SAMPLE_EXTRA = [
  "/부산한정승인",
  "/부산상속등기",
  "/부산부동산등기",
  "/부산법인법무사",
  "/부산개인회생",
  "/해운대법무사",
  "/센텀법무사",
  "/자가진단",
  "/업무사례",
  "/partners",
  "/법률강의",
  "/부산법무사비용",
  "/부산법무사후기",
  "/전세사기피해대응절차",
] as const;

function csvEscape(v: string | number | boolean | undefined | null): string {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(file: string, headers: string[], rows: (string | number | boolean)[][]) {
  const lines = [
    headers.join(","),
    ...rows.map((r) => r.map(csvEscape).join(",")),
  ];
  fs.writeFileSync(path.join(OUT, file), lines.join("\n") + "\n", "utf8");
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html: string, prop: string, attr = "name"): string {
  const re = new RegExp(
    `<meta[^>]*${attr}=["']${prop}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${prop}["']`,
    "i",
  );
  const m2 = html.match(re2);
  return m2?.[1] ?? "";
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? stripTags(m[1]) : "";
}

function extractCanonical(html: string): string {
  const m = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  return m?.[1] ?? "";
}

function extractH1(html: string): string {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? stripTags(m[1]).slice(0, 200) : "";
}

function countH1(html: string): number {
  return (html.match(/<h1\b/gi) ?? []).length;
}

function first300(html: string): string {
  return stripTags(html).slice(0, 300);
}

function wordCount(html: string): number {
  return stripTags(html).length;
}

function footerBeforeH1(html: string): boolean {
  const f = html.search(/<footer\b/i);
  const h = html.search(/<h1\b/i);
  if (f < 0 || h < 0) return false;
  return f < h;
}

function hasLoadingPhrase(html: string): boolean {
  return html.includes("페이지를 불러오는 중입니다");
}

function readLocalHtml(urlPath: string): string | null {
  const rel =
    urlPath === "/"
      ? "index.html"
      : `${decodeURIComponent(urlPath.replace(/^\//, ""))}/index.html`;
  const candidates = [
    path.join(LOCAL_OUT, rel),
    path.join(LOCAL_OUT, `${urlPath.replace(/^\//, "")}.html`),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return fs.readFileSync(c, "utf8");
  }
  return null;
}

async function fetchHtml(urlPath: string): Promise<{
  status: number;
  html: string;
  error?: string;
  source: "local-out" | "production" | "none";
}> {
  const local = readLocalHtml(urlPath);
  if (local) {
    return { status: 200, html: local, source: "local-out" };
  }

  const encoded =
    urlPath === "/"
      ? `${SITE}/`
      : `${SITE}/${urlPath
          .split("/")
          .filter(Boolean)
          .map((s) => encodeURIComponent(s))
          .join("/")}`;
  try {
    const res = await fetch(encoded, {
      headers: {
        "user-agent": "daom-seo-master-audit/1.0",
        accept: "text/html",
      },
      redirect: "follow",
    });
    const html = await res.text();
    return { status: res.status, html, source: "production" };
  } catch (e) {
    return {
      status: 0,
      html: "",
      error: e instanceof Error ? e.message : String(e),
      source: "none",
    };
  }
}

function mainInventory() {
  const pages = getAllPageData();
  const rows = pages.map((p) => {
    const indexable = isIndexablePagePath(p.path);
    return [
      p.path,
      p.title ?? "",
      p.metaTitle ?? "",
      p.h1 ?? "",
      p.category ?? "",
      p.primaryKeyword ?? (p.primaryKeywords?.[0] ?? ""),
      indexable ? "yes" : "no",
      pathToSitemapUrl(p.path),
    ];
  });
  writeCsv(
    "02-url-inventory.csv",
    [
      "path",
      "title",
      "metaTitle",
      "h1",
      "category",
      "primaryKeyword",
      "indexable",
      "sitemapUrl",
    ],
    rows,
  );
  const indexableCount = pages.filter((p) => isIndexablePagePath(p.path)).length;
  fs.writeFileSync(
    path.join(OUT, "02-url-inventory-summary.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalPages: pages.length,
        indexable: indexableCount,
        nonIndexable: pages.length - indexableCount,
        priorityA: [...PRIORITY_A],
      },
      null,
      2,
    ),
    "utf8",
  );
  return { total: pages.length, indexable: indexableCount };
}

async function crawlDeep() {
  const targets = [...new Set([...PRIORITY_A, ...SAMPLE_EXTRA])];
  const urlRows: (string | number | boolean)[][] = [];
  const metaRows: (string | number | boolean)[][] = [];

  for (const p of targets) {
    const { status, html, error, source } = await fetchHtml(p);
    urlRows.push([
      p,
      status,
      error ?? "",
      source,
      extractTitle(html),
      extractH1(html),
      countH1(html),
      extractCanonical(html),
      extractMeta(html, "robots") || "n/a",
      footerBeforeH1(html),
      hasLoadingPhrase(html),
      wordCount(html),
      PRIORITY_A.includes(p as (typeof PRIORITY_A)[number])
        ? "priority-a"
        : "sample",
    ]);
    metaRows.push([
      p,
      extractTitle(html),
      extractMeta(html, "description"),
      extractMeta(html, "og:title", "property"),
      extractMeta(html, "og:description", "property"),
      extractH1(html),
      extractCanonical(html),
      first300(html),
    ]);
    await new Promise((r) => setTimeout(r, 50));
  }

  writeCsv(
    "urls.csv",
    [
      "path",
      "status",
      "error",
      "source",
      "title",
      "h1",
      "h1Count",
      "canonical",
      "robots",
      "footerBeforeH1",
      "hasLoadingPhrase",
      "bodyCharCount",
      "tier",
    ],
    urlRows,
  );
  writeCsv(
    "metadata.csv",
    [
      "path",
      "title",
      "description",
      "ogTitle",
      "ogDescription",
      "h1",
      "canonical",
      "first300",
    ],
    metaRows,
  );
  return urlRows;
}

function writeInternalLinksStub() {
  const pages = getAllPageData();
  const byPath = new Map(pages.map((p) => [p.path, p]));
  const rows: (string | number)[][] = [];
  for (const p of PRIORITY_A) {
    const page = byPath.get(p);
    const links = page?.relatedLinks ?? [];
    for (const link of links) {
      rows.push([p, link.href, link.label ?? "", "pageData"]);
    }
  }
  writeCsv(
    "internal-links.csv",
    ["fromPath", "toHref", "anchor", "source"],
    rows,
  );
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const inv = mainInventory();
  console.log(`[seo-master-audit] inventory ${inv.total} (${inv.indexable} indexable)`);
  writeInternalLinksStub();
  const crawl = await crawlDeep();
  const footerIssues = crawl.filter((r) => r[9] === true).length;
  const loadingIssues = crawl.filter((r) => r[10] === true).length;
  console.log(
    `[seo-master-audit] crawled ${crawl.length}; footerBeforeH1=${footerIssues}; loadingPhrase=${loadingIssues}`,
  );
  console.log(`[seo-master-audit] wrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
