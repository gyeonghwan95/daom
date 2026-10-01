#!/usr/bin/env node
/** 선박등기 클러스터 — 실제 사무소·등기국 사진을 리사이즈·크롭만 한다(합성·텍스트·선박 AI 이미지 없음). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG = path.join(ROOT, "public", "image");
const outDir = path.join(IMG, "og");
fs.mkdirSync(outDir, { recursive: true });

const SOURCES = {
  hub: "썸네일-부산지방등기국.jpg",
  busan: "썸네일-부산지방법원등기국.jpg",
  "vs-registration": "썸네일-등기운영과.jpg",
  inheritance: "썸네일-사무실_겨울 (3).jpg",
  manager: "썸네일_사무실_여름 (13).jpg",
  tongyeong: "썸네일-사무실_겨울 (4).jpg",
  geoje: "썸네일-아래.jpg",
  changwon: "썸네일-사무실_가을 (2).jpg",
  ulsan: "썸네일_사무실_여름 (5).jpg",
  pohang: "썸네일-법원절차.jpg",
  uljin: "썸네일-서류확인.jpg",
  yeongdeok: "썸네일-상담협의.jpg",
  gyeongju: "썸네일-서류등기.jpg",
};

// node scripts/ship-make-og.mjs hub busan ...  → 지정한 키만 생성
const only = process.argv.slice(2);

for (const [key, file] of Object.entries(SOURCES)) {
  if (only.length && !only.includes(key)) continue;
  for (const [suffix, width, height] of [
    ["", 1200, 630],
    ["-4x3", 1200, 900],
  ]) {
    const out = path.join(outDir, `ship-${key}${suffix}.jpg`);
    await sharp(path.join(IMG, file))
      .rotate()
      .resize(width, height, { fit: "cover", position: "attention" })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);
    const meta = await sharp(out).metadata();
    console.log(path.relative(ROOT, out), meta.width, meta.height, fs.statSync(out).size);
  }
}
