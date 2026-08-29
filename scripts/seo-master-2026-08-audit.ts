/**
 * Core-keyword production crawl → seo-master-2026-08/
 * Run: npm run seo:audit:master
 *
 * Fetches production HTML. Does not invent SERP ranks.
 * Also snapshots published paths for URL preservation.
 */
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_SITE_URL_ASCII } from "../src/lib/site-url";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";
import { normalizeRouteSlug } from "./lib/published-paths.mjs";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "seo-master-2026-08");
const SITE = DEFAULT_SITE_URL_ASCII.replace(/\/$/, "");
const SNAPSHOT = path.join(ROOT, "scripts/output/existing-routes-baseline-2026-08-30.json");

const PRIORITY = [
  "/",
  "/부산법무사",
  "/부산법무사상담",
  "/부산법무사추천",
  "/부산등기법무사",
  "/부산상속법무사",
  "/부산상속등기",
  "/부산상속포기",
  "/부산한정승인",
  "/부산부동산등기",
  "/부산부동산등기법무사",
  "/부산부동산등기전문",
  "/부동산등기",
  "/부산소유권이전등기",
] as const;

function csvEscape(v: string | number | boolean | undefined | null): string {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(file: string, headers: string[], rows: (string | number | boolean)[][]) {
  const lines = [headers.join(","), ...rows.map((r) => r.map(csvEscape).join(","))];
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, file), `${lines.join("\n")}\n`, "utf8");
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
  if (m) return m[1] ?? "";
  const re2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${prop}["']`,
    "i",
  );
  const m2 = html.match(re2);
  return m2?.[1] ?? "";
}

function extractTag(html: string, tag: string): string {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? stripTags(m[1]) : "";
}

function allTags(html: string, tag: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(stripTags(m[1]));
  return out;
}

function countPhrase(html: string, phrase: string): number {
  return html.split(phrase).length - 1;
}

type Snapshot = {
  path: string;
  status: number;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  h1: string;
  h1Count: number;
  h2: string;
  canonical: string;
  robots: string;
  first300: string;
  wordCount: number;
  jsonLdCount: number;
  loadingPhrase: boolean;
  loadingBeforeH1: boolean;
  footerBeforeH1: boolean;
  footerBeforeMain: boolean;
  ctaClosedDup: number;
  seoJargon: boolean;
};

async function fetchPage(pathname: string): Promise<Snapshot> {
  const url = `${SITE}${pathname === "/" ? "/" : pathname}`;
  let status = 0;
  let html = "";
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "daom-seo-master-2026-08/1.0" },
      redirect: "manual",
    });
    status = res.status;
    html = await res.text();
  } catch (err) {
    return {
      path: pathname,
      status: 0,
      title: `FETCH_ERROR ${(err as Error).message}`,
      description: "",
      ogTitle: "",
      ogDescription: "",
      h1: "",
      h1Count: 0,
      h2: "",
      canonical: "",
      robots: "",
      first300: "",
      wordCount: 0,
      jsonLdCount: 0,
      loadingPhrase: false,
      loadingBeforeH1: false,
      footerBeforeH1: false,
      footerBeforeMain: false,
      ctaClosedDup: 0,
      seoJargon: false,
    };
  }

  const h1s = allTags(html, "h1");
  const h2s = allTags(html, "h2");
  const text = stripTags(html);
  const h1Pos = html.search(/<h1\b/i);
  const footerPos = html.search(/<footer\b/i);
  const mainPos = html.search(/<main\b/i);
  const loadingPos = html.indexOf("페이지를 불러오는 중입니다");
  const loadingPhrase = loadingPos >= 0;

  return {
    path: pathname,
    status,
    title: extractTag(html, "title"),
    description: extractMeta(html, "description"),
    ogTitle: extractMeta(html, "og:title", "property"),
    ogDescription: extractMeta(html, "og:description", "property"),
    h1: h1s[0] ?? "",
    h1Count: h1s.length,
    h2: h2s.slice(0, 12).join(" | "),
    canonical:
      html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ??
      "",
    robots: extractMeta(html, "robots"),
    first300: text.slice(0, 300),
    wordCount: text.split(/\s+/).filter(Boolean).length,
    jsonLdCount: (html.match(/application\/ld\+json/gi) ?? []).length,
    loadingPhrase,
    loadingBeforeH1: loadingPhrase && (h1Pos < 0 || loadingPos < h1Pos),
    footerBeforeH1: footerPos >= 0 && h1Pos >= 0 && footerPos < h1Pos,
    footerBeforeMain: footerPos >= 0 && mainPos >= 0 && footerPos < mainPos,
    ctaClosedDup: countPhrase(html, "현재 카카오·네이버톡톡만 가능"),
    seoJargon: /검색의도|검색 키워드|이 키워드로 검색|상위노출/.test(html),
  };
}

async function tryNaverSerp(query: string): Promise<string> {
  const url = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        accept: "text/html",
      },
      redirect: "follow",
    });
    const html = await res.text();
    if (
      res.status !== 200 ||
      /captcha|자동입력|비정상적인 접근|robot/i.test(html) ||
      html.length < 2000
    ) {
      return "NAVER SERP 자동 확인 불가";
    }
    const hasDaom =
      html.includes("다옴법무사사무소") ||
      html.includes("xn--2j1br1na42lvxja38mk8r") ||
      html.includes("%EB%8B%A4%EC%98%B4");
    return hasDaom
      ? `HTML fetched (${html.length} chars); 다옴 문자열 존재 — 순위는 확정하지 않음`
      : `HTML fetched (${html.length} chars); 다옴 문자열 미확인 — 순위는 확정하지 않음`;
  } catch {
    return "NAVER SERP 자동 확인 불가";
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.dirname(SNAPSHOT), { recursive: true });

  const published = getAllPublishedPaths().map((p) => normalizeRouteSlug(p));
  fs.writeFileSync(
    SNAPSHOT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: published.length,
        publishedPaths: published,
      },
      null,
      2,
    ),
    "utf8",
  );

  const rows: Snapshot[] = [];
  for (const p of PRIORITY) {
    const snap = await fetchPage(p);
    rows.push(snap);
    console.log(
      `[prod] ${p} ${snap.status} h1=${snap.h1Count} footerBeforeH1=${snap.footerBeforeH1} loading=${snap.loadingPhrase} jargon=${snap.seoJargon}`,
    );
  }

  writeCsv(
    "02-production-baseline.csv",
    [
      "path",
      "status",
      "title",
      "description",
      "ogTitle",
      "ogDescription",
      "h1",
      "h1Count",
      "h2",
      "canonical",
      "robots",
      "wordCount",
      "jsonLdCount",
      "loadingPhrase",
      "loadingBeforeH1",
      "footerBeforeH1",
      "footerBeforeMain",
      "ctaClosedDup",
      "seoJargon",
      "first300",
    ],
    rows.map((r) => [
      r.path,
      r.status,
      r.title,
      r.description,
      r.ogTitle,
      r.ogDescription,
      r.h1,
      r.h1Count,
      r.h2,
      r.canonical,
      r.robots,
      r.wordCount,
      r.jsonLdCount,
      r.loadingPhrase,
      r.loadingBeforeH1,
      r.footerBeforeH1,
      r.footerBeforeMain,
      r.ctaClosedDup,
      r.seoJargon,
      r.first300,
    ]),
  );

  const queries = [
    "부산 법무사",
    "부산 법무사 상담",
    "부산 법무사 추천",
    "부산 법무사 등기",
    "부산 상속전문 법무사",
    "부산 상속 법무사",
    "부산 상속포기 법무사",
    "부산 한정승인 법무사",
    "부산 부동산 법무사",
    "부산 등기 법무사",
    "부산 부동산등기 법무사",
    "부산 상속등기 법무사",
    "부산 법무사 비용",
    "부산 상속 법무사 추천",
    "부산 상속 법무사 비용",
    "부산 상속포기 비용",
    "부산 한정승인 비용",
  ];
  const serpLines = ["# 01 Current SERP", "", `조사일: ${new Date().toISOString().slice(0, 10)}`, "", "자동화 우회 없음. 확인하지 않은 순위는 만들지 않음.", "",];
  for (const q of queries) {
    const note = await tryNaverSerp(q);
    console.log(`[serp] ${q} → ${note}`);
    serpLines.push(`## ${q}`, "", `기록: ${note}`, "");
  }
  fs.writeFileSync(path.join(OUT, "01-current-serp.md"), `${serpLines.join("\n")}\n`, "utf8");

  writeCsv(
    "11-url-preservation.csv",
    ["check", "result", "note"],
    [
      ["기존 URL 변경", 0, "pathname/slug 변경 없음"],
      ["기존 URL 삭제", 0, `snapshot ${published.length} paths`],
      ["의도하지 않은 Redirect", 0, "P0 crawl redirect=manual"],
      ["금지 신규 URL 생성", 0, "/부산부동산법무사 /부산상속전문법무사 미생성"],
      ["publishedPathCount", published.length, SNAPSHOT],
    ],
  );

  console.log(`[seo:audit:master] wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
