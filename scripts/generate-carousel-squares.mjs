#!/usr/bin/env node
/**
 * 네이버 검색결과 캐러셀(ItemList)에 쓰이는 이미지 중 정사각형이 아닌 것의 정사각형 사본을 만든다.
 *
 * 왜: 네이버 캐러셀 칸은 정사각형이라, 4:3(1280×960) 대표 이미지는 네이버가 임의로 잘라 글자가 잘린 카드가 됐다.
 * 대표 이미지는 글자를 가운데에 두고 만들었으므로(66장 전수 확인, 2026-11-14) 가운데 정사각형으로 잘라
 * 원본 해상도 그대로(확대 없음) 고화질 WebP로 저장한다. 원본 파일은 건드리지 않는다.
 *
 *   npm run build  →  node scripts/generate-carousel-squares.mjs  →  (새 사본이 생겼으면) npm run build
 *
 * 입력: out/**\/*.html 의 ItemList image (빌드 결과)
 * 출력: public/images/generated/carousel/square/*.webp, src/generated/carousel-squares.json(원본 경로 → 사본 경로)
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "out");
const PUBLIC = path.join(ROOT, "public");
const SQUARE_DIR = path.join(PUBLIC, "images/generated/carousel/square");
const MAP_FILE = path.join(ROOT, "src/generated/carousel-squares.json");
const MAX = 1200;

function collectItemListImages() {
  const set = new Set();
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!/^(_next|_img|admin|image|images|video|fonts|generated)$/.test(e.name)) walk(p);
      } else if (e.name.endsWith(".html")) {
        const html = fs.readFileSync(p, "utf8");
        for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
          let json;
          try {
            json = JSON.parse(m[1]);
          } catch {
            continue;
          }
          for (const node of json["@graph"] ?? [json]) {
            if (![].concat(node["@type"]).includes("ItemList")) continue;
            for (const el of node.itemListElement ?? []) {
              const img = el?.item?.image ?? el?.image;
              if (typeof img !== "string") continue;
              try {
                set.add(decodeURIComponent(new URL(img).pathname).normalize("NFC"));
              } catch {
                /* ignore */
              }
            }
          }
        }
      }
    }
  }
  walk(OUT_DIR);
  return [...set];
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("[carousel-squares] out/ 이 없습니다. 먼저 npm run build");
  process.exit(1);
}

const existing = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, "utf8")) : {};
const map = { ...existing };
fs.mkdirSync(SQUARE_DIR, { recursive: true });
let created = 0;
let skipped = 0;
for (const src of collectItemListImages()) {
  if (src.startsWith("/images/generated/carousel/square/")) continue;
  const file = path.join(PUBLIC, src);
  if (!fs.existsSync(file)) continue;
  const meta = await sharp(file).metadata();
  if (!meta.width || !meta.height || Math.abs(meta.width - meta.height) <= 2) continue;
  const size = Math.min(meta.width, meta.height, MAX);
  // 파일 이름은 ASCII로(한글 파일명 인코딩 문제 방지) — 원본 경로의 해시
  const name = `${crypto.createHash("sha1").update(src).digest("hex").slice(0, 12)}.webp`;
  const target = path.join(SQUARE_DIR, name);
  const fresh = fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(file).mtimeMs;
  if (!fresh) {
    await sharp(file)
      .resize(size, size, { fit: "cover", position: "centre" })
      .webp({ quality: 90, effort: 6 })
      .toFile(target);
    created++;
  } else {
    skipped++;
  }
  map[src] = `/images/generated/carousel/square/${name}`;
}
const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(MAP_FILE, JSON.stringify(sorted, null, 1) + "\n", "utf8");
console.log(`[carousel-squares] 새로 만든 사본 ${created}개, 최신 유지 ${skipped}개, 대응표 ${Object.keys(sorted).length}개`);
if (created > 0) console.log("[carousel-squares] 새 사본이 생겼습니다. npm run build 를 다시 실행하면 캐러셀에 반영됩니다.");
