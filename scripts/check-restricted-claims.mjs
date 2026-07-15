#!/usr/bin/env node
/**
 * 제한 표현·검색의도 충돌 간단 감사
 * 실행: node scripts/check-restricted-claims.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");

const RESTRICTED = [
  /전문\s*법무사/g,
  /인증된\s*전문/g,
  /최고의\s*법무사/g,
  /1위/g,
  /유일/g,
  /무조건\s*인가/g,
  /반드시\s*면책/g,
  /반드시\s*성공/g,
  /성공률\s*100/g,
  /성공\s*보장/g,
  /전문\s*인증/g,
];

const ALLOW_PATH_SNIPPETS = [
  "search-intents.ts",
  "check-restricted-claims",
  "selection-landing-config", // URL 문자열 포함 가능
  "hub-catalog.ts",
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|mdx|js|mjs)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const hits = [];
for (const file of walk(SRC)) {
  const rel = path.relative(ROOT, file);
  if (ALLOW_PATH_SNIPPETS.some((s) => rel.includes(s))) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of RESTRICTED) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text))) {
      const lineStart = text.lastIndexOf("\n", match.index) + 1;
      const lineEnd = text.indexOf("\n", match.index);
      const lineText = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
      // URL slug 유지(부산*전문*) · 레지스트리 금지어 예시는 스킵
      if (/slug:\s*"|href:\s*"\/|primaryKeyword:\s*"전문|do-not-target/.test(lineText)) {
        continue;
      }
      if (/부산\S*전문\S*/.test(lineText) && /slug|href|path/.test(lineText)) {
        continue;
      }
      const line = text.slice(0, match.index).split("\n").length;
      hits.push({ file: rel, line, match: match[0], lineText: lineText.trim() });
    }
  }
}

const reportPath = path.join(ROOT, "scripts/output/restricted-claims-report.json");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify({ count: hits.length, hits }, null, 2)}\n`);

console.log(`[check-restricted-claims] ${hits.length} hits → ${reportPath}`);
if (hits.length > 0) {
  for (const hit of hits.slice(0, 40)) {
    console.log(`  ${hit.file}:${hit.line}  ${hit.match}`);
  }
  if (hits.length > 40) console.log(`  … +${hits.length - 40} more`);
}

// search-intent coverage summary (static parse of registry file)
const registryPath = path.join(ROOT, "src/data/seo/search-intents.ts");
if (fs.existsSync(registryPath)) {
  const src = fs.readFileSync(registryPath, "utf8");
  const actions = [
    "strengthen-existing",
    "create-new",
    "merge-into-existing",
    "do-not-target",
  ];
  console.log("\n[search-intent registry actions]");
  for (const action of actions) {
    const count = (src.match(new RegExp(`action: "${action}"`, "g")) ?? [])
      .length;
    console.log(`  ${action}: ${count}`);
  }
}

process.exitCode = 0;
