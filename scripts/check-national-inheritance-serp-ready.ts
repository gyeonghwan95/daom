/**
 * 전국·절차 상속 검색어 — 대표 URL·캐러셀 분기·compact 소유 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고, 등기/포기/비용/셀프/서류/기간 팩이 갈래를 섞지 않으며,
 * 그 URL HTML에 고유 이미지 카드 4장 이상이 붙을 수 있다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-national-inheritance-serp-ready.ts
 */
import fs from "node:fs";
import path from "node:path";
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

const TARGETS: { query: string; champion: string }[] = [
  { query: "상속 법무사", champion: "/상속" },
  { query: "법무사 상속", champion: "/상속" },
  { query: "상속 법무사 추천", champion: "/상속" },
  { query: "상속등기 법무사", champion: "/전국상속등기" },
  { query: "상속포기 법무사", champion: "/부산상속포기" },
  { query: "상속 법무사 비용", champion: "/상속등기비용" },
  { query: "상속포기 법무사 비용", champion: "/상속포기비용" },
  { query: "주변 상속등기 법무사", champion: "/전국상속등기" },
  { query: "근처 상속등기 법무사", champion: "/전국상속등기" },
  { query: "저렴한 상속등기 법무사", champion: "/상속등기비용" },
  { query: "상속등기", champion: "/전국상속등기" },
  { query: "상속등기 셀프", champion: "/방문없이준비하는상속등기" },
  { query: "상속포기 셀프", champion: "/방문없이준비하는상속포기한정승인" },
  { query: "셀프 상속포기", champion: "/방문없이준비하는상속포기한정승인" },
  { query: "셀프 상속등기", champion: "/방문없이준비하는상속등기" },
  { query: "상속등기 서류", champion: "/상속등기필요서류" },
  { query: "상속등기 비용", champion: "/상속등기비용" },
  { query: "상속등기 절차", champion: "/상속등기기간" },
  { query: "상속등기 순서", champion: "/상속등기기간" },
  { query: "상속등기 기간", champion: "/상속등기기간" },
  { query: "상속하는법", champion: "/상속" },
];

const EXTRA_INFLOW: { query: string; champion: string }[] = [
  { query: "한정승인 법무사", champion: "/부산한정승인" },
  { query: "상속포기 서류", champion: "/상속포기필요서류" },
  { query: "상속등기 필요서류", champion: "/상속등기필요서류" },
  { query: "상속포기 기간", champion: "/상속포기기간" },
  { query: "한정승인 기간", champion: "/한정승인기간" },
  { query: "한정승인 서류", champion: "/한정승인필요서류" },
  { query: "상속등기 안하면", champion: "/situations/상속등기-지연-과태료" },
  { query: "부모님 사망 후", champion: "/부모님사망후해야할일" },
  { query: "상속포기 방법", champion: "/부산상속포기" },
];

const COMPACT_OWNERS: { compact: string; path: string }[] = [
  { compact: "상속하는법", path: "/상속" },
  { compact: "상속등기", path: "/전국상속등기" },
  { compact: "근처상속등기법무사", path: "/전국상속등기" },
  { compact: "주변상속등기법무사", path: "/전국상속등기" },
  { compact: "저렴한상속등기법무사", path: "/상속등기비용" },
  { compact: "상속등기셀프", path: "/방문없이준비하는상속등기" },
  { compact: "셀프상속등기", path: "/방문없이준비하는상속등기" },
  { compact: "상속포기셀프", path: "/방문없이준비하는상속포기한정승인" },
  { compact: "셀프상속포기", path: "/방문없이준비하는상속포기한정승인" },
  { compact: "상속등기서류", path: "/상속등기필요서류" },
  { compact: "상속등기기간", path: "/상속등기기간" },
  { compact: "상속등기절차", path: "/상속등기기간" },
  { compact: "상속등기순서", path: "/상속등기기간" },
  { compact: "한정승인법무사", path: "/부산한정승인" },
  { compact: "상속포기기간", path: "/상속포기기간" },
  { compact: "한정승인기간", path: "/한정승인기간" },
  { compact: "한정승인서류", path: "/한정승인필요서류" },
  { compact: "한정승인재산목록", path: "/한정승인필요서류" },
  { compact: "상속등기안하면", path: "/situations/상속등기-지연-과태료" },
  { compact: "부모님사망후", path: "/부모님사망후해야할일" },
  { compact: "상속포기3개월", path: "/부산상속포기" },
  { compact: "상속포기방법", path: "/부산상속포기" },
];

const CAROUSEL_FENCES: { path: string; forbid: string[] }[] = [
  { path: "/상속", forbid: ["/부산상속포기", "/상속등기비용"] },
  { path: "/전국상속등기", forbid: ["/부산상속포기", "/상속등기비용"] },
  { path: "/상속등기비용", forbid: ["/상속포기비용", "/부산상속포기"] },
  { path: "/상속포기비용", forbid: ["/상속등기비용"] },
  { path: "/부산상속포기", forbid: ["/상속포기비용", "/부산상속등기"] },
  { path: "/방문없이준비하는상속등기", forbid: ["/부산셀프등기", "/부산상속포기"] },
  { path: "/방문없이준비하는상속포기한정승인", forbid: ["/부산셀프등기"] },
  { path: "/상속포기기간", forbid: ["/상속등기기간", "/상속등기비용"] },
  { path: "/한정승인기간", forbid: ["/상속등기기간", "/상속포기기간"] },
  { path: "/한정승인필요서류", forbid: ["/상속등기필요서류"] },
];

const FROZEN_TITLES: { path: string; startsWith: string }[] = [
  { path: "/부산상속포기", startsWith: "부산 상속포기 법무사" },
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

  const diyKw = sanitizePageKeywords("/부산셀프등기", [
    "상속등기 셀프",
    "셀프 상속등기",
    "상속포기 셀프",
  ]);
  if (diyKw?.length) {
    errors.push(`/부산셀프등기 still keeps DIY keywords: ${diyKw.join(", ")}`);
  }

  const nearbyKw = sanitizePageKeywords("/부동산과거주지가다른상속등기", [
    "근처 상속등기 법무사",
    "주변 상속등기 법무사",
    "상속등기 법무사",
  ]);
  if (nearbyKw?.length) {
    errors.push(
      `/부동산과거주지가다른상속등기 still keeps nationwide keywords: ${nearbyKw.join(", ")}`,
    );
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
