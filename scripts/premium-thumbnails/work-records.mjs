#!/usr/bin/env node
/**
 * 업무 페이지 '실제로 진행한 업무 기록' 이미지 생성 — src/data/seo/work-records.ts 기준.
 *
 * 1) 원본(바탕화면 포스팅용 폴더)을 assets/thumbnail-sources/work-<key>.jpg 로 가져온다(2400px, 배포 안 됨).
 * 2) 기존 업무 이미지와 같은 렌더러(render.mjs)로 1200×1200 JPG를 만든다 → public/image/cards/work/<file>.jpg
 *    crop·톤·타이포만 한다(얼굴·서류 내용 변형 없음, AI 생성 없음).
 *
 *   node scripts/premium-thumbnails/work-records.mjs            # 전부
 *   node scripts/premium-thumbnails/work-records.mjs gift ship  # 일부 키만
 *   POSTING_DIR=... 로 원본 폴더를 바꿀 수 있다.
 */
import { existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { render } from "./render.mjs";
import { POSTING_DIR, SOURCES_DIR } from "./hero-sources.mjs";

const ROOT = process.cwd();
const sharp = createRequire(path.join(ROOT, "package.json"))("sharp");
const { WORK_RECORDS } = await import(pathToFileURL(path.join(ROOT, "src/data/seo/work-records.ts")).href);

/**
 * 키 → 포스팅용 폴더 기준 원본 사진. src/에 두지 않는 이유는 src/data/seo/work-records.ts 머리말 참고.
 * 바꿀 때는 assets/thumbnail-sources/work-<키>.jpg 를 지워야 새 원본을 다시 가져온다.
 */
const SOURCES = {
  "inheritanceDone": "상속/등기필증_상속 (3).jpg",
  "inheritanceAgreement": "상속/신청서_상속, 분할협의.jpg",
  "renunciation": "상속/심판문_상속포기.jpg",
  "gift": "증여/신청서_증여 (2).jpg",
  "saleDone": "등기필증/등기필증_매매 (3).jpg",
  "mortgageSet": "근저당설정, 말소/신청서_근저당설정.jpg",
  "mortgageCancel": "근저당설정, 말소/해지증서_근저당말소.jpg",
  "jeonse": "전세권/신청서_전세권설정.jpg",
  "leaseOrder": "서류_임차권등기명령.jpg",
  "corpEstablish": "법인관련/신청서_법인설립 (3).jpg",
  "corpOfficer": "법인관련/서류_임원변경.jpg",
  "corpRelocation": "법인관련/서류_본점이전 (3).jpg",
  "corpCapital": "법인관련/신청서_유상증자 (2).jpg",
  "corpPurpose": "법인관련/서류_목적변경.jpg",
  "deposit": "공탁/공탁금 출급회수 청구서.jpg",
  "commission": "촉탁/서류_촉탁 (3).jpg",
  "subAgency": "복대리/서류_복대리 (3).jpg",
  "ship": "선박/신청서_선박등기.jpg",
  "specialAgent": "특별대리인심판/결정문_특별대리인심판.jpg",
  "bankruptcy": "서류_파산면책 (2).jpg",
  "auction": "서류_매각완납증명.jpg",
  "nameChange": "서류_개명.jpg"
};

const OUT = path.join(ROOT, "public/image/cards/work");
mkdirSync(OUT, { recursive: true });
mkdirSync(SOURCES_DIR, { recursive: true });

const only = new Set(process.argv.slice(2));
for (const [key, rec] of Object.entries(WORK_RECORDS)) {
  if (only.size && !only.has(key)) continue;
  if (!SOURCES[key]) throw new Error(`원본 경로 없음: ${key}`);
  const src = path.join(POSTING_DIR, SOURCES[key]);
  const staged = path.join(SOURCES_DIR, `work-${key}.jpg`);
  if (!existsSync(staged)) {
    if (!existsSync(src)) {
      console.error(`원본 없음: ${src}`);
      process.exitCode = 1;
      continue;
    }
    await sharp(src).rotate().resize(2400, 2400, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 88, mozjpeg: true }).toFile(staged);
  }
  const { buf, crop, size } = await render({ photo: `@posting/work-${key}.jpg`, title: rec.title, format: "jpg", quality: 84 });
  const out = path.join(OUT, `${rec.file}.jpg`);
  writeFileSync(out, buf);
  console.log(`${key}\t${rec.file}.jpg\t${Math.round(statSync(out).size / 1024)}KB\tcrop ${crop.width}x${crop.height} up${crop.upscale}\tfont ${size}`);
}
