/**
 * Broad corporate page 업무범위 과장 표현 검사.
 * 실행: npx --yes tsx scripts/audit-corporate-scope-language.ts
 */
import fs from "node:fs";
import path from "node:path";
import { corporateLegalIntents } from "../src/data/seo/corporate-legal-intents";

const ROOT = process.cwd();

const REVIEW =
  /모든 기업 법률문제|기업 분쟁 전반|소송 대리|계약 분쟁 대리|기업 종합 법률서비스|원스톱 기업 법률|상시 법률고문|모든 회사 법무/;

const SCAN_FILES = [
  "src/lib/local-landing/corporate-legal-operations-modules.ts",
  "src/components/local-landing/CorporateLegalOperationsModules.tsx",
  "src/lib/local-landing/keyword-topics.ts",
  "src/lib/local-landing/keyword-builder.ts",
];

const reviews: string[] = [];
const errors: string[] = [];

function isNegated(blob: string, index: number): boolean {
  const window = blob.slice(Math.max(0, index - 80), index + 80);
  return /않(습니다|아요)|아니|금지|해당하지|제공하지|맡는 안내가 아닙니다|범위 밖|OUT_OF_SCOPE|Target하지/.test(
    window,
  );
}

for (const rel of SCAN_FILES) {
  const full = path.join(ROOT, rel);
  const text = fs.readFileSync(full, "utf8");
  for (const match of text.matchAll(new RegExp(REVIEW, "g"))) {
    const idx = match.index ?? 0;
    if (isNegated(text, idx)) continue;
    reviews.push(`${rel}: REVIEW (${match[0]})`);
  }
}

const createNew = corporateLegalIntents.filter(
  (row) => row.recommendedAction === "CREATE_NEW",
);
if (createNew.length > 0) {
  errors.push(`CREATE_NEW ${createNew.length}건 — 이번 Cluster는 0이어야 함`);
}

const outOfScopeTargeted = corporateLegalIntents.filter(
  (row) =>
    row.coverage === "out_of_scope" &&
    row.recommendedAction !== "DO_NOT_TARGET",
);
if (outOfScopeTargeted.length > 0) {
  errors.push("OUT_OF_SCOPE intent가 Target action을 가짐");
}

console.log("=== Corporate Scope Language ===");
if (reviews.length) {
  for (const row of reviews) console.log(`[review] ${row}`);
} else {
  console.log("REVIEW hits: 0 (negated/scope table OK)");
}
if (errors.length) {
  for (const row of errors) console.error(`[fail] ${row}`);
  process.exit(1);
}
