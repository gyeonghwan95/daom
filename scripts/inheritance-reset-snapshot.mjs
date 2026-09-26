#!/usr/bin/env node
/**
 * INHERITANCE SEO RESET — before/after snapshot for protected URLs.
 * Targets: /부산상속법무사, /부산상속포기, /부산상속전문법무사
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const CACHE = path.join(ROOT, ".cache", "inheritance-reset");
const PATHS_JSON = path.join(ROOT, "scripts", "output", "seo-paths.json");
const REPORT_DIR = path.join(ROOT, "reports", "inheritance-reset", "2026-09-26");

const TARGET_URLS = new Set([
  "/부산상속법무사",
  "/부산상속포기",
  "/부산상속전문법무사",
]);

const PROTECTED_HASH_KEYS = ["title", "description", "canonical", "h1"];
/** body excluded from hard fail: prebuild Naver review feed / CTA clock cause ±2 char sitewide drift */

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
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

function htmlPathForUrl(urlPath) {
  const clean = normalizePath(urlPath);
  if (clean === "/") return path.join(OUT, "index.html");
  const nested = path.join(OUT, ...clean.slice(1).split("/"), "index.html");
  if (fs.existsSync(nested)) return nested;
  const flat = path.join(OUT, `${clean.slice(1)}.html`);
  if (fs.existsSync(flat)) return flat;
  return nested;
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
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = html.match(re);
  return m ? stripTags(m[1]) : "";
}

function extractCanonical(html) {
  const re = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i;
  const m = html.match(re);
  if (m) return m[1];
  const re2 = /<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i;
  const m2 = html.match(re2);
  return m2?.[1] ?? "";
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : html;
}

function normalizeBodyForCompare(text) {
  return String(text || "")
    .replace(/전화상담은 (오늘|내일) 9시부터 가능/g, "전화상담은 [DAY] 9시부터 가능")
    .replace(/\s+/g, " ")
    .trim();
}

function snapshotPage(urlPath) {
  const file = htmlPathForUrl(urlPath);
  if (!fs.existsSync(file)) return { url: urlPath, missing: true };
  const html = fs.readFileSync(file, "utf8");
  const main = extractMain(html);
  const title = extractTag(html, "title");
  const description = extractMeta(html, "description");
  const canonical = extractCanonical(html);
  const h1 = extractTag(html, "h1");
  const bodyNorm = normalizeBodyForCompare(stripTags(main));
  return {
    url: urlPath,
    missing: false,
    title,
    description,
    canonical,
    h1,
    bodyChars: bodyNorm.length,
    first700: bodyNorm.slice(0, 700),
    hashes: {
      title: hash(title),
      description: hash(description),
      canonical: hash(canonical),
      h1: hash(h1),
      body: hash(bodyNorm),
    },
  };
}

function loadAllIndexableUrls() {
  const data = JSON.parse(fs.readFileSync(PATHS_JSON, "utf8"));
  return [...new Set((data.paths || []).map(normalizePath))].sort();
}

function writePhase(phaseName) {
  const dir = path.join(CACHE, phaseName);
  ensureDir(dir);
  const allUrls = loadAllIndexableUrls();
  const protectedUrls = allUrls.filter((u) => !TARGET_URLS.has(u));
  const manifest = {
    generatedAt: new Date().toISOString(),
    phase: phaseName,
    targetUrls: [...TARGET_URLS],
    protectedCount: protectedUrls.length,
    totalUrls: allUrls.length,
    pages: {},
  };
  for (const url of allUrls) {
    const snap = snapshotPage(url);
    manifest.pages[url] = {
      missing: snap.missing,
      hashes: snap.hashes || null,
      title: snap.title || null,
      description: snap.description || null,
      canonical: snap.canonical || null,
      h1: snap.h1 || null,
      bodyChars: snap.bodyChars || 0,
    };
  }
  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(
    path.join(dir, "protected-urls.json"),
    JSON.stringify(protectedUrls, null, 2) + "\n",
  );
  console.log(
    `[inheritance-reset] ${phaseName}: total=${allUrls.length} protected=${protectedUrls.length} targets=${TARGET_URLS.size}`,
  );
}

function compare() {
  const before = JSON.parse(
    fs.readFileSync(path.join(CACHE, "before", "manifest.json"), "utf8"),
  );
  const after = JSON.parse(
    fs.readFileSync(path.join(CACHE, "after", "manifest.json"), "utf8"),
  );
  const protectedUrls = JSON.parse(
    fs.readFileSync(path.join(CACHE, "before", "protected-urls.json"), "utf8"),
  ).filter((url) => !TARGET_URLS.has(url));

  const changed = [];
  for (const url of protectedUrls) {
    const b = before.pages[url];
    const a = after.pages[url];
    if (!b || !a) {
      changed.push({ url, reason: !b ? "missing_in_before" : "missing_in_after" });
      continue;
    }
    if (b.missing !== a.missing) {
      changed.push({ url, reason: "missing_flag_changed" });
      continue;
    }
    if (b.missing) continue;
    const diffs = [];
    for (const key of PROTECTED_HASH_KEYS) {
      if (b.hashes?.[key] !== a.hashes?.[key]) diffs.push(key);
    }
    if (diffs.length) {
      changed.push({
        url,
        reason: "hash_diff",
        diffs,
        beforeTitle: b.title,
        afterTitle: a.title,
      });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    NON_TARGET_CHANGED_URLS: changed.length,
    changed,
  };
  ensureDir(CACHE);
  fs.writeFileSync(path.join(CACHE, "diff-report.json"), JSON.stringify(report, null, 2) + "\n");
  ensureDir(REPORT_DIR);
  const md = [
    "# Protected URL diff — inheritance reset",
    "",
    `NON_TARGET_CHANGED_URLS = **${changed.length}**`,
    "",
    changed.length
      ? changed
          .slice(0, 50)
          .map((c) => `- \`${c.url}\` — ${c.reason} ${c.diffs ? `(${c.diffs.join(",")})` : ""}`)
          .join("\n")
      : "All protected URLs unchanged (identity fields).",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(REPORT_DIR, "15-protected-url-diff.md"), md);
  console.log(`[inheritance-reset] NON_TARGET_CHANGED_URLS = ${changed.length}`);
  if (changed.length) {
    console.error(`FAIL: NON_TARGET_CHANGED_URLS = ${changed.length} (expected 0)`);
    process.exitCode = 1;
  } else {
    console.log("PASS: protected URLs unchanged.");
  }
}

if (phase === "before" || phase === "after") writePhase(phase);
if (doCompare) compare();
if (!phase && !doCompare) {
  console.log("Usage: --phase=before|after | --compare");
  process.exit(1);
}
