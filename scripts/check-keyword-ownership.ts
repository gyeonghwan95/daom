/**
 * PRIMARY QUERY ownership — 동일 검색어를 두 개 이상 indexable URL이 소유하면 FAIL.
 * Usage: npx --yes tsx scripts/check-keyword-ownership.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import {
  HOME_H1,
  HOME_METADATA_TITLE,
} from "../src/lib/seo/metadata";
import { staticPageSeo } from "../src/lib/seo/page-seo";
import { isNoIndexPath } from "../src/lib/seo/index-policy";

const ROOT = process.cwd();
const MAP_PATH = path.join(ROOT, "seo/keyword-map.json");

type KeywordRow = {
  owner: string;
  intent?: string;
  aliasOf?: string;
  supporting?: string[];
};

type KeywordMap = {
  queries: Record<string, KeywordRow>;
};

type PageSignal = {
  path: string;
  title: string;
  h1: string;
};

function compact(value: string): string {
  return value.replace(/\s+/g, "");
}

function titlePrimary(title: string): string {
  return title.split("|")[0]?.split("｜")[0]?.trim() ?? title.trim();
}

function loadMap(): KeywordMap {
  return JSON.parse(fs.readFileSync(MAP_PATH, "utf8")) as KeywordMap;
}

function resolveOwner(map: KeywordMap, query: string): string {
  const row = map.queries[query];
  if (!row) return "";
  if (row.aliasOf && map.queries[row.aliasOf]) {
    return map.queries[row.aliasOf].owner;
  }
  return row.owner;
}

function collectPages(): PageSignal[] {
  const pages: PageSignal[] = [
    { path: "/", title: HOME_METADATA_TITLE, h1: HOME_H1 },
  ];

  for (const page of Object.values(staticPageSeo)) {
    pages.push({
      path: page.path,
      title: page.title,
      h1: page.title.split("|")[0]?.trim() ?? page.title,
    });
  }

  for (const page of getAllPageData()) {
    pages.push({
      path: page.path,
      title: page.metaTitle || page.title,
      h1: page.h1,
    });
  }

  const seen = new Set<string>();
  return pages.filter((page) => {
    if (seen.has(page.path)) return false;
    seen.add(page.path);
    return isIndexablePagePath(page.path) && !isNoIndexPath(page.path);
  });
}

function matchQuery(text: string, queries: string[]): string | null {
  const primary = compact(titlePrimary(text));
  for (const query of queries) {
    const compactQuery = compact(query);
    if (!primary.startsWith(compactQuery)) continue;
    const rest = primary.slice(compactQuery.length);
    if (rest.length === 0) return query;
    if (/^(안윤정|다옴법무사사무소)/.test(rest)) return query;
    if (/^[·,，、|｜—\-–]/.test(rest)) return query;
  }
  return null;
}

function main() {
  const map = loadMap();
  const queries = Object.keys(map.queries).sort(
    (a, b) => compact(b).length - compact(a).length,
  );
  const pages = collectPages();
  const claimed = new Map<string, string[]>();
  const errors: string[] = [];

  for (const page of pages) {
    const matched =
      matchQuery(page.title, queries) ?? matchQuery(page.h1, queries);
    if (!matched) continue;
    const owner = resolveOwner(map, matched);
    const canonicalQuery = map.queries[matched]?.aliasOf ?? matched;
    const list = claimed.get(canonicalQuery) ?? [];
    if (!list.includes(page.path)) list.push(page.path);
    claimed.set(canonicalQuery, list);

    if (page.path !== owner) {
      errors.push(
        `${matched}: ${page.path} title/H1이 PRIMARY를 소유함 (owner=${owner}) — "${titlePrimary(page.title)}" / "${page.h1}"`,
      );
    }
  }

  for (const [query, row] of Object.entries(map.queries)) {
    if (row.aliasOf) continue;
    if (!row.owner || (!row.owner.startsWith("/") && row.owner !== "/")) {
      errors.push(`${query}: owner URL 없음`);
    }
  }

  const busan = resolveOwner(map, "부산 법무사");
  if (busan !== "/") {
    errors.push("부산 법무사 owner가 HOME `/`가 아님");
  }

  console.log("=== Keyword ownership ===");
  console.log(`queries: ${Object.keys(map.queries).length}`);
  console.log(`indexable pages scanned: ${pages.length}`);
  for (const [query, paths] of claimed) {
    console.log(`  ${query} → ${paths.join(", ")}`);
  }

  if (errors.length) {
    for (const error of errors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
  console.log("OK — no PRIMARY query owned by two indexable URLs.");
}

main();
