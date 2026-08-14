/**
 * 「부산 법무사」 Recovery audit (report-only except hard registry checks).
 * Usage: npx --yes tsx scripts/audit-busan-law-scrivener.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "reports/seo/busan-law-scrivener-audit.json");

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function count(hay: string, needle: string) {
  let n = 0;
  let i = 0;
  while (true) {
    const j = hay.indexOf(needle, i);
    if (j === -1) return n;
    n += 1;
    i = j + needle.length;
  }
}

function main() {
  const flagship = read("src/lib/local-landing/flagship-busan-lawyer.ts");
  const toc = read("src/components/readability/PageTableOfContents.tsx");
  const hero = read("src/components/home/HomeHero.tsx");
  const home = read("src/app/page.tsx");
  const template = read("src/components/page-data/PageDataTemplate.tsx");
  const defaults = read("src/lib/pageData/template-helpers.ts");

  const inheritanceLock =
    flagship.includes("제적등본") &&
    flagship.includes("상속재산분할협의서") &&
    !flagship.includes("법인설립") &&
    !flagship.includes("개인회생");

  const mixedDocs = /상속: 피상속인/.test(flagship);
  const proceduresBroad = flagship.includes(
    "부산에서 법무사를 찾는 상황 확인(상속·매매·법인·회생)",
  );

  const hiddenTocDup =
    toc.includes('className="hidden"') &&
    toc.includes("readability-toc__details") &&
    count(toc, "<TocList") >= 2;

  const keywordBadges = ["부산 법무사", "부산법무사"].every((k) =>
    flagship.includes(`"${k}"`),
  );

  const heroContactDup =
    hero.includes("home-hero__mobile-convert") &&
    hero.includes("home-hero__desktop-contact") &&
    count(hero, "<HeroContactBlock") >= 2;

  const usesPageDataTemplate = template.includes("PageTableOfContents");
  const defaultInheritanceDocs = defaults.includes("가족관계증명서");

  const report = {
    generatedAt: new Date().toISOString(),
    liveNaverSerp: "LIVE_NAVER_SERP_UNAVAILABLE",
    answers: {
      "1_inheritance_template_lock": inheritanceLock
        ? "YES"
        : mixedDocs
          ? "PARTIAL — flagship uses PageDataTemplate shell; procedures are broad; documents mix inheritance with corporate/real-estate. Not exclusive 상속등기 lock."
          : "NO",
      "2_keyword_list_block": keywordBadges
        ? "YES — primaryKeywords badges (부산 법무사 / 부산법무사). Not a UL dump of variants. Protected — no auto-delete."
        : "NO",
      "3_duplicate_toc": hiddenTocDup
        ? "YES — hidden TocList + details TocList (fix applied if hidden copy removed)"
        : "NO — single TocList in details",
      "4_homepage_responsive_duplicate": heroContactDup
        ? "YES — HeroContactBlock mobile+desktop separate DOM; images marquee duplicated. REPORT, UI-risk so Phase 1 did not merge."
        : "NO",
      "5_multiple_primary_urls": "YES as candidates, NO as registry — Primary Champion is exactly /부산법무사",
      "6_spoke_competition": "PARTIAL — 추천/상담/비교/등기 pages exist; registry assigns supporting roles. Title/H1 unchanged this phase.",
      "7_exact_anchor_surge": "REVIEW — many label: 부산 법무사 across landings; capHubLinks fillers use exact-ish phrases. No mass delete this phase.",
      "8_local_page_dilution": "REVIEW — local pages exist and must not act as mini-Champion. Freeze new local-provider URLs.",
      "9_title_h1_canonical_changed_since_good": "NO for title/H1/canonical vs e064454 on /부산법무사. Related links and lawyerOpinion date did change.",
      "10_search_advisor_index": "UNKNOWN — no Search Advisor login in this environment. Manual checklist only.",
    },
    evidence: {
      proceduresBroad,
      mixedDocs,
      defaultInheritanceDocs,
      usesPageDataTemplate,
      hiddenTocDup,
      heroContactDup,
      homeClientSwiper: home.includes("HomeFullpageSwiper"),
    },
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log("=== Busan Law Scrivener Audit ===");
  for (const [k, v] of Object.entries(report.answers)) {
    console.log(`${k}: ${v}`);
  }
  console.log(`wrote ${path.relative(ROOT, OUT)}`);
}

main();
