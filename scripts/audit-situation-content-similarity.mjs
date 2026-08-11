#!/usr/bin/env node
/**
 * Situation-batch similarity after stripping geo/office nouns.
 * Usage: node scripts/audit-situation-content-similarity.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(
  ROOT,
  "src/lib/local-landing/search-intent/overrides/situation-intent-batch1.ts",
);

const STRIP = [
  /부산/g,
  /해운대/g,
  /센텀/g,
  /서면/g,
  /다옴법무사사무소/g,
  /안윤정/g,
  /법무사/g,
  /\s+/g,
];

function normalize(s) {
  let t = s;
  for (const re of STRIP) t = t.replace(re, "");
  return t;
}

function trigrams(s) {
  const set = new Set();
  for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3));
  return set;
}

function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function main() {
  const src = fs.readFileSync(FILE, "utf8");
  const blocks = [
    ...src.matchAll(
      /export const (\S+)Override: SearchIntentContent = \{([\s\S]*?)\n\};/g,
    ),
  ];
  const pages = blocks.map((m) => {
    const hero = m[2].match(
      /heroParagraphs:\s*\[([\s\S]*?)\],\s*summaryBullets/,
    )?.[1] || "";
    const prose = m[2].match(/proseSections:[\s\S]*$/)?.[0] || "";
    const text = normalize(hero + prose);
    return { name: m[1], tri: trigrams(text) };
  });

  const pairs = [];
  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const similarity = Number(
        jaccard(pages[i].tri, pages[j].tri).toFixed(3),
      );
      pairs.push({
        a: pages[i].name,
        b: pages[j].name,
        similarity,
        flag:
          similarity >= 0.55
            ? "HIGH"
            : similarity >= 0.4
              ? "WATCH"
              : "OK",
      });
    }
  }
  pairs.sort((x, y) => y.similarity - x.similarity);

  const out = {
    generatedAt: new Date().toISOString(),
    pageCount: pages.length,
    highRisk: pairs.filter((p) => p.flag === "HIGH"),
    pairs,
  };
  const outPath = path.join(
    ROOT,
    "reports/seo/situation-content-similarity.json",
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
  console.log(
    JSON.stringify(
      { pageCount: out.pageCount, highRisk: out.highRisk.length, top: pairs.slice(0, 5), out: outPath },
      null,
      2,
    ),
  );
  if (out.highRisk.length) process.exitCode = 2;
}

main();
