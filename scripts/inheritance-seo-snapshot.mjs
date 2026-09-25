#!/usr/bin/env node
/**
 * INHERITANCE SEO SURGERY — before/after static HTML snapshot + protected URL hash check.
 *
 * Usage:
 *   node scripts/inheritance-seo-snapshot.mjs --phase=before
 *   node scripts/inheritance-seo-snapshot.mjs --phase=after
 *   node scripts/inheritance-seo-snapshot.mjs --compare
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const CACHE = path.join(ROOT, ".cache", "inheritance-seo");
const PATHS_JSON = path.join(ROOT, "scripts", "output", "seo-paths.json");
const DIFF_REPORT = path.join(CACHE, "diff-report.json");
const MD_REPORT = path.join(
  ROOT,
  "reports",
  "inheritance-seo",
  "2026-09-25",
  "14-protected-url-diff.md",
);

const TARGET_URLS = new Set(["/부산상속법무사", "/부산상속포기"]);

/** Protected identity only — head/internalLinks/raw HTML drift with Next chunks & CTA clocks. */
const PROTECTED_HASH_KEYS = [
  "title",
  "description",
  "canonical",
  "h1",
  "body",
];

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
  const parts = clean.slice(1).split("/");
  if (parts.length > 1) {
    const nestedFlat = path.join(OUT, ...parts.slice(0, -1), `${parts[parts.length - 1]}.html`);
    if (fs.existsSync(nestedFlat)) return nestedFlat;
  }
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

function extractHead(html) {
  const m = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1] : "";
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : html;
}

function extractInternalLinks(html) {
  const main = extractMain(html);
  const links = new Set();
  const re = /<a[^>]*href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(main)) !== null) {
    let href = m[1].trim();
    if (!href || href.startsWith("#") || /^mailto:/i.test(href) || /^tel:/i.test(href)) {
      continue;
    }
    if (/^https?:\/\//i.test(href)) {
      try {
        const u = new URL(href);
        href = u.pathname || "/";
      } catch {
        continue;
      }
    }
    links.add(normalizePath(href));
  }
  return [...links].sort();
}

function normalizeBodyForCompare(text) {
  return String(text || "")
    .replace(/전화상담은 (오늘|내일) 9시부터 가능/g, "전화상담은 [DAY] 9시부터 가능")
    .replace(/\s+/g, " ")
    .trim();
}

function snapshotPage(urlPath) {
  const file = htmlPathForUrl(urlPath);
  if (!fs.existsSync(file)) {
    return { url: urlPath, missing: true };
  }
  const html = fs.readFileSync(file, "utf8");
  const main = extractMain(html);
  const title = extractTag(html, "title");
  const description = extractMeta(html, "description");
  const canonical = extractCanonical(html);
  const h1 = extractTag(html, "h1");
  const bodyText = stripTags(main);
  const bodyNorm = normalizeBodyForCompare(bodyText);
  const internalLinks = extractInternalLinks(html);
  const semanticHead = [
    title,
    description,
    canonical,
    extractMeta(html, "robots"),
    extractMeta(html, "og:title", "property"),
    extractMeta(html, "og:description", "property"),
  ].join("\n");
  return {
    url: urlPath,
    missing: false,
    file,
    title,
    description,
    canonical,
    h1,
    bodyText,
    internalLinks,
    first700: bodyNorm.slice(0, 700),
    bodyChars: bodyText.length,
    hashes: {
      title: hash(title),
      description: hash(description),
      canonical: hash(canonical),
      h1: hash(h1),
      body: hash(bodyNorm),
      head: hash(semanticHead),
      internalLinks: hash(internalLinks.join("\n")),
      html: hash(html),
    },
  };
}

function loadAllIndexableUrls() {
  if (!fs.existsSync(PATHS_JSON)) {
    throw new Error(`Missing ${PATHS_JSON}`);
  }
  const data = JSON.parse(fs.readFileSync(PATHS_JSON, "utf8"));
  const paths = (data.paths || []).map(normalizePath);
  return [...new Set(paths)].sort();
}

function writePhase(phaseName) {
  const dir = path.join(CACHE, phaseName);
  ensureDir(dir);
  const pagesDir = path.join(dir, "pages");
  ensureDir(pagesDir);

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
    const isTarget = TARGET_URLS.has(url);
    const safeName = url === "/" ? "_root" : url.replace(/^\//, "").replace(/\//g, "__");
    if (!snap.missing) {
      if (isTarget) {
        const html = fs.readFileSync(snap.file, "utf8");
        fs.writeFileSync(path.join(pagesDir, `${safeName}.html`), html, "utf8");
      }
      fs.writeFileSync(
        path.join(pagesDir, `${safeName}.meta.json`),
        JSON.stringify(
          {
            url: snap.url,
            title: snap.title,
            description: snap.description,
            canonical: snap.canonical,
            h1: snap.h1,
            internalLinks: snap.internalLinks,
            first700: snap.first700,
            bodyChars: snap.bodyChars,
            hashes: snap.hashes,
          },
          null,
          2,
        ) + "\n",
        "utf8",
      );
    }
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

  fs.writeFileSync(
    path.join(dir, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8",
  );
  fs.writeFileSync(
    path.join(dir, "protected-urls.json"),
    JSON.stringify(protectedUrls, null, 2) + "\n",
    "utf8",
  );
  console.log(
    `[inheritance-seo] ${phaseName}: total=${allUrls.length} protected=${protectedUrls.length} targets=${TARGET_URLS.size}`,
  );
  return manifest;
}

function writeDiffMarkdown(report) {
  ensureDir(path.dirname(MD_REPORT));
  const lines = [
    "# 14 — Protected URL diff (inheritance SEO)",
    "",
    "## Method",
    "",
    "1. Build static export → `out/`",
    "2. `node scripts/inheritance-seo-snapshot.mjs --phase=before|after`",
    "3. Compare protected URLs (all indexable minus TARGET_URLS)",
    "",
    "## Identity fields compared",
    "",
    ...PROTECTED_HASH_KEYS.map((k) => `- ${k}`),
    "",
    "Raw HTML hash는 Next chunk ID 때문에 매 빌드 변동 → protected 비교에서 제외.",
    "",
    "## Result",
    "",
    `**NON_TARGET_CHANGED_URLS = ${report.NON_TARGET_CHANGED_URLS}**`,
    "",
  ];
  if (report.changedUrls.length) {
    lines.push("### Changed non-target URLs", "");
    for (const url of report.changedUrls) {
      const row = report.changed.find((c) => c.url === url);
      const detail =
        row?.reason === "hash_diff" && row.diffs?.length
          ? ` (${row.diffs.join(", ")})`
          : row?.reason
            ? ` (${row.reason})`
            : "";
      lines.push(`- \`${url}\`${detail}`);
    }
    lines.push("");
  } else {
    lines.push("No protected URL identity drift detected.", "", "");
  }
  lines.push(`Generated: ${report.generatedAt}`, "");
  fs.writeFileSync(MD_REPORT, lines.join("\n"), "utf8");
}

function compare() {
  const beforePath = path.join(CACHE, "before", "manifest.json");
  const afterPath = path.join(CACHE, "after", "manifest.json");
  if (!fs.existsSync(beforePath) || !fs.existsSync(afterPath)) {
    throw new Error("Need both before and after manifests");
  }
  const before = JSON.parse(fs.readFileSync(beforePath, "utf8"));
  const after = JSON.parse(fs.readFileSync(afterPath, "utf8"));
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
        beforeH1: b.h1,
        afterH1: a.h1,
      });
    }
  }

  const changedUrls = changed.map((c) => c.url);
  const report = {
    generatedAt: new Date().toISOString(),
    NON_TARGET_CHANGED_URLS: changed.length,
    changedUrls,
    changed,
  };
  ensureDir(CACHE);
  fs.writeFileSync(DIFF_REPORT, JSON.stringify(report, null, 2) + "\n", "utf8");
  writeDiffMarkdown(report);

  console.log(`[inheritance-seo] NON_TARGET_CHANGED_URLS = ${changed.length}`);
  if (changed.length) {
    console.error(
      `FAIL: NON_TARGET_CHANGED_URLS = ${changed.length} (expected 0). See ${DIFF_REPORT} and ${MD_REPORT}`,
    );
    console.log(changed.slice(0, 20));
    process.exitCode = 1;
  } else {
    console.log(`PASS: protected URLs unchanged. Reports: ${DIFF_REPORT}, ${MD_REPORT}`);
  }
  return report;
}

if (phase === "before" || phase === "after") {
  writePhase(phase);
}
if (doCompare) {
  compare();
}
if (!phase && !doCompare) {
  console.log("Usage: --phase=before|after | --compare");
  process.exit(1);
}
