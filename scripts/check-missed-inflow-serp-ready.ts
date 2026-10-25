/**
 * 오늘 상속·법인 작업에서 빠진 유입 검색어 — 대표 URL·캐러셀·compact 소유 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고, 갈래를 섞지 않으며 카드 4장 이상이다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-missed-inflow-serp-ready.ts
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
  { query: "상속포기 기간", champion: "/상속포기기간" },
  { query: "한정승인 기간", champion: "/한정승인기간" },
  { query: "한정승인 서류", champion: "/한정승인필요서류" },
  { query: "한정승인 재산목록", champion: "/한정승인필요서류" },
  { query: "상속포기 3개월", champion: "/부산상속포기" },
  { query: "상속포기 방법", champion: "/부산상속포기" },
  { query: "상속등기 안하면", champion: "/situations/상속등기-지연-과태료" },
  { query: "부모님 사망 후", champion: "/부모님사망후해야할일" },
  { query: "1인 법인", champion: "/부산법인설립등기" },
  { query: "부산 법인설립 비용", champion: "/법인설립등기비용" },
  { query: "부산 대표이사 변경", champion: "/부산대표이사변경등기" },
  { query: "부산 해산청산 법무사", champion: "/부산법인해산청산등기" },
];

const COMPACT_OWNERS: { compact: string; path: string }[] = [
  { compact: "상속포기기간", path: "/상속포기기간" },
  { compact: "한정승인기간", path: "/한정승인기간" },
  { compact: "한정승인서류", path: "/한정승인필요서류" },
  { compact: "한정승인재산목록", path: "/한정승인필요서류" },
  { compact: "상속포기3개월", path: "/부산상속포기" },
  { compact: "상속포기방법", path: "/부산상속포기" },
  { compact: "상속등기안하면", path: "/situations/상속등기-지연-과태료" },
  { compact: "부모님사망후", path: "/부모님사망후해야할일" },
  { compact: "1인법인", path: "/부산법인설립등기" },
  { compact: "부산법인설립비용", path: "/법인설립등기비용" },
  { compact: "부산대표이사변경", path: "/부산대표이사변경등기" },
  { compact: "부산법인해산청산", path: "/부산법인해산청산등기" },
];

const CAROUSEL_FENCES: { path: string; forbid: string[] }[] = [
  { path: "/상속포기기간", forbid: ["/상속등기기간"] },
  { path: "/한정승인기간", forbid: ["/상속등기기간"] },
  { path: "/한정승인필요서류", forbid: ["/상속등기필요서류"] },
  { path: "/법인설립등기비용", forbid: ["/부산법인등기비용"] },
  { path: "/부모님사망후해야할일", forbid: ["/방문없이준비하는상속등기"] },
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
) {
  const mapOwner = resolveOwner(map, row.query) || "(unmapped)";
  if (mapOwner !== row.champion && mapOwner !== "(unmapped)") {
    errors.push(
      `${row.query}: keyword-map owner ${mapOwner} ≠ champion ${row.champion}`,
    );
  }
  if (mapOwner === "(unmapped)") {
    errors.push(`${row.query}: missing keyword-map owner`);
  }
  if (isNoIndexPath(row.champion)) {
    errors.push(`${row.query}: champion ${row.champion} is noindex`);
  }
  const pack = getSerpCarouselPack(row.champion);
  const count = pack?.items.length ?? 0;
  console.log(
    `target\t${row.query}\t${row.champion}\t${mapOwner}\t${count}\t${pack?.heading ?? ""}`,
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
  for (const row of TARGETS) checkRow(map.queries, row, errors);

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

  if (getExactKeywordChampionPath("상속하는법") !== "/상속") {
    errors.push("상속하는법 must stay on /상속");
  }

  const blogKw = sanitizePageKeywords(
    "/blog/one-person-company-establishment-checklist",
    ["1인 법인", "1인 법인설립"],
  );
  if (blogKw?.length) {
    errors.push(`blog still keeps 1인 법인 keywords: ${blogKw.join(", ")}`);
  }

  const costKw = sanitizePageKeywords("/부산법인등기비용", [
    "부산 법인설립 비용",
  ]);
  if (costKw?.length) {
    errors.push(`/부산법인등기비용 still keeps 설립 비용: ${costKw.join(", ")}`);
  }

  if (errors.length) {
    for (const error of errors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
  console.log(
    `\nOK ${TARGETS.length} missed-inflow — champion uniqueness + ItemList 자격. 네이버 1위는 관측 항목.`,
  );
}

main();
