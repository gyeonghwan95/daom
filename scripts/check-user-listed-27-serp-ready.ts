/**
 * 고객 제시 27검색어 + 인접 수임 검색어 — 대표 URL·캐러셀·compact 소유 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고, 갈래를 섞지 않으며 카드 4장 이상이다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-user-listed-27-serp-ready.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  USER_LISTED_27_EXTRA,
  USER_LISTED_27_TARGETS,
} from "../src/data/seo/user-listed-27-champions";
import { getExplicitSerpCarouselPack } from "../src/data/seo/serp-carousel-packs";
import {
  getExactKeywordChampionPath,
  sanitizePageKeywords,
} from "../src/lib/seo/champion-query";
import { isNoIndexPath } from "../src/lib/seo/index-policy";
import { getSerpCarouselPack } from "../src/lib/seo/serp-carousel-pack";

const ROOT = process.cwd();

type KeywordRow = {
  owner: string;
  aliasOf?: string;
};

const COMPACT_OWNERS: { compact: string; path: string }[] = [
  { compact: "부산법무사", path: "/" },
  { compact: "부산법무사사무소", path: "/" },
  { compact: "부산법무사상담", path: "/부산법무사상담" },
  { compact: "부산법무사전화상담", path: "/부산법무사상담" },
  { compact: "부산법무사온라인상담", path: "/부산법무사비대면상담" },
  { compact: "부산비대면법무사", path: "/부산법무사비대면상담" },
  { compact: "부산온라인법무사", path: "/부산법무사비대면상담" },
  { compact: "부산상속법무사", path: "/부산상속법무사" },
  { compact: "부산법무사상속", path: "/부산상속법무사" },
  { compact: "부산상속전문법무사", path: "/부산상속전문법무사" },
  { compact: "부산상속포기법무사", path: "/부산상속포기" },
  { compact: "부산상속포기상담", path: "/부산상속포기" },
  { compact: "부산진구상속법무사", path: "/부산진구상속등기" },
  { compact: "부산남구상속법무사", path: "/남구상속등기" },
  { compact: "기장상속법무사", path: "/기장상속등기" },
  { compact: "기장군상속법무사", path: "/기장군상속등기" },
  { compact: "부산법인전문법무사", path: "/부산법인설립전문법무사" },
  { compact: "부산법인설립", path: "/부산법인설립등기" },
  { compact: "부산등기전문법무사", path: "/부산부동산등기전문법무사" },
  { compact: "부산경매법무사", path: "/부산경매낙찰등기" },
  { compact: "부산유언법무사", path: "/부산유언검인" },
  { compact: "부산부동산가압류법무사", path: "/부산가압류신청" },
  { compact: "부산가압류법무사", path: "/부산가압류신청" },
  { compact: "부산채권가압류법무사", path: "/부산가압류신청" },
  { compact: "부산부동산가처분법무사", path: "/가처분신청서류준비" },
  { compact: "부산가처분법무사", path: "/가처분신청서류준비" },
  { compact: "부산채권추심법무사", path: "/부산채권압류추심명령" },
  { compact: "부산강제집행법무사", path: "/situations/판결-후-강제집행" },
  { compact: "부산임대차분쟁법무사", path: "/부산전세보증금반환법무사" },
  { compact: "부산법원앞법무사", path: "/부산법원근처법무사" },
  { compact: "부산법원근처법무사", path: "/부산법원근처법무사" },
  { compact: "부산내용증명법무사", path: "/내용증명작성준비" },
];

const CAROUSEL_FENCES: { path: string; forbid: string[] }[] = [
  { path: "/", forbid: ["/부산법인등기", "/부산법인설립등기", "/부산상속법무사"] },
  { path: "/부산진구상속등기", forbid: ["/부산진구법무사", "/업무사례/대구남구상속등기법무사"] },
  { path: "/남구상속등기", forbid: ["/남구법무사", "/업무사례/울산남구상속등기법무사"] },
  { path: "/기장상속등기", forbid: ["/기장군법무사"] },
  { path: "/부산가압류신청", forbid: ["/부산가압류말소등기"] },
  { path: "/가처분신청서류준비", forbid: ["/부산가처분말소등기"] },
  { path: "/부산전세보증금반환법무사", forbid: ["/전세사기피해대응절차"] },
  { path: "/부산법원근처법무사", forbid: ["/"] },
  { path: "/부산경매낙찰등기", forbid: ["/전세사기피해대응절차"] },
  { path: "/부산유언검인", forbid: ["/부산상속포기"] },
  { path: "/부산법무사비대면상담", forbid: ["/부산법률상담"] },
];

const FROZEN_TITLES: { path: string; startsWith: string }[] = [
  { path: "/", startsWith: "부산 법무사 안윤정" },
  { path: "/부산법인설립등기", startsWith: "부산 법인설립 법무사" },
];

function resolveOwner(
  map: Record<string, KeywordRow>,
  query: string,
): string {
  const row = map[query];
  if (!row) return "";
  if (row.aliasOf && map[row.aliasOf]) return map[row.aliasOf].owner;
  return row.owner;
}

function checkRow(
  map: Record<string, KeywordRow>,
  row: { query: string; champion: string },
  errors: string[],
  required: boolean,
) {
  const mapOwner = resolveOwner(map, row.query) || "(unmapped)";
  if (mapOwner !== row.champion && mapOwner !== "(unmapped)") {
    errors.push(
      `${row.query}: keyword-map owner ${mapOwner} ≠ champion ${row.champion}`,
    );
  }
  if (required && mapOwner === "(unmapped)") {
    errors.push(`${row.query}: missing keyword-map owner`);
  }
  if (isNoIndexPath(row.champion)) {
    errors.push(`${row.query}: champion ${row.champion} is noindex`);
  }
  const pack = getSerpCarouselPack(row.champion);
  const count = pack?.items.length ?? 0;
  const tag = required ? "target" : "inflow";
  console.log(
    `${tag}\t${row.query}\t${row.champion}\t${mapOwner}\t${count}\t${pack?.heading ?? ""}`,
  );
  if (count < 4) {
    errors.push(`${row.query}: ${row.champion} carousel cards ${count} < 4`);
  }
}

function main() {
  const map = JSON.parse(
    fs.readFileSync(path.join(ROOT, "seo/keyword-map.json"), "utf8"),
  ) as { queries: Record<string, KeywordRow> };
  const titles = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "src/generated/admin-page-titles.json"),
      "utf8",
    ),
  ) as { titles: Record<string, string> };
  const errors: string[] = [];

  console.log("kind\tquery\tchampion\tmapOwner\tcards\theading");
  for (const row of USER_LISTED_27_TARGETS) {
    checkRow(map.queries, row, errors, true);
  }
  for (const row of USER_LISTED_27_EXTRA) {
    checkRow(map.queries, row, errors, true);
  }

  for (const row of COMPACT_OWNERS) {
    const owner = getExactKeywordChampionPath(row.compact);
    if (owner !== row.path) {
      errors.push(`compact ${row.compact}: ${owner ?? "(none)"} ≠ ${row.path}`);
    }
  }

  for (const fence of CAROUSEL_FENCES) {
    const pack =
      fence.path === "/"
        ? getExplicitSerpCarouselPack("/")
        : getExplicitSerpCarouselPack(fence.path);
    const urls = pack?.urls ?? [];
    for (const forbidden of fence.forbid) {
      if (urls.includes(forbidden)) {
        errors.push(`${fence.path} carousel still includes ${forbidden}`);
      }
    }
  }

  const geoLeak = sanitizePageKeywords("/부산진구법무사", [
    "부산진구 상속 법무사",
    "부산 남구 상속 법무사",
  ]);
  if (geoLeak?.length) {
    errors.push(`/부산진구법무사 still keeps district inheritance keywords: ${geoLeak.join(", ")}`);
  }

  const homeLeak = sanitizePageKeywords("/", [
    "부산 법원 앞 법무사",
    "부산 법무사 전화상담",
    "부산 경매 법무사",
  ]);
  if (homeLeak?.length) {
    errors.push(`/ still keeps spoke keywords: ${homeLeak.join(", ")}`);
  }

  const officeLeak = sanitizePageKeywords("/부산법무사무소", [
    "부산 법무사 사무소",
    "부산 법원 앞 법무사",
  ]);
  if (officeLeak?.length) {
    errors.push(`/부산법무사무소 still keeps owned keywords: ${officeLeak.join(", ")}`);
  }

  if (getExactKeywordChampionPath("부산진구법무사") !== "/부산진구법무사") {
    errors.push("compact 부산진구법무사 must stay on geo hub");
  }
  if (getExactKeywordChampionPath("기장법무사") !== "/기장군법무사") {
    errors.push("compact 기장법무사 must stay on geo hub");
  }
  if (getExactKeywordChampionPath("부산법무사") !== "/") {
    errors.push("compact 부산법무사 must stay on HOME");
  }

  for (const frozen of FROZEN_TITLES) {
    const title = titles.titles[frozen.path] ?? "";
    console.log(`frozen\t${frozen.path}\t${title}`);
    if (!title.startsWith(frozen.startsWith)) {
      errors.push(
        `${frozen.path} title "${title}" must start with ${frozen.startsWith}`,
      );
    }
  }

  if (errors.length) {
    for (const error of errors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
  console.log(
    `\nOK ${USER_LISTED_27_TARGETS.length} target + ${USER_LISTED_27_EXTRA.length} extra — champion uniqueness + ItemList 자격. 네이버 1위는 관측 항목.`,
  );
}

main();
