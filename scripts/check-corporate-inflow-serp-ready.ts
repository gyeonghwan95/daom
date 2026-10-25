/**
 * 부산 법인 수임 검색어 — 대표 URL·캐러셀 분기·compact 소유 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고, 설립/변경/전문/HOME 팩이 갈래를 섞지 않으며,
 * 그 URL HTML에 고유 이미지 카드 4장 이상이 붙을 수 있다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-corporate-inflow-serp-ready.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  getExplicitSerpCarouselPack,
  HOME_SERP_CAROUSEL_URLS,
} from "../src/data/seo/serp-carousel-packs";
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

const TARGETS: { query: string; champion: string }[] = [
  { query: "부산 법인등기 법무사", champion: "/부산법인등기" },
  { query: "부산 법인전문 법무사", champion: "/부산법인설립전문법무사" },
  { query: "부산 법인 법무사", champion: "/" },
  { query: "부산 법인설립 법무사", champion: "/부산법인설립등기" },
  { query: "부산 법인설립", champion: "/부산법인설립등기" },
  { query: "부산 법인법무", champion: "/부산법인법무사" },
];

const EXTRA_INFLOW: { query: string; champion: string }[] = [
  { query: "부산 회사설립 법무사", champion: "/부산법인설립등기" },
  { query: "부산 상업등기", champion: "/부산법인등기" },
  { query: "부산 법인변경", champion: "/부산법인등기" },
  { query: "부산 법인설립등기", champion: "/부산법인설립등기" },
  { query: "부산 회사 법무사", champion: "/부산법인법무사" },
  { query: "1인 법인", champion: "/부산법인설립등기" },
  { query: "부산 법인설립 비용", champion: "/법인설립등기비용" },
  { query: "부산 대표이사 변경", champion: "/부산대표이사변경등기" },
  { query: "부산 해산청산 법무사", champion: "/부산법인해산청산등기" },
];

const COMPACT_OWNERS: { compact: string; path: string }[] = [
  { compact: "부산법인등기법무사", path: "/부산법인등기" },
  { compact: "부산상업등기", path: "/부산법인등기" },
  { compact: "부산법인변경", path: "/부산법인등기" },
  { compact: "부산법인전문법무사", path: "/부산법인설립전문법무사" },
  { compact: "부산법인법무사", path: "/" },
  { compact: "부산법인설립법무사", path: "/부산법인설립등기" },
  { compact: "부산법인설립", path: "/부산법인설립등기" },
  { compact: "부산회사설립법무사", path: "/부산법인설립등기" },
  { compact: "부산법인설립등기", path: "/부산법인설립등기" },
  { compact: "부산법인법무", path: "/부산법인법무사" },
  { compact: "부산회사법무사", path: "/부산법인법무사" },
  { compact: "1인법인", path: "/부산법인설립등기" },
  { compact: "1인법인설립", path: "/부산법인설립등기" },
  { compact: "부산법인설립비용", path: "/법인설립등기비용" },
  { compact: "1인법인설립비용", path: "/법인설립등기비용" },
  { compact: "부산대표이사변경", path: "/부산대표이사변경등기" },
  { compact: "부산법인해산청산", path: "/부산법인해산청산등기" },
];

const INHERITANCE_LEAK = [
  "/부산상속법무사",
  "/부산상속등기",
  "/전국상속등기",
  "/부산상속포기",
];

const CORPORATE_LEAK = [
  "/부산법인등기",
  "/부산법인설립등기",
  "/부산법인설립전문법무사",
  "/부산법인법무사",
];

const CAROUSEL_FENCES: { path: string; forbid: string[] }[] = [
  { path: "/", forbid: CORPORATE_LEAK },
  { path: "/부산법인등기", forbid: INHERITANCE_LEAK },
  { path: "/부산법인설립등기", forbid: INHERITANCE_LEAK },
  { path: "/부산법인설립전문법무사", forbid: INHERITANCE_LEAK },
  { path: "/부산법인법무사", forbid: INHERITANCE_LEAK },
  { path: "/법인설립등기비용", forbid: ["/부산법인등기비용", ...INHERITANCE_LEAK] },
  { path: "/부산법인해산청산등기", forbid: INHERITANCE_LEAK },
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
  const errors: string[] = [];

  console.log("kind\tquery\tchampion\tmapOwner\tcards\theading");
  for (const row of TARGETS) checkRow(map.queries, row, errors, true);
  for (const row of EXTRA_INFLOW) checkRow(map.queries, row, errors, false);

  for (const row of COMPACT_OWNERS) {
    const owner = getExactKeywordChampionPath(row.compact);
    if (owner !== row.path) {
      errors.push(`compact ${row.compact}: ${owner ?? "(none)"} ≠ ${row.path}`);
    }
  }

  for (const fence of CAROUSEL_FENCES) {
    const pack =
      fence.path === "/"
        ? { urls: [...HOME_SERP_CAROUSEL_URLS] }
        : getExplicitSerpCarouselPack(fence.path);
    const urls = pack?.urls ?? [];
    for (const forbidden of fence.forbid) {
      if (urls.includes(forbidden)) {
        errors.push(`${fence.path} carousel still includes ${forbidden}`);
      }
    }
  }

  const specialistKw = sanitizePageKeywords("/부산법인설립전문법무사", [
    "부산 법인설립",
    "부산 회사설립 법무사",
    "부산 법인설립 법무사",
  ]);
  if (specialistKw?.length) {
    errors.push(
      `/부산법인설립전문법무사 still keeps establishment keywords: ${specialistKw.join(", ")}`,
    );
  }

  const homeKw = sanitizePageKeywords("/", [
    "부산 법인설립",
    "부산 법인법무",
    "부산 법인등기 법무사",
  ]);
  if (homeKw?.length) {
    errors.push(`/ still keeps corporate spoke keywords: ${homeKw.join(", ")}`);
  }

  const selectionKw = sanitizePageKeywords("/부산법인등기전문", [
    "부산 법인등기 법무사",
  ]);
  if (selectionKw?.length) {
    errors.push(
      `/부산법인등기전문 still keeps hub keywords: ${selectionKw.join(", ")}`,
    );
  }

  if (getExactKeywordChampionPath("부산법인법무") === "/") {
    errors.push("compact 부산법인법무 must not belong to HOME");
  }

  for (const frozen of FROZEN_TITLES) {
    console.log(`frozen\t${frozen.path}\tmust start ${frozen.startsWith}`);
  }

  if (errors.length) {
    for (const error of errors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
  console.log(
    `\nOK ${TARGETS.length} target + ${EXTRA_INFLOW.length} inflow — champion uniqueness + ItemList 자격. 네이버 1위는 관측 항목.`,
  );
}

main();
