/**
 * 법무사 업무범위 오인·과장 표현 검사
 * Usage: npm run check:profession-misrepresentation
 *
 * “변호”가 다른 단어 일부(예: 변호사 언급이 아닌 경우)로만 나타나면
 * 문맥을 확인해 오탐을 줄인다. 변호사 자격 암시·종합자문 과장은 오류로 처리한다.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { counselPages } from "../src/lib/counsel-intent/content";
import { businessPages } from "../src/lib/business/content";

const ROOT = process.cwd();

/** 절대 금지에 가까운 과장·오인 표현 (부정 문맥은 허용) */
const BLOCKED =
  /종합\s*법률자문|법률고문|기업\s*고문|원스톱\s*법률서비스|변호에\s*준하는|변호사와\s*동일|변호사\s*없이|승소를\s*위한|최고의\s*법률상담|사건\s*직접\s*대리|법률전문가\s*직접\s*대응|전문\s*법률상담(?!\s*전)|소송대리\s*제공|형사변호\s*제공|협상대리\s*제공|법률의견서\s*제공/;

const BLOCKED_ALL_LEGAL = /모든\s*법률문제/;

/** 문맥 확인이 필요한 표현 — 금지 단정이 아닌 주의 */
const REVIEW =
  /소송대리(?!\s*는|\s*·|\s*\/|,|\s*등|\s*또는)|형사변호|협상대리|법률의견서|변론|승소/;

function isNegatedContext(text: string, index: number): boolean {
  const window = text.slice(Math.max(0, index - 50), index + 60);
  return /않(습니다|아요)|아니|금지|해당하지|제공하지|의미하지|판단하지|보장하지|포함되지|대체하거나|안내하지/.test(
    window,
  );
}

const SCAN_DIRS = [
  "src/lib/counsel-intent",
  "src/lib/business",
  "src/components/counsel",
  "src/components/business",
];

function walk(dir: string): string[] {
  const out: string[] = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

/** “변호사” 자격 암시가 아닌 정상 비교 문장인지 */
function isAllowedLawyerMention(text: string, index: number): boolean {
  const window = text.slice(Math.max(0, index - 40), index + 40);
  return (
    /별도\s*전문가|변호사\s*등|변호사\s*영역|변호사\s*검토|변호사\s*사무실을\s*대체/.test(
      window,
    ) || /법무사/.test(window)
  );
}

const errors: string[] = [];
const warnings: string[] = [];

function scanText(source: string, blob: string) {
  for (const match of blob.matchAll(new RegExp(BLOCKED, "g"))) {
    const idx = match.index ?? 0;
    if (isNegatedContext(blob, idx)) continue;
    errors.push(`${source}: 금지 표현 (${match[0]})`);
  }
  for (const match of blob.matchAll(new RegExp(BLOCKED_ALL_LEGAL, "g"))) {
    const idx = match.index ?? 0;
    if (isNegatedContext(blob, idx)) continue;
    errors.push(`${source}: 금지 표현 (${match[0]})`);
  }

  for (const match of blob.matchAll(new RegExp(REVIEW, "g"))) {
    const idx = match.index ?? 0;
    if (isNegatedContext(blob, idx)) continue;
    if (match[0].startsWith("변호") && isAllowedLawyerMention(blob, idx)) {
      continue;
    }
    const window = blob.slice(Math.max(0, idx - 60), idx + 80);
    if (
      /별도\s*(전문가\s*)?검토|업무범위|지원하지|포함되지|다를\s*수|범위\s*외/.test(
        window,
      )
    ) {
      continue;
    }
    warnings.push(`${source}: 문맥 확인 필요 (${match[0]})`);
  }
}

for (const page of [...counselPages, ...businessPages]) {
  const blob = [
    page.title,
    page.metaTitle,
    page.metaDescription,
    page.h1,
    page.heroIntro,
    ...page.heroParagraphs,
    ...page.faqs.map((faq) => `${faq.question} ${faq.answer}`),
    page.ctaText,
    "scopeNotice" in page ? String(page.scopeNotice ?? "") : "",
  ].join("\n");
  scanText(page.slug, blob);

  const isHub =
    page.slug === "부산법률상담" ||
    page.slug === "부산기업법률자문" ||
    ("kind" in page && page.kind === "hub");
  if (isHub && !/법무사/.test(blob)) {
    errors.push(`${page.slug}: ‘법무사’ 자격 표시 누락`);
  }
  if (isHub && !/다옴법무사사무소/.test(blob)) {
    errors.push(`${page.slug}: ‘다옴법무사사무소’ 표시 누락`);
  }
}

for (const dir of SCAN_DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    const text = readFileSync(file, "utf8");
    scanText(path.relative(ROOT, file), text);
  }
}

if (warnings.length) {
  console.log(JSON.stringify({ warnings }, null, 2));
}
if (errors.length) {
  console.error(JSON.stringify({ errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        ok: true,
        counselPages: counselPages.length,
        businessPages: businessPages.length,
        warnings: warnings.length,
      },
      null,
      2,
    ),
  );
}
