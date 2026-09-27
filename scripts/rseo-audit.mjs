#!/usr/bin/env node
/**
 * REGIONAL SEO — code-only audit of every out-of-Busan / nationwide page in out/.
 *   node scripts/rseo-audit.mjs
 * Output: .cache/regional-seo/audit.json + reports/regional-seo/{DATE}/01,08,09,10 csv
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const CACHE = path.join(ROOT, ".cache", "regional-seo");
const DATE = process.env.RSEO_DATE || "2026-09-27";
const REPORT = path.join(ROOT, "reports", "regional-seo", DATE);
fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(REPORT, { recursive: true });

export const REGIONS = [
  // [name, parent, level, group, type]
  ["울산", "울산", "광역시", "울산", "NEARBY"],
  ["울주", "울산", "군", "울산", "NEARBY"],
  ["양산", "경남", "시", "경남", "NEARBY"],
  ["김해", "경남", "시", "경남", "NEARBY"],
  ["창원", "경남", "시", "경남", "NEARBY"],
  ["밀양", "경남", "시", "경남", "NEARBY"],
  ["거제", "경남", "시", "경남", "NEARBY"],
  ["통영", "경남", "시", "경남", "NEARBY"],
  ["진주", "경남", "시", "경남", "REMOTE"],
  ["사천", "경남", "시", "경남", "REMOTE"],
  ["고성", "경남", "군", "경남", "REMOTE"],
  ["남해", "경남", "군", "경남", "REMOTE"],
  ["대구", "대구", "광역시", "대구경북", "REMOTE"],
  ["경주", "경북", "시", "대구경북", "REMOTE"],
  ["포항", "경북", "시", "대구경북", "REMOTE"],
  ["구미", "경북", "시", "대구경북", "REMOTE"],
  ["경산", "경북", "시", "대구경북", "REMOTE"],
  ["영천", "경북", "시", "대구경북", "REMOTE"],
  ["안동", "경북", "시", "대구경북", "REMOTE"],
  ["칠곡", "경북", "군", "대구경북", "REMOTE"],
  ["서울", "서울", "특별시", "수도권", "REMOTE"],
  ["인천", "인천", "광역시", "수도권", "REMOTE"],
  ["경기광주", "경기", "시", "수도권", "REMOTE"],
  ["경기", "경기", "도", "수도권", "REMOTE"],
  ["대전", "대전", "광역시", "기타", "REMOTE"],
  ["세종", "세종", "특별자치시", "기타", "REMOTE"],
  ["광주", "광주", "광역시", "기타", "REMOTE"],
  ["제주시", "제주", "시", "기타", "REMOTE"],
  ["제주", "제주", "도", "기타", "REMOTE"],
  ["강원", "강원", "도", "기타", "REMOTE"],
  ["충남", "충남", "도", "기타", "REMOTE"],
  ["충북", "충북", "도", "기타", "REMOTE"],
  ["전남", "전남", "도", "기타", "REMOTE"],
  ["전북", "전북", "도", "기타", "REMOTE"],
  ["경남", "경남", "도", "경남", "MIXED"],
  ["경북", "경북", "도", "대구경북", "REMOTE"],
  ["경상도", "영남", "권역", "전국", "MIXED"],
  ["전국", "전국", "전국", "전국", "NATIONAL"],
  ["타지역", "전국", "전국", "전국", "NATIONAL"],
];

/** Busan-internal names that contain another region token. */
const BUSAN_MASK = [/거제동/g, /광안/g, /기장/g, /해운대/g, /산양산업/g, /수안동/g];
const NATIONAL_SLUG = /비대면|원격|타지역|전국/;

const SUB_AREAS =
  "울주군 달서구 수성구 달성군 군위군 유성구 성산구 의창구 마산회원구 마산합포구 마산 진해 장유 율하 진영 물금 증산 사송 삼산동 삼산 달동 옥동 송정동 송정 매곡동 매곡 범서 삼남 언양 범어동 만촌동 상인동 월성동 성서 시지 다사 현풍 송도 청라 영종 둔산 삼천포 원주 춘천 강릉 김천 예천 태화 우정 방어 일산 구영 천상 상남 용호 사파 북면 동읍 팔용 여수 순천 목포 전주 익산 군산 청주 충주 제천 천안 아산 당진 서귀포 남구 북구 동구 서구 중구 수도권 영남 경상도 경상남도 경상북도 광역시";
const REGION_TOKENS = [
  ...new Set([...REGIONS.map((r) => r[0]), ...SUB_AREAS.split(/\s+/)]),
].sort((a, b) => b.length - a.length);
const REGION_RE = new RegExp(REGION_TOKENS.join("|"), "g");

const decode = (s) =>
  String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const stripTags = (html) =>
  decode(
    String(html || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
      .replace(/<form[\s\S]*?<\/form>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const meta = (html, key, attr = "name") => {
  const a = html.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`, "i"));
  const b = html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`, "i"));
  return decode(a?.[1] ?? b?.[1] ?? "");
};

const mainOf = (html) => html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? html;
const articleOf = (html) =>
  html.match(/<article[^>]*>([\s\S]*)<\/article>/i)?.[1] ?? mainOf(html);

const safeDecode = (h) => {
  try {
    return decodeURIComponent(h);
  } catch {
    return h;
  }
};
const hrefsOf = (html) =>
  [...html.matchAll(/<a\b[^>]*\shref="([^"#?]+)[^"]*"/gi)]
    .map((m) => decode(m[1]))
    .filter((h) => h.startsWith("/") && !h.startsWith("/_next/"))
    .map((h) => safeDecode(h).replace(/\/$/, "") || "/");

const tokens = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s[\]]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
const shingles = (text, n = 3) => {
  const t = tokens(text);
  const set = new Set();
  for (let i = 0; i + n <= t.length; i++) set.add(t.slice(i, i + n).join(" "));
  return set;
};
const jaccard = (A, B) => {
  if (!A.size || !B.size) return 0;
  let inter = 0;
  const [s, l] = A.size < B.size ? [A, B] : [B, A];
  for (const t of s) if (l.has(t)) inter++;
  return inter / (A.size + B.size - inter);
};
export const normalizeRegion = (text) => String(text).replace(REGION_RE, "[REGION]");

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "_next") continue;
      walk(full, acc);
    } else if (e.name.endsWith(".html")) acc.push(full);
  }
  return acc;
}
const urlOf = (file) => {
  let rel = path.relative(OUT, file).replace(/\\/g, "/").replace(/\.html$/, "");
  if (rel === "index") return "/";
  rel = rel.replace(/\/index$/, "");
  return `/${rel}`;
};

function detectRegion(url) {
  let s = url;
  for (const re of BUSAN_MASK) s = s.replace(re, "#");
  for (const [name, parent, level, group, type] of REGIONS) {
    if (s.includes(name)) return { region: name, parent, level, group, type };
  }
  return null;
}

function detectSubLevel(slug, base) {
  if (/[가-힣]+(구)(상속|법무|$)/.test(slug.replace(base.region, "")) && base.level === "광역시")
    return "구";
  if (/군(상속|법무)/.test(slug) && base.region !== "울주") return "군";
  if (/동(상속|법무)/.test(slug)) return "동";
  if (/(범서|삼남|언양|다사|현풍|성서|시지|장유|물금)/.test(slug)) return "읍면/생활권";
  return base.level;
}

function detectService(slug) {
  if (/상속포기|한정승인/.test(slug)) return "상속포기·한정승인";
  if (/유증/.test(slug)) return "유증등기";
  if (/본점이전/.test(slug)) return "법인 본점이전";
  if (/법인|사단|재단/.test(slug)) return "법인등기";
  if (/근저당|공동담보/.test(slug)) return "근저당·공동담보";
  if (/개인회생/.test(slug)) return "개인회생";
  if (/상속등기비용/.test(slug)) return "상속등기 비용";
  if (/필요서류/.test(slug)) return "상속등기 서류";
  if (/상속/.test(slug)) return "상속등기";
  if (/부동산등기|증여|멸실|보존|말소/.test(slug)) return "부동산등기";
  if (/법무사업무|비대면|법무사|업무사례/.test(slug)) return "지역 업무 허브";
  return "기타";
}

function primaryIntent(slug, service, region) {
  if (region?.type === "NATIONAL" || /전국|타지역|경상도/.test(slug)) return "NATIONAL_REMOTE";
  if (service === "지역 업무 허브") return "REGIONAL_HUB";
  if (/거주.+부동산|상속인.+부동산|에서부산|부산에서/.test(slug)) return "RESIDENCE_MISMATCH";
  if (/비용|필요서류/.test(slug)) return "INFO_COST_DOCS";
  return "SERVICE_IN_REGION";
}

const CTA_RE = /상담\s*(신청|하기|요청|예약)|문의하기|바로\s*상담|카카오톡\s*상담|전화\s*상담|가능\s*여부\s*확인/g;
const DISCLAIMER_RE = /(지점|분사무소|지사)(이|가)?\s*(아니|없)|부산\s*해운대(구)?\s*(센텀)?[^.]{0,20}(사무소|위치)/g;
const REMOTE_RE = /방문\s*없이|비대면|원격|우편|전자신청|사진으로|파일로/g;
const COST_RE = /취득세|국민주택채권|법무사\s*보수|등록면허세/g;
const JURIS_RE = /관할|특례|등기소/g;

function sentencesOf(text) {
  return text
    .split(/(?<=[.?!])\s+|(?<=다)\s+(?=[가-힣A-Z0-9“"(])/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 25);
}
function paragraphsOf(html) {
  return [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1]))
    .filter((p) => p.length >= 40);
}

// ---------- load all pages ----------
const files = walk(OUT);
const pages = new Map();
for (const f of files) {
  const url = urlOf(f);
  pages.set(url, fs.readFileSync(f, "utf8"));
}

const sitemapXml = fs.readFileSync(path.join(ROOT, "public", "sitemap.xml"), "utf8");
const sitemapSet = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    safeDecode(new URL(m[1]).pathname).replace(/\/$/, "") || "/",
  ),
);

// incoming links (all pages), anywhere vs inside <main>
const inAll = new Map();
const inMain = new Map();
for (const [url, html] of pages) {
  const all = new Set(hrefsOf(html));
  const main = new Set(hrefsOf(mainOf(html)));
  for (const h of all) if (h !== url) inAll.set(h, (inAll.get(h) ?? 0) + 1);
  for (const h of main) if (h !== url) inMain.set(h, (inMain.get(h) ?? 0) + 1);
}

// ---------- region pages ----------
const rows = [];
for (const [url, html] of pages) {
  if (url.startsWith("/admin") || url.startsWith("/blog/external")) continue;
  const slug = url.split("/").pop();
  let region = detectRegion(url);
  if (!region && NATIONAL_SLUG.test(slug)) region = { region: "전국", parent: "전국", level: "전국", group: "전국", type: "NATIONAL" };
  if (!region) continue;
  if (url.startsWith("/blog/")) region = { ...region, blog: true };

  const robots = meta(html, "robots");
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1] ?? "";
  const canonicalPath = canonical ? safeDecode(new URL(canonical).pathname).replace(/\/$/, "") || "/" : "";
  const art = articleOf(html);
  const main = mainOf(html);
  const text = stripTags(art);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? stripTags(h1Match[1]) : "";
  const afterH1 = h1 && text.includes(h1) ? text.slice(text.indexOf(h1) + h1.length).trim() : text;
  const first700 = afterH1.slice(0, 700);
  const h2Count = (art.match(/<h2\b/gi) || []).length;
  const faqLd = (html.match(/"@type":"Question"/g) || []).length;
  const faqDetails = (art.match(/<details\b/gi) || []).length;
  const out = new Set(hrefsOf(art).filter((h) => h !== url));
  const sentences = sentencesOf(text);
  const sentCount = new Map();
  for (const s of sentences) sentCount.set(s, (sentCount.get(s) ?? 0) + 1);
  const dupSentences = [...sentCount.values()].filter((n) => n > 1).reduce((a, n) => a + n - 1, 0);
  const paras = paragraphsOf(art);
  let similarParas = 0;
  const pSh = paras.map((p) => shingles(p, 2));
  for (let i = 0; i < pSh.length; i++)
    for (let j = i + 1; j < pSh.length; j++) if (jaccard(pSh[i], pSh[j]) >= 0.5) similarParas++;

  const service = detectService(slug);
  const level = detectSubLevel(slug, region);
  rows.push({
    url,
    title: decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    h1,
    description: meta(html, "description"),
    canonical: canonicalPath,
    selfCanonical: canonicalPath === url,
    region: region.region,
    parentRegion: region.parent,
    regionGroup: region.group,
    regionType: region.type,
    regionLevel: level,
    blog: Boolean(region.blog),
    service,
    primaryIntent: primaryIntent(slug, service, region),
    mainTextChars: text.length,
    first700,
    h2Count,
    faqCount: Math.max(faqLd, faqDetails),
    incomingLinks: inAll.get(url) ?? 0,
    incomingLinksInMain: inMain.get(url) ?? 0,
    outgoingLinks: out.size,
    sitemap: sitemapSet.has(url),
    indexable: !/noindex/i.test(robots),
    ogImage: meta(html, "og:image", "property"),
    dupSentences,
    similarParagraphPairs: similarParas,
    ctaMentions: (text.match(CTA_RE) || []).length,
    disclaimerMentions: (text.match(DISCLAIMER_RE) || []).length,
    remoteMentions: (text.match(REMOTE_RE) || []).length,
    costMentions: (text.match(COST_RE) || []).length,
    jurisdictionMentions: (text.match(JURIS_RE) || []).length,
    textBeforeH1InMain: h1 ? stripTags(main.slice(0, main.indexOf("<h1"))).length : -1,
    _norm: normalizeRegion(text),
    _normFirst: normalizeRegion(first700),
  });
}

// ---------- normalized similarity ----------
const sh = rows.map((r) => shingles(r._norm));
const shF = rows.map((r) => shingles(r._normFirst));
const pairs = [];
for (let i = 0; i < rows.length; i++) {
  rows[i].maxNormSim = 0;
  rows[i].maxNormSimWith = "";
  rows[i].maxFirst700Sim = 0;
  rows[i].maxFirst700With = "";
}
for (let i = 0; i < rows.length; i++) {
  for (let j = i + 1; j < rows.length; j++) {
    const body = jaccard(sh[i], sh[j]);
    const first = jaccard(shF[i], shF[j]);
    for (const [x, y] of [[i, j], [j, i]]) {
      if (body > rows[x].maxNormSim) {
        rows[x].maxNormSim = +body.toFixed(4);
        rows[x].maxNormSimWith = rows[y].url;
      }
      if (first > rows[x].maxFirst700Sim) {
        rows[x].maxFirst700Sim = +first.toFixed(4);
        rows[x].maxFirst700With = rows[y].url;
      }
    }
    if (body < 0.2) continue;
    pairs.push({ a: rows[i].url, b: rows[j].url, body: +body.toFixed(4), first700: +first.toFixed(4) });
  }
}
const band = (v) =>
  v >= 0.85 ? "DOORWAY_DUPLICATE_RISK" : v >= 0.75 ? "HIGH_SIMILARITY" : v >= 0.6 ? "REVIEW" : "GOOD";
for (const r of rows) r.similarityBand = band(r.maxNormSim);

// union-find groups at >= 0.6
const parent = new Map(rows.map((r) => [r.url, r.url]));
const find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
for (const p of pairs) if (p.body >= 0.6) parent.set(find(p.a), find(p.b));
const groupIds = new Map();
for (const r of rows) {
  const root = find(r.url);
  if (!groupIds.has(root)) groupIds.set(root, `G${groupIds.size + 1}`);
}
const groupSizes = new Map();
for (const r of rows) {
  const g = groupIds.get(find(r.url));
  groupSizes.set(g, (groupSizes.get(g) ?? 0) + 1);
}
for (const r of rows) {
  const g = groupIds.get(find(r.url));
  r.normalizedSimilarityGroup = groupSizes.get(g) > 1 ? g : "-";
}

// thin local pages: sub-city level with weak uniqueness
for (const r of rows) {
  const sub = ["구", "동", "읍면/생활권", "군"].includes(r.regionLevel) && !["울주"].includes(r.region) ? true : r.regionLevel !== "광역시" && r.regionLevel !== "시" && r.regionLevel !== "도" && r.regionLevel !== "전국" && r.regionLevel !== "권역" && r.regionLevel !== "특별시" && r.regionLevel !== "특별자치시";
  const reasons = [];
  if (r.mainTextChars < 1500) reasons.push("chars<1500");
  if (r.maxNormSim >= 0.6) reasons.push(`normSim ${r.maxNormSim}`);
  if (r.dupSentences >= 3) reasons.push(`dupSentences ${r.dupSentences}`);
  if (r.incomingLinksInMain <= 2) reasons.push(`inMain ${r.incomingLinksInMain}`);
  r.thinFlags = reasons.join("; ");
  r.thinLocal = sub && reasons.length >= 2 ? "THIN_LOCAL_PAGE" : "";
}

rows.sort((a, b) => a.url.localeCompare(b.url, "ko"));
fs.writeFileSync(path.join(CACHE, "audit.json"), JSON.stringify({ rows, pairs }, null, 0));

// ---------- CSV ----------
const esc = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const writeCsv = (file, header, data) =>
  fs.writeFileSync(file, "\uFEFF" + [header.join(","), ...data.map((r) => header.map((h) => esc(r[h])).join(","))].join("\n") + "\n");

const cols = [
  "url", "title", "h1", "description", "canonical", "selfCanonical", "region", "parentRegion", "regionGroup",
  "regionType", "regionLevel", "service", "primaryIntent", "mainTextChars", "first700", "h2Count", "faqCount",
  "incomingLinks", "incomingLinksInMain", "outgoingLinks", "sitemap", "indexable", "normalizedSimilarityGroup",
  "maxNormSim", "maxNormSimWith", "similarityBand", "dupSentences", "similarParagraphPairs", "ctaMentions",
  "disclaimerMentions", "remoteMentions", "textBeforeH1InMain", "ogImage",
];
writeCsv(path.join(REPORT, "01-current-region-pages.csv"), cols, rows);
fs.copyFileSync(path.join(REPORT, "01-current-region-pages.csv"), path.join(ROOT, "reports", "regional-seo", "current-region-pages.csv"));

writeCsv(
  path.join(REPORT, "09-region-normalized-similarity.csv"),
  ["a", "b", "body", "first700", "band"],
  pairs.sort((x, y) => y.body - x.body).map((p) => ({ ...p, band: band(p.body) })),
);
writeCsv(
  path.join(REPORT, "08-duplicate-regions.csv"),
  ["url", "region", "service", "dupSentences", "similarParagraphPairs", "ctaMentions", "disclaimerMentions", "remoteMentions", "costMentions", "jurisdictionMentions", "h2Count", "mainTextChars"],
  rows.filter((r) => r.dupSentences >= 2 || r.similarParagraphPairs >= 3 || r.ctaMentions >= 6 || r.disclaimerMentions >= 3),
);
writeCsv(
  path.join(REPORT, "10-thin-local-pages.csv"),
  ["url", "region", "regionLevel", "service", "mainTextChars", "maxNormSim", "maxNormSimWith", "dupSentences", "incomingLinksInMain", "thinFlags", "thinLocal"],
  rows.filter((r) => r.thinLocal),
);

// ---------- summary ----------
const indexable = rows.filter((r) => r.indexable && !r.blog);
const inh = indexable.filter((r) => /상속|유증/.test(r.service));
const summary = {
  total: rows.length,
  indexableNonBlog: indexable.length,
  inheritanceRelated: inh.length,
  thinLocal: rows.filter((r) => r.thinLocal).length,
  bands: Object.fromEntries(["DOORWAY_DUPLICATE_RISK", "HIGH_SIMILARITY", "REVIEW", "GOOD"].map((b) => [b, indexable.filter((r) => r.similarityBand === b).length])),
  notInSitemap: indexable.filter((r) => !r.sitemap).map((r) => r.url),
  notSelfCanonical: indexable.filter((r) => !r.selfCanonical).map((r) => r.url),
  dupTitle: [...Object.entries(indexable.reduce((m, r) => ((m[r.title] = (m[r.title] ?? 0) + 1), m), {}))].filter(([, n]) => n > 1),
  dupDescription: [...Object.entries(indexable.reduce((m, r) => ((m[r.description] = (m[r.description] ?? 0) + 1), m), {}))].filter(([, n]) => n > 1).length,
};
fs.writeFileSync(path.join(CACHE, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
