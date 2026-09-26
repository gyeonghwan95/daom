#!/usr/bin/env node
/**
 * Quick inheritance cluster map for reset reports.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const PATHS = path.join(ROOT, "scripts", "output", "seo-paths.json");
const REPORT = path.join(
  ROOT,
  "reports",
  "inheritance-reset",
  "2026-09-26",
);

const KEYWORDS = [
  "상속",
  "상속법무사",
  "상속전문",
  "상속등기",
  "상속포기",
  "한정승인",
  "특별한정승인",
  "상속재산분할",
  "대습",
  "재상속",
  "미성년",
  "해외",
  "오래된상속",
  "부산상속",
  "상속비용",
];

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html, name) {
  const m =
    html.match(new RegExp(`name=["']${name}["'][^>]*content=["']([^"']*)`, "i")) ||
    html.match(new RegExp(`content=["']([^"']*)["'][^>]*name=["']${name}["']`, "i"));
  return m?.[1] ?? "";
}

function tag(html, t) {
  const m = html.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)<\\/${t}>`, "i"));
  return m ? strip(m[1]) : "";
}

function canonical(html) {
  const m =
    html.match(/rel=["']canonical["'][^>]*href=["']([^"']*)/i) ||
    html.match(/href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  return m?.[1] ?? "";
}

function htmlPath(urlPath) {
  if (urlPath === "/") return path.join(OUT, "index.html");
  const flat = path.join(OUT, `${urlPath.slice(1)}.html`);
  if (fs.existsSync(flat)) return flat;
  return path.join(OUT, ...urlPath.slice(1).split("/"), "index.html");
}

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function main() {
  ensureDir(REPORT);
  if (!fs.existsSync(PATHS) || !fs.existsSync(OUT)) {
    console.error("Need seo-paths.json and out/");
    process.exit(1);
  }
  const paths = JSON.parse(fs.readFileSync(PATHS, "utf8")).paths || [];
  const related = paths.filter((p) =>
    KEYWORDS.some((k) => p.includes(k) || decodeURIComponent(p).includes(k)),
  );
  const rows = [
    "url,title,h1,description,canonical,robots,mainTextChars,h2Count,first700",
  ];
  for (const url of related.sort()) {
    const file = htmlPath(url);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || html;
    const body = strip(main);
    const h2Count = [...main.matchAll(/<h2\b/gi)].length;
    rows.push(
      [
        url,
        tag(html, "title"),
        tag(html, "h1"),
        meta(html, "description"),
        canonical(html),
        meta(html, "robots"),
        body.length,
        h2Count,
        body.slice(0, 700),
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  fs.writeFileSync(path.join(REPORT, "01-inheritance-cluster.csv"), rows.join("\n") + "\n");
  console.log(`[cluster] wrote ${rows.length - 1} rows → ${REPORT}/01-inheritance-cluster.csv`);
}

main();
