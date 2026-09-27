#!/usr/bin/env node
/** Checks og:image URLs of target pages (and a few samples) resolve with 200 image/*. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["부산상속전문법무사.html", "부산상속포기.html", "해운대법무사.html", "index.html", "about.html", "부산상속법무사.html"];

const results = [];
for (const f of files) {
  const file = path.join(OUT, f);
  if (!fs.existsSync(file)) {
    results.push({ file: f, error: "missing" });
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const og = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? "";
  let status = null;
  let type = null;
  try {
    const res = await fetch(og.replace(/&amp;/g, "&"), { method: "GET", redirect: "manual" });
    status = res.status;
    type = res.headers.get("content-type");
  } catch (e) {
    status = String(e.message);
  }
  results.push({ file: f, og, doubleEncoded: /%25[0-9A-F]{2}/i.test(og), status, type });
}
console.log(JSON.stringify(results, null, 2));
fs.mkdirSync(path.join(ROOT, ".cache", "naver-critical-recovery"), { recursive: true });
fs.writeFileSync(path.join(ROOT, ".cache", "naver-critical-recovery", "og-check.json"), JSON.stringify(results, null, 2));
