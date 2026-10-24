/**
 * 특강·강의 100개 + 유입 보조 검색어의 대표 URL·캐러셀 자격 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고, 그 URL HTML에 고유 이미지 카드 4장 이상이 붙을 수 있다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-lecture-100-query-serp-ready.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  LECTURE_100_TARGETS,
  LECTURE_EXTRA_INFLOW,
  LECTURE_SERP_CAROUSEL_URLS,
  compactLectureQuery,
} from "../src/data/seo/lecture-100-champions";
import { HOME_SERP_CAROUSEL_URLS } from "../src/data/seo/serp-carousel-packs";
import { isBusanDistrictHubPath } from "../src/lib/geo/busan-district-hubs";
import { getExactKeywordChampionPath } from "../src/lib/seo/champion-query";
import { isNoIndexPath } from "../src/lib/seo/index-policy";
import { getSerpCarouselPack } from "../src/lib/seo/serp-carousel-pack";

const ROOT = process.cwd();

type KeywordRow = {
  owner: string;
  aliasOf?: string;
};

const FORBIDDEN_CHAMPIONS = new Set([
  "/",
  "/부산상속법무사",
  "/부산상속포기",
  "/부산부동산등기전문법무사",
  "/부산상속전문법무사",
  "/상속",
  "/전국상속등기",
  "/상속포기비용",
  "/부산법인등기",
  "/부산법인설립전문법무사",
  "/부산법인설립등기",
  "/부산법률상담",
  "/해운대법무사",
  "/센텀법무사",
  "/부산등기법무사",
  "/부산공탁",
  "/부산임차권등기명령",
  "/개인회생파산",
  "/전세사기피해대응절차",
]);

function resolveOwner(
  map: Record<string, KeywordRow>,
  query: string,
): string {
  const row = map[query];
  if (!row) return "";
  if (row.aliasOf && map[row.aliasOf]) return map[row.aliasOf].owner;
  return row.owner;
}

function leaked(hrefs: string[]): string[] {
  return hrefs.filter(
    (href) =>
      HOME_SERP_CAROUSEL_URLS.includes(
        href as (typeof HOME_SERP_CAROUSEL_URLS)[number],
      ) ||
      isBusanDistrictHubPath(href) ||
      FORBIDDEN_CHAMPIONS.has(href) ||
      href.startsWith("/업무사례/"),
  );
}

function checkRow(
  map: Record<string, KeywordRow>,
  row: { query: string; champion: string },
  errors: string[],
  required: boolean,
) {
  if (FORBIDDEN_CHAMPIONS.has(row.champion)) {
    errors.push(`${row.query}: steals protected champion ${row.champion}`);
  }
  const mapOwner = resolveOwner(map, row.query) || "(unmapped)";
  if (mapOwner !== row.champion && mapOwner !== "(unmapped)") {
    errors.push(
      `${row.query}: keyword-map owner ${mapOwner} ≠ champion ${row.champion}`,
    );
  }
  if (mapOwner === "(unmapped)") {
    errors.push(`${row.query}: missing keyword-map row`);
  }
  const compactOwner = getExactKeywordChampionPath(row.query);
  if (compactOwner && compactOwner !== row.champion) {
    errors.push(
      `${row.query}: compact champion ${compactOwner} ≠ ${row.champion}`,
    );
  }
  if (isNoIndexPath(row.champion)) {
    errors.push(`${row.query}: champion ${row.champion} is noindex`);
  }
  const pack = getSerpCarouselPack(row.champion);
  const count = pack?.items.length ?? 0;
  const hrefs = pack?.items.map((item) => item.href) ?? [];
  const leak = leaked(hrefs);
  const tag = required ? "target" : "inflow";
  console.log(
    `${tag}\t${row.query}\t${row.champion}\t${mapOwner}\t${count}\t${pack?.heading ?? ""}`,
  );
  if (count < 4) {
    errors.push(`${row.query}: ${row.champion} carousel cards ${count} < 4`);
  }
  if (leak.length) {
    errors.push(
      `${row.query}: lecture pack leaked ${leak.join(",")}`,
    );
  }
}

function main() {
  if (LECTURE_100_TARGETS.length !== 100) {
    console.error(
      `[fail] LECTURE_100_TARGETS length ${LECTURE_100_TARGETS.length} ≠ 100`,
    );
    process.exit(1);
  }

  const seenQuery = new Set<string>();
  const seenCompact = new Map<string, string>();
  const errors: string[] = [];
  for (const row of LECTURE_100_TARGETS) {
    if (seenQuery.has(row.query)) {
      errors.push(`duplicate query ${row.query}`);
    }
    seenQuery.add(row.query);
    const compact = compactLectureQuery(row.query);
    const prev = seenCompact.get(compact);
    if (prev && prev !== row.champion) {
      errors.push(
        `compact ${compact} claimed by ${prev} and ${row.champion}`,
      );
    }
    seenCompact.set(compact, row.champion);
  }

  const map = JSON.parse(
    fs.readFileSync(path.join(ROOT, "seo/keyword-map.json"), "utf8"),
  ) as { queries: Record<string, KeywordRow> };

  console.log("kind\tquery\tchampion\tmapOwner\tcards\theading");
  for (const row of LECTURE_100_TARGETS) {
    checkRow(map.queries, row, errors, true);
  }
  for (const row of LECTURE_EXTRA_INFLOW) {
    checkRow(map.queries, row, errors, false);
  }

  if (LECTURE_SERP_CAROUSEL_URLS.length < 4) {
    errors.push("lecture carousel pool < 4");
  }

  if (errors.length) {
    for (const error of errors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
  console.log(
    `\nOK ${LECTURE_100_TARGETS.length} target + ${LECTURE_EXTRA_INFLOW.length} inflow — champion uniqueness + ItemList 자격. 네이버 1위는 관측 항목.`,
  );
}

main();
