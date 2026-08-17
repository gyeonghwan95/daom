/**
 * 전역 SEO 저평가 요인 전수조사 (읽기 전용)
 * npx --yes tsx scripts/audit-seo-undervaluation.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import { getInflowItemsForPath } from "../src/lib/seo/inflow-policy";
import { staticPageSeo } from "../src/lib/seo/page-seo";
import {
  HOME_METADATA_DESCRIPTION,
  HOME_METADATA_TITLE,
} from "../src/lib/seo/metadata";

const OUT = path.join(process.cwd(), "reports/seo/undervaluation-audit.json");

const HYPE = [/최고/, /1위/, /일등/, /업계\s*1/, /무조건/, /100%/, /보장합니다/];
const QUERY_PHRASES = [
  "부산 법무사",
  "부산 등기 법무사",
  "부산 상속등기",
  "부산 부동산등기",
  "부산 법인등기",
  "부산 개인회생",
  "해운대 법무사",
];

function bodyOf(page: {
  intro: string;
  introParagraphs: string[];
  procedures: string[];
  documents: string[];
  consultationPoints: string[];
  faqs: { question: string; answer: string }[];
  sections: { title: string; body: string; items?: string[] }[];
  consultationExample: { title: string; body: string };
}): string {
  return [
    page.intro,
    ...page.introParagraphs,
    ...page.procedures,
    ...page.documents,
    ...page.consultationPoints,
    ...page.faqs.flatMap((f) => [f.question, f.answer]),
    ...page.sections.flatMap((s) => [s.title, s.body, ...(s.items ?? [])]),
    page.consultationExample.title,
    page.consultationExample.body,
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function countPhrase(text: string, phrase: string): number {
  if (!phrase) return 0;
  let n = 0;
  let i = 0;
  while (true) {
    const found = text.indexOf(phrase, i);
    if (found === -1) break;
    n += 1;
    i = found + phrase.length;
  }
  return n;
}

function main() {
  const all = getAllPageData();
  const indexable = all.filter((p) => isIndexablePagePath(p.path));
  const noindex = all.filter((p) => !isIndexablePagePath(p.path));

  const byCategory: Record<string, number> = {};
  for (const p of indexable) {
    byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
  }

  const titleMap = new Map<string, string[]>();
  const h1Map = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  const shortTitle: Array<{ path: string; title: string; len: number }> = [];
  const longTitle: Array<{ path: string; title: string; len: number }> = [];
  const shortDesc: Array<{ path: string; len: number }> = [];
  const longDesc: Array<{ path: string; len: number }> = [];
  const thinBody: Array<{ path: string; chars: number; category: string }> = [];
  const stuffing: Array<{
    path: string;
    phrase: string;
    hits: number;
    titleHits: number;
  }> = [];
  const hypeHits: Array<{ path: string; match: string }> = [];
  const fewLinks: Array<{ path: string; internal: number; related: number }> =
    [];
  const missingH1: string[] = [];
  const titleEqH1: string[] = [];
  const queryInTitle: Record<string, string[]> = {};
  for (const q of QUERY_PHRASES) queryInTitle[q] = [];

  const faqQuestions = new Map<string, string[]>();
  const keywordMetaExactQuery: Array<{ path: string; keyword: string }> = [];

  for (const p of indexable) {
    const title = p.metaTitle || p.title;
    const desc = p.metaDescription || "";
    const h1 = p.h1 || "";
    const body = bodyOf(p);
    const chars = body.length;

    titleMap.set(title, [...(titleMap.get(title) ?? []), p.path]);
    if (h1) h1Map.set(h1, [...(h1Map.get(h1) ?? []), p.path]);
    if (desc) descMap.set(desc, [...(descMap.get(desc) ?? []), p.path]);

    if (title.length < 12) shortTitle.push({ path: p.path, title, len: title.length });
    if (title.length > 45) longTitle.push({ path: p.path, title, len: title.length });
    if (desc.length > 0 && desc.length < 70)
      shortDesc.push({ path: p.path, len: desc.length });
    if (desc.length > 130) longDesc.push({ path: p.path, len: desc.length });
    if (chars < 900)
      thinBody.push({ path: p.path, chars, category: p.category });
    if (!h1.trim()) missingH1.push(p.path);
    if (h1 && title.replace(/\s+/g, "") === h1.replace(/\s+/g, "")) {
      titleEqH1.push(p.path);
    }

    const combined = `${title} ${h1} ${desc} ${body}`;
    for (const phrase of QUERY_PHRASES) {
      const hits = countPhrase(combined, phrase);
      const titleHits = countPhrase(`${title} ${h1}`, phrase);
      if (hits >= 8) {
        stuffing.push({ path: p.path, phrase, hits, titleHits });
      }
      if (title.includes(phrase) || h1.includes(phrase)) {
        queryInTitle[phrase].push(p.path);
      }
    }

    for (const re of HYPE) {
      if (re.test(combined) && !/전문 분야|전문성|전문의/.test(combined)) {
        const m = combined.match(re);
        if (m) hypeHits.push({ path: p.path, match: m[0] });
      }
    }

    if ((p.internalLinks?.length ?? 0) < 3) {
      fewLinks.push({
        path: p.path,
        internal: p.internalLinks?.length ?? 0,
        related: p.relatedLinks?.length ?? 0,
      });
    }

    for (const faq of p.faqs ?? []) {
      const q = faq.question.trim();
      faqQuestions.set(q, [...(faqQuestions.get(q) ?? []), p.path]);
    }

    for (const kw of p.primaryKeywords ?? []) {
      if (QUERY_PHRASES.includes(kw)) {
        keywordMetaExactQuery.push({ path: p.path, keyword: kw });
      }
    }
  }

  const dupTitles = [...titleMap.entries()]
    .filter(([, paths]) => paths.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 25)
    .map(([title, paths]) => ({ title, count: paths.length, sample: paths.slice(0, 6) }));

  const dupH1 = [...h1Map.entries()]
    .filter(([, paths]) => paths.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 20)
    .map(([h1, paths]) => ({ h1, count: paths.length, sample: paths.slice(0, 6) }));

  const dupDesc = [...descMap.entries()]
    .filter(([, paths]) => paths.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 20)
    .map(([desc, paths]) => ({
      desc: desc.slice(0, 80),
      count: paths.length,
      sample: paths.slice(0, 6),
    }));

  const dupFaqs = [...faqQuestions.entries()]
    .filter(([, paths]) => paths.length >= 8)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 20)
    .map(([question, paths]) => ({
      question,
      count: paths.length,
      sample: paths.slice(0, 5),
    }));

  stuffing.sort((a, b) => b.hits - a.hits);
  thinBody.sort((a, b) => a.chars - b.chars);

  const thinByCat: Record<string, number> = {};
  for (const row of thinBody) {
    thinByCat[row.category] = (thinByCat[row.category] ?? 0) + 1;
  }

  const inflowPages = indexable.filter(
    (p) => getInflowItemsForPath(p.path).length > 0,
  ).length;
  const inflowWithSearchPhrase = getInflowItemsForPath("/부산상속등기").filter(
    (i) => i.searchPhrase,
  );

  const staticTitles = Object.entries(staticPageSeo).map(([key, v]) => ({
    key,
    path: v.path,
    title: v.title,
    titleLen: v.title.length,
    descLen: v.description.length,
    keywords: v.keywords ?? [],
  }));

  const sitemapPath = path.join(process.cwd(), "public/sitemap.xml");
  let sitemapCount = 0;
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, "utf8");
    sitemapCount = (xml.match(/<loc>/g) || []).length;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      pageData: all.length,
      indexable: indexable.length,
      noindexOrExcluded: noindex.length,
      sitemapLocs: sitemapCount,
      inflowRailPages: inflowPages,
    },
    byCategory,
    home: {
      title: HOME_METADATA_TITLE,
      description: HOME_METADATA_DESCRIPTION,
      descLen: HOME_METADATA_DESCRIPTION.length,
    },
    duplicates: {
      titles: dupTitles,
      h1: dupH1,
      descriptions: dupDesc,
      faqQuestionsShared8plus: dupFaqs,
    },
    length: {
      shortTitle: shortTitle.slice(0, 20),
      longTitleCount: longTitle.length,
      longTitleSample: longTitle.slice(0, 12),
      shortDescCount: shortDesc.length,
      longDescCount: longDesc.length,
      thinBodyCount: thinBody.length,
      thinByCategory: thinByCat,
      thinnest: thinBody.slice(0, 25),
    },
    cannibalization: Object.fromEntries(
      Object.entries(queryInTitle).map(([q, paths]) => [
        q,
        { count: paths.length, sample: paths.slice(0, 12) },
      ]),
    ),
    stuffing: stuffing.slice(0, 40),
    stuffingCount: stuffing.length,
    hypeHits: hypeHits.slice(0, 30),
    hypeCount: hypeHits.length,
    fewInternalLinks: fewLinks.slice(0, 25),
    fewInternalCount: fewLinks.length,
    missingH1: missingH1.slice(0, 20),
    missingH1Count: missingH1.length,
    titleEqualsH1Count: titleEqH1.length,
    keywordMetaExactQueryCount: keywordMetaExactQuery.length,
    keywordMetaExactQuerySample: keywordMetaExactQuery.slice(0, 20),
    inflowRailSearchPhrases: inflowWithSearchPhrase.map((i) => i.searchPhrase),
    staticPages: staticTitles,
    noindexSample: noindex.slice(0, 20).map((p) => p.path),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report.totals, null, 2));
  console.log("byCategory", byCategory);
  console.log("dup titles", dupTitles.slice(0, 8));
  console.log("dup h1", dupH1.slice(0, 8));
  console.log("thin", thinBody.length, thinByCat);
  console.log("stuffing pages", stuffing.length);
  console.log("cannibal", Object.fromEntries(
    Object.entries(queryInTitle).map(([q, p]) => [q, p.length]),
  ));
  console.log("hype", hypeHits.length);
  console.log("few links", fewLinks.length);
  console.log("Wrote", OUT);
}

main();
