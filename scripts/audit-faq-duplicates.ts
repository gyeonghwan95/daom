/** FAQ 질문 중복 감사 — 핵심 Champion 중심 */
import fs from "node:fs";
import path from "node:path";
import { buildBusanLawyerFlagshipPage } from "../src/lib/local-landing/flagship-busan-lawyer";
import { buildBusanInheritanceRenunciationPage } from "../src/lib/local-landing/inheritance-renunciation-busan";
import { buildKeywordHubPage } from "../src/lib/local-landing/keyword-builder";
import type { LocalLandingConfig } from "../src/types/local-landing";

const OUT = path.join(process.cwd(), "reports/seo/faq-duplicates.json");

function cfg(slug: string): LocalLandingConfig {
  return {
    slug,
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: [],
    serviceSlug: "corporate-registration",
    pageType: "keyword-hub",
    keywordKey: slug,
  } as LocalLandingConfig;
}

function main() {
  const pages: { path: string; questions: string[] }[] = [];
  const flagship = buildBusanLawyerFlagshipPage(cfg("부산법무사"));
  pages.push({
    path: flagship.path,
    questions: flagship.faqs.map((f) => f.question),
  });
  const ren = buildBusanInheritanceRenunciationPage({
    ...cfg("부산상속포기"),
    serviceSlug: "inheritance-renunciation",
  });
  pages.push({ path: ren.path, questions: ren.faqs.map((f) => f.question) });
  for (const slug of ["부산법인법무사", "부산상속법무사"]) {
    const p = buildKeywordHubPage(cfg(slug));
    if (p) pages.push({ path: p.path, questions: p.faqs.map((f) => f.question) });
  }

  const qMap = new Map<string, string[]>();
  for (const p of pages) {
    for (const q of p.questions) {
      const list = qMap.get(q) ?? [];
      list.push(p.path);
      qMap.set(q, list);
    }
  }
  const dupes = [...qMap.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([question, paths]) => ({ question, paths }));

  const report = {
    generatedAt: new Date().toISOString(),
    pages: pages.map((p) => ({ path: p.path, faqCount: p.questions.length })),
    exactQuestionDuplicates: dupes,
    note: "Champion별 FAQ 역할 유지. 공통 템플릿 FAQ 신규 복제 금지.",
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote", OUT, "dupes", dupes.length);
}

main();
