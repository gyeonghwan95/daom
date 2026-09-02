/**
 * 상속 대표 URL 본문 유사도 감사.
 * 실행: npx --yes tsx scripts/inheritance-similarity-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import type { LocalLandingConfig } from "../src/types/local-landing";
import { buildKeywordHubPage } from "../src/lib/local-landing/keyword-builder";
import { buildBusanInheritanceRegistrationPage } from "../src/lib/local-landing/inheritance-registration-busan";
import { buildBusanInheritanceRenunciationPage } from "../src/lib/local-landing/inheritance-renunciation-busan";
import { buildBusanQualifiedAcceptancePage } from "../src/lib/local-landing/qualified-acceptance-busan";
import { getInheritanceArticleSummary } from "../src/lib/inheritance/article-summaries";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "seo/inheritance");

type PageBlob = {
  path: string;
  title: string;
  h1: string;
  desc: string;
  body: string;
  faq: string;
};

const busan: Pick<
  LocalLandingConfig,
  "regionKey" | "regionLabel" | "neighborhoods"
> = {
  regionKey: "busan",
  regionLabel: "부산",
  neighborhoods: ["해운대구", "센텀"],
};

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1),
  );
}

function jaccard(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function band(n: number): string {
  const p = n * 100;
  if (p < 40) return "낮음";
  if (p < 60) return "관찰";
  if (p < 75) return "주의";
  return "강한 중복 가능성";
}

function landingBlob(
  pathSlug: string,
  title: string,
  h1: string,
  desc: string,
  parts: string[],
): PageBlob {
  const extra = getInheritanceArticleSummary(pathSlug.replace(/^\//, ""));
  return {
    path: pathSlug,
    title,
    h1,
    desc,
    body: [...parts, extra?.conclusion ?? ""].join(" "),
    faq: parts.filter((p) => p.includes("?")).join(" "),
  };
}

function pages(): PageBlob[] {
  const champion = buildKeywordHubPage({
    slug: "부산상속법무사",
    keywordKey: "부산상속법무사",
    pageType: "keyword-hub",
    serviceSlug: "inheritance-registration",
    ...busan,
  } as LocalLandingConfig)!;
  const registration = buildBusanInheritanceRegistrationPage({
    slug: "부산상속등기",
    serviceSlug: "inheritance-registration",
    ...busan,
  } as LocalLandingConfig);
  const renunciation = buildBusanInheritanceRenunciationPage({
    slug: "부산상속포기",
    serviceSlug: "inheritance-renunciation",
    ...busan,
  } as LocalLandingConfig);
  const qualified = buildBusanQualifiedAcceptancePage({
    slug: "부산한정승인",
    serviceSlug: "qualified-acceptance",
    ...busan,
  } as LocalLandingConfig);

  return [
    landingBlob(
      "/부산상속법무사",
      champion.metaTitle ?? champion.title,
      champion.h1,
      champion.description,
      [
        champion.problemStatement,
        ...(champion.summaryParagraphs ?? []),
        ...(champion.extraPageSections ?? []).map((s) => s.title + s.body),
        ...(champion.faqs ?? []).map((f) => f.question + f.answer),
      ],
    ),
    landingBlob(
      "/부산상속등기",
      registration.metaTitle ?? registration.title,
      registration.h1,
      registration.description,
      [
        registration.problemStatement,
        ...(registration.summaryParagraphs ?? []),
        ...(registration.extraPageSections ?? []).map((s) => s.title + s.body),
        ...(registration.faqs ?? []).map((f) => f.question + f.answer),
      ],
    ),
    landingBlob(
      "/부산상속포기",
      renunciation.metaTitle ?? renunciation.title,
      renunciation.h1,
      renunciation.description,
      [
        renunciation.problemStatement,
        ...(renunciation.summaryParagraphs ?? []),
        ...(renunciation.extraPageSections ?? []).map((s) => s.title + s.body),
        ...(renunciation.faqs ?? []).map((f) => f.question + f.answer),
      ],
    ),
    landingBlob(
      "/부산한정승인",
      qualified.metaTitle ?? qualified.title,
      qualified.h1,
      qualified.description,
      [
        qualified.problemStatement,
        ...(qualified.summaryParagraphs ?? []),
        ...(qualified.extraPageSections ?? []).map((s) => s.title + s.body),
        ...(qualified.faqs ?? []).map((f) => f.question + f.answer),
      ],
    ),
  ];
}

function csvEscape(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const list = pages();
  const rows: Record<string, string | number>[] = [];
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const A = list[i]!;
      const B = list[j]!;
      const title = jaccard(A.title, B.title);
      const h1 = jaccard(A.h1, B.h1);
      const body = jaccard(A.body, B.body);
      const faq = jaccard(A.faq, B.faq);
      const avg = (title + h1 + body) / 3;
      rows.push({
        urlA: A.path,
        urlB: B.path,
        titleSimilarity: Number((title * 100).toFixed(1)),
        h1Similarity: Number((h1 * 100).toFixed(1)),
        bodySimilarity: Number((body * 100).toFixed(1)),
        faqSimilarity: Number((faq * 100).toFixed(1)),
        intentSimilarity: Number((avg * 100).toFixed(1)),
        cannibalizationRisk: band(avg),
        recommendation:
          avg >= 0.75
            ? "본문 고유 H2·FAQ를 더 벌릴 것. title/H1/URL은 동결."
            : "역할 유지. 상호 링크·의도 분리 유지.",
      });
    }
  }

  const header = [
    "urlA",
    "urlB",
    "titleSimilarity",
    "h1Similarity",
    "bodySimilarity",
    "faqSimilarity",
    "intentSimilarity",
    "cannibalizationRisk",
    "recommendation",
  ];
  const csv = [
    header.join(","),
    ...rows.map((row) => header.map((key) => csvEscape(row[key] ?? "")).join(",")),
  ].join("\n");
  const csvPath = path.join(OUT_DIR, "similarity.csv");
  fs.writeFileSync(csvPath, `${csv}\n`, "utf8");
  fs.writeFileSync(
    path.join(ROOT, "scripts/output/inheritance-similarity.json"),
    JSON.stringify(rows, null, 2),
    "utf8",
  );

  const fingerprintHeader = "path,title,h1,bodyChars,faqChars,summaryChars";
  const fingerprintRows = list.map((p) =>
    [
      csvEscape(p.path),
      csvEscape(p.title),
      csvEscape(p.h1),
      csvEscape(p.body.replace(/\s+/g, "").length),
      csvEscape(p.faq.replace(/\s+/g, "").length),
      csvEscape((getInheritanceArticleSummary(p.path.replace(/^\//, ""))?.conclusion.length ?? 0)),
    ].join(","),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "before-content-fingerprint.csv"),
    `${fingerprintHeader}\n${fingerprintRows.join("\n")}\n`,
    "utf8",
  );

  console.log(JSON.stringify(rows, null, 2));
  console.log("Wrote", csvPath);
}

main();
