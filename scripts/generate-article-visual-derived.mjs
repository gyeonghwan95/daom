/**
 * 본문 ArticleVisual용 파생 WebP 생성.
 * 원본 public/image 파일은 절대 덮어쓰지 않는다.
 *
 *   node scripts/generate-article-visual-derived.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public/image/derived");

/** asset-catalog 와 동기화 */
const JOBS = [
  { src: "썸네일-서류확인.jpg", out: "doc-review-desk.webp", maxW: 1280 },
  { src: "썸네일-계약임원.jpg", out: "contract-officer-review.webp", maxW: 1280 },
  { src: "썸네일-등기필증_상속.jpg", out: "inheritance-reg-cert.webp", maxW: 1280 },
  { src: "썸네일-등기필증_매매증여.jpg", out: "sale-gift-reg-cert.webp", maxW: 1280 },
  { src: "썸네일-등기필증_근저당.jpg", out: "mortgage-reg-cert.webp", maxW: 1280 },
  { src: "썸네일-등기소.jpg", out: "registry-office-visit.webp", maxW: 1280 },
  { src: "상담-메인.jpg", out: "consult-main.webp", maxW: 1280 },
  { src: "썸네일-정면.jpg", out: "portrait-front.webp", maxW: 1280 },
  { src: "썸네일-서류등기.jpg", out: "desk-computer.webp", maxW: 1280 },
  { src: "썸네일-상담협의.jpg", out: "consult-talk.webp", maxW: 1280 },
  { src: "썸네일-법원절차.jpg", out: "court-procedure.webp", maxW: 1280 },
  { src: "썸네일-부산지방법원등기국.jpg", out: "busan-registry-bureau.webp", maxW: 1280 },
  { src: "사무소-서류.jpg", out: "office-docs.webp", maxW: 1280 },
  { src: "썸네일-사무실_가을 (1).jpg", out: "office-exterior-fall.webp", maxW: 1280 },
  { src: "사무소-명판가로.jpg", out: "office-nameplate.webp", maxW: 1280 },
  { src: "강의-청년전세사기예방접종.jpg", out: "lecture-youth-jeonse.webp", maxW: 1280 },
  { src: "강의-시민도서관1주차.jpg", out: "lecture-citizen-lib.webp", maxW: 1280 },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

let before = 0;
let after = 0;

for (const job of JOBS) {
  const input = path.join(ROOT, "public/image", job.src);
  const output = path.join(OUT_DIR, job.out);
  if (!fs.existsSync(input)) {
    console.warn("[skip missing]", job.src);
    continue;
  }
  before += fs.statSync(input).size;
  await sharp(input)
    .rotate()
    .resize({ width: job.maxW, withoutEnlargement: true })
    .webp({ quality: 76 })
    .toFile(output);
  after += fs.statSync(output).size;
  console.log("ok", job.out, Math.round(fs.statSync(output).size / 1024) + "KB");
}

console.log(
  JSON.stringify(
    {
      originalsKB: Math.round(before / 1024),
      derivedKB: Math.round(after / 1024),
      savedKB: Math.round((before - after) / 1024),
      count: JOBS.length,
    },
    null,
    2,
  ),
);
