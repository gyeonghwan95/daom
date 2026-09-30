#!/usr/bin/env node
/**
 * NAVER CRITICAL RECOVERY — before/after snapshot + protected URL gate.
 *
 *   node scripts/ncr-snapshot.mjs --phase=before
 *   node scripts/ncr-snapshot.mjs --phase=after
 *   node scripts/ncr-snapshot.mjs --compare
 *
 * Hashes: title, description, canonical, robots, H1, normalized main body, internal href set,
 * JSON-LD schema, og:title / og:description / og:image, image src+alt set.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const NS = process.env.SNAP_NS || "naver-critical-recovery";
const CACHE = path.join(ROOT, ".cache", NS);
const PATHS_JSON = path.join(ROOT, "scripts", "output", "seo-paths.json");
const REPORT_DATE = process.env.REPORT_DATE || "2026-09-27";
const REPORT_DIR = path.join(ROOT, "reports", NS, REPORT_DATE);
const DIFF_CSV = process.env.SNAP_DIFF_CSV || "19-protected-url-diff.csv";

export const TARGET_LECTURE_URLS = new Set(
  process.env.SNAP_TARGETS
    ? process.env.SNAP_TARGETS.split(",").map((s) => s.trim()).filter(Boolean)
    : ["/부산상속전문법무사", "/부산상속포기", "/해운대법무사"],
);

const HASH_KEYS = ["title", "description", "canonical", "robots", "h1", "body", "hrefs", "schema", "og", "images"];

const args = process.argv.slice(2);
const phaseArg = args.find((a) => a.startsWith("--phase="));
const phase = phaseArg ? phaseArg.split("=")[1] : null;
const doCompare = args.includes("--compare");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function hash(text) {
  return createHash("sha256").update(text || "", "utf8").digest("hex");
}

function normalizePath(p) {
  if (!p) return "/";
  let s = String(p).split("?")[0].split("#")[0];
  try {
    s = decodeURIComponent(s);
  } catch {
    /* keep raw */
  }
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

function htmlPathForUrl(urlPath) {
  const clean = normalizePath(urlPath);
  if (clean === "/") return path.join(OUT, "index.html");
  const flat = path.join(OUT, `${clean.slice(1)}.html`);
  if (fs.existsSync(flat)) return flat;
  return path.join(OUT, ...clean.slice(1).split("/"), "index.html");
}

function decodeEntities(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html, prop, attr = "name") {
  const re = new RegExp(`<meta[^>]*${attr}=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i");
  const m = html.match(re);
  if (m) return decodeEntities(m[1] ?? "");
  const re2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${prop}["']`, "i");
  return decodeEntities(html.match(re2)?.[1] ?? "");
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? stripTags(m[1]) : "";
}

function extractH1s(html) {
  return [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  if (m) return m[1];
  return html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i)?.[1] ?? "";
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  return m ? m[1] : html;
}

/** Remove review feed section (refetched every prebuild) before text extraction. */
function stripVolatileMarkup(html) {
  return html.replace(
    /<section[^>]*id=["']naver-place-reviews["'][\s\S]*?<\/section>/gi,
    " ",
  );
}

export function normalizeBody(text) {
  return String(text || "")
    .replace(/현재 카카오·네이버톡톡만 가능/g, "[CONSULT_STATUS]")
    .replace(/현재 상담가능/g, "[CONSULT_STATUS]")
    .replace(/전화상담은 (오늘|내일|토요일|일요일|월요일) 9시부터 가능/g, "[CONSULT_NEXT]")
    .replace(/\s+/g, " ")
    .trim();
}

function extractInternalHrefs(html) {
  const body = html.replace(/<head[\s\S]*?<\/head>/i, " ");
  const set = new Set();
  for (const m of body.matchAll(/<a\b[^>]*\shref=["']([^"']+)["']/gi)) {
    const raw = decodeEntities(m[1]);
    if (/^(https?:|mailto:|tel:|sms:|javascript:|#)/i.test(raw)) {
      if (/^https?:\/\/(xn--2j1br1na42lvxja38mk8r\.kr|다옴법무사사무소\.kr)/i.test(raw)) {
        set.add(normalizePath(raw.replace(/^https?:\/\/[^/]+/i, "")) + hashPart(raw));
      }
      continue;
    }
    if (raw.startsWith("/_next/")) continue;
    set.add(normalizePath(raw) + hashPart(raw));
  }
  return [...set].sort();
}

function hashPart(raw) {
  const i = raw.indexOf("#");
  return i >= 0 ? raw.slice(i) : "";
}

function extractSchema(html) {
  return [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1].trim().replace(/"(dateModified|datePublished|uploadDate)":"[^"]*"/g, '"$1":"[DATE]"'))
    .sort();
}

function extractSchemaTypes(schema) {
  return [...new Set(schema.flatMap((s) => [...s.matchAll(/"@type":"([^"]+)"/g)].map((m) => m[1])))].sort();
}

function extractImages(html) {
  const main = stripVolatileMarkup(extractMain(html));
  return [
    ...new Set(
      [...main.matchAll(/<img\b[^>]*>/gi)].map((m) => {
        const src = decodeEntities(m[0].match(/\ssrc="([^"]+)"/)?.[1] ?? "").replace(/[?&](w|q)=\d+/g, "");
        const alt = decodeEntities(m[0].match(/\salt="([^"]*)"/)?.[1] ?? "");
        return `${src}|${alt}`;
      }),
    ),
  ].sort();
}

function snapshotPage(urlPath) {
  const file = htmlPathForUrl(urlPath);
  if (!fs.existsSync(file)) return { url: urlPath, missing: true };
  const html = fs.readFileSync(file, "utf8");
  const mainText = stripTags(stripVolatileMarkup(extractMain(html)));
  const schema = extractSchema(html);
  return {
    url: urlPath,
    missing: false,
    title: extractTitle(html),
    description: extractMeta(html, "description"),
    canonical: extractCanonical(html),
    robots: extractMeta(html, "robots"),
    h1: extractH1s(html).join(" | "),
    h1Count: extractH1s(html).length,
    ogTitle: extractMeta(html, "og:title", "property"),
    ogDescription: extractMeta(html, "og:description", "property"),
    ogImage: extractMeta(html, "og:image", "property"),
    schemaTypes: extractSchemaTypes(schema),
    schema,
    images: extractImages(html),
    mainText,
    hrefs: extractInternalHrefs(html),
  };
}

function hashesFor(page) {
  return {
    title: hash(page.title),
    description: hash(page.description),
    canonical: hash(page.canonical),
    robots: hash(page.robots),
    h1: hash(page.h1),
    body: hash(normalizeBody(page.mainText)),
    hrefs: hash(page.hrefs.join("\n")),
    schema: hash(page.schema.join("\n")),
    og: hash([page.ogTitle, page.ogDescription, page.ogImage].join("\n")),
    images: hash(page.images.join("\n")),
  };
}

function loadAllIndexableUrls() {
  const data = JSON.parse(fs.readFileSync(PATHS_JSON, "utf8"));
  const paths = (data.paths || []).map(normalizePath);
  // SNAP_INCLUDE_SITEMAP=1 — seo-paths.json 밖에서 추가된 sitemap URL(예: 선박 클러스터)도 보호 대상에 포함
  if (process.env.SNAP_INCLUDE_SITEMAP) {
    const sitemap = JSON.parse(
      fs.readFileSync(path.join(ROOT, "scripts", "output", "sitemap-manifest.json"), "utf8"),
    );
    for (const e of sitemap.entries || []) paths.push(normalizePath(e.path));
  }
  return [...new Set(paths)].sort();
}

function writePhase(phaseName) {
  const dir = path.join(CACHE, phaseName);
  ensureDir(dir);
  const allUrls = loadAllIndexableUrls();
  const pages = {};
  for (const url of allUrls) pages[url] = snapshotPage(url);
  const manifest = {
    generatedAt: new Date().toISOString(),
    phase: phaseName,
    targetUrls: [...TARGET_LECTURE_URLS],
    totalUrls: allUrls.length,
    protectedCount: allUrls.filter((u) => !TARGET_LECTURE_URLS.has(u)).length,
    pages: Object.fromEntries(
      Object.entries(pages).map(([url, p]) => [
        url,
        p.missing
          ? { missing: true }
          : {
              missing: false,
              title: p.title,
              description: p.description,
              canonical: p.canonical,
              robots: p.robots,
              h1: p.h1,
              h1Count: p.h1Count,
              ogTitle: p.ogTitle,
              ogDescription: p.ogDescription,
              ogImage: p.ogImage,
              schemaTypes: p.schemaTypes,
              bodyChars: normalizeBody(p.mainText).length,
              hrefCount: p.hrefs.length,
              hashes: hashesFor(p),
            },
      ]),
    ),
  };
  fs.writeFileSync(path.join(dir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  const raw = Object.fromEntries(
    Object.entries(pages)
      .filter(([, p]) => !p.missing)
      .map(([url, p]) => [url, { mainText: p.mainText, hrefs: p.hrefs, schema: p.schema, images: p.images }]),
  );
  fs.writeFileSync(path.join(dir, "raw.json"), JSON.stringify(raw));
  console.log(
    `[naver-critical-recovery] ${phaseName}: total=${allUrls.length} protected=${manifest.protectedCount} targets(present)=${allUrls.filter((u) => TARGET_LECTURE_URLS.has(u)).length}`,
  );
}

function firstDiff(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return {
    at: i,
    before: a.slice(Math.max(0, i - 60), i + 120),
    after: b.slice(Math.max(0, i - 60), i + 120),
  };
}

function compareSitemapLastmod() {
  const beforeFile = path.join(CACHE, "before", "sitemap-manifest.json");
  const afterFile = path.join(ROOT, "scripts", "output", "sitemap-manifest.json");
  const index = (file) =>
    new Map(
      JSON.parse(fs.readFileSync(file, "utf8")).entries.map((e) => [normalizePath(e.path), e]),
    );
  const before = index(beforeFile);
  const after = index(afterFile);
  const nonTargetLastmodChanged = [];
  const targetLastmod = [];
  const addedEntries = [];
  const removedEntries = [];
  for (const [p, a] of after) {
    const b = before.get(p);
    if (!b) {
      addedEntries.push({ path: p, lastmod: a.lastmod, tier: a.tier });
      continue;
    }
    if (TARGET_LECTURE_URLS.has(p)) {
      targetLastmod.push({ path: p, before: b.lastmod, after: a.lastmod });
    } else if (b.lastmod !== a.lastmod || b.loc !== a.loc) {
      nonTargetLastmodChanged.push({ path: p, before: b.lastmod, after: a.lastmod });
    }
  }
  for (const p of before.keys()) if (!after.has(p)) removedEntries.push({ path: p });
  return { addedEntries, removedEntries, targetLastmod, nonTargetLastmodChanged };
}

function compare() {
  const load = (p, f) => JSON.parse(fs.readFileSync(path.join(CACHE, p, f), "utf8"));
  const before = load("before", "manifest.json");
  const after = load("after", "manifest.json");
  const rawBefore = load("before", "raw.json");
  const rawAfter = load("after", "raw.json");

  const beforeUrls = Object.keys(before.pages);
  const afterUrls = Object.keys(after.pages);
  const protectedUrls = beforeUrls.filter((u) => !TARGET_LECTURE_URLS.has(u));
  const newUrls = afterUrls.filter((u) => !before.pages[u]);
  const removedUrls = beforeUrls.filter((u) => !after.pages[u]);

  const rows = [];
  const changed = [];
  for (const url of protectedUrls) {
    const b = before.pages[url];
    const a = after.pages[url];
    if (!a) {
      changed.push({ url, reason: "removed_from_indexable_list" });
      rows.push({ url, status: "CHANGED", diffs: "removed" });
      continue;
    }
    if (b.missing || a.missing) {
      if (b.missing !== a.missing) {
        changed.push({ url, reason: "missing_flag_changed" });
        rows.push({ url, status: "CHANGED", diffs: "missing_flag" });
      } else {
        rows.push({ url, status: "UNCHANGED", diffs: "" });
      }
      continue;
    }
    const hb = {
      ...b.hashes,
      body: hash(normalizeBody(rawBefore[url]?.mainText)),
      hrefs: hash((rawBefore[url]?.hrefs || []).join("\n")),
    };
    const ha = {
      ...a.hashes,
      body: hash(normalizeBody(rawAfter[url]?.mainText)),
      hrefs: hash((rawAfter[url]?.hrefs || []).join("\n")),
    };
    const diffs = HASH_KEYS.filter((k) => hb[k] !== ha[k]);
    if (diffs.length) {
      const detail = { url, reason: "hash_diff", diffs };
      if (diffs.includes("body")) {
        detail.body = firstDiff(
          normalizeBody(rawBefore[url]?.mainText),
          normalizeBody(rawAfter[url]?.mainText),
        );
      }
      if (diffs.includes("hrefs")) {
        const sb = new Set(rawBefore[url]?.hrefs || []);
        const sa = new Set(rawAfter[url]?.hrefs || []);
        detail.hrefsAdded = [...sa].filter((h) => !sb.has(h));
        detail.hrefsRemoved = [...sb].filter((h) => !sa.has(h));
      }
      for (const k of ["title", "description", "canonical", "robots", "h1"]) {
        if (diffs.includes(k)) detail[k] = { before: b[k], after: a[k] };
      }
      if (diffs.includes("og")) {
        detail.og = {
          before: [b.ogTitle, b.ogDescription, b.ogImage],
          after: [a.ogTitle, a.ogDescription, a.ogImage],
        };
      }
      if (diffs.includes("schema")) {
        detail.schema = firstDiff((rawBefore[url]?.schema || []).join("\n"), (rawAfter[url]?.schema || []).join("\n"));
      }
      if (diffs.includes("images")) {
        const ib = new Set(rawBefore[url]?.images || []);
        const ia = new Set(rawAfter[url]?.images || []);
        detail.imagesAdded = [...ia].filter((x) => !ib.has(x));
        detail.imagesRemoved = [...ib].filter((x) => !ia.has(x));
      }
      changed.push(detail);
      rows.push({ url, status: "CHANGED", diffs: diffs.join("|") });
    } else {
      rows.push({ url, status: "UNCHANGED", diffs: "" });
    }
  }

  const sitemap = compareSitemapLastmod();
  for (const s of sitemap.nonTargetLastmodChanged) {
    if (!changed.some((c) => c.url === s.path)) {
      changed.push({ url: s.path, reason: "sitemap_lastmod_changed", before: s.before, after: s.after });
      rows.push({ url: s.path, status: "CHANGED", diffs: "lastmod" });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    protectedCount: protectedUrls.length,
    NON_TARGET_CHANGED_URLS: changed.length,
    newUrls,
    removedUrls,
    sitemap,
    changed,
  };
  fs.writeFileSync(path.join(CACHE, "diff-report.json"), `${JSON.stringify(report, null, 2)}\n`);

  ensureDir(REPORT_DIR);
  const csv = ["url,status,changed_fields"]
    .concat(rows.map((r) => `"${r.url}",${r.status},${r.diffs}`))
    .join("\n");
  fs.writeFileSync(path.join(REPORT_DIR, DIFF_CSV), `\uFEFF${csv}\n`);

  console.log(`[naver-critical-recovery] protected=${protectedUrls.length} new=${newUrls.length} removed=${removedUrls.length}`);
  console.log(
    `[naver-critical-recovery] sitemap added=${sitemap.addedEntries.map((e) => e.path).join(",") || "-"} removed=${sitemap.removedEntries.length} nonTargetLastmodChanged=${sitemap.nonTargetLastmodChanged.length}`,
  );
  console.log(`[naver-critical-recovery] NON_TARGET_CHANGED_URLS = ${changed.length}`);
  if (changed.length) {
    for (const c of changed.slice(0, 20)) {
      console.log(`  - ${c.url} ${c.reason} ${(c.diffs || []).join(",")}`);
    }
    process.exitCode = 1;
  } else {
    console.log("PASS: protected URLs unchanged.");
  }
}

if (phase === "before" || phase === "after") {
  writePhase(phase);
  if (phase === "before") {
    for (const f of ["sitemap-manifest.json", "seo-paths.json"]) {
      fs.copyFileSync(path.join(ROOT, "scripts", "output", f), path.join(CACHE, "before", f));
    }
  }
}
if (doCompare) compare();
if (!phase && !doCompare) {
  console.log("Usage: --phase=before|after | --compare");
  process.exit(1);
}
