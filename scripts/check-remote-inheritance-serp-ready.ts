/**
 * 타지역키워드+상속+법무사 대표 URL·캐러셀 자격 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고, 그 URL HTML에 고유 이미지 카드 4장 이상이 붙을 수 있다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-remote-inheritance-serp-ready.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getExactKeywordChampionPath } from "../src/lib/seo/champion-query";
import { getSerpCarouselPack } from "../src/lib/seo/serp-carousel-pack";
import { isNoIndexPath } from "../src/lib/seo/index-policy";

const ROOT = process.cwd();

type KeywordRow = {
  owner: string;
  aliasOf?: string;
};

const TARGETS: { query: string; champion: string }[] = [
  { query: "서울 상속 법무사", champion: "/업무사례/서울상속등기법무사" },
  { query: "인천 상속 법무사", champion: "/업무사례/인천상속등기법무사" },
  { query: "수원 상속 법무사", champion: "/업무사례/수원상속등기법무사" },
  { query: "대구 상속 법무사", champion: "/업무사례/대구상속등기법무사" },
  { query: "대전 상속 법무사", champion: "/업무사례/대전상속등기법무사" },
  { query: "울산 상속 법무사", champion: "/업무사례/울산상속등기법무사" },
  { query: "세종 상속 법무사", champion: "/업무사례/세종상속등기법무사" },
  { query: "광주 상속 법무사", champion: "/업무사례/광주상속등기법무사" },
  { query: "창원 상속 법무사", champion: "/업무사례/창원상속등기법무사" },
  { query: "김해 상속 법무사", champion: "/업무사례/김해상속등기법무사" },
  { query: "청주 상속 법무사", champion: "/업무사례/청주상속등기법무사" },
  { query: "천안 상속 법무사", champion: "/업무사례/천안상속등기법무사" },
  { query: "포항 상속 법무사", champion: "/업무사례/포항상속등기법무사" },
  { query: "용인 상속 법무사", champion: "/업무사례/용인상속등기법무사" },
  { query: "양산 상속 법무사", champion: "/업무사례/양산상속등기법무사" },
  { query: "거제 상속 법무사", champion: "/업무사례/거제상속등기법무사" },
  { query: "진주 상속 법무사", champion: "/업무사례/진주상속등기법무사" },
  { query: "경산 상속 법무사", champion: "/업무사례/경산상속등기법무사" },
  { query: "구미 상속 법무사", champion: "/업무사례/구미상속등기법무사" },
  { query: "경주 상속 법무사", champion: "/업무사례/경주상속등기법무사" },
  { query: "전주 상속 법무사", champion: "/업무사례/전주상속등기법무사" },
  { query: "원주 상속 법무사", champion: "/업무사례/원주상속등기법무사" },
  { query: "제주 상속 법무사", champion: "/업무사례/제주상속등기법무사" },
  { query: "경기 상속 법무사", champion: "/업무사례/경기상속등기법무사" },
  { query: "경남 상속 법무사", champion: "/업무사례/경남상속등기법무사" },
  { query: "충남 상속 법무사", champion: "/업무사례/충남상속등기법무사" },
  { query: "충북 상속 법무사", champion: "/업무사례/충북상속등기법무사" },
  { query: "전남 상속 법무사", champion: "/업무사례/전남상속등기법무사" },
  { query: "전북 상속 법무사", champion: "/업무사례/전북상속등기법무사" },
  { query: "경북 상속 법무사", champion: "/업무사례/경북상속등기법무사" },
  { query: "강원 상속 법무사", champion: "/업무사례/강원상속등기법무사" },
  { query: "성남 상속 법무사", champion: "/업무사례/성남상속등기법무사" },
  { query: "고양 상속 법무사", champion: "/업무사례/고양상속등기법무사" },
  { query: "송도 상속 법무사", champion: "/업무사례/송도상속등기법무사" },
  { query: "밀양 상속 법무사", champion: "/업무사례/밀양상속등기법무사" },
  { query: "통영 상속 법무사", champion: "/업무사례/통영상속등기법무사" },
];

const EXTRA_INFLOW: { query: string; champion: string }[] = [
  { query: "서울 상속등기 법무사", champion: "/업무사례/서울상속등기법무사" },
  { query: "울산 상속등기 법무사", champion: "/업무사례/울산상속등기법무사" },
  { query: "창원 상속등기 법무사", champion: "/업무사례/창원상속등기법무사" },
  { query: "김해 상속등기 법무사", champion: "/업무사례/김해상속등기법무사" },
  { query: "양산 상속등기 법무사", champion: "/업무사례/양산상속등기법무사" },
  { query: "울산 동구 상속 법무사", champion: "/업무사례/울산동구상속등기법무사" },
  { query: "울산 남구 상속 법무사", champion: "/업무사례/울산남구상속등기법무사" },
  { query: "강남구 상속 법무사", champion: "/업무사례/강남구상속등기법무사" },
  { query: "남동구 상속 법무사", champion: "/업무사례/남동구상속등기법무사" },
  { query: "경기 광주 상속 법무사", champion: "/업무사례/경기광주상속등기법무사" },
  { query: "제주시 상속 법무사", champion: "/업무사례/제주시상속등기법무사" },
  { query: "거제시 상속 법무사", champion: "/업무사례/거제상속등기법무사" },
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
  if (mapOwner === "(unmapped)") {
    errors.push(`${row.query}: missing keyword-map row`);
  }
  const exact = getExactKeywordChampionPath(row.query);
  if (exact !== row.champion) {
    errors.push(
      `${row.query}: compact champion ${exact ?? "(none)"} ≠ ${row.champion}`,
    );
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
  const geoLeak = pack?.items.some(
    (item) =>
      item.href !== "/" &&
      !item.href.startsWith("/업무사례/") &&
      /구법무사$|군법무사$/.test(item.href),
  );
  if (geoLeak) {
    errors.push(`${row.query}: ${row.champion} carousel includes Busan 구·군 카드`);
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

  if (errors.length) {
    for (const error of errors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
  console.log(
    `\nOK ${TARGETS.length} target + ${EXTRA_INFLOW.length} inflow — champion uniqueness + ItemList 자격. 네이버 1위는 관측 항목.`,
  );
}

main();
