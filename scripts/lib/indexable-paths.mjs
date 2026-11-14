import { getAllPublishedPaths } from "./published-paths.mjs";
import { NOINDEX_EXACT } from "./sitemap/exclusions.mjs";
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

/**
 * 빌드된 HTML에서 noindex이거나 canonical이 자기 자신이 아닌 경로(scripts/sync-sitemap-with-rendered.mjs가 만든다).
 * TS 설정 추정으로는 잡히지 않는 실행 중 규칙(동 대표 페이지로 canonical 등)을 사이트맵에서 빼기 위해 쓴다.
 */
function renderedExclusions() {
  const file = path.join(ROOT, "scripts/lib/sitemap/rendered-exclusions.json");
  if (!fs.existsSync(file)) return new Set();
  try {
    return new Set(JSON.parse(fs.readFileSync(file, "utf8")).map((p) => String(p).normalize("NFC")));
  } catch {
    return new Set();
  }
}
const RENDERED_EXCLUSIONS = renderedExclusions();

/** 색인 대상 path (레거시 /cases/*, /press, 네이버 블로그 미러, 내부검색 제외) */
export function getIndexablePaths() {
  return getAllPublishedPaths().filter((routePath) => {
    if (NOINDEX_EXACT.has(routePath)) return false;
    if (RENDERED_EXCLUSIONS.has(routePath.normalize("NFC"))) return false;
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
