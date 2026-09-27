#!/usr/bin/env node
/** 해운대 target og/body image — 실제 사무소 명판 사진을 리사이즈만 한다(합성·텍스트 추가 없음). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(ROOT, "public", "image", "og");
fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  {
    src: path.join(ROOT, "public", "image", "사무소-명판가로.jpg"),
    out: path.join(outDir, "haeundae-office-nameplate.jpg"),
    width: 1200,
    height: 630,
  },
  {
    src: path.join(ROOT, "public", "image", "사무소-명판가로.jpg"),
    out: path.join(outDir, "haeundae-office-nameplate-4x3.jpg"),
    width: 1200,
    height: 900,
  },
];

for (const job of jobs) {
  await sharp(job.src)
    .rotate()
    .resize(job.width, job.height, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(job.out);
  const meta = await sharp(job.out).metadata();
  console.log(path.relative(ROOT, job.out), meta.width, meta.height, fs.statSync(job.out).size);
}
