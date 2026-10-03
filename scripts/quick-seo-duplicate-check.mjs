#!/usr/bin/env node
/**
 * 대상 URL만 빠르게 보는 중복 검사 — out/ 정적 HTML 기준(빌드 후 실행).
 * - 제목·first700·본문·H2 유사도(문자 n-gram 코사인)
 * - 필수 비교쌍 + 대상별 사이트 전체 최근접 페이지
 * - 사이트 전체와 title / description / H1 완전 일치 여부
 *
 * node scripts/quick-seo-duplicate-check.mjs [--out=reports/seo-priority-reset/2026-10-01/03-duplicate-check.csv]
 *   [--targets=/a,/b] [--pairs=/a:/b,/c:/d] — 지정하면 기본 TARGETS·PAIRS 대신 사용(pairs는 필수 쌍)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const outArg = process.argv.find((a) => a.startsWith("--out="))?.slice(6);
const CSV_OUT = path.join(ROOT, outArg ?? "reports/seo-priority-reset/2026-10-01/03-duplicate-check.csv");

const targetsArg = process.argv.find((a) => a.startsWith("--targets="))?.slice(10);
const pairsArg = process.argv.find((a) => a.startsWith("--pairs="))?.slice(8);

const DEFAULT_TARGETS = [
  "/부산상속포기", "/부산한정승인", "/부산상속전문법무사",
  "/부산법무사", "/부산법무사상담", "/부산법무사추천",
  "/부산공탁", "/부산변제공탁", "/부산집행공탁", "/부산담보공탁", "/부산형사공탁", "/공탁금출급회수",
];

/** [a, b, 필수 여부] — 필수 쌍은 브리프에서 중복 금지로 지정한 조합 */
const DEFAULT_PAIRS = [
  ["/부산상속포기", "/부산한정승인", true],
  ["/부산상속전문법무사", "/부산상속법무사", true],
  ["/부산법무사", "/부산법무사추천", true],
  ["/부산법무사", "/부산법무사상담", true],
  ["/부산공탁", "/부산변제공탁", true],
  ["/부산변제공탁", "/부산집행공탁", true],
  ["/공탁금출급회수", "/공탁채권회수", true],
  ["/부산한정승인", "/특별한정승인", false],
  ["/부산상속포기", "/상속포기후다음순위확인", false],
  ["/부산법무사", "/", false],
  ["/부산법무사", "/부산법무사무소", false],
  ["/부산법무사상담", "/법무사상담", false],
  ["/부산법무사상담", "/부산법무사방문상담", false],
  ["/부산법무사상담", "/부산법무사비대면상담", false],
  ["/부산법무사추천", "/부산법무사비교", false],
  ["/부산법무사추천", "/부산법무사잘하는곳", false],
  ["/부산법무사추천", "/부산법무사상담", false],
  ["/부산공탁", "/공탁자가진단", false],
  ["/부산공탁", "/공탁채권회수", false],
  ["/부산변제공탁", "/변제공탁서류준비", false],
  ["/부산집행공탁", "/공탁채권회수", false],
  ["/부산집행공탁", "/부산담보공탁", false],
  ["/부산형사공탁", "/부산변제공탁", false],
  ["/부산담보공탁", "/공탁금출급회수", false],
  ["/부산공탁", "/공탁금출급회수", false],
];

const TARGETS = targetsArg ? targetsArg.split(",").filter(Boolean) : DEFAULT_TARGETS;
const PAIRS = pairsArg
  ? pairsArg.split(",").filter(Boolean).map((p) => [...p.split(":"), true])
  : DEFAULT_PAIRS;

const decode = (s) =>
  String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ");
const strip = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ").trim();

function htmlFile(p) {
  if (p === "/") return path.join(OUT, "index.html");
  const flat = path.join(OUT, `${p.slice(1)}.html`);
  if (fs.existsSync(flat)) return flat;
  return path.join(OUT, ...p.slice(1).split("/"), "index.html");
}

const cache = new Map();
function parts(p) {
  if (cache.has(p)) return cache.get(p);
  const file = htmlFile(p);
  if (!fs.existsSync(file)) {
    cache.set(p, null);
    return null;
  }
  const html = fs.readFileSync(file, "utf8");
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? "";
  const h1s = [...main.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1]));
  const h1 = h1s[0] ?? "";
  const text = strip(main);
  const idx = h1 ? text.indexOf(h1) : -1;
  const body = idx >= 0 ? text.slice(idx + h1.length).trim() : text;
  const h2 = [...main.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1])).filter(Boolean);
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "").trim();
  const robots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? "";
  const value = {
    title,
    description,
    h1,
    h1Count: h1s.length,
    body,
    first700: body.slice(0, 700),
    h2Text: h2.join(" | "),
    chars: body.replace(/\s/g, "").length,
    noindex: /noindex/i.test(robots),
  };
  cache.set(p, value);
  return value;
}

function shingles(text, n) {
  const s = text.replace(/\s+/g, " ");
  const m = new Map();
  for (let i = 0; i + n <= s.length; i++) {
    const g = s.slice(i, i + n);
    m.set(g, (m.get(g) || 0) + 1);
  }
  let sq = 0;
  for (const v of m.values()) sq += v * v;
  m.norm = Math.sqrt(sq) || 1;
  return m;
}
function cosine(a, b) {
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  let dot = 0;
  for (const [k, v] of small) {
    const w = large.get(k);
    if (w) dot += v * w;
  }
  return dot / (a.norm * b.norm);
}
const vecCache = new Map();
function vec(p, field, n) {
  const key = `${p}\0${field}\0${n}`;
  if (!vecCache.has(key)) vecCache.set(key, shingles(parts(p)[field], n));
  return vecCache.get(key);
}

function compare(a, b) {
  return {
    title: cosine(vec(a, "title", 2), vec(b, "title", 2)),
    first700: cosine(vec(a, "first700", 5), vec(b, "first700", 5)),
    body: cosine(vec(a, "body", 5), vec(b, "body", 5)),
    h2: cosine(vec(a, "h2Text", 3), vec(b, "h2Text", 3)),
  };
}
const band = (v) => (v >= 0.8 ? "CRITICAL" : v >= 0.7 ? "REWRITE" : v >= 0.6 ? "REVIEW" : "ACCEPT");
const fail = (s) => s.first700 >= 0.75 || s.body >= 0.8;
const r3 = (v) => v.toFixed(3);

const sitemap = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/output/sitemap-manifest.json"), "utf8"));
const corpus = [...new Set(sitemap.entries.map((e) => e.path))].filter((p) => parts(p) && !parts(p).noindex);

const rows = [];
let failCount = 0;
let missing = 0;

for (const [a, b, required] of PAIRS) {
  if (!parts(a) || !parts(b)) {
    missing++;
    rows.push(["PAIR", a, b, required ? "Y" : "N", "", "", "", "", "MISSING", "MISSING"]);
    continue;
  }
  const s = compare(a, b);
  const f = fail(s);
  if (f) failCount++;
  rows.push(["PAIR", a, b, required ? "Y" : "N", r3(s.title), r3(s.first700), r3(s.body), r3(s.h2), band(Math.max(s.first700, s.body)), f ? "FAIL" : "PASS"]);
}

for (const t of TARGETS) {
  if (!parts(t)) {
    missing++;
    continue;
  }
  let best = null;
  for (const p of corpus) {
    if (p === t) continue;
    const body = cosine(vec(t, "body", 5), vec(p, "body", 5));
    if (!best || body > best.body) best = { p, body };
  }
  const s = compare(t, best.p);
  const f = fail(s);
  if (f) failCount++;
  rows.push(["NEAREST", t, best.p, "N", r3(s.title), r3(s.first700), r3(s.body), r3(s.h2), band(Math.max(s.first700, s.body)), f ? "FAIL" : "PASS"]);
}

const exactDupes = [];
for (const t of TARGETS) {
  const tp = parts(t);
  if (!tp) continue;
  for (const field of ["title", "description", "h1"]) {
    const value = tp[field];
    if (!value) {
      exactDupes.push([t, field, "EMPTY"]);
      continue;
    }
    for (const p of corpus) {
      if (p !== t && parts(p)[field] === value) exactDupes.push([t, field, p]);
    }
  }
  if (tp.h1Count !== 1) exactDupes.push([t, "h1Count", String(tp.h1Count)]);
}
for (const [t, field, other] of exactDupes) {
  rows.push(["EXACT_DUPLICATE", t, other, "Y", "", "", "", "", field, "FAIL"]);
}

const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const header = ["type", "url_a", "url_b", "required_pair", "title_sim", "first700_sim", "body_sim", "h2_sim", "band", "result"];
fs.mkdirSync(path.dirname(CSV_OUT), { recursive: true });
fs.writeFileSync(CSV_OUT, "\uFEFF" + [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n", "utf8");

const lengths = TARGETS.filter((t) => parts(t)).map((t) => `${t} chars=${parts(t).chars} h1Count=${parts(t).h1Count}`);
console.log(`corpus=${corpus.length} pairs=${PAIRS.length} similarity_fail=${failCount} exact_duplicates=${exactDupes.length} missing=${missing}`);
console.log(lengths.join("\n"));
console.log(`csv=${path.relative(ROOT, CSV_OUT)}`);
process.exitCode = failCount || exactDupes.length || missing ? 1 : 0;
