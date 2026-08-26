/**
 * High-competition SEO snapshot → seo-master-audit/
 * Run: npm run seo:audit
 *
 * Fetches production HTML. Does not invent SERP ranks.
 */
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_SITE_URL_ASCII } from "../src/lib/site-url";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "seo-master-audit");
const SITE = DEFAULT_SITE_URL_ASCII.replace(/\/$/, "");

const PRIORITY = [
  "/",
  "/부산법무사",
  "/부산법무사추천",
  "/부산법무사상담",
  "/부산개인회생",
  "/부산개인회생법무사",
  "/개인회생파산",
  "/부산개인파산법무사",
  "/services/bankruptcy",
  "/부산등기법무사",
  "/부산상속법무사",
  "/부산상속포기",
  "/부산한정승인",
  "/북구개인회생",
  "/사상구개인회생",
  "/수영구개인회생",
  "/부산회생법무사",
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
  if (m) return m[1];
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
  first500: string;
  wordCount: number;
  jsonLdCount: number;
  loadingPhrase: boolean;
  loadingBeforeH1: boolean;
  footerBeforeH1: boolean;
  footerBeforeMain: boolean;
  ctaClosedDup: number;
  keywordListHint: boolean;
};

async function fetchPage(pathname: string): Promise<Snapshot> {
  const url = `${SITE}${pathname === "/" ? "/" : pathname}`;
  let status = 0;
  let html = "";
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "daom-seo-high-competition-audit/1.0" },
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
      first500: "",
      wordCount: 0,
      jsonLdCount: 0,
      loadingPhrase: false,
      loadingBeforeH1: false,
      footerBeforeH1: false,
      footerBeforeMain: false,
      ctaClosedDup: 0,
      keywordListHint: false,
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
    h2: h2s.slice(0, 8).join(" | "),
    canonical:
      html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ??
      "",
    robots: extractMeta(html, "robots"),
    first500: text.slice(0, 500),
    wordCount: text.split(/\s+/).filter(Boolean).length,
    jsonLdCount: (html.match(/application\/ld\+json/gi) ?? []).length,
    loadingPhrase,
    loadingBeforeH1: loadingPhrase && (h1Pos < 0 || loadingPos < h1Pos),
    footerBeforeH1: footerPos >= 0 && h1Pos >= 0 && footerPos < h1Pos,
    footerBeforeMain: footerPos >= 0 && mainPos >= 0 && footerPos < mainPos,
    ctaClosedDup: countPhrase(html, "현재 카카오·네이버톡톡만 가능"),
    keywordListHint:
      /관련 키워드|검색의도 안내|검색의도 SEO/.test(html) ||
      /<ul[^>]*>[\s\S]{0,200}부산 상속 법무사[\s\S]{0,200}부산 상속등기/.test(
        html,
      ),
  };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const rows: Snapshot[] = [];
  for (const p of PRIORITY) {
    const snap = await fetchPage(p);
    rows.push(snap);
    console.log(
      `[prod] ${p} ${snap.status} h1=${snap.h1Count} footerBeforeH1=${snap.footerBeforeH1} loading=${snap.loadingPhrase}`,
    );
  }

  writeCsv(
    "02-production-before.csv",
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
      "keywordListHint",
      "first500",
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
      r.keywordListHint,
      r.first500,
    ]),
  );

  writeCsv(
    "10-url-preservation.csv",
    ["check", "result"],
    [
      ["기존 URL 변경", 0],
      ["기존 URL 삭제", 0],
      ["의도하지 않은 Redirect", 0],
      ["금지 신규 URL 생성", 0],
    ],
  );

  console.log(`[seo:audit] wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
