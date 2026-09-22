#!/usr/bin/env node
/** Dump target page SEO identity from out/ */
import fs from "node:fs";
import path from "node:path";

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dump(url) {
  const flat = path.join("out", `${url.replace(/^\//, "")}.html`);
  const nested = path.join(
    "out",
    ...url.replace(/^\//, "").split("/"),
    "index.html",
  );
  const file = fs.existsSync(flat) ? flat : nested;
  if (!fs.existsSync(file)) {
    console.log("MISSING", url);
    return;
  }
  const html = fs.readFileSync(file, "utf8");
  const title = (html.match(/<title[^>]*>([^<]*)/i) || [])[1] || "";
  const desc =
    (html.match(/name=["']description["'][^>]*content=["']([^"']*)/i) ||
      html.match(/content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
      [])[1] || "";
  const can =
    (html.match(/rel=["']canonical["'][^>]*href=["']([^"']*)/i) ||
      html.match(/href=["']([^"']*)["'][^>]*rel=["']canonical["']/i) ||
      [])[1] || "";
  const h1 = strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "");
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
  const text = strip(main);
  const h2s = [...main.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
    strip(m[1]),
  );
  console.log("\n====", url, "====");
  console.log("TITLE:", title);
  console.log("DESC:", desc);
  console.log("CANON:", can);
  console.log("H1:", h1);
  console.log("CHARS:", text.length);
  console.log("H2:", h2s.slice(0, 12).join(" | "));
  console.log("FIRST700:\n", text.slice(0, 700));
  // duplicate sentence detection
  const sentences = text
    .split(/(?<=[.。!?？])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);
  const seen = new Map();
  for (const s of sentences) {
    seen.set(s, (seen.get(s) || 0) + 1);
  }
  const dups = [...seen.entries()].filter(([, n]) => n > 1);
  console.log("DUP_SENTENCES:", dups.length);
  for (const [s, n] of dups.slice(0, 5)) console.log(`  x${n}:`, s.slice(0, 120));
}

const urls = [
  "/부산상속법무사",
  "/부산등기법무사",
  "/부산법인등기",
  "/부산법인법무사",
  "/해운대법무사",
  "/업무사례/울산상속등기법무사",
  "/공공기관등기업무",
];
for (const u of urls) dump(u);
