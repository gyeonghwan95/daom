#!/usr/bin/env npx tsx
/**
 * TOP450 internal SEO audit. No Naver rank / SearchAd / volume APIs.
 * Usage: npx tsx scripts/naver-top450/cli.ts [audit|map|duplicate|fix|create|validate|all] [--force]
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  CURATED_NAVER_SEO_TOP450,
  validateTop450Keywords,
} from "../../data/seo/naver-top450";
import { isIndexablePagePath } from "../../src/lib/pageData/sitemap";
import { getAllPageData } from "../../src/lib/pageData/registry";
import { getAllLocalLandingSlugs } from "../../src/lib/local-landing";
import { getAllSeoLandingSlugs } from "../../src/lib/seo-landing";
import { getAllTopicHubSlugs } from "../../src/lib/topic-hubs";
import { classifyKeyword, type KeywordMeta } from "./champions";
import type { PageData } from "../../src/lib/pageData/types";

const ROOT = process.cwd();
const CACHE = path.join(ROOT, ".cache", "naver-top450");
const REPORT_ROOT = path.join(ROOT, "reports", "naver-top450");
const INVENTORY_DIR = path.join(ROOT, "reports", "seo-top450");
const DATE = "2026-09-21";
const REPORT = path.join(REPORT_ROOT, DATE);
const PIPELINE_VERSION = "top450-v1";

type InventoryPage = {
  url: string;
  title: string;
  h1: string;
  description: string;
  canonical: string;
  headings: string[];
  mainText: string;
  mainTextLength: number;
  first700: string;
  region: string | null;
  service: string;
  intent: string;
  internalIncomingLinks: number;
  internalOutgoingLinks: number;
  sitemap: boolean;
  indexable: boolean;
  schemaTypes: string[];
  hasBreadcrumb: boolean;
  imageCount: number;
  altCoverage: number;
  faqCount: number;
  source: string;
  category: string;
};

type CoverageBand =
  | "COVERED_STRONG"
  | "COVERED_NEEDS_IMPROVEMENT"
  | "WEAK_COVERAGE"
  | "CONTENT_GAP_CANDIDATE";

type Action =
  | "KEEP"
  | "IMPROVE"
  | "REPOSITION"
  | "ADD_SECTION"
  | "CREATE"
  | "CANNIBALIZATION_RISK"
  | "LEGAL_REVIEW"
  | "PARENT_HUB_COVERAGE";

type MapRow = {
  keyword: string;
  cluster: string;
  region: string | null;
  regionType: string;
  intent: string;
  service: string;
  bestUrl: string;
  coverageScore: number;
  band: CoverageBand;
  candidates: string;
  action: Action;
  parentHubUrl: string;
  issues: string;
};

function hash(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function compact(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(file: string, headers: string[], rows: Record<string, unknown>[]): void {
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
  ];
  fs.writeFileSync(file, lines.join("\n") + "\n", "utf8");
}

function ensureDirs(): void {
  fs.mkdirSync(CACHE, { recursive: true });
  fs.mkdirSync(REPORT, { recursive: true });
  fs.mkdirSync(INVENTORY_DIR, { recursive: true });
}

function inferService(page: PageData): string {
  const s = `${page.path} ${page.metaTitle} ${page.h1}`;
  if (/상속|한정|포기|유증|대습|사망/.test(s)) return "INHERITANCE";
  if (/법인|설립|임원|본점|증자|감자|해산|청산|정관/.test(s)) return "CORPORATE";
  if (/회생|파산|면책/.test(s)) return "REHABILITATION";
  if (/임차권|전세|보증금/.test(s)) return "LEASE";
  if (/지급명령|내용증명|가압류|공탁|채권/.test(s)) return "CIVIL";
  if (/부동산|매매|증여|근저당|전세권|보존|멸실|소유권/.test(s)) return "REAL_ESTATE";
  if (/해운대|수영|연제|동래|서면|센텀|구법무사|동법무사/.test(s)) return "LOCAL";
  return "GENERAL";
}

function inferRegion(page: PageData): string | null {
  const s = `${page.path} ${page.h1}`;
  const m = s.match(
    /양산|김해|울산|울주|창원|거제|통영|경주|포항|해운대|센텀|수영|연제|동래|부산진|사상|사하|강서|기장|금정|남구|북구|중구|서구|동구/,
  );
  return m ? m[0] : /부산/.test(s) ? "부산" : null;
}

function mainTextOf(page: PageData): string {
  return [
    page.intro,
    ...(page.introParagraphs || []),
    ...(page.sections || []).map((sec) => `${sec.title}\n${sec.body}`),
    ...(page.faqs || []).map((f) => `${f.question} ${f.answer}`),
  ]
    .join("\n")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRegionTokens(text: string): string {
  return text.replace(
    /부산|해운대|수영|연제|동래|부산진|남구|북구|금정|사상|사하|강서|기장|재송|반여|센텀|양산|김해|울산|창원|거제|통영|경주|포항|광안|연산|서면|명지|정관|일광/g,
    "[REGION]",
  );
}

function trigrams(s: string): Set<string> {
  const t = compact(s);
  const set = new Set<string>();
  for (let i = 0; i < t.length - 2; i += 1) set.add(t.slice(i, i + 3));
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function sourceOf(slug: string, local: Set<string>, seo: Set<string>, topic: Set<string>): string {
  if (local.has(slug)) return "local-landing";
  if (topic.has(slug)) return "topic-hub";
  if (seo.has(slug)) return "seo-landing";
  return "other";
}

function sourcePriority(source: string): number {
  if (source === "local-landing") return 4;
  if (source === "topic-hub") return 3;
  if (source === "other") return 2;
  return 1;
}

function buildInventory(): InventoryPage[] {
  const local = new Set(getAllLocalLandingSlugs());
  const seo = new Set(getAllSeoLandingSlugs());
  const topic = new Set(getAllTopicHubSlugs());
  const all = getAllPageData();
  const indexable = all.filter((p) => isIndexablePagePath(p.path));
  const incoming = new Map<string, number>();
  for (const p of indexable) {
    for (const link of p.internalLinks || []) {
      incoming.set(link.href, (incoming.get(link.href) || 0) + 1);
    }
    for (const link of p.relatedLinks || []) {
      incoming.set(link.href, (incoming.get(link.href) || 0) + 1);
    }
  }

  return indexable.map((page) => {
    const slug = page.path.replace(/^\//, "") || "home";
    const text = mainTextOf(page);
    const headings = [
      page.h1,
      ...(page.sections || []).map((s) => s.title),
    ].filter(Boolean);
    return {
      url: page.path,
      title: page.metaTitle || page.title || "",
      h1: page.h1 || "",
      description: page.metaDescription || "",
      canonical: page.path,
      headings,
      mainText: text,
      mainTextLength: text.replace(/\s/g, "").length,
      first700: text.slice(0, 700),
      region: inferRegion(page),
      service: inferService(page),
      intent: page.category,
      internalIncomingLinks: incoming.get(page.path) || 0,
      internalOutgoingLinks: (page.internalLinks?.length || 0) + (page.relatedLinks?.length || 0),
      sitemap: true,
      indexable: true,
      schemaTypes: page.includeFaqSchema ? ["WebPage", "FAQPage"] : ["WebPage"],
      hasBreadcrumb: (page.breadcrumbs?.length || 0) > 0,
      imageCount: page.ogImage ? 1 : 0,
      altCoverage: page.ogImage ? 1 : 0,
      faqCount: page.faqs?.length || 0,
      source: sourceOf(slug, local, seo, topic),
      category: page.category,
    };
  });
}

function tokenOverlap(keyword: string, page: InventoryPage): number {
  const k = compact(keyword);
  const blob = compact(`${page.url} ${page.title} ${page.h1} ${page.description} ${page.first700}`);
  if (blob.includes(k)) return 1;
  const parts = keyword.split(/\s+/).filter((t) => t.length >= 2);
  if (parts.length === 0) return 0;
  let hit = 0;
  for (const p of parts) if (blob.includes(compact(p))) hit += 1;
  return hit / parts.length;
}

function pickBest(
  keyword: string,
  meta: KeywordMeta,
  pages: InventoryPage[],
  byUrl: Map<string, InventoryPage>,
): { best: InventoryPage | undefined; candidates: InventoryPage[] } {
  const preferred = byUrl.get(meta.preferredUrl);
  const scored = pages
    .map((p) => ({
      p,
      score:
        tokenOverlap(keyword, p) * 10 +
        sourcePriority(p.source) +
        (compact(p.h1).includes(compact(keyword)) ? 4 : 0) +
        (compact(p.title).includes(compact(keyword.split(" ")[0] || "")) ? 1 : 0),
    }))
    .filter((x) => x.score >= 6)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.p);

  if (preferred) {
    const others = scored.filter((p) => p.url !== preferred.url).slice(0, 5);
    return { best: preferred, candidates: [preferred, ...others] };
  }
  const parent = meta.parentHubUrl ? byUrl.get(meta.parentHubUrl) : undefined;
  return { best: parent, candidates: scored.slice(0, 6) };
}

function coverageScore(
  keyword: string,
  page: InventoryPage | undefined,
  titleDup: boolean,
  descDup: boolean,
): { score: number; issues: string[] } {
  if (!page) return { score: 12, issues: ["NO_REPRESENTATIVE_URL"] };
  const issues: string[] = [];
  let score = 0;
  score += 10;
  const k = compact(keyword);
  const titleC = compact(page.title);
  const h1C = compact(page.h1);
  const introC = compact(page.first700);
  const titleHit = titleC.includes(k) || keyword.split(/\s+/).filter((t) => t.length > 1).some((t) => titleC.includes(compact(t)));
  score += titleHit ? 15 : 4;
  if (!titleHit) issues.push("TITLE_INTENT_WEAK");
  const h1Hit = h1C.includes(k) || keyword.split(/\s+/).filter((t) => t.length > 1).some((t) => h1C.includes(compact(t)));
  score += h1Hit ? 10 : 3;
  if (!h1Hit) issues.push("H1_INTENT_WEAK");
  const introHit = introC.includes(compact(keyword.replace(/부산|법무사/g, ""))) || introC.length > 200;
  score += introHit ? 10 : 3;
  if (page.mainTextLength >= 1800) score += 15;
  else if (page.mainTextLength >= 900) score += 9;
  else {
    score += 3;
    issues.push("THIN_BODY");
  }
  score += page.faqCount >= 3 ? 10 : page.faqCount > 0 ? 6 : 2;
  if (page.faqCount < 2) issues.push("FAQ_THIN");
  score += page.internalIncomingLinks >= 3 ? 10 : page.internalIncomingLinks > 0 ? 6 : 2;
  if (page.internalIncomingLinks === 0) issues.push("ORPHAN_RISK");
  score += page.indexable ? 10 : 0;
  score += !titleDup && !descDup ? 5 : 1;
  if (titleDup) issues.push("DUP_TITLE");
  if (descDup) issues.push("DUP_DESCRIPTION");
  const localHit = !keyword.match(/해운대|센텀|구 |동 /) || (page.region && compact(page.title + page.h1).includes(compact(page.region)));
  score += localHit ? 5 : 2;
  return { score: Math.min(100, score), issues };
}

function bandOf(score: number): CoverageBand {
  if (score >= 85) return "COVERED_STRONG";
  if (score >= 70) return "COVERED_NEEDS_IMPROVEMENT";
  if (score >= 55) return "WEAK_COVERAGE";
  return "CONTENT_GAP_CANDIDATE";
}

const CREATE_INTENTS = new Set([
  "one-person-company",
  "llc-formation",
  "third-party-allotment",
  "shareholder-allotment",
  "debt-equity-swap",
  "in-kind-increase",
  "re-inheritance",
  "foreign-heir",
]);

function decideAction(
  meta: KeywordMeta,
  page: InventoryPage | undefined,
  band: CoverageBand,
  preferredExists: boolean,
): Action {
  if (CREATE_INTENTS.has(meta.intent) && !preferredExists) return "CREATE";
  if (!page) {
    return CREATE_INTENTS.has(meta.intent) ? "CREATE" : "PARENT_HUB_COVERAGE";
  }
  if (band === "COVERED_STRONG") return "KEEP";
  if (band === "COVERED_NEEDS_IMPROVEMENT") return "IMPROVE";
  if (band === "WEAK_COVERAGE") {
    if (meta.regionType === "NEIGHBORHOOD") return "ADD_SECTION";
    return "IMPROVE";
  }
  if (meta.regionType === "NEIGHBORHOOD" || meta.regionType === "LIVING_AREA") {
    return "PARENT_HUB_COVERAGE";
  }
  return CREATE_INTENTS.has(meta.intent) ? "CREATE" : "ADD_SECTION";
}

function techAudit(pages: InventoryPage[]) {
  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  const h1Map = new Map<string, string[]>();
  for (const p of pages) {
    const t = p.title.trim();
    const d = p.description.trim();
    const h = p.h1.trim();
    if (t) titleMap.set(t, [...(titleMap.get(t) || []), p.url]);
    if (d) descMap.set(d, [...(descMap.get(d) || []), p.url]);
    if (h) h1Map.set(h, [...(h1Map.get(h) || []), p.url]);
  }
  const issues: Record<string, unknown>[] = [];
  for (const p of pages) {
    const flags: string[] = [];
    if (!p.title) flags.push("MISSING_TITLE");
    if (!p.description) flags.push("MISSING_DESCRIPTION");
    if (!p.h1) flags.push("MISSING_H1");
    if (p.title.length > 70) flags.push("TITLE_LONG");
    if ((titleMap.get(p.title) || []).length > 1) flags.push("DUP_TITLE");
    if ((descMap.get(p.description) || []).length > 1) flags.push("DUP_DESCRIPTION");
    if ((h1Map.get(p.h1) || []).length > 1) flags.push("DUP_H1");
    if (!p.hasBreadcrumb) flags.push("NO_BREADCRUMB");
    if (p.internalIncomingLinks === 0 && p.url !== "/") flags.push("ORPHAN");
    if (p.source === "seo-landing") flags.push("TEMPLATE_LANDING");
    if (flags.length) {
      issues.push({ url: p.url, source: p.source, flags: flags.join("|"), title: p.title });
    }
  }
  return {
    issues,
    dupTitles: [...titleMap.entries()].filter(([, v]) => v.length > 1).length,
    dupDescriptions: [...descMap.entries()].filter(([, v]) => v.length > 1).length,
    missingH1: pages.filter((p) => !p.h1).length,
    orphan: pages.filter((p) => p.internalIncomingLinks === 0 && p.url !== "/").length,
    titleMap,
    descMap,
  };
}

function duplicatePairs(pages: InventoryPage[]) {
  const pairs: Record<string, unknown>[] = [];
  const byService = new Map<string, InventoryPage[]>();
  for (const p of pages) {
    const list = byService.get(p.service) || [];
    list.push(p);
    byService.set(p.service, list);
  }
  for (const [service, list] of byService) {
    const sample = list
      .filter((p) => p.source !== "seo-landing" || p.mainTextLength > 1200)
      .slice(0, 80);
    for (let i = 0; i < sample.length; i += 1) {
      const a = trigrams(normalizeRegionTokens(sample[i].mainText.slice(0, 4000)));
      for (let j = i + 1; j < sample.length; j += 1) {
        const b = trigrams(normalizeRegionTokens(sample[j].mainText.slice(0, 4000)));
        const sim = jaccard(a, b);
        if (sim < 0.65) continue;
        let level = "SIMILAR";
        if (sim >= 0.9) level = "DUPLICATE_HIGH";
        else if (sim >= 0.8) level = "DUPLICATE_RISK";
        pairs.push({
          service,
          urlA: sample[i].url,
          urlB: sample[j].url,
          similarity: sim.toFixed(3),
          level,
          note: "MERGE_CANDIDATE",
        });
      }
    }
  }
  return pairs;
}

function writeDashboard(stats: Record<string, unknown>, rows: MapRow[]): void {
  const payload = JSON.stringify({ stats, rows });
  const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>TOP450 SEO dashboard</title>
<style>
body{font-family:ui-sans-serif,system-ui;margin:24px;background:#f6f4ef;color:#1f1b16}
h1{font-size:22px} .bar{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
button,select{padding:6px 10px;border:1px solid #cfc6b8;background:#fff;border-radius:8px}
table{border-collapse:collapse;width:100%;background:#fff;font-size:13px}
th,td{border-bottom:1px solid #eee;padding:6px 8px;text-align:left;vertical-align:top}
.STRONG{color:#0b6} .IMPROVE{color:#c60} .WEAK{color:#c40} .GAP{color:#a00}
</style></head><body>
<h1>CURATED_NAVER_SEO_TOP450</h1>
<p>내부 담당 품질 점수입니다. 네이버 순위 예측이 아닙니다.</p>
<div id="stats"></div>
<div class="bar">
<select id="band"><option value="">전체</option>
<option>COVERED_STRONG</option><option>COVERED_NEEDS_IMPROVEMENT</option>
<option>WEAK_COVERAGE</option><option>CONTENT_GAP_CANDIDATE</option>
<option>CREATE</option><option>CANNIBALIZATION_RISK</option></select>
<select id="svc"><option value="">업무 전체</option>
<option>GENERAL</option><option>INHERITANCE</option><option>REAL_ESTATE</option>
<option>CORPORATE</option><option>REHABILITATION</option><option>LEASE</option>
<option>CIVIL</option><option>LOCAL</option></select>
<select id="reg"><option value="">지역 전체</option>
<option>BUSAN</option><option>DISTRICT</option><option>NEIGHBORHOOD</option>
<option>LIVING_AREA</option><option>NEARBY_CITY</option></select>
</div>
<table><thead><tr><th>keyword</th><th>URL</th><th>score</th><th>action</th><th>issues</th></tr></thead>
<tbody id="tb"></tbody></table>
<script>
const DATA = ${payload};
const tb = document.getElementById('tb');
document.getElementById('stats').innerHTML = Object.entries(DATA.stats).map(([k,v])=>k+': <b>'+v+'</b>').join(' · ');
function draw(){
  const b=document.getElementById('band').value,s=document.getElementById('svc').value,r=document.getElementById('reg').value;
  tb.innerHTML='';
  DATA.rows.filter(x=>{
    if(b && b!==x.band && b!==x.action) return false;
    if(s && s!==x.service) return false;
    if(r && r!==x.regionType) return false;
    return true;
  }).forEach(x=>{
    const tr=document.createElement('tr');
    tr.innerHTML='<td>'+x.keyword+'</td><td>'+x.bestUrl+'</td><td>'+x.coverageScore+'</td><td>'+x.action+'</td><td>'+x.issues+'</td>';
    tb.appendChild(tr);
  });
}
['band','svc','reg'].forEach(id=>document.getElementById(id).onchange=draw);
draw();
</script></body></html>`;
  fs.writeFileSync(path.join(REPORT, "dashboard.html"), html, "utf8");
}

function loadCache(key: string): unknown | null {
  const f = path.join(CACHE, key);
  if (!fs.existsSync(f)) return null;
  return JSON.parse(fs.readFileSync(f, "utf8"));
}

function saveCache(key: string, data: unknown): void {
  fs.writeFileSync(path.join(CACHE, key), JSON.stringify(data), "utf8");
}

function stripMain(pages: InventoryPage[]) {
  return pages.map((p) => {
    const { mainText, ...rest } = p;
    return { ...rest, mainTextPreview: p.first700 };
  });
}

function runAll(force: boolean): void {
  validateTop450Keywords();
  ensureDirs();
  const pagesLive = buildInventory();
  const fp = hash(
    PIPELINE_VERSION +
      pagesLive.map((p) => `${p.url}|${p.title}|${p.h1}|${p.mainTextLength}`).join("\n"),
  );
  const hashFile = path.join(CACHE, "site-pages.hash.json");
  const prevHash = fs.existsSync(hashFile)
    ? JSON.parse(fs.readFileSync(hashFile, "utf8")).hash
    : "";
  if (!force && prevHash === fp && fs.existsSync(path.join(CACHE, "keyword-map.json"))) {
    console.log("[top450] cache hit — reuse .cache/naver-top450");
  } else {
    saveCache("site-pages.json", stripMain(pagesLive));
    fs.writeFileSync(hashFile, JSON.stringify({ hash: fp, at: new Date().toISOString() }, null, 2));
  }

  const pages = pagesLive;
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  const tech = techAudit(pages);
  const titleDupUrls = new Set(
    [...tech.titleMap.entries()].filter(([, v]) => v.length > 1).flatMap(([, v]) => v),
  );
  const descDupUrls = new Set(
    [...tech.descMap.entries()].filter(([, v]) => v.length > 1).flatMap(([, v]) => v),
  );

  const mapRows: MapRow[] = [];
  const clusterUrls = new Map<string, Set<string>>();
  for (const keyword of CURATED_NAVER_SEO_TOP450) {
    const meta = classifyKeyword(keyword);
    const { best, candidates } = pickBest(keyword, meta, pages, byUrl);
    const preferredExists = byUrl.has(meta.preferredUrl);
    let resolved = best;
    if (!resolved && !CREATE_INTENTS.has(meta.intent)) {
      resolved = byUrl.get(meta.parentHubUrl || "") || byUrl.get("/부산법무사");
    }
    if (CREATE_INTENTS.has(meta.intent) && !preferredExists) {
      resolved = undefined;
    }
    const scoredOn = resolved || byUrl.get(meta.parentHubUrl || "") || byUrl.get("/부산법인법무사");
    const { score, issues } = coverageScore(
      keyword,
      scoredOn,
      resolved ? titleDupUrls.has(resolved.url) : false,
      resolved ? descDupUrls.has(resolved.url) : false,
    );
    const urls = clusterUrls.get(meta.cluster) || new Set();
    if (CREATE_INTENTS.has(meta.intent) && !preferredExists) urls.add(meta.preferredUrl);
    else if (resolved) urls.add(resolved.url);
    clusterUrls.set(meta.cluster, urls);
    const band = bandOf(score);
    const action = decideAction(meta, resolved, band, preferredExists);
    mapRows.push({
      keyword,
      cluster: meta.cluster,
      region: meta.region,
      regionType: meta.regionType,
      intent: meta.intent,
      service: meta.service,
      bestUrl: resolved?.url || meta.preferredUrl,
      coverageScore: score,
      band,
      candidates: (candidates || []).map((c) => c.url).join("|"),
      action,
      parentHubUrl: meta.parentHubUrl || "",
      issues: issues.join("|"),
    });
  }

  for (const row of mapRows) {
    const urls = clusterUrls.get(row.cluster);
    if (urls && urls.size >= 2 && row.action !== "CREATE") {
      row.action = "CANNIBALIZATION_RISK";
      row.issues = [row.issues, "MULTI_URL_CLUSTER"].filter(Boolean).join("|");
    }
  }

  saveCache("keyword-map.json", mapRows);
  const intentGroups = [...new Set(mapRows.map((r) => r.cluster))];
  saveCache("intent-map.json", intentGroups);

  const mappedUrls = [...new Set(mapRows.map((r) => r.bestUrl))].map((u) => byUrl.get(u)).filter(Boolean) as InventoryPage[];
  const dups = force || !fs.existsSync(path.join(CACHE, "similarity.json"))
    ? duplicatePairs(mappedUrls)
    : (loadCache("similarity.json") as Record<string, unknown>[]);
  saveCache("similarity.json", dups);

  const createPlan = mapRows
    .filter((r) => r.action === "CREATE")
    .reduce<Record<string, MapRow[]>>((acc, r) => {
      acc[r.cluster] = acc[r.cluster] || [];
      acc[r.cluster].push(r);
      return acc;
    }, {});
  const createPlanRows = Object.entries(createPlan).map(([cluster, ks]) => ({
    intent: cluster,
    keywords: ks.map((k) => k.keyword).join("|"),
    reason: "Independent legal procedure not covered by a unique existing URL",
    existingCandidates: ks[0]?.candidates || "",
    whyExistingPagesInsufficient: "Hub covers synonym or adjacent procedure only",
    uniqueContentPlan: "Situation, documents, sequence, FAQ unique to this intent",
    targetParentHub: ks[0]?.parentHubUrl || ks[0]?.bestUrl || "",
  }));
  saveCache("new-page-plan.json", createPlanRows);

  const inventoryRows = pages.map((p) => ({
    url: p.url,
    title: p.title,
    h1: p.h1,
    description: p.description,
    canonical: p.canonical,
    headings: p.headings.join("|"),
    mainTextLength: p.mainTextLength,
    region: p.region,
    service: p.service,
    intent: p.intent,
    internalIncomingLinks: p.internalIncomingLinks,
    internalOutgoingLinks: p.internalOutgoingLinks,
    sitemap: p.sitemap,
    indexable: p.indexable,
    schemaTypes: p.schemaTypes.join("|"),
    hasBreadcrumb: p.hasBreadcrumb,
    imageCount: p.imageCount,
    altCoverage: p.altCoverage,
    source: p.source,
  }));

  writeCsv(path.join(INVENTORY_DIR, "site-inventory.csv"), Object.keys(inventoryRows[0] || { url: 1 }), inventoryRows);
  writeCsv(path.join(REPORT, "02-site-inventory.csv"), Object.keys(inventoryRows[0] || { url: 1 }), inventoryRows);
  writeCsv(path.join(REPORT, "01-top450-keywords.csv"), ["set", "keyword"], [
    ...CURATED_NAVER_SEO_TOP450.slice(0, 200).map((keyword) => ({ set: "SET_1", keyword })),
    ...CURATED_NAVER_SEO_TOP450.slice(200).map((keyword) => ({ set: "SET_2", keyword })),
  ]);
  writeCsv(path.join(REPORT, "03-keyword-to-url.csv"), Object.keys(mapRows[0]), mapRows);
  writeCsv(path.join(REPORT, "04-coverage-score.csv"), ["keyword", "bestUrl", "coverageScore", "band", "action"], mapRows);
  writeCsv(
    path.join(REPORT, "05-existing-pages-to-improve.csv"),
    Object.keys(mapRows[0]),
    mapRows.filter((r) => r.action === "IMPROVE" || r.action === "ADD_SECTION"),
  );
  writeCsv(
    path.join(REPORT, "06-content-gaps.csv"),
    Object.keys(mapRows[0]),
    mapRows.filter((r) => r.band === "CONTENT_GAP_CANDIDATE" || r.action === "CREATE" || r.action === "PARENT_HUB_COVERAGE"),
  );
  writeCsv(path.join(REPORT, "07-create-plan.csv"), ["intent", "keywords", "reason", "existingCandidates", "whyExistingPagesInsufficient", "uniqueContentPlan", "targetParentHub"], createPlanRows);
  writeCsv(path.join(REPORT, "08-created-pages.csv"), ["url", "status"], [{ url: "(filled after create)", status: "pending" }]);
  writeCsv(path.join(REPORT, "09-cannibalization.csv"), Object.keys(mapRows[0]), mapRows.filter((r) => r.action === "CANNIBALIZATION_RISK"));
  writeCsv(path.join(REPORT, "10-duplicate-content.csv"), ["service", "urlA", "urlB", "similarity", "level", "note"], dups);
  writeCsv(path.join(REPORT, "11-technical-seo.csv"), ["url", "source", "flags", "title"], tech.issues);
  writeCsv(path.join(REPORT, "12-regional-coverage.csv"), Object.keys(mapRows[0]), mapRows.filter((r) => r.service === "LOCAL" || r.regionType !== "NONE"));
  writeCsv(path.join(REPORT, "13-internal-links.csv"), ["url", "in", "out"], pages.map((p) => ({ url: p.url, in: p.internalIncomingLinks, out: p.internalOutgoingLinks })));

  const counts = (key: keyof MapRow, val: string) => mapRows.filter((r) => r[key] === val).length;
  const stats = {
    inventoryPages: pages.length,
    keywords: mapRows.length,
    intentGroups: intentGroups.length,
    COVERED_STRONG: counts("band", "COVERED_STRONG"),
    COVERED_NEEDS_IMPROVEMENT: counts("band", "COVERED_NEEDS_IMPROVEMENT"),
    WEAK_COVERAGE: counts("band", "WEAK_COVERAGE"),
    CONTENT_GAP_CANDIDATE: counts("band", "CONTENT_GAP_CANDIDATE"),
    CREATE: counts("action", "CREATE"),
    IMPROVE: counts("action", "IMPROVE"),
    PARENT_HUB_COVERAGE: counts("action", "PARENT_HUB_COVERAGE"),
    CANNIBALIZATION_RISK: counts("action", "CANNIBALIZATION_RISK"),
    dupTitles: tech.dupTitles,
    dupDescriptions: tech.dupDescriptions,
    missingH1: tech.missingH1,
    orphan: tech.orphan,
    duplicatePairs: dups.length,
  };
  saveCache("seo-audit.json", stats);
  writeCsv(path.join(REPORT, "14-final-validation.csv"), ["metric", "value"], Object.entries(stats).map(([metric, value]) => ({ metric, value })));

  const summary = `# TOP450 SEO summary (${DATE})

- 감사 URL 수: ${stats.inventoryPages}
- TOP450 keyword 수: ${stats.keywords}
- intent group 수: ${stats.intentGroups}
- COVERED_STRONG: ${stats.COVERED_STRONG}
- COVERED_NEEDS_IMPROVEMENT: ${stats.COVERED_NEEDS_IMPROVEMENT}
- WEAK_COVERAGE: ${stats.WEAK_COVERAGE}
- CONTENT_GAP_CANDIDATE: ${stats.CONTENT_GAP_CANDIDATE}
- CREATE: ${stats.CREATE}
- IMPROVE: ${stats.IMPROVE}
- PARENT_HUB_COVERAGE: ${stats.PARENT_HUB_COVERAGE}
- cannibalization risk: ${stats.CANNIBALIZATION_RISK}
- duplicate titles: ${stats.dupTitles}
- duplicate descriptions: ${stats.dupDescriptions}
- duplicate content pairs (>=0.65 among mapped URLs): ${stats.duplicatePairs}

네이버 실제 순위는 확인하지 않았습니다.
`;
  fs.writeFileSync(path.join(REPORT, "00-summary.md"), summary, "utf8");
  writeDashboard(stats, mapRows);
  fs.writeFileSync(path.join(REPORT, "metadata.json"), JSON.stringify({ date: DATE, noRankCheck: true, stats }, null, 2));
  console.log(summary);
}

const cmd = process.argv[2] || "all";
const force = process.argv.includes("--force");
if (cmd === "validate") {
  validateTop450Keywords();
  console.log("TOP450 keyword sets OK");
} else {
  runAll(force);
}
