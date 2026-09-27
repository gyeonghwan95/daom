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

/** EXIF 회전을 반영한 실제 표시 폭 */
async function displayWidth(file) {
  const meta = await sharp(file).metadata();
  const rotated = meta.orientation && meta.orientation >= 5;
  return rotated ? meta.height : meta.width;
}

function targetWidths(sourceWidth) {
  const top = Math.min(sourceWidth, VARIANT_WIDTHS.at(-1));
  const widths = VARIANT_WIDTHS.filter((w) => w < top * 0.9);
  widths.push(top);
  return widths;
}

/** public 밖에 있지만 같은 URL로 서빙되는 원본 (app/icon.png → /icon.png, 헤더 로고) */
const EXTRA_SOURCES = new Map([[path.join(ROOT, "src/app/icon.png"), "/icon.png"]]);

const toKey = (file) =>
  EXTRA_SOURCES.get(file) ?? `/${path.relative(PUBLIC, file).replaceAll("\\", "/")}`;
const variantFile = (key, width) =>
  path.join(OUT, `${key.replace(SOURCE_EXT, "")}.${width}.webp`);

async function processFile(file) {
  const key = toKey(file);
  const widths = targetWidths(await displayWidth(file));
  const srcMtime = fs.statSync(file).mtimeMs;
  let written = 0;
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
  return { key, widths, written };
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
    else if (entry.name.endsWith(".webp")) acc.push(full);
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
const expected = new Set();
for (const { key, widths } of results.sort((a, b) => a.key.localeCompare(b.key))) {
  manifest[key] = widths;
  for (const w of widths) expected.add(variantFile(key, w));
}
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 1)}\n`);

const removed = removeStale(expected);
const written = results.reduce((n, r) => n + r.written, 0);
console.log(
  `[optimize-images] 원본 ${sources.length}개 · 파생본 ${expected.size}개 (새로 생성 ${written}, 정리 ${removed}) · ${((Date.now() - started) / 1000).toFixed(1)}s`,
);
