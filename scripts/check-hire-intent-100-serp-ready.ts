/**
 * 법무사 수임 유입 100+ — 대표 URL·캐러셀·compact 소유 검사.
 * 성공 정의: 각 검색어의 대표 URL이 고유하고 카드 4장 이상이다.
 * 네이버 통합검색 1위는 배포·수집 후 관측한다. 이 스크립트는 순위를 추정·보장하지 않는다.
 *
 * Usage: npx --yes tsx scripts/check-hire-intent-100-serp-ready.ts
 */
import fs from "node:fs";
import path from "node:path";
import { HIRE_INTENT_100_TARGETS } from "../src/data/seo/hire-intent-100-champions";
import { getExactKeywordChampionPath } from "../src/lib/seo/champion-query";
import { isNoIndexPath } from "../src/lib/seo/index-policy";
import { getSerpCarouselPack } from "../src/lib/seo/serp-carousel-pack";

const ROOT = process.cwd();

type KeywordRow = {
  owner: string;
  aliasOf?: string;
};

function compactQuery(value: string): string {
  return value.replace(/\s+/g, "");
}

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

  if (HIRE_INTENT_100_TARGETS.length < 100) {
    errors.push(`targets ${HIRE_INTENT_100_TARGETS.length} < 100`);
  }

  console.log("kind\tquery\tchampion\tmapOwner\tcards\theading");
  const seenCompact = new Map<string, string>();

  for (const row of HIRE_INTENT_100_TARGETS) {
    const mapOwner = resolveOwner(map.queries, row.query) || "(unmapped)";
    if (mapOwner === "(unmapped)") {
      errors.push(`${row.query}: missing keyword-map owner`);
    } else if (mapOwner !== row.champion) {
      errors.push(
        `${row.query}: keyword-map owner ${mapOwner} ≠ champion ${row.champion}`,
      );
    }
    if (isNoIndexPath(row.champion)) {
      errors.push(`${row.query}: champion ${row.champion} is noindex`);
    }
    const compact = compactQuery(row.query);
    const exact = getExactKeywordChampionPath(compact);
    if (exact !== row.champion) {
      errors.push(
        `compact ${compact}: ${exact ?? "(none)"} ≠ ${row.champion}`,
      );
    }
    const prev = seenCompact.get(compact);
    if (prev && prev !== row.champion) {
      errors.push(`compact ${compact} split ${prev} vs ${row.champion}`);
    }
    seenCompact.set(compact, row.champion);

    const pack = getSerpCarouselPack(row.champion);
    const count = pack?.items.length ?? 0;
    console.log(
      `target\t${row.query}\t${row.champion}\t${mapOwner}\t${count}\t${pack?.heading ?? ""}`,
    );
    if (count < 4) {
      errors.push(`${row.query}: ${row.champion} carousel cards ${count} < 4`);
    }
  }

  if (getExactKeywordChampionPath("부산법무사") !== "/") {
    errors.push("부산 법무사 must stay on HOME");
  }
  if (getExactKeywordChampionPath("상속하는법") !== "/상속") {
    errors.push("상속하는법 must stay on /상속");
  }
  if (getExactKeywordChampionPath("부산법인설립법무사") !== "/부산법인설립등기") {
    errors.push("부산 법인설립 법무사 must stay on /부산법인설립등기");
  }

  if (errors.length) {
    for (const error of errors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
  console.log(
    `\nOK ${HIRE_INTENT_100_TARGETS.length} hire-intent — champion uniqueness + ItemList 자격. 네이버 1위는 관측 항목.`,
  );
}

main();
