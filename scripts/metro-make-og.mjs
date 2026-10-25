#!/usr/bin/env node
/**
 * ⚠ 이 스크립트가 만드는 og 이미지는 이후 `npm run thumbnails:premium`(1:1 프리미엄 썸네일)으로 같은 경로에 다시 만들었다.
 *   다시 실행하면 예전 디자인으로 덮어쓰므로, 실행했다면 thumbnails:premium 을 이어서 실행한다.
 */
/** 수도권·충청 원거리 상속등기 대표 URL — 실제 사무소 사진을 리사이즈·크롭만 한다(합성·텍스트·랜드마크 없음). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG = path.join(ROOT, "public", "image");
const outDir = path.join(IMG, "og");
fs.mkdirSync(outDir, { recursive: true });

const SOURCES = {
  seoul: "썸네일-등기필증_상속.jpg",
  yongin: "썸네일-작성중.png",
  daejeon: "사무소-서류.jpg",
  daegu: "썸네일-사무실_겨울 (3).jpg",
};

const only = process.argv.slice(2);
for (const [key, file] of Object.entries(SOURCES)) {
  if (only.length && !only.includes(key)) continue;
  const src = path.join(IMG, file);
  const srcMeta = await sharp(src).metadata();
  console.log(file, srcMeta.width, srcMeta.height);
  for (const [suffix, width, height] of [
    ["", 1200, 630],
    ["-4x3", 1200, 900],
  ]) {
    const out = path.join(outDir, `metro-${key}${suffix}.jpg`);
    await sharp(src)
      .rotate()
      .resize(width, height, { fit: "cover", position: "attention" })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);
    const meta = await sharp(out).metadata();
    console.log(path.relative(ROOT, out), meta.width, meta.height, fs.statSync(out).size);
  }
}
