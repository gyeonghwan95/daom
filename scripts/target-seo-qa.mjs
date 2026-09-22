#!/usr/bin/env node
/**
 * Target SEO QA — title/desc/H1 uniqueness, dups, canonical, sitemap, length.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const REPORT = path.join(ROOT, "reports", "target-seo-2026-09-22");

const TARGETS = [
  "/부산상속법무사",
  "/부산등기법무사",
  "/부산법인등기",
  "/해운대법무사",
  "/업무사례/울산상속등기법무사",
  "/부산보상등기",
];

function htmlPath(url) {
  if (url === "/") return path.join(OUT, "index.html");
  const flat = path.join(OUT, `${url.slice(1)}.html`);
  if (fs.existsSync(flat)) return flat;
  return path.join(OUT, ...url.slice(1).split("/"), "index.html");
}

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extract(html, url) {
  const title = (html.match(/<title[^>]*>([^<]*)/i) || [])[1] || "";
  const description =
    (html.match(/name=["']description["'][^>]*content=["']([^"']*)/i) ||
      html.match(/content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
      [])[1] || "";
  const canonical =
    (html.match(/rel=["']canonical["'][^>]*href=["']([^"']*)/i) ||
      html.match(/href=["']([^"']*)["'][^>]*rel=["']canonical["']/i) ||
      [])[1] || "";
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    strip(m[1]),
  );
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
  const body = strip(main);
  const robots =
    (html.match(/name=["']robots["'][^>]*content=["']([^"']*)/i) || [])[1] ||
    "";
  const noindex = /noindex/i.test(robots);
  const paragraphs = body
    .split(/(?<=[.。])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 50);
  const counts = new Map();
  for (const p of paragraphs) counts.set(p, (counts.get(p) || 0) + 1);
  const dups = [...counts.entries()].filter(([, n]) => n > 1);
  return {
    url,
    title,
    description,
    canonical,
    h1Count: h1s.length,
    h1: h1s[0] || "",
    bodyChars: body.length,
    first700: body.slice(0, 700),
    noindex,
    dupParagraphs: dups.length,
    exists: true,
  };
}

function main() {
  fs.mkdirSync(REPORT, { recursive: true });
  const rows = [];
  const issues = [];
  for (const url of TARGETS) {
    const file = htmlPath(url);
    if (!fs.existsSync(file)) {
      rows.push({ url, exists: false });
      issues.push(`${url}: missing HTML`);
      continue;
    }
    rows.push(extract(fs.readFileSync(file, "utf8"), url));
  }

  const titles = new Map();
  const descs = new Map();
  for (const r of rows) {
    if (!r.exists) continue;
    if (r.h1Count !== 1) issues.push(`${r.url}: H1 count=${r.h1Count}`);
    if (r.noindex) issues.push(`${r.url}: noindex`);
    if (!r.canonical || !r.canonical.includes(encodeURI(r.url.slice(1))) && !r.canonical.endsWith(r.url) && !decodeURIComponent(r.canonical).endsWith(r.url)) {
      // soft check — punycode host + encoded path
      if (!decodeURIComponent(r.canonical).includes(r.url.replace(/^\//, "")) && !r.canonical.includes(encodeURIComponent(r.url.slice(1).split("/")[0]))) {
        issues.push(`${r.url}: canonical odd: ${r.canonical}`);
      }
    }
    if (r.dupParagraphs > 2) issues.push(`${r.url}: duplicate paragraphs=${r.dupParagraphs}`);
    if (r.bodyChars < 2000) issues.push(`${r.url}: thin body ${r.bodyChars}`);
    titles.set(r.title, (titles.get(r.title) || 0) + 1);
    descs.set(r.description, (descs.get(r.description) || 0) + 1);
  }
  for (const [t, n] of titles) if (n > 1) issues.push(`duplicate title x${n}: ${t}`);
  for (const [d, n] of descs) if (n > 1 && d) issues.push(`duplicate description x${n}`);

  const sitemap = fs.readFileSync(path.join(ROOT, "public", "sitemap.xml"), "utf8");
  for (const url of TARGETS) {
    const enc = encodeURI(url);
    if (!sitemap.includes(enc) && !sitemap.includes(url)) {
      // check tier sitemaps
      const tiers = fs.readdirSync(path.join(ROOT, "public", "sitemaps"));
      const found = tiers.some((f) =>
        fs.readFileSync(path.join(ROOT, "public", "sitemaps", f), "utf8").includes(encodeURI(url.slice(1))) ||
        fs.readFileSync(path.join(ROOT, "public", "sitemaps", f), "utf8").includes(url),
      );
      if (!found) issues.push(`${url}: not in sitemap`);
    }
  }

  const out = { generatedAt: new Date().toISOString(), issues, rows };
  fs.writeFileSync(
    path.join(REPORT, "qa-validation.json"),
    JSON.stringify(out, null, 2) + "\n",
  );
  console.log(`[target-qa] issues=${issues.length}`);
  for (const i of issues) console.log(" -", i);
  if (issues.length) process.exitCode = 1;
}

main();
