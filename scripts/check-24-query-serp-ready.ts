/**
 * 24개 목표 검색어의 대표 URL·캐러셀 자격 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고, 그 URL HTML에 고유 이미지 카드 4장 이상이 붙을 수 있다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-24-query-serp-ready.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getSerpCarouselPack } from "../src/lib/seo/serp-carousel-pack";
import { isNoIndexPath } from "../src/lib/seo/index-policy";

const ROOT = process.cwd();

type KeywordRow = {
  owner: string;
  aliasOf?: string;
};

const TARGETS: { query: string; champion: string }[] = [
  { query: "부산 법무사", champion: "/" },
  { query: "부산 법무사 상담", champion: "/부산법무사상담" },
  { query: "부산 법무사 사무소", champion: "/" },
  { query: "부산 상속", champion: "/부산상속법무사" },
  { query: "부산 상속 법무사", champion: "/부산상속법무사" },
  { query: "부산 법무사 상속", champion: "/부산상속법무사" },
  { query: "부산 상속포기 법무사", champion: "/부산상속포기" },
  { query: "부산 등기전문 법무사", champion: "/부산부동산등기전문법무사" },
  { query: "부산 상속전문 법무사", champion: "/부산상속전문법무사" },
  { query: "상속 법무사", champion: "/상속" },
  { query: "법무사 상속", champion: "/상속" },
  { query: "상속 법무사 추천", champion: "/상속" },
  { query: "상속등기 법무사", champion: "/전국상속등기" },
  { query: "상속포기 법무사", champion: "/부산상속포기" },
  { query: "상속포기 법무사 비용", champion: "/상속포기비용" },
  { query: "상속포기 법무사 수수료", champion: "/상속포기비용" },
  { query: "상속포기 법무사 보수", champion: "/상속포기비용" },
  { query: "상속 법무사 보수", champion: "/상속등기비용" },
  { query: "부산 법인등기 법무사", champion: "/부산법인등기" },
  { query: "부산 법인전문 법무사", champion: "/부산법인설립전문법무사" },
  { query: "부산 법인 법무사", champion: "/" },
  { query: "부산 법인설립 법무사", champion: "/부산법인설립등기" },
  { query: "부산법률상담", champion: "/부산법률상담" },
  { query: "부산 회사 법무사", champion: "/부산법인법무사" },
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

function main() {
  const map = JSON.parse(
    fs.readFileSync(path.join(ROOT, "seo/keyword-map.json"), "utf8"),
  ) as { queries: Record<string, KeywordRow> };
  const errors: string[] = [];

  console.log("query\tchampion\tmapOwner\tcards\theading");
  for (const row of TARGETS) {
    const mapOwner = resolveOwner(map.queries, row.query) || "(unmapped)";
    if (mapOwner !== row.champion && mapOwner !== "(unmapped)") {
      errors.push(
        `${row.query}: keyword-map owner ${mapOwner} ≠ champion ${row.champion}`,
      );
    }
    if (isNoIndexPath(row.champion)) {
      errors.push(`${row.query}: champion ${row.champion} is noindex`);
    }
    const pack = getSerpCarouselPack(row.champion);
    const count = pack?.items.length ?? 0;
    console.log(
      `${row.query}\t${row.champion}\t${mapOwner}\t${count}\t${pack?.heading ?? ""}`,
    );
    if (count < 4) {
      errors.push(`${row.query}: ${row.champion} carousel cards ${count} < 4`);
    }
  }

  if (errors.length) {
    for (const error of errors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
  console.log(
    `\nOK ${TARGETS.length} queries — champion uniqueness + ItemList 자격. 네이버 1위는 관측 항목.`,
  );
}

main();
