import fs from "node:fs";
import { getPublishedGyeongnamSlugs } from "../src/lib/gyeongnam-cases";
import { phaseYangsanClusterDefs } from "../src/lib/gyeongnam-cases/phase-yangsan-cluster";
import { getGyeongnamPageDataBySlug } from "../src/lib/gyeongnam-cases";

const all = getPublishedGyeongnamSlugs()
  .map((s) => `/업무사례/${s}`)
  .sort((a, b) => a.localeCompare(b, "ko"));

const yangsan = all.filter((p) =>
  /양산|물금|증산|사송/.test(p),
);

const created = phaseYangsanClusterDefs.map((d) => `/업무사례/${d.slug}`);

const metrics = phaseYangsanClusterDefs.map((d) => {
  const pd = getGyeongnamPageDataBySlug(d.slug)!;
  const text = [
    pd.metaTitle,
    pd.h1,
    pd.intro,
    ...pd.introParagraphs,
    ...pd.sections.flatMap((s) => [s.title, s.body, ...(s.items || [])]),
    ...pd.faqs.flatMap((f) => [f.question, f.answer]),
  ].join("");
  return {
    url: `/업무사례/${d.slug}`,
    primary: d.primaryKeyword,
    secondary: d.secondaryKeywords,
    title: d.seoTitle,
    h1: d.h1,
    description: d.metaDescription,
    renderedChars: text.replace(/\s+/g, "").length,
    cta: d.ctaTitle,
  };
});

const out = {
  gyeongnamCount: all.length,
  gyeongnamUrls: all,
  yangsanUrls: [
    "/업무사례/양산상속등기법무사",
    ...yangsan.filter((u) => u !== "/업무사례/양산상속등기법무사"),
  ],
  created,
  metrics,
  indexNowCandidates: created,
  naverPriority: [
    "/업무사례/양산법무사업무",
    "/업무사례/양산상속등기법무사",
    "/업무사례/양산상속포기한정승인",
    "/업무사례/양산증여등기법무사",
    "/업무사례/양산부동산등기법무사",
    "/업무사례/양산법인등기법무사",
    "/업무사례/양산근저당말소",
    "/업무사례/양산건물멸실등기",
    "/업무사례/양산신축건물보존등기",
    "/업무사례/양산개인회생법무사",
    "/업무사례/부산거주양산부동산상속",
    "/업무사례/양산에서부산법인본점이전",
    "/업무사례/경남법무사업무",
  ],
};

fs.writeFileSync(
  "scripts/output/yangsan-cluster-report.json",
  JSON.stringify(out, null, 2),
  "utf8",
);
console.log(
  JSON.stringify(
    {
      gyeongnamCount: all.length,
      yangsanCount: out.yangsanUrls.length,
      created: created.length,
      metrics: metrics.map((m) => ({
        url: m.url,
        chars: m.renderedChars,
        title: m.title,
      })),
    },
    null,
    2,
  ),
);
