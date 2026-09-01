#!/usr/bin/env node
/**
 * ZERO-REGRESSION SEO FREEZE snapshot.
 * Production crawl for priority URLs + local route inventory for all paths.
 * Does NOT modify site content.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "audit", "seo-freeze");
const SITE = "https://xn--2j1br1na42lvxja38mk8r.kr";
const PATHS_JSON = path.join(ROOT, "scripts", "output", "seo-paths.json");
const PROTECTED_CFG = path.join(ROOT, "config", "seo-protected-assets.json");
const OWNERSHIP = path.join(ROOT, "seo-master-2026-08", "03-query-ownership.csv");
const CANNIBAL = path.join(ROOT, "seo-master-2026-08", "04-cannibalization.csv");

const PRIORITY_CRAWL = [
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
  "/부산법무사비용",
  "/부산법인법무사",
  "/부산법인등기",
  "/개인회생파산",
  "/부산개인회생",
  "/해운대법무사",
  "/센텀법무사",
  "/연제구법무사",
  "/about",
  "/office",
  "/services",
  "/contact",
  "/location",
  "/media",
  "/강의이력",
  "/강의문의",
  "/법률강의",
  "/상속",
  "/전국상속등기",
  "/법인등기",
  "/부동산등기",
  "/robots.txt",
  "/sitemap.xml",
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function csvEscape(v) {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(file, headers, rows) {
  ensureDir(OUT);
  const lines = [
    headers.join(","),
    ...rows.map((r) => r.map(csvEscape).join(",")),
  ];
  fs.writeFileSync(path.join(OUT, file), `${lines.join("\n")}\n`, "utf8");
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html, prop, attr = "name") {
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

function extractTag(html, tag) {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? stripTags(m[1]) : "";
}

function allTags(html, tag) {
  const out = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let m;
  while ((m = re.exec(html))) out.push(stripTags(m[1]));
  return out;
}

function extractCanonical(html) {
  const m = html.match(
    /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
  );
  if (m) return m[1];
  const m2 = html.match(
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i,
  );
  return m2?.[1] ?? "";
}

function extractMain(html) {
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  return m ? stripTags(m[0]) : stripTags(html).slice(0, 8000);
}

function hash(text) {
  return createHash("sha256").update(text || "").digest("hex").slice(0, 16);
}

function semanticHash(text) {
  const norm = (text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();
  return hash(norm);
}

function normalizePath(p) {
  if (!p) return "/";
  let s = String(p).split("?")[0].split("#")[0];
  try {
    if (s.startsWith("http")) s = new URL(s).pathname;
  } catch {
    /* ignore */
  }
  s = decodeURIComponent(s);
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

async function fetchUrl(urlPath) {
  const url = urlPath.startsWith("http") ? urlPath : `${SITE}${encodeURI(urlPath)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent":
          "DaomSeoFreezeBot/1.0 (+zero-regression freeze; preserve-first)",
        accept: "text/html,application/xhtml+xml,*/*",
      },
      redirect: "manual",
    });
    const buf = Buffer.from(await res.arrayBuffer());
    const text = buf.toString("utf8");
    return {
      status: res.status,
      location: res.headers.get("location") || "",
      robotsHeader: res.headers.get("x-robots-tag") || "",
      contentType: res.headers.get("content-type") || "",
      body: text,
    };
  } catch (err) {
    return {
      status: 0,
      location: "",
      robotsHeader: "",
      contentType: "",
      body: "",
      error: String(err?.message || err),
    };
  } finally {
    clearTimeout(timer);
  }
}

function loadLocalPaths() {
  const sets = [];
  if (fs.existsSync(PATHS_JSON)) {
    const data = JSON.parse(fs.readFileSync(PATHS_JSON, "utf8"));
    sets.push(...(data.paths || []).map(normalizePath));
  }
  const baseline = path.join(
    ROOT,
    "scripts",
    "output",
    "existing-routes-baseline-2026-08-30.json",
  );
  if (fs.existsSync(baseline)) {
    const data = JSON.parse(fs.readFileSync(baseline, "utf8"));
    sets.push(...(data.publishedPaths || data.paths || []).map(normalizePath));
  }
  return [...new Set(sets)].sort((a, b) => a.localeCompare(b, "ko"));
}

function loadProtectedFromConfig() {
  if (!fs.existsSync(PROTECTED_CFG)) return new Map();
  const cfg = JSON.parse(fs.readFileSync(PROTECTED_CFG, "utf8"));
  const map = new Map();
  for (const p of cfg.pages || []) {
    const url = normalizePath(p.url);
    const level =
      p.protectionLevel === "FULL" || p.modificationRisk === "HIGH"
        ? "P0"
        : p.protectionLevel === "URL"
          ? "P1"
          : "P1";
    map.set(url, {
      level,
      reason: p.reason || p.role || "config-protected",
    });
  }
  return map;
}

function loadOwnersFromCsv() {
  const map = new Map();
  if (!fs.existsSync(OWNERSHIP)) return map;
  const lines = fs.readFileSync(OWNERSHIP, "utf8").split(/\r?\n/).slice(1);
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = line.split(",");
    const query = cols[0];
    const primary = normalizePath(cols[3]);
    if (!primary || primary === "PRIMARY URL") continue;
    const existing = map.get(primary);
    if (!existing) {
      map.set(primary, { level: "P0", reason: `owner:${query}` });
    } else {
      existing.reason += `|${query}`;
    }
  }
  return map;
}

async function main() {
  ensureDir(OUT);
  const localPaths = loadLocalPaths();
  const protectedMap = loadProtectedFromConfig();
  const ownerMap = loadOwnersFromCsv();

  // Merge protection: owners P0, config P0/P1, else P2 for all indexable routes
  const registry = {};
  for (const p of localPaths) {
    const owner = ownerMap.get(p);
    const cfg = protectedMap.get(p);
    if (owner) registry[p] = "P0";
    else if (cfg) registry[p] = cfg.level;
    else registry[p] = "P2";
  }
  // Ensure crawl priorities exist
  for (const p of PRIORITY_CRAWL) {
    if (p.endsWith(".txt") || p.endsWith(".xml")) continue;
    if (!registry[p]) registry[p] = ownerMap.has(p) ? "P0" : "P1";
  }

  fs.mkdirSync(path.join(ROOT, "seo"), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, "seo", "protected-urls.json"),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        policy: "PRESERVE_FIRST — UNKNOWN performance treated as P2 protect",
        counts: {
          P0: Object.values(registry).filter((v) => v === "P0").length,
          P1: Object.values(registry).filter((v) => v === "P1").length,
          P2: Object.values(registry).filter((v) => v === "P2").length,
          total: Object.keys(registry).length,
        },
        urls: registry,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  // routes.csv — full local inventory
  writeCsv(
    "routes.csv",
    ["url", "source", "protection", "in_local_inventory"],
    localPaths.map((p) => [p, "seo-paths.json", registry[p] || "P2", "yes"]),
  );

  // Production crawl priority pages
  const crawlTargets = PRIORITY_CRAWL.filter(
    (p) => !p.endsWith(".xml") || p === "/sitemap.xml" || p === "/robots.txt",
  );
  const metaRows = [];
  const headingRows = [];
  const canonicalRows = [];
  const indexRows = [];
  const bodyRows = [];
  const schemaRows = [];
  const fingerprintRows = [];

  console.log(`[freeze] crawling ${crawlTargets.length} production URLs…`);
  for (const p of crawlTargets) {
    process.stdout.write(`  ${p} `);
    const res = await fetchUrl(p);
    console.log(res.status || res.error || "?");

    if (p === "/robots.txt" || p === "/sitemap.xml") {
      indexRows.push([
        p,
        res.status,
        "",
        res.robotsHeader,
        "",
        p === "/robots.txt" ? "robots" : "sitemap",
        res.body.slice(0, 200).replace(/\s+/g, " "),
        hash(res.body),
      ]);
      continue;
    }

    const title = extractTag(res.body, "title");
    const description = extractMeta(res.body, "description");
    const robots = extractMeta(res.body, "robots");
    const canonical = extractCanonical(res.body);
    const h1s = allTags(res.body, "h1");
    const h2s = allTags(res.body, "h2");
    const main = extractMain(res.body);
    const wordCount = main ? main.split(/\s+/).filter(Boolean).length : 0;
    const bodyHash = hash(main);
    const bodySem = semanticHash(main);
    const schemaTypes = [
      ...res.body.matchAll(/"@type"\s*:\s*"([^"]+)"/g),
    ].map((m) => m[1]);
    const uniqueSchema = [...new Set(schemaTypes)].join("|");
    const indexable =
      res.status === 200 &&
      !/noindex/i.test(robots) &&
      !/noindex/i.test(res.robotsHeader);

    metaRows.push([
      p,
      res.status,
      title,
      description,
      robots,
      res.robotsHeader,
      registry[p] || "P1",
    ]);
    headingRows.push([
      p,
      h1s.length,
      h1s[0] || "",
      h1s.slice(1).join(" | "),
      h2s[0] || "",
      h2s.slice(0, 5).join(" | "),
    ]);
    canonicalRows.push([
      p,
      canonical,
      normalizePath(canonical) === normalizePath(p) ? "self" : "other",
      res.status,
    ]);
    indexRows.push([
      p,
      res.status,
      robots,
      res.robotsHeader,
      indexable ? "indexable" : "not-indexable",
      res.location,
      "",
      "",
    ]);
    bodyRows.push([
      p,
      wordCount,
      bodyHash,
      bodySem,
      main.slice(0, 300),
      main.slice(0, 500),
    ]);
    schemaRows.push([p, uniqueSchema, schemaTypes.length]);
    fingerprintRows.push([
      p,
      hash(
        [
          p,
          res.status,
          robots,
          canonical,
          title,
          h1s[0] || "",
          bodySem,
        ].join("|"),
      ),
      registry[p] || "P1",
      indexable ? "yes" : "no",
    ]);
  }

  writeCsv(
    "meta.csv",
    ["url", "http_status", "title", "description", "robots", "x_robots", "protection"],
    metaRows,
  );
  writeCsv(
    "headings.csv",
    ["url", "h1_count", "h1", "extra_h1", "first_h2", "h2_sample"],
    headingRows,
  );
  writeCsv(
    "canonical.csv",
    ["url", "canonical", "canonical_relation", "http_status"],
    canonicalRows,
  );
  writeCsv(
    "indexability.csv",
    [
      "url",
      "http_status",
      "robots",
      "x_robots",
      "indexability",
      "location",
      "note",
      "extra",
    ],
    indexRows,
  );
  writeCsv(
    "body-fingerprint.csv",
    [
      "url",
      "word_count",
      "main_body_hash",
      "main_body_semantic_hash",
      "first_300",
      "first_500",
    ],
    bodyRows,
  );
  writeCsv("schema.csv", ["url", "schema_types", "schema_type_count"], schemaRows);
  writeCsv(
    "seo-fingerprint.csv",
    ["url", "fingerprint", "protection", "indexable"],
    fingerprintRows,
  );

  // Sitemap snapshot from production
  const sm = await fetchUrl("/sitemap.xml");
  const smPaths = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(sm.body))) {
    try {
      smPaths.push(normalizePath(decodeURIComponent(new URL(m[1]).pathname)));
    } catch {
      /* ignore */
    }
  }
  writeCsv(
    "sitemap.csv",
    ["url", "in_production_sitemap", "http_status_sitemap_doc"],
    [...new Set(smPaths)]
      .sort((a, b) => a.localeCompare(b, "ko"))
      .map((p) => [p, "yes", sm.status]),
  );

  // Internal links — lightweight from crawled HTML only
  const linkRows = [];
  for (const row of metaRows) {
    const p = row[0];
    // re-fetch not needed — skip deep; use placeholder counts from crawl set
    linkRows.push([p, "crawl-sample", "", "", "see production HTML audit"]);
  }
  writeCsv(
    "internal-links.csv",
    ["url", "scope", "incoming_link_count", "exact_anchor_in_count", "note"],
    [
      [
        "(sitewide)",
        "deferred-full-graph",
        "",
        "",
        "Full graph deferred; owner incoming-link gate uses seo:regression + existing audits",
      ],
      ...linkRows,
    ],
  );

  // Cannibalization observation (READ-ONLY copy/enrich)
  if (fs.existsSync(CANNIBAL)) {
    fs.copyFileSync(
      CANNIBAL,
      path.join(ROOT, "seo", "cannibalization-observation.csv"),
    );
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    site: SITE,
    localRouteCount: localPaths.length,
    productionCrawled: crawlTargets.length,
    protectedCounts: {
      P0: Object.values(registry).filter((v) => v === "P0").length,
      P1: Object.values(registry).filter((v) => v === "P1").length,
      P2: Object.values(registry).filter((v) => v === "P2").length,
    },
    policy: "PRESERVE_FIRST — no RED changes applied by this script",
  };
  fs.writeFileSync(
    path.join(OUT, "freeze-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );
  console.log("[freeze] done → audit/seo-freeze/", summary);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
