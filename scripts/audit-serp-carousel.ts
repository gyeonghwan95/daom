/**
 * 네이버 이미지형 하위페이지 캐러셀 자격 검사
 * Usage: npm run audit:serp-carousel
 *
 * 실패: 필수 URL의 팩이 4장 미만, 이미지 파일 없음, 팩 안 이미지 중복, noindex 포함.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { SERP_OWNED_IMAGES } from "../src/data/seo/serp-carousel-images";
import { SERP_CAROUSEL_PACKS } from "../src/data/seo/serp-carousel-packs";
import { BUSAN_DISTRICT_HUBS } from "../src/lib/geo/busan-district-hubs";
import { getSerpCarouselPack } from "../src/lib/seo/serp-carousel-pack";
import { isNoIndexPath } from "../src/lib/seo/index-policy";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");

const REQUIRED_PATHS = [
  "/",
  ...Object.keys(SERP_CAROUSEL_PACKS),
  ...BUSAN_DISTRICT_HUBS.map((hub) => hub.href),
  "/정관법무사",
  "/명지법무사",
  "/화명동법무사",
  "/센텀법무사",
];

function diskPath(publicPath: string): string {
  const decoded = decodeURIComponent(publicPath.split("?")[0] ?? publicPath);
  return path.join(PUBLIC, decoded.replace(/^\//, "").replace(/\//g, path.sep));
}

function unique(paths: string[]): string[] {
  return [...new Set(paths)];
}

function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const [url, owned] of Object.entries(SERP_OWNED_IMAGES)) {
    if (isNoIndexPath(url)) {
      errors.push(`owned image on noindex URL: ${url}`);
    }
    if (!existsSync(diskPath(owned.src))) {
      errors.push(`missing owned image file: ${url} -> ${owned.src}`);
    }
  }

  const seenRequired = unique(REQUIRED_PATHS);
  const rows: Array<{
    path: string;
    ok: boolean;
    count: number;
    heading: string;
    hrefs: string;
  }> = [];

  for (const pagePath of seenRequired) {
    const pack = getSerpCarouselPack(pagePath);
    if (!pack) {
      errors.push(`pack missing or <4 unique images: ${pagePath}`);
      rows.push({
        path: pagePath,
        ok: false,
        count: 0,
        heading: "",
        hrefs: "",
      });
      continue;
    }
    const images = pack.items.map((item) => item.representativeImage ?? item.image);
    if (new Set(images).size !== images.length) {
      errors.push(`duplicate images in pack: ${pagePath}`);
    }
    for (const item of pack.items) {
      if (isNoIndexPath(item.href)) {
        errors.push(`${pagePath} pack includes noindex ${item.href}`);
      }
      const src = item.representativeImage ?? item.image;
      const file = diskPath(src);
      if (!existsSync(file)) {
        errors.push(`pack image missing on disk: ${pagePath} -> ${item.href} (${src})`);
      }
    }
    if (pack.items.length < 5) {
      warnings.push(`${pagePath} has only ${pack.items.length} cards (target 5–7)`);
    }
    rows.push({
      path: pagePath,
      ok: true,
      count: pack.items.length,
      heading: pack.heading,
      hrefs: pack.items.map((item) => item.href).join(" · "),
    });
  }

  console.log("path\tcount\theading\threfs");
  for (const row of rows) {
    console.log(
      `${row.ok ? "OK" : "FAIL"}\t${row.path}\t${row.count}\t${row.heading}\t${row.hrefs}`,
    );
  }

  if (warnings.length) {
    console.warn("\nWARNINGS");
    for (const warning of warnings) console.warn(`- ${warning}`);
  }
  if (errors.length) {
    console.error("\nERRORS");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`\nOK ${rows.filter((row) => row.ok).length}/${rows.length} required packs`);
}

main();
