import { getAllPublishedPaths } from "./published-paths.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function nonIndexableCaseRegionSlugs() {
  const slugs = new Set();
  const dir = path.join(ROOT, "src/lib/case-regions");
  if (!fs.existsSync(dir)) return slugs;

  const districts = fs.readFileSync(path.join(dir, "districts.ts"), "utf8");
  for (const block of districts.matchAll(/adminDongs:\s*\[([\s\S]*?)\]/g)) {
    for (const name of block[1].matchAll(/"([^"]+)"/g)) {
      slugs.add(`부산${name[1]}법무사`);
    }
  }

  for (const file of ["living-areas.ts", "industrial.ts", "courts.ts"]) {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    // 객체 단위로 분리해 indexable:false / canonical 별칭만 수집 (교차 매칭 방지)
    for (const chunk of text.split(/\},\s*\{/)) {
      const slugMatch = chunk.match(/slug:\s*"([^"]+)"/);
      if (!slugMatch) continue;
      const slug = slugMatch[1];
      if (/indexable:\s*false/.test(chunk)) {
        slugs.add(slug);
        continue;
      }
      const canonical = chunk.match(/canonicalSlug:\s*"([^"]+)"/);
      if (canonical && canonical[1] !== slug) {
        slugs.add(slug);
      }
    }
  }
  return slugs;
}

const NON_INDEXABLE_CASE_REGIONS = nonIndexableCaseRegionSlugs();

/** 색인 대상 path (레거시 /cases/*, /press, 네이버 블로그 미러, 내부검색 제외) */
export function getIndexablePaths() {
  return getAllPublishedPaths().filter((routePath) => {
    if (routePath === "/search") return false;
    if (routePath === "/cases" || routePath.startsWith("/cases/")) return false;
    if (routePath === "/press" || routePath.startsWith("/press/")) return false;
    if (routePath.startsWith("/blog/external/")) return false;
    if (routePath.startsWith("/admin") || routePath.startsWith("/api/")) return false;
    if (routePath.startsWith("/업무사례/")) {
      const slug = routePath.slice("/업무사례/".length);
      if (slug === "지역별" || slug === "업무별") return true;
      if (NON_INDEXABLE_CASE_REGIONS.has(slug)) return false;
    }
    return true;
  });
}
