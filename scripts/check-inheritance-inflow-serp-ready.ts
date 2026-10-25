/**
 * 부산 상속 수임 검색어 — 대표 URL·캐러셀 분기·compact 소유 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고, 허브·전문·등기 팩이 포기 페이지를 가로채지 않으며,
 * 그 URL HTML에 고유 이미지 카드 4장 이상이 붙을 수 있다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-inheritance-inflow-serp-ready.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getSerpCarouselPack } from "../src/lib/seo/serp-carousel-pack";
import {
  getExactKeywordChampionPath,
  sanitizePageKeywords,
} from "../src/lib/seo/champion-query";
import { isNoIndexPath } from "../src/lib/seo/index-policy";
import { getExplicitSerpCarouselPack } from "../src/data/seo/serp-carousel-packs";

const ROOT = process.cwd();

type KeywordRow = {
  owner: string;
  aliasOf?: string;
};

const TARGETS: { query: string; champion: string }[] = [
  { query: "부산 상속포기 법무사", champion: "/부산상속포기" },
  { query: "부산 상속전문 법무사", champion: "/부산상속전문법무사" },
  { query: "부산 법무사 상속", champion: "/부산상속법무사" },
  { query: "부산 상속", champion: "/부산상속법무사" },
  { query: "부산 상속 법무사", champion: "/부산상속법무사" },
];

const EXTRA_INFLOW: { query: string; champion: string }[] = [
  { query: "부산 한정승인 법무사", champion: "/부산한정승인" },
  { query: "부산 상속등기 법무사", champion: "/부산상속등기" },
  { query: "부산 상속 상담", champion: "/부산상속법무사" },
  { query: "부산 상속 절차", champion: "/부산상속법무사" },
  { query: "부산 상속 법무사 추천", champion: "/부산상속법무사추천" },
  { query: "부산 상속 법무사 선택", champion: "/부산상속전문법무사" },
  { query: "부산 상속포기 비용", champion: "/상속포기비용" },
  { query: "부산 한정승인 비용", champion: "/한정승인비용" },
  { query: "부산 상속 비용", champion: "/상속등기비용" },
  { query: "부산 상속 명의이전", champion: "/부산상속등기" },
  { query: "부산 상속포기 3개월", champion: "/부산상속포기" },
  { query: "부산 상속포기 후순위", champion: "/부산상속포기" },
];

const COMPACT_OWNERS: { compact: string; path: string }[] = [
  { compact: "부산상속포기", path: "/부산상속포기" },
  { compact: "부산한정승인", path: "/부산한정승인" },
  { compact: "부산상속상담", path: "/부산상속법무사" },
  { compact: "부산상속절차", path: "/부산상속법무사" },
  { compact: "부산상속비용", path: "/상속등기비용" },
  { compact: "부산상속법무사선택", path: "/부산상속전문법무사" },
  { compact: "부산상속재산분할법무사", path: "/부산상속재산분할법무사" },
];

const CAROUSEL_FENCES: {
  path: string;
  forbid: string[];
}[] = [
  { path: "/부산상속법무사", forbid: ["/부산상속포기", "/부산한정승인"] },
  { path: "/부산상속전문법무사", forbid: ["/부산상속포기"] },
  { path: "/부산상속등기", forbid: ["/부산상속포기"] },
  { path: "/상속", forbid: ["/부산상속포기"] },
  { path: "/부산상속포기", forbid: ["/부산상속법무사", "/부산상속등기"] },
  { path: "/부산한정승인", forbid: ["/상속포기비용"] },
  { path: "/부산상속재산분할법무사", forbid: ["/부산상속포기"] },
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
    const pack = getExplicitSerpCarouselPack(fence.path);
    const urls = pack?.urls ?? [];
    for (const forbidden of fence.forbid) {
      if (urls.includes(forbidden)) {
        errors.push(`${fence.path} carousel still includes ${forbidden}`);
      }
    }
  }

  const splitKw = sanitizePageKeywords("/부산상속재산분할법무사", [
    "부산 상속",
    "부산 상속 법무사",
    "부산 법무사 상속",
    "부산 상속포기 법무사",
  ]);
  if (splitKw?.length) {
    errors.push(
      `재산분할 still keeps hub/포기 exact keywords: ${splitKw.join(", ")}`,
    );
  }

  const districtKw = sanitizePageKeywords("/부산진구한정승인", [
    "부산 한정승인 법무사",
    "부산 한정승인",
  ]);
  if (districtKw?.length) {
    errors.push(
      `부산진구한정승인 still keeps city-wide 한정 keywords: ${districtKw.join(", ")}`,
    );
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
