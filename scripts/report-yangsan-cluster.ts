/**
 * 양산 클러스터 최종 보고용 메타 덤프
 * 실행: npx --yes tsx scripts/report-yangsan-cluster.ts
 */
import {
  getAllGyeongnamDefs,
  getGyeongnamPageDataBySlug,
  getPublishedGyeongnamDefs,
  scoreGyeongnamLanding,
} from "../src/lib/gyeongnam-cases";
import { phaseYangsanClusterDefs } from "../src/lib/gyeongnam-cases/phase-yangsan-cluster";
import { getNationwideCasePageDataBySlug } from "../src/lib/nationwide-cases";
import type { PageData } from "../src/lib/pageData/types";

function pureChars(s: string): number {
  return (s || "").replace(/\s+/g, "").length;
}

function bodyOf(d: {
  heroDescription: string;
  scenarioBodies?: string[];
  uniqueFaqs?: { question: string; answer: string }[];
  jurisdictionNote?: string;
  visitHint?: string;
  remoteHint?: string;
  ctaDescription?: string;
}): string {
  return [
    d.heroDescription,
    ...(d.scenarioBodies || []),
    ...(d.uniqueFaqs || []).flatMap((f) => [f.question, f.answer]),
    d.jurisdictionNote || "",
    d.visitHint || "",
    d.remoteHint || "",
    d.ctaDescription || "",
  ].join("\n");
}

function pageChars(pd: PageData | undefined): number {
  if (!pd) return 0;
  const parts = [
    pd.metaTitle,
    pd.h1,
    pd.intro,
    ...(pd.introParagraphs || []),
    ...(pd.sections || []).flatMap((s) => [
      s.title,
      s.body,
      ...(s.items || []),
    ]),
    ...(pd.faqs || []).flatMap((f) => [f.question, f.answer]),
    pd.ctaTitle,
    pd.ctaText,
  ].filter(Boolean) as string[];
  return pureChars(parts.join("\n"));
}

function main() {
  const all = getAllGyeongnamDefs();
  const yangsan = getPublishedGyeongnamDefs().filter(
    (d) =>
      d.regionName === "양산" ||
      d.parentRegion === "양산" ||
      /양산|물금|증산|사송/.test(d.slug),
  );

  console.log("=== EXISTING YANGSAN URLS ===");
  console.log("/업무사례/양산상속등기법무사");
  for (const d of yangsan.sort((a, b) => a.slug.localeCompare(b.slug, "ko"))) {
    console.log(`/업무사례/${d.slug}`);
  }

  const nw = getNationwideCasePageDataBySlug("양산상속등기법무사");
  console.log(
    "\n=== NATIONWIDE YANGSAN INHERITANCE ===",
    JSON.stringify({
      url: "/업무사례/양산상속등기법무사",
      renderedChars: pageChars(nw),
      title: nw?.metaTitle,
      h1: nw?.h1,
    }),
  );

  console.log("\n=== PHASE CREATE META ===");
  for (const d of phaseYangsanClusterDefs) {
    const body = bodyOf(d);
    const pd = getGyeongnamPageDataBySlug(d.slug);
    console.log(
      JSON.stringify(
        {
          url: `/업무사례/${d.slug}`,
          primary: d.primaryKeyword,
          secondary: d.secondaryKeywords,
          title: d.seoTitle,
          h1: d.h1,
          description: d.metaDescription,
          defChars: pureChars(body),
          renderedChars: pageChars(pd),
          score: scoreGyeongnamLanding(d, all).total,
          ctaTitle: d.ctaTitle,
          ctaDescription: d.ctaDescription,
          related: d.relatedRegionSlugs,
          services: d.relatedServiceSlugs,
        },
        null,
        0,
      ),
    );
  }

  console.log("\n=== IMPROVED CORP ===");
  const corp = yangsan.find((d) => d.slug === "양산법인등기법무사");
  if (corp) {
    console.log(
      JSON.stringify({
        url: `/업무사례/${corp.slug}`,
        title: corp.seoTitle,
        h1: corp.h1,
        pureChars: pureChars(bodyOf(corp)),
        score: scoreGyeongnamLanding(corp, all).total,
      }),
    );
  }
}

main();
