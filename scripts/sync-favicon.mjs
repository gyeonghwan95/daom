#!/usr/bin/env node
/**
 * public/image/로고.png → app/icon, apple-icon, public/favicon.ico 동기화
 *
 * 원본(2616×2440, 약 138KB)을 그대로 복사하면 모든 페이지가 아이콘을 두 번(링크 아이콘 + 헤더 로고) 받는다.
 * 같은 경로를 유지한 채 용도별 크기로 만든다.
 *  - app/icon.png       512×512 투명 PNG (manifest 512x512 선언·헤더 로고 원본)
 *  - app/apple-icon.png 180×180 흰 배경(iOS는 투명 영역을 검게 칠한다)
 *  - public/favicon.ico 16·32·48 PNG 내장 ICO
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "public/image/로고.png");
const ICON = path.join(ROOT, "src/app/icon.png");
const APPLE_ICON = path.join(ROOT, "src/app/apple-icon.png");
const FAVICON = path.join(ROOT, "public/favicon.ico");

if (!fs.existsSync(SOURCE)) {
  console.error("[sync-favicon] missing:", SOURCE);
  process.exit(1);
}

sharp.cache(false);

/** 원본 비율을 지키고 투명 여백으로 정사각형을 만든다 */
async function squareSource() {
  const meta = await sharp(SOURCE).metadata();
  const side = Math.max(meta.width, meta.height);
  return sharp(SOURCE)
    .extend({
      top: Math.floor((side - meta.height) / 2),
      bottom: Math.ceil((side - meta.height) / 2),
      left: Math.floor((side - meta.width) / 2),
      right: Math.ceil((side - meta.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

const PNG_OPTS = { compressionLevel: 9, palette: true, quality: 95, effort: 10 };

function resized(square, size) {
  return sharp(square).resize(size, size, { kernel: "lanczos3" });
}

async function appleIcon(square) {
  const inner = 144;
  const logo = await resized(square, inner).png().toBuffer();
  return sharp({ create: { width: 180, height: 180, channels: 4, background: "#ffffff" } })
    .composite([{ input: logo, left: (180 - inner) / 2, top: (180 - inner) / 2 }])
    .png(PNG_OPTS)
    .toBuffer();
}

async function faviconIco(square) {
  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map((s) => resized(square, s).png({ compressionLevel: 9 }).toBuffer()),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(sizes.length, 4);
  const dir = Buffer.alloc(16 * sizes.length);
  let offset = header.length + dir.length;
  sizes.forEach((s, i) => {
    const b = i * 16;
    dir.writeUInt8(s, b);
    dir.writeUInt8(s, b + 1);
    dir.writeUInt16LE(1, b + 4); // color planes
    dir.writeUInt16LE(32, b + 6); // bits per pixel
    dir.writeUInt32LE(images[i].length, b + 8);
    dir.writeUInt32LE(offset, b + 12);
    offset += images[i].length;
  });
  return Buffer.concat([header, dir, ...images]);
}

/** 내용이 같으면 쓰지 않는다 — 빌드마다 파일 시각·아이콘 해시가 바뀌지 않게 */
function writeIfChanged(file, buf) {
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buf)) return false;
  fs.writeFileSync(file, buf);
  return true;
}

const square = await squareSource();
const results = [
  [ICON, await resized(square, 512).png(PNG_OPTS).toBuffer()],
  [APPLE_ICON, await appleIcon(square)],
  [FAVICON, await faviconIco(square)],
];
const written = results.filter(([file, buf]) => writeIfChanged(file, buf)).length;

console.log(
  `[sync-favicon] 로고.png → icon 512 · apple-icon 180 · favicon.ico 16/32/48 (${written}개 갱신)`,
);

// optimize-images.mjs와 같은 이유: Windows에서 sharp 작업 직후 바로 끝나면 libuv 단언 오류로 죽을 수 있다
await new Promise((resolve) => setTimeout(resolve, 200));
