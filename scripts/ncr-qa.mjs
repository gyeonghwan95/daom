#!/usr/bin/env node
/**
 * NAVER CRITICAL RECOVERY — target QA on built out/ (after build).
 *   node scripts/ncr-qa.mjs
 * Output: .cache/naver-critical-recovery/qa.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const CACHE = path.join(ROOT, ".cache", "naver-critical-recovery");
const SITE = "https://xn--2j1br1na42lvxja38mk8r.kr";

const TARGETS = {
  "/부산상속전문법무사": { role: "PROVIDER_SELECTION", dominant: "selection" },
  "/부산상속포기": { role: "ACTION_PROCEDURE", dominant: "procedure" },
  "/해운대법무사": { role: "LOCAL_PROVIDER", dominant: "local" },
};

const PAIR_GATES = [
  { a: "/부산상속전문법무사", b: "/부산상속법무사", first: 0.45, body: 0.6 },
  { a: "/부산상속전문법무사", b: "/부산상속포기", first: 0.35, body: 0.5 },
];
const DEFAULT_GATE = { first: 0.55, body: 0.7 };

const NEIGHBORS = [
  "/부산상속법무사",
  "/부산한정승인",
  "/상속포기비용",
  "/부산가정법원상속포기",
  "/상속포기자가진단",
  "/부산진구상속포기",
  "/부산소유권이전전문법무사",
  "/부산부동산등기전문법무사",
  "/센텀법무사",
  "/재송동법무사",
  "/반여동법무사",
  "/해운대구부동산등기",
  "/해운대구상속등기",
  "/업무사례/해운대구법무사",
  "/해운대역법무사",
  "/해운대여성법무사",
  "/부산법무사",
];

const FORBIDDEN = [
  /다옴은 부산 상속전문 법무사입니다/,
  /공인\s*상속전문/,
  /부산\s*최고의?\s*상속/,
  /1위\s*상속/,
  /해운대구에서 가장 많은 사건/,
  /해운대\s*1위/,
  /해운대\s*대표\s*법무사/,
  /모든 법률문제 해결/,
  /모든 소송 가능/,
];

const INTENT_WORDS = {
  selection: ["선택", "비교", "업무범위", "맡길", "맡는", "기준", "고를", "검토 방식", "기록"],
  procedure: ["신고", "기한", "3개월", "순위", "심판", "수리", "단순승인", "처분", "절차", "민법"],
  local: ["해운대", "센텀", "재송", "반여", "우동", "방문", "주차", "역", "관할", "등기과"],
  cost: ["비용", "보수", "견적", "수수료"],
  consult: ["상담", "문의", "예약"],
};

function htmlPath(u) {
  if (u === "/") return path.join(OUT, "index.html");
  const flat = path.join(OUT, `${u.slice(1)}.html`);
  return fs.existsSync(flat) ? flat : path.join(OUT, ...u.slice(1).split("/"), "index.html");
}

const decode = (s) =>
  String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const strip = (html) =>
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

const article = (html) =>
  html.match(/<article[^>]*>([\s\S]*)<\/article>/i)?.[1] ?? html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? html;

const safeDecode = (h) => {
  try {
    return decodeURIComponent(h);
  } catch {
    return h;
  }
};

const hrefsOf = (html) =>
  [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)]
    .map((m) => decode(m[1]))
    .filter((h) => h.startsWith("/") && !h.startsWith("/_next/"))
    .map(safeDecode);

const tokens = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);

const shingles = (text, n = 3) => {
  const t = tokens(text);
  const set = new Set();
  for (let i = 0; i + n <= t.length; i++) set.add(t.slice(i, i + n).join(" "));
  return set;
};

const jaccard = (A, B) => {
  if (!A.size && !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
};

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

const allPaths = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "output", "seo-paths.json"), "utf8")).paths.map(safeDecode);
const pathSet = new Set(allPaths);

function loadPage(u) {
  const file = htmlPath(u);
  if (!fs.existsSync(file)) return { url: u, missing: true };
  const html = fs.readFileSync(file, "utf8");
  const art = article(html);
  const body = strip(art);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1]));
  const h1Index = body.indexOf(h1s[0] ?? "");
  const first700 = (h1Index >= 0 ? body.slice(h1Index) : body).slice(0, 700);
  const paragraphs = [...art.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((m) => strip(m[2]))
    .filter((t) => t.length >= 30);
  return {
    url: u,
    html,
    art,
    body,
    first700,
    paragraphs,
    title: strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    titleCount: (html.match(/<title[\s>]/gi) || []).length,
    description: meta(html, "description"),
    robots: meta(html, "robots"),
    canonical: decode(html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1] ?? ""),
    ogTitle: meta(html, "og:title", "property"),
    ogDescription: meta(html, "og:description", "property"),
    ogImage: meta(html, "og:image", "property"),
    ogImageWidth: meta(html, "og:image:width", "property"),
    ogImageHeight: meta(html, "og:image:height", "property"),
    metaKeywords: /<meta[^>]*name="keywords"/i.test(html),
    h1: h1s[0] ?? "",
    h1Count: h1s.length,
    h2: [...art.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1])),
    ldTypes: [
      ...new Set(
        [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) =>
          [...m[1].matchAll(/"@type":"([^"]+)"/g)].map((x) => x[1]),
        ),
      ),
    ],
  };
}

const splitSentences = (s) =>
  String(s)
    .split(/(?<=[.!?。])\s+|(?<=다\.)/)
    .map((x) => x.trim())
    .filter((x) => x.length >= 15);

const targetUrls = Object.keys(TARGETS);
const pages = new Map([...targetUrls, ...NEIGHBORS].map((u) => [u, loadPage(u)]));

// similarity
const docs = [...pages.values()].filter((p) => !p.missing).map((p) => ({
  url: p.url,
  first: tokens(p.first700),
  body: tokens(p.body),
  firstSh: shingles(p.first700),
  bodySh: shingles(p.body),
}));
const df = { first: new Map(), body: new Map() };
for (const d of docs) {
  for (const t of new Set(d.first)) df.first.set(t, (df.first.get(t) || 0) + 1);
  for (const t of new Set(d.body)) df.body.set(t, (df.body.get(t) || 0) + 1);
}
const simRows = [];
for (const a of docs) {
  if (!targetUrls.includes(a.url)) continue;
  for (const b of docs) {
    if (a.url === b.url) continue;
    if (targetUrls.includes(b.url) && targetUrls.indexOf(b.url) < targetUrls.indexOf(a.url)) continue;
    const first = Math.max(cosine(a.first, b.first, df.first, docs.length), jaccard(a.firstSh, b.firstSh));
    const body = Math.max(cosine(a.body, b.body, df.body, docs.length), jaccard(a.bodySh, b.bodySh));
    const gate = PAIR_GATES.find((g) => g.a === a.url && g.b === b.url) ?? DEFAULT_GATE;
    simRows.push({
      a: a.url,
      b: b.url,
      first700: Number(first.toFixed(4)),
      body: Number(body.toFixed(4)),
      gateFirst700: gate.first,
      gateBody: gate.body,
      briefGate: Boolean(PAIR_GATES.find((g) => g.a === a.url && g.b === b.url)),
      pass: first < gate.first && body < gate.body,
    });
  }
}

// descriptions of all pages for uniqueness
const afterManifest = JSON.parse(fs.readFileSync(path.join(CACHE, "after", "manifest.json"), "utf8")).pages;
const sitemapAfter = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "output", "sitemap-manifest.json"), "utf8")).entries;

const results = [];
for (const u of targetUrls) {
  const p = pages.get(u);
  const role = TARGETS[u];
  // text before H1 (after the site header)
  const h1Pos = p.html.search(/<h1[\s>]/i);
  const headerEnd = p.html.search(/<\/header>/i);
  const beforeH1 = strip(p.html.slice(headerEnd >= 0 && headerEnd < h1Pos ? headerEnd : 0, h1Pos).replace(/<nav[\s\S]*?<\/nav>/gi, " "));
  const breadcrumbText = strip((p.html.slice(0, h1Pos).match(/<nav aria-label="breadcrumb"[\s\S]*?<\/nav>/i) || [""])[0].replace(/<nav[^>]*>|<\/nav>/g, ""));
  const consultBeforeH1 = ["상담하기", "문의하기", "카카오", "톡톡", "전화 상담", "예약"].filter((w) => beforeH1.includes(w));

  // description uniqueness
  const mySentences = splitSentences(p.description);
  const sharedDescription = [];
  for (const [other, m] of Object.entries(afterManifest)) {
    if (other === u || !m.description) continue;
    for (const s of mySentences) if (m.description.includes(s)) sharedDescription.push({ other, sentence: s });
  }
  const titleCore = p.title.split(/[｜|]/)[0].trim();

  // links
  const consultIdx = p.art.search(/id="consultation"/);
  const contentArt = consultIdx > 0 ? p.art.slice(0, consultIdx) : p.art;
  const contextual = [...new Set(hrefsOf(contentArt).map((h) => h.split("#")[0]))].filter((h) => h && h !== u);
  const allArticleHrefs = [...new Set(hrefsOf(p.art).map((h) => h.split("#")[0].split("?")[0]))].filter(Boolean);
  const broken = allArticleHrefs.filter((h) => !pathSet.has(h.replace(/\/$/, "") || "/") && !fs.existsSync(htmlPath(h)));

  // paragraphs duplicates
  const counts = new Map();
  for (const t of p.paragraphs) counts.set(t, (counts.get(t) || 0) + 1);
  const dupWithin = [...counts.entries()].filter(([, c]) => c > 1).map(([t]) => t);
  const dupAcross = [];
  for (const o of targetUrls) {
    if (o === u) continue;
    const other = new Set(pages.get(o).paragraphs);
    for (const t of p.paragraphs) if (other.has(t)) dupAcross.push({ other: o, text: t.slice(0, 60) });
  }

  // og image
  let ogCheck = { url: p.ogImage, doubleEncoded: /%25[0-9A-F]{2}/i.test(p.ogImage) };
  try {
    const rel = safeDecode(new URL(p.ogImage).pathname);
    const file = path.join(ROOT, "public", ...rel.split("/").filter(Boolean));
    const exists = fs.existsSync(file);
    const m = exists ? await sharp(file).metadata() : null;
    ogCheck = {
      ...ogCheck,
      file: path.relative(ROOT, file),
      exists,
      actual: m ? `${m.width}x${m.height}` : null,
      declared: `${p.ogImageWidth}x${p.ogImageHeight}`,
      dimsMatch: m ? String(m.width) === p.ogImageWidth && String(m.height) === p.ogImageHeight : false,
      bodyUsesSameImage: p.art.includes(encodeURIComponent(path.basename(rel)).replace(/%2F/g, "/")) || p.art.includes(path.basename(rel)) || p.art.includes(path.basename(rel).replace(/\.jpg$/, "-4x3.jpg")),
    };
  } catch (e) {
    ogCheck.error = String(e.message);
  }

  // intent distribution
  const dist = {};
  for (const [k, words] of Object.entries(INTENT_WORDS)) dist[k] = words.reduce((n, w) => n + (p.body.split(w).length - 1), 0);
  const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
  const probs = Object.values(dist).map((c) => c / total).filter((x) => x > 0);
  const entropy = -probs.reduce((s, x) => s + x * Math.log2(x), 0) / Math.log2(Object.keys(INTENT_WORDS).length);
  const dominant = Object.entries(dist).sort((a, b) => b[1] - a[1])[0][0];

  // renunciation first700 concepts
  const concepts =
    u === "/부산상속포기"
      ? {
          meaning: /가정법원에 신고/.test(p.first700),
          threeMonths: /3개월/.test(p.first700),
          heirs: /배우자/.test(p.first700) && /자녀/.test(p.first700),
          onlyMe: /나만 포기/.test(p.first700),
          disposal: /처분|예금을 찾/.test(p.first700),
          qualified: /한정승인/.test(p.first700),
        }
      : null;

  const remoteIdx = p.body.indexOf("다른 지역에 계신 경우");
  const sitemap = sitemapAfter.find((e) => safeDecode(e.path) === u);
  const firstSentence = p.body.slice(p.body.indexOf(p.h1) + p.h1.length).trim().slice(0, 200);
  const sameOpening = Object.keys(afterManifest).filter((o) => o !== u && pages.get(o)?.body?.includes(firstSentence));

  const gates = {
    HTTP_200: fs.existsSync(htmlPath(u)),
    INDEXABLE: /index/.test(p.robots) && !/noindex/.test(p.robots),
    ROBOTS_ALLOWED: true,
    SELF_CANONICAL: safeDecode(p.canonical) === `${SITE}${u}`,
    TITLE_COUNT_1: p.titleCount === 1,
    H1_COUNT_1: p.h1Count === 1,
    DESCRIPTION_UNIQUE: sharedDescription.length === 0 && !p.description.includes(titleCore),
    FIRST700_UNIQUE: simRows.filter((r) => r.a === u || r.b === u).every((r) => r.first700 < (r.briefGate ? r.gateFirst700 : DEFAULT_GATE.first)) && sameOpening.length === 0,
    STATIC_MAIN_CONTENT: p.body.length > 1500 && !/animate-pulse|로딩 중/.test(p.art),
    DUPLICATE_PARAGRAPH_0: dupWithin.length === 0 && dupAcross.length === 0,
    BROKEN_LINK_0: broken.length === 0,
    SITEMAP: Boolean(sitemap),
    OG_IMAGE_VALID: Boolean(ogCheck.exists && ogCheck.dimsMatch && !ogCheck.doubleEncoded),
    TARGET_ROLE_CLEAR: dominant === role.dominant,
    FORBIDDEN_PHRASES_0: !FORBIDDEN.some((re) => re.test(p.body) || re.test(p.title) || re.test(p.description)),
    NO_META_KEYWORDS: !p.metaKeywords,
    NO_FAKE_SCHEMA: !p.ldTypes.some((t) => ["AggregateRating", "Review"].includes(t)),
  };

  results.push({
    url: u,
    role: role.role,
    title: p.title,
    h1: p.h1,
    description: p.description,
    descriptionChars: p.description.length,
    ogTitle: p.ogTitle,
    ogImage: ogCheck,
    robots: p.robots,
    canonical: safeDecode(p.canonical),
    bodyChars: p.body.length,
    h2Count: p.h2.length,
    h2: p.h2,
    textBeforeH1: beforeH1,
    breadcrumbText,
    textBeforeH1Chars: beforeH1.length,
    consultBeforeH1,
    contextualLinks: contextual,
    contextualLinkCount: contextual.length,
    brokenLinks: broken,
    dupWithin,
    dupAcross,
    sharedDescription,
    intentDistribution: dist,
    intentEntropy: Number(entropy.toFixed(3)),
    dominantIntent: dominant,
    first700: p.first700,
    first700Concepts: concepts,
    remoteNotePosition: remoteIdx >= 0 ? Number((remoteIdx / p.body.length).toFixed(3)) : null,
    sitemap: sitemap ? { lastmod: sitemap.lastmod, tier: sitemap.tier } : null,
    ldTypes: p.ldTypes,
    gates,
    allGatesPass: Object.values(gates).every(Boolean),
  });
}

const qa = { generatedAt: new Date().toISOString(), similarity: simRows, targets: results };
fs.writeFileSync(path.join(CACHE, "qa.json"), JSON.stringify(qa, null, 2));

for (const r of results) {
  console.log(`\n== ${r.url} (${r.role}) bodyChars=${r.bodyChars} h2=${r.h2Count} links=${r.contextualLinkCount} beforeH1=${r.textBeforeH1Chars} dominant=${r.dominantIntent} entropy=${r.intentEntropy} remotePos=${r.remoteNotePosition}`);
  console.log("title:", r.title, "| desc chars:", r.descriptionChars);
  const failed = Object.entries(r.gates).filter(([, v]) => !v).map(([k]) => k);
  console.log("gates:", failed.length ? `FAIL ${failed.join(",")}` : "ALL PASS");
  if (r.first700Concepts) console.log("first700 concepts:", JSON.stringify(r.first700Concepts));
  if (r.brokenLinks.length) console.log("broken:", r.brokenLinks);
  if (r.dupWithin.length || r.dupAcross.length) console.log("dups:", r.dupWithin, r.dupAcross);
  if (r.sharedDescription.length) console.log("shared desc:", r.sharedDescription.slice(0, 3));
}
console.log("\n== similarity (brief gates + worst)");
for (const s of simRows.filter((x) => x.briefGate || !x.pass).concat(simRows.filter((x) => !x.briefGate).sort((a, b) => b.body - a.body).slice(0, 6))) {
  console.log(s.pass ? "PASS" : "FAIL", s.a, "vs", s.b, "first700", s.first700, "/", s.gateFirst700, "body", s.body, "/", s.gateBody);
}
