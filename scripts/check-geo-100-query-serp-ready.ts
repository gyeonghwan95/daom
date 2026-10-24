/**
 * 부산 지역키워드+법무사 100개 + 놓친 유입 검색어의 대표 URL·캐러셀 자격 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고, 그 URL HTML에 고유 이미지 카드 4장 이상이 붙을 수 있다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-geo-100-query-serp-ready.ts
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

/** 검색이 잘 될 가능성이 큰 순. 기존 URL만. 신규 랜딩 없음. */
const TARGETS: { query: string; champion: string }[] = [
  { query: "해운대 법무사", champion: "/해운대법무사" },
  { query: "센텀 법무사", champion: "/센텀법무사" },
  { query: "서면 법무사", champion: "/서면법무사" },
  { query: "해운대구 법무사", champion: "/해운대법무사" },
  { query: "센텀시티 법무사", champion: "/센텀법무사" },
  { query: "부산진구 법무사", champion: "/부산진구법무사" },
  { query: "연제구 법무사", champion: "/연제구법무사" },
  { query: "동래구 법무사", champion: "/동래구법무사" },
  { query: "수영구 법무사", champion: "/수영구법무사" },
  { query: "광안리 법무사", champion: "/광안리법무사" },
  { query: "사상구 법무사", champion: "/사상구법무사" },
  { query: "기장 법무사", champion: "/기장군법무사" },
  { query: "기장군 법무사", champion: "/기장군법무사" },
  { query: "정관 법무사", champion: "/정관법무사" },
  { query: "명지 법무사", champion: "/명지법무사" },
  { query: "사하구 법무사", champion: "/사하구법무사" },
  { query: "하단 법무사", champion: "/하단법무사" },
  { query: "금정구 법무사", champion: "/금정구법무사" },
  { query: "북구 법무사", champion: "/북구법무사" },
  { query: "남구 법무사", champion: "/남구법무사" },
  { query: "강서구 법무사", champion: "/강서구법무사" },
  { query: "중구 법무사", champion: "/중구법무사" },
  { query: "동구 법무사", champion: "/동구법무사" },
  { query: "영도구 법무사", champion: "/영도구법무사" },
  { query: "서구 법무사", champion: "/서구법무사" },
  { query: "부산 해운대 법무사", champion: "/해운대법무사" },
  { query: "재송동 법무사", champion: "/재송동법무사" },
  { query: "연산동 법무사", champion: "/연산동법무사" },
  { query: "부산역 법무사", champion: "/부산역법무사" },
  { query: "광안동 법무사", champion: "/광안동법무사" },
  { query: "민락동 법무사", champion: "/민락동법무사" },
  { query: "전포동 법무사", champion: "/전포동법무사" },
  { query: "부전동 법무사", champion: "/부전동법무사" },
  { query: "대연동 법무사", champion: "/대연동법무사" },
  { query: "화명동 법무사", champion: "/화명동법무사" },
  { query: "덕천동 법무사", champion: "/덕천동법무사" },
  { query: "우동 법무사", champion: "/우동법무사" },
  { query: "좌동 법무사", champion: "/좌동법무사" },
  { query: "중동 법무사", champion: "/중동법무사" },
  { query: "사상 법무사", champion: "/사상법무사" },
  { query: "거제동 법무사", champion: "/거제동법무사" },
  { query: "반여동 법무사", champion: "/반여동법무사" },
  { query: "남천동 법무사", champion: "/남천동법무사" },
  { query: "온천동 법무사", champion: "/온천동법무사" },
  { query: "사직동 법무사", champion: "/사직동법무사" },
  { query: "용호동 법무사", champion: "/용호동법무사" },
  { query: "문현동 법무사", champion: "/문현동법무사" },
  { query: "구포동 법무사", champion: "/구포동법무사" },
  { query: "하단동 법무사", champion: "/하단법무사" },
  { query: "괴정동 법무사", champion: "/괴정동법무사" },
  { query: "다대동 법무사", champion: "/다대동법무사" },
  { query: "초량동 법무사", champion: "/초량동법무사" },
  { query: "범일동 법무사", champion: "/범일동법무사" },
  { query: "남포동 법무사", champion: "/남포동법무사" },
  { query: "동래역 법무사", champion: "/동래역법무사" },
  { query: "정관읍 법무사", champion: "/정관법무사" },
  { query: "일광읍 법무사", champion: "/일광읍법무사" },
  { query: "기장읍 법무사", champion: "/기장읍법무사" },
  { query: "오시리아 법무사", champion: "/오시리아법무사" },
  { query: "양정동 법무사", champion: "/양정동법무사" },
  { query: "장전동 법무사", champion: "/장전동법무사" },
  { query: "개금동 법무사", champion: "/개금동법무사" },
  { query: "안락동 법무사", champion: "/안락동법무사" },
  { query: "구서동 법무사", champion: "/구서동법무사" },
  { query: "부곡동 법무사", champion: "/부곡동법무사" },
  { query: "반송동 법무사", champion: "/반송동법무사" },
  { query: "주례동 법무사", champion: "/주례동법무사" },
  { query: "연지동 법무사", champion: "/연지동법무사" },
  { query: "동삼동 법무사", champion: "/동삼동법무사" },
  { query: "우암동 법무사", champion: "/우암동법무사" },
  { query: "망미동 법무사", champion: "/망미동법무사" },
  { query: "민락 법무사", champion: "/민락동법무사" },
  { query: "양정 법무사", champion: "/양정동법무사" },
  { query: "연산 법무사", champion: "/연산동법무사" },
  { query: "부전 법무사", champion: "/부전동법무사" },
  { query: "전포 법무사", champion: "/전포동법무사" },
  { query: "대연 법무사", champion: "/대연동법무사" },
  { query: "화명 법무사", champion: "/화명동법무사" },
  { query: "덕천 법무사", champion: "/덕천동법무사" },
  { query: "광안 법무사", champion: "/광안동법무사" },
  { query: "장산 법무사", champion: "/좌동법무사" },
  { query: "장산역 법무사", champion: "/좌동법무사" },
  { query: "양정역 법무사", champion: "/양정동법무사" },
  { query: "민락역 법무사", champion: "/민락동법무사" },
  { query: "전포역 법무사", champion: "/전포동법무사" },
  { query: "복산동 법무사", champion: "/동래구법무사" },
  { query: "명륜동 법무사", champion: "/동래구법무사" },
  { query: "부산진 법무사", champion: "/부산진구법무사" },
  { query: "부산 연제구 법무사", champion: "/연제구법무사" },
  { query: "부산 동래구 법무사", champion: "/동래구법무사" },
  { query: "부산 수영구 법무사", champion: "/수영구법무사" },
  { query: "부산 사상구 법무사", champion: "/사상구법무사" },
  { query: "부산 기장군 법무사", champion: "/기장군법무사" },
  { query: "부산 남구 법무사", champion: "/남구법무사" },
  { query: "부산 북구 법무사", champion: "/북구법무사" },
  { query: "부산 금정구 법무사", champion: "/금정구법무사" },
  { query: "부산 사하구 법무사", champion: "/사하구법무사" },
  { query: "부산 강서구 법무사", champion: "/강서구법무사" },
  { query: "에코델타시티 법무사", champion: "/명지법무사" },
  { query: "장전 법무사", champion: "/장전동법무사" },
];

/** 목록에 없었지만 상담 유입이 큰 기존 URL. 신규 랜딩을 만들지 않는다. */
const EXTRA_INFLOW: { query: string; champion: string }[] = [
  { query: "부산 법무사 추천", champion: "/부산법무사추천" },
  { query: "부산 등기 법무사", champion: "/부산등기법무사" },
  { query: "부산 상속등기 법무사", champion: "/부산상속등기" },
  { query: "부산 법인설립 법무사", champion: "/부산법인설립등기" },
  { query: "부산 한정승인 법무사", champion: "/부산한정승인" },
  { query: "부산 회사 법무사", champion: "/부산법인법무사" },
  { query: "부산 부동산 법무사", champion: "/부산부동산등기" },
  { query: "금정 법무사", champion: "/금정구법무사" },
  { query: "부산 해운대구 법무사", champion: "/해운대법무사" },
  { query: "명지동 법무사", champion: "/명지동법무사" },
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
  if (TARGETS.length !== 100) {
    console.error(`[fail] TARGETS length ${TARGETS.length} ≠ 100`);
    process.exit(1);
  }
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
