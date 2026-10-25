/**
 * ⚠ 현재 배포 이미지는 `npm run thumbnails:premium`(scripts/generate-premium-thumbnails.ts)으로 만든 1:1 프리미엄 썸네일이다.
 *   이 스크립트를 실행하면 같은 경로를 예전 디자인으로 덮어쓴다.
 *
 * SERP 캐러셀에 쓰이는 원본 사진을 1:1 훅 썸네일로 만든다.
 * 얼굴·몸은 변형하지 않는다. 결과 맵: src/data/seo/serp-hook-images.ts
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { SERP_OWNED_IMAGES } from "../src/data/seo/serp-carousel-images";
import { layoutForPhoto, toHookFields } from "./lib/hook-layout-catalog";
import {
  hookDiskPath,
  hookOutputPath,
  renderHookThumbnail,
  writeAtomic,
} from "./lib/render-hook-thumbnail";

const DESIGNED_SUBSTITUTE: Record<string, string> = {
  "/image/상담-전화.png": "/image/썸네일-사무실_전화중.jpg",
  "/image/상담-대면.png": "/image/썸네일-상담협의.jpg",
};

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");

function resolveDisk(src: string): string | null {
  const disk = path.join(PUBLIC, decodeURIComponent(src).replace(/^\//, ""));
  return existsSync(disk) ? disk : null;
}

async function main() {
  const rows: { url: string; src: string; alt: string }[] = [];
  const failed: string[] = [];

  for (const [url, owned] of Object.entries(SERP_OWNED_IMAGES)) {
    if (
      owned.src.startsWith("/image/cards/") ||
      owned.src.startsWith("/image/og/")
    ) {
      continue;
    }
    const photoSrc = DESIGNED_SUBSTITUTE[owned.src] ?? owned.src;
    const photoDisk = resolveDisk(photoSrc);
    if (!photoDisk) {
      failed.push(`${url}: missing ${photoSrc}`);
      continue;
    }
    const outDisk = hookDiskPath(ROOT, url);
    mkdirSync(path.dirname(outDisk), { recursive: true });
    const layout = layoutForPhoto(photoSrc, owned.alt, url);
    const buffer = await renderHookThumbnail({
      photoDisk,
      title: owned.headline,
      ...toHookFields(layout),
    });
    writeAtomic(outDisk, buffer);
    rows.push({
      url,
      src: hookOutputPath(url),
      alt: owned.alt,
    });
  }

  const body = `/**
 * 생성물 — scripts/generate-serp-card-hooks.ts
 * 직접 수정하지 않는다. 캐러셀 카드·ItemList 전용 1:1 훅 썸네일.
 */
export type SerpHookImage = {
  src: string;
  alt: string;
  width: 1200;
  height: 1200;
};

export const SERP_HOOK_IMAGES: Record<string, SerpHookImage> = {
${rows
  .map(
    (row) =>
      `  ${JSON.stringify(row.url)}: { src: ${JSON.stringify(row.src)}, alt: ${JSON.stringify(row.alt)}, width: 1200, height: 1200 },`,
  )
  .join("\n")}
};

export function getSerpHookImage(url: string): SerpHookImage | undefined {
  return SERP_HOOK_IMAGES[url];
}
`;

  writeFileSync(path.join(ROOT, "src/data/seo/serp-hook-images.ts"), body, "utf8");
  console.log(
    JSON.stringify(
      { generated: rows.length, failed, map: "src/data/seo/serp-hook-images.ts" },
      null,
      2,
    ),
  );
  if (failed.length) process.exitCode = 1;
}

main();
