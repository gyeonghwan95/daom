#!/usr/bin/env node
/** 상속·부산법무사·공탁 우선순위 클러스터 — 실제 사무소·법원 사진을 리사이즈·크롭만 한다(합성·텍스트·AI 이미지 없음). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG = path.join(ROOT, "public", "image");
const outDir = path.join(IMG, "og");
fs.mkdirSync(outDir, { recursive: true });

const SOURCES = {
  "deposit-hub": "썸네일-동부지원.jpg",
  "deposit-payment": "썸네일-서류확인.jpg",
  "deposit-execution": "썸네일-법원절차.jpg",
  "deposit-security": "썸네일-서부지원.jpg",
  "deposit-criminal": "썸네일-동부지원2.jpg",
  "deposit-release": "썸네일-서류등기.jpg",
  "qualified-acceptance": "썸네일_사무실_서류검토_여름 (5).jpg",
  "busan-lawyer": "썸네일-상담협의.jpg",
  "busan-consult": "썸네일-사무실_전화중.jpg",
  "busan-recommend": "썸네일-사무실_정면.jpg",
};

// node scripts/priority-make-og.mjs deposit-hub ...  → 지정한 키만 생성
const only = process.argv.slice(2);

for (const [key, file] of Object.entries(SOURCES)) {
  if (only.length && !only.includes(key)) continue;
  for (const [suffix, width, height] of [
    ["", 1200, 630],
    ["-4x3", 1200, 900],
  ]) {
    const out = path.join(outDir, `priority-${key}${suffix}.jpg`);
    await sharp(path.join(IMG, file))
      .rotate()
      .resize(width, height, { fit: "cover", position: "attention" })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);
    const meta = await sharp(out).metadata();
    console.log(path.relative(ROOT, out), meta.width, meta.height, fs.statSync(out).size);
  }
}
