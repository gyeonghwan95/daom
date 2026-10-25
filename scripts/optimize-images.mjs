#!/usr/bin/env node
/**
 * public/ 의 JPG·PNG를 폭별 WebP 파생본으로 만든다 → public/_img/ (git 제외).
 * next/image 커스텀 로더(src/lib/image-loader.ts)가 src/generated/image-variants.json을 보고
 * 요청 폭에 맞는 파생본 URL을 돌려준다. 원본 파일은 그대로 둔다(OG·JSON-LD 등).
 *
 *   node scripts/optimize-images.mjs          # 바뀐 원본만 처리
 *   node scripts/optimize-images.mjs --force  # 전부 다시 생성
 *
 * Cloudflare Pages 배포 파일 수 한도(20,000)를 고려해 폭 단계는 적게 유지한다.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "_img");
const MANIFEST = path.join(ROOT, "src/generated/image-variants.json");
/** 원본 크기·형식과 공유(OG)용 JPEG 파생본 — 메타데이터의 og:image width/height/type을 실제 파일과 맞춘다 */
const DIMENSIONS = path.join(ROOT, "src/generated/image-dimensions.json");
/** OG 파생본: 이보다 크거나 무거운 원본만 1200px JPEG로 만든다(원본은 그대로 둔다) */
const OG_MAX_WIDTH = 1200;
const OG_MAX_SOURCE_BYTES = 600 * 1024;

/** next.config.ts images.deviceSizes + imageSizes 와 같은 값 */
export const VARIANT_WIDTHS = [256, 384, 640, 960, 1280, 1920];
const SOURCE_EXT = /\.(jpe?g|png)$/i;
const QUALITY = 74;
/** 이미 가벼운 파일(QR 코드 등)은 손실 압축으로 오히려 망가질 수 있어 원본을 쓴다 */
const MIN_SOURCE_BYTES = 32 * 1024;
const force = process.argv.includes("--force");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full !== OUT) walk(full, acc);
    } else if (SOURCE_EXT.test(entry.name) && fs.statSync(full).size >= MIN_SOURCE_BYTES) {
      acc.push(full);
    }
  }
  return acc;
}

/** EXIF 회전을 반영한 실제 표시 크기 */
async function displaySize(file) {
  const meta = await sharp(file).metadata();
  const rotated = meta.orientation && meta.orientation >= 5;
  return {
    width: rotated ? meta.height : meta.width,
    height: rotated ? meta.width : meta.height,
    format: meta.format,
  };
}

function targetWidths(sourceWidth) {
  const top = Math.min(sourceWidth, VARIANT_WIDTHS.at(-1));
  const widths = VARIANT_WIDTHS.filter((w) => w < top * 0.9);
  widths.push(top);
  return widths;
}

/**
 * 본문 갤러리 1:1 카드(최대 표시 폭 약 270px·모바일 50vw)는 두 폭만 만든다.
 * Cloudflare Pages 파일 수 한도(20,000) 여유를 지키기 위해서다. 원본 JPG는 img src로 그대로 쓴다.
 */
const GALLERY_PREFIX = "/image/cards/gallery/";
const GALLERY_WIDTHS = [384, 640];
const PAGE_THUMB_PREFIX = "/image/og-pages/";

/**
 * 1200px 1:1 썸네일(og·카드·본문 대표 이미지)은 파생본을 만들지 않고 원본 JPG를 그대로 쓴다.
 * 고해상도 휴대폰에서도 1200px가 필요한 크기라 화질 손해가 없고, 장당 5개씩 늘던 파일 수를 아낀다.
 * (src/lib/image-variants.ts 는 파생본이 없으면 원본 경로를 그대로 돌려준다)
 */
function isSquareThumbnail(key) {
  if (key.startsWith("/image/og-pages/") || key.startsWith("/generated/serp/") || key.startsWith("/resources/og/")) return true;
  if (key.startsWith("/image/og/")) return !/-4x3\.jpe?g$/i.test(key); // 4:3은 본문 기록 사진
  if (key.startsWith("/image/cards/")) return !key.startsWith(GALLERY_PREFIX);
  return false;
}

/**
 * 코드(src) 어디에도 이름이 나오지 않는 원본은 화면에 그려질 수 없으므로 파생본을 만들지 않는다.
 * 생성 스크립트의 원본 사진(서류 사진 등)이 여기에 해당한다. 경로를 조립해 쓰는 경우를 놓치지 않도록
 * 파일명·확장자 뺀 이름·"썸네일-" 뺀 이름(src/lib/thumbnail-images.ts가 조립) 중 하나라도 보이면 참조된 것으로 본다.
 */
const SRC_TEXT = (() => {
  const chunks = [];
  (function read(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (full !== path.join(ROOT, "src", "generated")) read(full);
      } else if (/\.(tsx?|mdx?|json|css)$/.test(entry.name)) {
        chunks.push(fs.readFileSync(full, "utf8").normalize("NFC"));
      }
    }
  })(path.join(ROOT, "src"));
  return chunks.join("\n");
})();
function isReferencedInSource(key) {
  const file = key.split("/").pop().normalize("NFC");
  const base = file.replace(SOURCE_EXT, "");
  const bare = base.replace(/^썸네일[-_]/, "");
  return [file, base, bare === base ? "" : `"${bare}"`, encodeURIComponent(base)].some((t) => t.length >= 2 && SRC_TEXT.includes(t));
}

/** public 밖에 있지만 같은 URL로 서빙되는 원본 (app/icon.png → /icon.png, 헤더 로고) */
const EXTRA_SOURCES = new Map([[path.join(ROOT, "src/app/icon.png"), "/icon.png"]]);

const toKey = (file) =>
  EXTRA_SOURCES.get(file) ?? `/${path.relative(PUBLIC, file).replaceAll("\\", "/")}`;
const variantFile = (key, width) =>
  path.join(OUT, `${key.replace(SOURCE_EXT, "")}.${width}.webp`);
const ogFile = (key) => path.join(OUT, `${key.replace(SOURCE_EXT, "")}.og.jpg`);
const ogKey = (key) => `/_img${key.replace(SOURCE_EXT, "")}.og.jpg`;

async function processFile(file) {
  const key = toKey(file);
  // 페이지별 1:1 썸네일은 파생본·크기 표가 모두 필요 없다(share-image.ts가 1200×1200 고정) — sharp를 열지 않는다
  if (key.startsWith(PAGE_THUMB_PREFIX)) return { key, widths: [], written: 0, dims: {} };
  const size = await displaySize(file);
  const referenced = EXTRA_SOURCES.has(file) || isReferencedInSource(key);
  const widths = !referenced || isSquareThumbnail(key)
    ? []
    : key.startsWith(GALLERY_PREFIX)
      ? GALLERY_WIDTHS
      : targetWidths(size.width);
  const srcStat = fs.statSync(file);
  const srcMtime = srcStat.mtimeMs;
  let written = 0;
  const dims = { width: size.width, height: size.height, format: size.format, bytes: srcStat.size };
  if (referenced && (size.width > OG_MAX_WIDTH || srcStat.size > OG_MAX_SOURCE_BYTES)) {
    const dest = ogFile(key);
    const ogWidth = Math.min(OG_MAX_WIDTH, size.width);
    if (force || !fs.existsSync(dest) || fs.statSync(dest).mtimeMs < srcMtime) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      // 메타데이터(EXIF·위치)는 sharp 기본값대로 빠진다
      await sharp(file).rotate().resize({ width: ogWidth, withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
      written += 1;
    }
    dims.og = { src: ogKey(key), width: ogWidth, height: Math.round((size.height * ogWidth) / size.width), format: "jpeg" };
  }
  for (const width of widths) {
    const dest = variantFile(key, width);
    if (!force && fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= srcMtime) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(dest);
    written += 1;
  }
  return { key, widths, written, dims };
}

async function runPool(items, limit, fn) {
  const results = [];
  let next = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

function removeStale(expected) {
  if (!fs.existsSync(OUT)) return 0;
  let removed = 0;
  for (const file of listWebp(OUT)) {
    if (!expected.has(file)) {
      fs.rmSync(file, { force: true });
      removed += 1;
    }
  }
  return removed;
}

function listWebp(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listWebp(full, acc);
    else if (entry.name.endsWith(".webp") || entry.name.endsWith(".og.jpg")) acc.push(full);
  }
  return acc;
}

const started = Date.now();
const sources = walk(PUBLIC)
  .concat([...EXTRA_SOURCES.keys()].filter((file) => fs.existsSync(file)))
  .sort();
sharp.concurrency(1);
const results = await runPool(sources, Math.max(1, Math.min(4, os.cpus().length)), processFile);

const manifest = {};
const dimensions = {};
const expected = new Set();
for (const { key, widths, dims } of results.sort((a, b) => a.key.localeCompare(b.key))) {
  if (widths.length) manifest[key] = widths;
  // 페이지별 1:1 썸네일은 모두 1200×1200 JPEG — src/lib/seo/share-image.ts가 고정값으로 처리(표를 키우지 않는다)
  if (!key.startsWith(PAGE_THUMB_PREFIX)) dimensions[key] = dims;
  for (const w of widths) expected.add(variantFile(key, w));
  if (dims.og) expected.add(ogFile(key));
}
/**
 * 내용이 같으면 쓰지 않는다(dev 서버·에디터가 감시하는 파일을 매번 건드리지 않게).
 * Windows에서 감시 중인 파일을 바로 다시 열면 UNKNOWN/EBUSY/EPERM이 날 수 있어 잠시 뒤 재시도한다.
 */
async function writeIfChanged(file, text) {
  try {
    if (fs.readFileSync(file, "utf8") === text) return;
  } catch {
    // 없으면 새로 쓴다
  }
  for (let i = 0; ; i++) {
    try {
      fs.writeFileSync(file, text);
      return;
    } catch (e) {
      if (i >= 8 || !/UNKNOWN|EBUSY|EPERM|EACCES/.test(String(e?.code ?? e))) throw e;
      await new Promise((resolve) => setTimeout(resolve, 250 * (i + 1)));
    }
  }
}

fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
await writeIfChanged(MANIFEST, `${JSON.stringify(manifest, null, 1)}\n`);
await writeIfChanged(DIMENSIONS, `${JSON.stringify(dimensions, null, 1)}\n`);

const removed = removeStale(expected);
const written = results.reduce((n, r) => n + r.written, 0);
console.log(
  `[optimize-images] 원본 ${sources.length}개 · 파생본 ${expected.size}개 (새로 생성 ${written}, 정리 ${removed}) · ${((Date.now() - started) / 1000).toFixed(1)}s`,
);

// Windows(Node 24)에서 libvips 작업 스레드가 정리되기 전에 프로세스가 끝나면
// "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)"로 비정상 종료한다(npm run dev가 멈춤).
// 캐시를 비우고 스레드가 정리될 시간을 잠깐 준 뒤 끝낸다.
sharp.cache(false);
await new Promise((resolve) => setTimeout(resolve, 200));
