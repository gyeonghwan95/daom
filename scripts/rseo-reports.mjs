#!/usr/bin/env node
/**
 * REGIONAL SEO — build 후 보고서 CSV/TXT/dashboard 생성.
 *   SNAP_TARGETS=... node scripts/rseo-reports.mjs
 * 입력: .cache/regional-seo/{audit,simcheck,score,diff-report}.json, before/after manifest, out/, sitemap-manifest
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATE = process.env.RSEO_DATE || "2026-09-27";
const OUT = path.join(ROOT, "reports", "regional-seo", DATE);
const CACHE = path.join(ROOT, ".cache", "regional-seo");
const ORIGIN = "https://xn--2j1br1na42lvxja38mk8r.kr";
const TARGETS = (process.env.SNAP_TARGETS || "").split(",").filter(Boolean);
const CITY_TARGETS = TARGETS.filter((t) => t.startsWith("/업무사례/"));

const j = (f) => JSON.parse(fs.readFileSync(path.join(CACHE, f), "utf8"));
const audit = j("audit.json");
const sim = j("simcheck.json");
const score = j("score.json");
const diff = j("diff-report.json");
const before = j("before/manifest.json").pages;
const after = j("after/manifest.json").pages;
const sitemapAfter = new Map(
  JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/output/sitemap-manifest.json"), "utf8")).entries.map((e) => [
    decodeURIComponent(e.path),
    e,
  ]),
);
const lastmodDiff = new Map(diff.sitemap.targetLastmod.map((e) => [e.path, e]));

const esc = (v) => {
  const s = Array.isArray(v) ? v.join(" / ") : String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const writeCsv = (name, head, rows) => {
  fs.writeFileSync(path.join(OUT, name), `\uFEFF${[head.join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n")}\n`);
  console.log(`[rseo-reports] ${name} rows=${rows.length}`);
};
const htmlFor = (url) => {
  const flat = path.join(ROOT, "out", `${url.slice(1)}.html`);
  return fs.readFileSync(fs.existsSync(flat) ? flat : path.join(ROOT, "out", ...url.slice(1).split("/"), "index.html"), "utf8");
};
const decode = (s) =>
  String(s || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
const stripTags = (h) => decode(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const mainOf = (html) => html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? "";
const mainLinks = (html) =>
  [...mainOf(html).matchAll(/<a\b[^>]*\shref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => ({ href: decodeURIComponent(decode(m[1]).split("#")[0].split("?")[0]), anchor: stripTags(m[2]) }))
    .filter((l) => l.href.startsWith("/") && !l.href.startsWith("/_next/"));

// 13 — pages improved
writeCsv(
  "13-pages-improved.csv",
  ["url", "titleBefore", "titleAfter", "h1Before", "h1After", "descriptionBefore", "descriptionAfter", "normSimBefore", "normSimAfter", "first700SimBefore", "first700SimAfter", "mainCharsBefore", "mainCharsAfter", "ogBefore", "ogAfter", "lastmodBefore", "lastmodAfter"],
  TARGETS.map((u) => [
    u, before[u].title, after[u].title, before[u].h1, after[u].h1, before[u].description, after[u].description,
    sim[u]?.before?.maxBody, sim[u]?.after?.maxBody, sim[u]?.before?.maxFirst700, sim[u]?.after?.maxFirst700,
    before[u].bodyChars, after[u].bodyChars, before[u].ogImage, after[u].ogImage,
    lastmodDiff.get(u)?.before ?? "", lastmodDiff.get(u)?.after ?? "",
  ]),
);

// 14 — pages created (none)
writeCsv("14-pages-created.csv", ["url", "region", "status", "reason"], [
  ["(none)", "-", "NOT_CREATED", "평가한 23개 지역 모두 대표 URL이 이미 존재. 신규 URL은 기존 대표 URL과 같은 의도를 나눠 갖게 되므로(cannibalization) Batch A는 기존 URL 개선으로 진행."],
]);

// 16 — internal link map (hub → cities, cities → out)
const linkRows = [];
const hubLinks = mainLinks(htmlFor("/전국상속등기")).filter((l) => l.href.startsWith("/업무사례/") && /상속등기법무사$/.test(l.href));
for (const l of hubLinks) linkRows.push(["/전국상속등기", l.href, l.anchor, "HUB_TO_CITY", "new curated section"]);
for (const u of CITY_TARGETS) {
  const seen = new Set();
  for (const l of mainLinks(htmlFor(u))) {
    if (l.href === u || seen.has(l.href + l.anchor)) continue;
    seen.add(l.href + l.anchor);
    linkRows.push([u, l.href, l.anchor, l.href === "/전국상속등기" ? "CITY_TO_HUB" : "CITY_TO_RELATED", ""]);
  }
}
for (const r of audit.rows.filter((r) => CITY_TARGETS.includes(r.url))) {
  linkRows.push(["(all pages)", r.url, "", "INBOUND_COUNT", `incomingLinks=${r.incomingLinks}; inMain=${r.incomingLinksInMain}`]);
}
writeCsv("16-internal-link-map.csv", ["source", "target", "anchor", "type", "note"], linkRows);

// 18 — technical SEO
const techRows = TARGETS.map((u) => {
  const html = htmlFor(u);
  const a = after[u];
  const og = a.ogImage;
  const sm = sitemapAfter.get(u);
  return [
    u, "200(static)", a.title.length, a.description.length, a.h1Count,
    decodeURIComponent(a.canonical) === ORIGIN + u ? "Y" : "N",
    /noindex/i.test(a.robots) ? "noindex" : "index",
    sm ? "Y" : "N", sm?.lastmod ?? "",
    /%25/.test(og) ? "DOUBLE_ENCODED" : /^[\x20-\x7e]+$/.test(og) ? "ASCII_OK" : "NON_ASCII",
    /og:image:width" content="1200"/.test(html) ? "1200x630" : "?",
    a.schemaTypes.filter((t) => ["WebPage", "BreadcrumbList", "FAQPage", "LegalService", "Organization"].includes(t)).join("|"),
    /<meta[^>]*name="keywords"/i.test(html) ? "PRESENT" : "none",
    audit.rows.find((r) => r.url === u)?.textBeforeH1InMain ?? "",
  ];
});
writeCsv(
  "18-technical-seo.csv",
  ["url", "status", "titleLen", "descLen", "h1Count", "selfCanonical", "robots", "inSitemap", "lastmod", "ogImageUrl", "ogSize", "schemaTypes(subset)", "metaKeywords", "textCharsBeforeH1InMain"],
  techRows,
);

// 19 — IndexNow (changed pages only)
fs.writeFileSync(
  path.join(OUT, "19-indexnow-targets.txt"),
  `${TARGETS.map((u) => ORIGIN + u.split("/").map((s) => encodeURIComponent(s)).join("/")).join("\n")}\n`,
);
console.log(`[rseo-reports] 19-indexnow-targets.txt urls=${TARGETS.length}`);

// 21 — performance baseline template
const baseRows = [];
for (const e of score) {
  if (!e.serp) continue;
  baseRows.push([DATE, e.serp.query, e.representativeUrl, "", "", "", "", e.serp.position ?? "absent", e.serp.shown.join(" "), e.batch ? `Batch ${e.batch}` : e.action]);
}
writeCsv(
  "21-performance-baseline.csv",
  ["date", "query", "url", "impressions", "clicks", "ctr", "avgPosition", "serpSamplePosition", "serpSampleShownUrls", "group"],
  baseRows,
);

// dashboard
const scoreByRegion = new Map(score.map((e) => [e.region, e]));
const dashRows = audit.rows.map((r) => {
  const e = scoreByRegion.get(r.region);
  const isRep = e && e.representativeUrl === r.url;
  let status = "OK";
  if (isRep && e.action === "PROTECT_WINNER") status = "PROVEN";
  else if (isRep && e.batch === "A") status = "IMPROVE";
  else if (isRep && e.batch === "B") status = "TEST";
  else if (isRep && e.action === "HOLD") status = "HOLD";
  else if (r.thinLocal) status = "THIN";
  else if (r.similarityBand === "DOORWAY_DUPLICATE_RISK" || r.similarityBand === "HIGH_SIMILARITY") status = "DUPLICATE";
  return {
    region: r.region, group: r.regionGroup, service: r.service, query: isRep ? e.targetIntent : "",
    url: r.url, status, opportunity: isRep ? e.total : "", remoteFit: r.service === "상속등기" ? 90 : "",
    similarity: r.maxNormSim, contentChars: r.mainTextChars, indexable: r.indexable, action: isRep ? e.action : "",
  };
});
fs.writeFileSync(path.join(CACHE, "dashboard-rows.json"), JSON.stringify(dashRows));
console.log(`[rseo-reports] dashboard-rows.json rows=${dashRows.length} (run scripts/rseo-dashboard.mjs)`);
