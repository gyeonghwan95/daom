#!/usr/bin/env node
/** Regional SEO batch A — 실제 사무소 사진을 리사이즈·크롭만 한다(합성·텍스트·지역 풍경 없음). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG = path.join(ROOT, "public", "image");
const outDir = path.join(IMG, "og");
fs.mkdirSync(outDir, { recursive: true });

const SOURCES = {
  yangsan: "썸네일-서류확인.jpg",
  gimhae: "썸네일-상담협의.jpg",
  changwon: "썸네일-서류등기.jpg",
  daegu: "썸네일-사무실_전화중.jpg",
  geoje: "썸네일-사무실_작업중.jpg",
  hub: "썸네일-사무실_정면.jpg",
  gyeongju: "썸네일-사무실_가을 (1).jpg",
  jinju: "썸네일_사무실_서류검토_여름 (5).jpg",
  gumi: "썸네일-사무실_가을 (3).jpg",
  tongyeong: "썸네일-사무실_겨울 (2).jpg",
  miryang: "썸네일-사무실_겨울 (1).jpg",
};

// node scripts/rseo-make-og.mjs gyeongju jinju ...  → 지정한 키만 생성(기존 파일 재생성 방지)
const only = process.argv.slice(2);

for (const [key, file] of Object.entries(SOURCES)) {
  if (only.length && !only.includes(key)) continue;
  for (const [suffix, width, height] of [
    ["", 1200, 630],
    ["-4x3", 1200, 900],
  ]) {
    if (key === "hub" && suffix) continue;
    const out = path.join(outDir, `regional-inheritance-${key}${suffix}.jpg`);
    await sharp(path.join(IMG, file))
      .rotate()
      .resize(width, height, { fit: "cover", position: "attention" })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);
    const meta = await sharp(out).metadata();
    console.log(path.relative(ROOT, out), meta.width, meta.height, fs.statSync(out).size);
  }
}
