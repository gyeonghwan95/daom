// 공개용 파생본 제작 소스(재현용). 원본은 그대로 두고 새 경로에 저장한다.
//   node reports/image-2026-10-11/tools/make-derivatives.mjs
// - 인물 보정·재생성 없음: 회전 보정 + 크기 조정 + JPEG 저장만 한다. sharp 기본값으로 EXIF·위치 정보는 빠진다.
// - 현장 사진: 4:3 원본을 1600×1200으로 축소(가운데 기준, 원본도 4:3이라 실질적 잘림 없음).
// - 서류 사진: 긴 변 1600px로 축소(비율 유지). 고객 정보는 원본 단계에서 이미 가려진 것만 사용.
import sharp from "sharp";
import fs from "node:fs";

const JOBS = [
  ["public/image/외근_여름_부산지방등기국 (2).jpg", "public/image/현장/현장-부산지방법원등기국-방문.jpg", "cover43"],
  ["public/image/외근_여름_서부지원 (2).jpg", "public/image/현장/현장-부산지방법원서부지원-방문.jpg", "cover43"],
  ["public/image/외근_진구청 (2).jpg", "public/image/현장/현장-부산진구청-방문.jpg", "cover43"],
  ["public/image/서류/서류_상속포기.jpg", "public/image/업무서류/서류-상속재산포기심판청구-위임장.jpg", "inside"],
];
for (const [src, dest, mode] of JOBS) {
  if (!fs.existsSync(src)) {
    console.warn("원본 없음:", src);
    continue;
  }
  fs.mkdirSync(dest.replace(/\/[^/]+$/, ""), { recursive: true });
  const img = sharp(src).rotate();
  const sized = mode === "cover43" ? img.resize(1600, 1200, { fit: "cover", position: "centre" }) : img.resize(1600, 1600, { fit: "inside", withoutEnlargement: true });
  await sized.jpeg({ quality: 84, mozjpeg: true }).toFile(dest);
  const m = await sharp(dest).metadata();
  console.log(dest, `${m.width}x${m.height}`, m.exif ? "EXIF 남음(확인 필요)" : "EXIF 없음");
}
