#!/usr/bin/env node
/**
 * SPEAKER SEO RESET — target page QA on built out/ HTML.
 *   node scripts/speaker-seo-reset-qa.mjs
 * Writes .cache/speaker-seo-reset/qa.json (consumed by speaker-seo-reset-reports.mjs).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INTENT_GROUPS } from "./speaker-seo-reset-keywords.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const CACHE = path.join(ROOT, ".cache", "speaker-seo-reset");
const PATHS_JSON = path.join(ROOT, "scripts", "output", "seo-paths.json");

const TARGETS = INTENT_GROUPS.map((g) => g.url);
const NEIGHBORS = [
  "/청년생활법률특강",
  "/공공기관법률교육",
  "/부산기관법률특강",
  "/부산법무사강의",
  "/부산도서관법률특강",
  "/창업법률교육",
  "/부산강사섭외체크리스트",
];

const FIRST700_GATE = 0.55;
const BODY_GATE = 0.7;

const FORBIDDEN = [
  /부산\s*최고/,
  /유명\s*강사/,
  /대표\s*강사/,
  /1위/,
  /검색량이\s*(많|높)/,
  /합격\s*보장/,
  /법정의무교육\s*강사\s*자격/,
  /만족도\s*\d/,
  /재초청/,
];
const CONSULT_CTA = [/법률\s*상담/, /사건\s*상담/, /등기\s*상담/, /무료\s*상담/, /상담\s*예약/, /바로\s*상담하기/];

function htmlPath(u) {
  if (u === "/") return path.join(OUT, "index.html");
  const flat = path.join(OUT, `${u.slice(1)}.html`);
  return fs.existsSync(flat) ? flat : path.join(OUT, ...u.slice(1).split("/"), "index.html");
}

function decode(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function strip(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
      .replace(/<form[\s\S]*?<\/form>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function article(html) {
  return html.match(/<article[^>]*>([\s\S]*)<\/article>/i)?.[1] ?? html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? html;
}

function meta(html, key, attr = "name") {
  const a = html.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`, "i"));
  const b = html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`, "i"));
  return decode(a?.[1] ?? b?.[1] ?? "");
}

function section(html, id) {
  const re = new RegExp(`<section[^>]*id="${id}"[^>]*>([\\s\\S]*?)</section>`, "i");
  return html.match(re)?.[1] ?? "";
}

function hrefs(html) {
  return [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)]
    .map((m) => decode(m[1]))
    .filter((h) => h.startsWith("/") && !h.startsWith("/_next/"))
    .map((h) => {
      try {
        return decodeURIComponent(h);
      } catch {
        return h;
      }
    });
}

export function tokens(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function shingles(text, n = 3) {
  const t = tokens(text);
  const set = new Set();
  for (let i = 0; i + n <= t.length; i++) set.add(t.slice(i, i + n).join(" "));
  return set;
}

function jaccardSets(A, B) {
  if (!A.size && !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

function cosine(a, b, df, nDocs) {
  const vec = (doc) => {
    const tf = new Map();
    for (const t of doc) tf.set(t, (tf.get(t) || 0) + 1);
    const v = new Map();
    for (const [t, c] of tf) v.set(t, (c / doc.length) * (Math.log((nDocs + 1) / ((df.get(t) || 0) + 1)) + 1));
    return v;
  };
  const va = vec(a);
  const vb = vec(b);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const x of va.values()) na += x * x;
  for (const y of vb.values()) nb += y * y;
  for (const [t, x] of va) if (vb.has(t)) dot += x * vb.get(t);
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

const REGION_RE =
  /(부산광역시|부산시|부산|해운대구?|센텀|수영구?|동래구?|남구|연제구?|부산진구?|사하구?|북구|금정구?|기장군?|양산시?|창원시?|김해시?|울산광역시|울산|경남|경상남도|서울)/g;
const FORMAT_RE = /(특강|강연|강의|세미나|교육|출강)/g;
const normalizeRegion = (s) => s.replace(REGION_RE, "[REGION]");
const normalizeFormat = (s) => s.replace(FORMAT_RE, "[FORMAT]");
/** Cosine variant: drop region/format words so placeholder frequency doesn't dominate the vector. */
const dropRegionFormat = (s) => s.replace(REGION_RE, " ").replace(FORMAT_RE, " ");

function loadPage(u) {
  const file = htmlPath(u);
  if (!fs.existsSync(file)) return { url: u, missing: true };
  const html = fs.readFileSync(file, "utf8");
  const art = article(html);
  const body = strip(art);
  const claimText = strip(art.replace(/다루지 않는 범위<\/p>\s*<ul[\s\S]*?<\/ul>/g, " "));
  const ctaText = [...art.matchAll(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => strip(m[2])).join(" | ");
  const curriculaHtml = section(art, "curricula");
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1]));
  const h1Index = body.indexOf(h1s[0] ?? "");
  const first700 = (h1Index >= 0 ? body.slice(h1Index) : body).slice(0, 700);
  const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const relatedHrefs = [...new Set(hrefs(section(art, "related")))];
  const imgs = [...art.matchAll(/<img\b[^>]*>/gi)].map((m) => ({
    src: decode(m[0].match(/\ssrc="([^"]+)"/)?.[1] ?? ""),
    alt: decode(m[0].match(/\salt="([^"]*)"/)?.[1] ?? ""),
    width: m[0].match(/\swidth="(\d+)"/)?.[1] ?? "",
    height: m[0].match(/\sheight="(\d+)"/)?.[1] ?? "",
    loading: m[0].match(/\sloading="([^"]+)"/)?.[1] ?? "",
  }));
  return {
    url: u,
    missing: false,
    title: strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    description: meta(html, "description"),
    robots: meta(html, "robots"),
    canonical: decode(html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1] ?? ""),
    ogTitle: meta(html, "og:title", "property"),
    ogDescription: meta(html, "og:description", "property"),
    ogImage: meta(html, "og:image", "property"),
    ogImageWidth: meta(html, "og:image:width", "property"),
    ogImageHeight: meta(html, "og:image:height", "property"),
    h1: h1s[0] ?? "",
    h1Count: h1s.length,
    h2: [...art.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1])),
    body,
    bodyChars: body.length,
    first700,
    ldTypes: [...new Set(ld.flatMap((s) => [...s.matchAll(/"@type":"([^"]+)"/g)].map((m) => m[1])))],
    faqSchema: ld.some((s) => s.includes('"FAQPage"')),
    fakeSchema: ld.some((s) => /"(Review|AggregateRating|Award|Event)"/.test(s)),
    metaKeywords: /<meta[^>]*name="keywords"/i.test(html),
    relatedHrefs,
    articleHrefs: [...new Set(hrefs(art))],
    hasLectureRequest: /id="lecture-request"/.test(art),
    formInstitutionRequired: [...art.matchAll(/<input\b[^>]*>/gi)].some(
      (m) => /autoComplete="organization"/i.test(m[0]) && /\srequired/.test(m[0]),
    ),
    feeCriteriaLine: body.includes("기관 강사료 기준이 있다면 알려주세요"),
    curricula: [
      ["60", /(50|60)(~\d+)?분/],
      ["90", /90분/],
      ["120", /120분/],
      ["3h+", /3시간|반일|회차/],
    ]
      .filter(([, re]) => re.test(strip(curriculaHtml)))
      .map(([k]) => k),
    ctaText,
    consultCtaInArticle: CONSULT_CTA.filter((re) => re.test(ctaText)).map(String),
    consultHrefInArticle: hrefs(art).filter((h) => /inquiry|booking|reservation/i.test(h)),
    forbidden: FORBIDDEN.filter((re) => re.test(claimText) || re.test(html.match(/<title[^>]*>[\s\S]*?<\/title>/i)?.[0] ?? "")).map(String),
    sidebarConsult: /sidebar-consult|SidebarConsultation/i.test(html),
    imgs,
  };
}

function similarity(pages) {
  const docs = pages.map((p) => ({
    url: p.url,
    first: tokens(p.first700),
    body: tokens(p.body),
    firstR: tokens(dropRegionFormat(p.first700)),
    bodyR: tokens(dropRegionFormat(p.body)),
    firstSh: shingles(p.first700),
    bodySh: shingles(p.body),
    firstShR: shingles(normalizeFormat(normalizeRegion(p.first700))),
    bodyShR: shingles(normalizeFormat(normalizeRegion(p.body))),
  }));
  const dfFor = (key) => {
    const df = new Map();
    for (const d of docs) for (const t of new Set(d[key])) df.set(t, (df.get(t) || 0) + 1);
    return df;
  };
  const df = { first: dfFor("first"), body: dfFor("body"), firstR: dfFor("firstR"), bodyR: dfFor("bodyR") };
  const rows = [];
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const a = docs[i];
      const b = docs[j];
      if (!TARGETS.includes(a.url) && !TARGETS.includes(b.url)) continue;
      const r = (x) => Number(x.toFixed(4));
      const first = Math.max(cosine(a.first, b.first, df.first, docs.length), jaccardSets(a.firstSh, b.firstSh));
      const bodyScore = Math.max(cosine(a.body, b.body, df.body, docs.length), jaccardSets(a.bodySh, b.bodySh));
      const firstR = Math.max(cosine(a.firstR, b.firstR, df.firstR, docs.length), jaccardSets(a.firstShR, b.firstShR));
      const bodyR = Math.max(cosine(a.bodyR, b.bodyR, df.bodyR, docs.length), jaccardSets(a.bodyShR, b.bodyShR));
      rows.push({
        a: a.url,
        b: b.url,
        first700: r(first),
        body: r(bodyScore),
        first700Region: r(firstR),
        bodyRegion: r(bodyR),
        pass: first < FIRST700_GATE && bodyScore < BODY_GATE && firstR < FIRST700_GATE && bodyR < BODY_GATE,
      });
    }
  }
  return rows;
}

function ogUsage() {
  const paths = JSON.parse(fs.readFileSync(PATHS_JSON, "utf8")).paths || [];
  const usage = new Map();
  for (const p of paths) {
    const file = htmlPath(p);
    if (!fs.existsSync(file)) continue;
    const og = meta(fs.readFileSync(file, "utf8"), "og:image", "property");
    if (!og) continue;
    usage.set(og, [...(usage.get(og) || []), p]);
  }
  return usage;
}

const pages = [...TARGETS, ...NEIGHBORS].map(loadPage);
const missing = pages.filter((p) => p.missing).map((p) => p.url);
if (missing.length) {
  console.error("missing pages:", missing);
  process.exit(1);
}
const sim = similarity(pages);
const usage = ogUsage();
const targetPages = pages.filter((p) => TARGETS.includes(p.url));
for (const p of targetPages) p.ogImageSharedWith = (usage.get(p.ogImage) || []).filter((u) => u !== p.url);

const qa = { generatedAt: new Date().toISOString(), gates: { FIRST700_GATE, BODY_GATE }, pages, similarity: sim };
fs.mkdirSync(CACHE, { recursive: true });
fs.writeFileSync(path.join(CACHE, "qa.json"), `${JSON.stringify(qa, null, 2)}\n`);

for (const p of targetPages) {
  const issues = [];
  if (p.h1Count !== 1) issues.push(`h1Count=${p.h1Count}`);
  if (p.description.length < 80 || p.description.length > 120) issues.push(`descLen=${p.description.length}`);
  if (p.relatedHrefs.length < 5 || p.relatedHrefs.length > 8) issues.push(`related=${p.relatedHrefs.length}`);
  if (!p.hasLectureRequest) issues.push("no #lecture-request");
  if (!p.formInstitutionRequired) issues.push("institution not required");
  if (!p.feeCriteriaLine) issues.push("no fee criteria line");
  if (p.curricula.length < 4) issues.push(`curricula=${p.curricula.join("/")}`);
  if (p.consultCtaInArticle.length) issues.push(`consultCTA=${p.consultCtaInArticle.join(",")}`);
  if (p.consultHrefInArticle.length) issues.push(`consultHref=${p.consultHrefInArticle.join(",")}`);
  if (p.forbidden.length) issues.push(`forbidden=${p.forbidden.join(",")}`);
  if (p.fakeSchema) issues.push("fake schema");
  if (!p.faqSchema) issues.push("no FAQ schema");
  if (p.ogImageSharedWith.length) issues.push(`ogShared=${p.ogImageSharedWith.join(",")}`);
  if (p.robots && /noindex/.test(p.robots)) issues.push("noindex");
  if (p.sidebarConsult) issues.push("sidebar consult present");
  console.log(`${issues.length ? "ISSUE" : "OK"}\t${p.url}\tbody=${p.bodyChars}\trelated=${p.relatedHrefs.length}\t${issues.join(" | ")}`);
}
const fails = sim.filter((r) => !r.pass);
const maxOf = (k) => Math.max(...sim.map((r) => r[k]));
console.log(
  `similarity pairs=${sim.length} fail=${fails.length} max first700=${maxOf("first700")} body=${maxOf("body")} first700R=${maxOf("first700Region")} bodyR=${maxOf("bodyRegion")}`,
);
for (const r of fails) console.log(`  FAIL ${r.a} ↔ ${r.b} f=${r.first700} b=${r.body} fR=${r.first700Region} bR=${r.bodyRegion}`);
