#!/usr/bin/env node
/**
 * Keyword stuffing audit — exact phrase repetition on public landing sources.
 * Does not set numeric density targets. Flags heading/anchor/FAQ/schema dumps.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "reports", "seo", "keyword-stuffing-audit.json");

const PHRASES = [
  "부산 법무사",
  "부산 법무사 추천",
  "부산 법인 법무사",
  "부산 법인 법무사 추천",
  "전문 법무사",
  "최고",
  "1위",
];

const SCAN_DIRS = [
  path.join(ROOT, "src", "lib", "local-landing"),
  path.join(ROOT, "src", "lib", "hub"),
  path.join(ROOT, "src", "data", "seo"),
  path.join(ROOT, "src", "components", "layout"),
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx|mjs|js)$/.test(name)) acc.push(p);
  }
  return acc;
}

function countPhrase(text, phrase) {
  let n = 0;
  let i = 0;
  while (true) {
    const j = text.indexOf(phrase, i);
    if (j === -1) break;
    n += 1;
    i = j + phrase.length;
  }
  return n;
}

const files = SCAN_DIRS.flatMap((d) => walk(d));
const rows = [];

for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll("\\", "/");
  const text = fs.readFileSync(file, "utf8");
  const hits = {};
  let flagged = false;
  for (const phrase of PHRASES) {
    const n = countPhrase(text, phrase);
    if (n >= 8) {
      hits[phrase] = n;
      flagged = true;
    }
  }
  if (flagged) {
    rows.push({ file: rel, hits, risk: "REVIEW" });
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  note: "Threshold ≥8 exact phrase hits per source file. Not a density target.",
  flaggedFileCount: rows.length,
  rows,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n");
console.log(`[audit-keyword-stuffing] flagged ${rows.length} files → ${OUT}`);
for (const row of rows.slice(0, 20)) {
  console.log(`  ${row.file} ${JSON.stringify(row.hits)}`);
}
