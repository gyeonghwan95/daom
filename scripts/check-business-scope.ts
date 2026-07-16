/**
 * 기업 페이지 업무범위·과장 표현 검사
 * 실행: npx tsx scripts/check-business-scope.ts
 */
import fs from "node:fs";
import path from "node:path";
import { businessPages } from "../src/lib/business/content";
import { businessSearchIntents } from "../src/data/business/search-intents";

const ROOT = process.cwd();
const RISKY =
  /기업 전문 법무사|기업법무 전문|종합 기업 법률자문|원스톱 기업 법률|모든 기업법률 문제|소송대리 제공|협상대리 제공|채권회수 보장|미수금 100%|분쟁 완벽 해결|법률의견서 제공|최고의 기업자문|부산 1위 기업|상시 법률고문|기업 고문 법무사/;

function findRisky(text: string): string | null {
  const match = text.match(RISKY);
  return match ? match[0] : null;
}

const errors: string[] = [];
const warnings: string[] = [];

for (const page of businessPages) {
  const blob = [
    page.title,
    page.metaTitle,
    page.metaDescription,
    page.h1,
    page.heroIntro,
    ...page.heroParagraphs,
    ...page.faqs.map((faq) => `${faq.question} ${faq.answer}`),
    page.ctaText,
  ].join("\n");

  const hit = findRisky(blob);
  if (hit) {
    errors.push(`${page.slug}: 위험 표현 검출 (${hit})`);
  }

  if (!page.relatedLinks.some((link) => link.href.startsWith("/"))) {
    warnings.push(`${page.slug}: 내부링크 부족`);
  }
}

for (const intent of businessSearchIntents) {
  if (intent.action === "do-not-target") continue;
  if (intent.action === "create-new" && !intent.targetUrl) {
    errors.push(`${intent.id}: create-new인데 targetUrl 없음`);
  }
  if (
    intent.action === "create-new" &&
    intent.targetUrl &&
    !businessPages.some((page) => `/${page.slug}` === intent.targetUrl)
  ) {
    // allow existing non-business targets later
    const knownExisting = [
      "/부산법인등기",
      "/부산법인설립등기",
      "/기업법률교육",
      "/공공기관등기업무",
    ];
    if (
      !businessPages.some((page) => `/${page.slug}` === intent.targetUrl) &&
      !knownExisting.includes(intent.targetUrl)
    ) {
      warnings.push(`${intent.id}: targetUrl 페이지 미확인 ${intent.targetUrl}`);
    }
  }
}

const contentDir = path.join(ROOT, "src/lib/business");
for (const file of fs.readdirSync(contentDir)) {
  if (!file.endsWith(".ts")) continue;
  const text = fs.readFileSync(path.join(contentDir, file), "utf8");
  const hit = findRisky(text);
  if (hit) {
    errors.push(`src/lib/business/${file}: 위험 표현 (${hit})`);
  }
}

if (warnings.length) {
  console.warn("Warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("Errors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `OK: ${businessPages.length} business pages, ${businessSearchIntents.length} intents, ${warnings.length} warnings`,
);
