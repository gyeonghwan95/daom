import { withRegionLabel, formatPlaceList } from "../src/lib/local-landing/region-label";
import { getPageDataByPath } from "../src/lib/pageData/registry";
import { getChampionArticleSummary } from "../src/lib/local-landing/champion-article-summaries";
import {
  HOME_H1,
  HOME_METADATA_TITLE,
} from "../src/lib/seo/metadata";

const cases: Array<[string, string, string]> = [
  ["부산", "부산 법무사 비용", "부산 법무사 비용"],
  ["부산", "재개발등기", "부산 재개발등기"],
  ["센텀", "센텀 법인등기", "센텀 법인등기"],
  ["해운대", "해운대 재개발 상속등기", "해운대 재개발 상속등기"],
  ["부산", "부산지방법원 등기국 관련 상속등기", "부산지방법원 등기국 관련 상속등기"],
  ["부산", "부산역", "부산역"],
];

let failed = 0;
for (const [region, text, expected] of cases) {
  const got = withRegionLabel(region, text);
  if (got !== expected) {
    console.error(`withRegionLabel(${region}, ${text}) => ${got} (expected ${expected})`);
    failed += 1;
  }
}

const place = formatPlaceList("부산", ["부산진구", "해운대구"]);
if (place !== "부산진구, 해운대구") {
  console.error("formatPlaceList busanjin failed", place);
  failed += 1;
}
const haeundaePlaces = formatPlaceList("부산", ["해운대구", "수영구"]);
if (haeundaePlaces !== "부산 해운대구, 수영구") {
  console.error("formatPlaceList haeundae failed", haeundaePlaces);
  failed += 1;
}

const identityPaths = [
  "/",
  "/부산상속법무사",
  "/부산상속등기",
  "/부산상속포기",
  "/부산한정승인",
  "/부산법무사상담",
  "/부산법인법무사",
  "/부산부동산등기",
  "/부산등기법무사",
  "/부산법인등기",
  "/부산개인회생",
  "/부산법무사추천",
  "/부산등기전문법무사",
];

const DUP = /(부산 부산|해운대 해운대|센텀 센텀)/;

for (const path of identityPaths) {
  const page = getPageDataByPath(path);
  if (!page) {
    console.error("missing page", path);
    failed += 1;
    continue;
  }
  const blob = [
    page.metaTitle,
    page.h1,
    page.consultationExample.title,
    page.consultationExample.body,
    ...page.faqs.map((f) => `${f.question} ${f.answer}`),
  ].join("\n");
  const dup = blob.match(DUP)?.[0];
  console.log(
    [
      path,
      `title=${page.metaTitle}`,
      `h1=${page.h1}`,
      `faqs=${page.faqs.length}`,
      `case=${page.consultationExample.title}`,
      `summary=${getChampionArticleSummary(page.slug) ? "dedicated" : "fallback"}`,
      dup ? `DUP=${dup}` : "dup=ok",
    ].join(" | "),
  );
  if (dup) failed += 1;
}

const home = getPageDataByPath("/");
if (!home) {
  console.error("HOME missing");
  failed += 1;
} else {
  if (home.metaTitle !== HOME_METADATA_TITLE) {
    console.error("HOME title drift", home.metaTitle);
    failed += 1;
  }
  if (home.h1 !== HOME_H1) {
    console.error("HOME h1 drift", home.h1);
    failed += 1;
  }
}

const realEstate = getPageDataByPath("/부산부동산등기");
if (!realEstate || realEstate.faqs.length < 8) {
  console.error("부동산등기 FAQ not unslice", realEstate?.faqs.length);
  failed += 1;
}

const caseStation = getPageDataByPath("/업무사례/부산역법무사");
if (caseStation) {
  console.log("case 부산역", caseStation.h1, caseStation.metaTitle);
  if (caseStation.h1.includes("부산 부산역")) {
    console.error("부산역 displayName still doubled");
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`FAILED ${failed}`);
  process.exit(1);
}
console.log("OK");
