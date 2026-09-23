/**
 * SERP 대표 JPG(무텍스트) + 카드 WebP 생성
 * Usage: npm run visuals:generate
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getThumbnailPortrait } from "../src/data/media/thumbnail-portraits";
import {
  PAGE_VISUALS,
  VISUAL_DESIGN_VERSION,
  type PageVisual,
} from "../src/data/seo/page-visuals";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const CACHE_DIR = path.join(ROOT, ".cache", "page-visuals");
const CACHE_MAP = path.join(CACHE_DIR, "hash-map.json");
const SIZE = 1200;
const CARD_SIZE = 720;

/** 카테고리별 은은한 grade (얼굴 형태는 변경하지 않음) */
const CATEGORY_GRADE: Record<
  string,
  { brightness: number; saturation: number; tint?: string; tintOpacity: number }
> = {
  inheritance: { brightness: 1.03, saturation: 0.96, tint: "#f3e9d8", tintOpacity: 0.08 },
  realestate: { brightness: 1.02, saturation: 0.97, tint: "#e6ebf2", tintOpacity: 0.1 },
  corporate: { brightness: 1.01, saturation: 0.94, tint: "#dfe5ee", tintOpacity: 0.12 },
  rehabilitation: { brightness: 1.02, saturation: 0.92, tint: "#e8ebf0", tintOpacity: 0.1 },
  lease: { brightness: 1.02, saturation: 0.95, tint: "#e4efef", tintOpacity: 0.1 },
  lecture: { brightness: 1.04, saturation: 0.98, tint: "#eef2f7", tintOpacity: 0.08 },
  local: { brightness: 1.03, saturation: 0.97, tint: "#eef2f7", tintOpacity: 0.08 },
  services: { brightness: 1.03, saturation: 0.97, tint: "#eef2f7", tintOpacity: 0.08 },
  office: { brightness: 1.03, saturation: 0.97, tint: "#eef2f7", tintOpacity: 0.08 },
  civil: { brightness: 1.02, saturation: 0.95, tint: "#e8ebf0", tintOpacity: 0.1 },
};

function loadCache(): Record<string, string> {
  if (!existsSync(CACHE_MAP)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_MAP, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

function saveCache(map: Record<string, string>) {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_MAP, JSON.stringify(map, null, 2), "utf8");
}

function contentHash(item: PageVisual): string {
  const portrait = getThumbnailPortrait(item.sourcePortrait);
  return createHash("sha256")
    .update(
      JSON.stringify({
        v: VISUAL_DESIGN_VERSION,
        url: item.url,
        portrait: item.sourcePortrait,
        crop: portrait?.crop,
        composition: item.composition,
        category: item.category,
        serp: item.representativeImage,
        card: item.cardImage,
      }),
    )
    .digest("hex")
    .slice(0, 16);
}

/** slug hash → crop nudge (고유성, 얼굴은 중앙에서 크게 벗어나지 않음) */
function cropNudge(url: string): { dx: number; dy: number; scale: number } {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
  const dx = ((h % 9) - 4) * 0.008; // -0.032 ~ 0.032
  const dy = (((h >> 4) % 7) - 3) * 0.006;
  const scale = 1 + (((h >> 8) % 5) - 2) * 0.012; // 0.976 ~ 1.024
  return { dx, dy, scale };
}

async function buildSquarePhoto(item: PageVisual): Promise<Buffer> {
  const portrait = getThumbnailPortrait(item.sourcePortrait);
  if (!portrait) throw new Error(`portrait missing ${item.sourcePortrait}`);
  const disk = path.join(
    PUBLIC,
    decodeURIComponent(portrait.src).replace(/^\//, ""),
  );
  if (!existsSync(disk)) throw new Error(`source missing ${portrait.src}`);

  const meta = await sharp(disk).metadata();
  const sw = meta.width ?? 0;
  const sh = meta.height ?? 0;
  const nudge = cropNudge(item.url);

  let cx = portrait.crop.x + portrait.crop.width / 2 + nudge.dx;
  let cy = portrait.crop.y + portrait.crop.height / 2 + nudge.dy;
  let side = Math.min(portrait.crop.width, portrait.crop.height) / nudge.scale;
  side = Math.min(side, 1);
  cx = Math.min(1 - side / 2, Math.max(side / 2, cx));
  cy = Math.min(1 - side / 2, Math.max(side / 2, cy));

  const left = Math.round((cx - side / 2) * sw);
  const top = Math.round((cy - side / 2) * sh);
  const width = Math.round(side * sw);
  const height = Math.round(side * sh);
  const extract = {
    left: Math.max(0, Math.min(left, sw - width)),
    top: Math.max(0, Math.min(top, sh - height)),
    width: Math.min(width, sw),
    height: Math.min(height, sh),
  };

  const grade = CATEGORY_GRADE[item.category] ?? CATEGORY_GRADE.services;
  let pipeline = sharp(disk)
    .extract(extract)
    .resize(SIZE, SIZE, { fit: "cover", position: "centre" })
    .modulate({ brightness: grade.brightness, saturation: grade.saturation });

  const layers: { input: Buffer; left: number; top: number }[] = [];

  // 아주 약한 vignette (가장자리만, 얼굴 중앙은 유지)
  const vignette = Buffer.from(
    `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="42%" r="72%">
          <stop offset="55%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.18"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`,
  );
  layers.push({
    input: await sharp(vignette).png().toBuffer(),
    left: 0,
    top: 0,
  });

  if (grade.tint) {
    const tint = Buffer.from(
      `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${grade.tint}" fill-opacity="${grade.tintOpacity}"/>
      </svg>`,
    );
    layers.push({
      input: await sharp(tint).png().toBuffer(),
      left: 0,
      top: 0,
    });
  }

  // composition에 따른 아주 얇은 editorial frame (텍스트 없음)
  const frameAccent =
    item.category === "corporate"
      ? "#1e3a5f"
      : item.category === "inheritance"
        ? "#5c6b4a"
        : item.category === "realestate"
          ? "#3d5a80"
          : "#44546a";
  // URL hash로 프레임 두께·위치를 미세 조정해 exact duplicate 방지
  let uh = 0;
  for (let i = 0; i < item.url.length; i++) uh = (uh * 31 + item.url.charCodeAt(i)) >>> 0;
  const inset = 24 + (uh % 12);
  const stroke = 1.5 + ((uh >> 3) % 3) * 0.5;
  const frame = Buffer.from(
    `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${inset}" y="${inset}" width="${SIZE - inset * 2}" height="${SIZE - inset * 2}" fill="none" stroke="${frameAccent}" stroke-opacity="0.2" stroke-width="${stroke}"/>
      <rect x="${8 + (uh % 5)}" y="${SIZE - 22}" width="${48 + (uh % 40)}" height="3" fill="${frameAccent}" fill-opacity="0.18"/>
    </svg>`,
  );
  layers.push({
    input: await sharp(frame).png().toBuffer(),
    left: 0,
    top: 0,
  });

  return pipeline.composite(layers).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}

async function generateOne(item: PageVisual, force: boolean) {
  const hash = contentHash(item);
  const cache = loadCache();
  const serpDisk = path.join(PUBLIC, item.representativeImage.replace(/^\//, ""));
  const cardDisk = path.join(PUBLIC, item.cardImage.replace(/^\//, ""));
  mkdirSync(path.dirname(serpDisk), { recursive: true });
  mkdirSync(path.dirname(cardDisk), { recursive: true });

  if (
    !force &&
    cache[item.url] === hash &&
    existsSync(serpDisk) &&
    existsSync(cardDisk)
  ) {
    return { url: item.url, ok: true, skipped: true, bytes: statSync(serpDisk).size };
  }

  const jpeg = await buildSquarePhoto(item);
  await sharp(jpeg).toFile(serpDisk);
  await sharp(jpeg)
    .resize(CARD_SIZE, CARD_SIZE)
    .webp({ quality: 80 })
    .toFile(cardDisk);

  const meta = await sharp(serpDisk).metadata();
  if (meta.width !== SIZE || meta.height !== SIZE) {
    return { url: item.url, ok: false, reason: `size ${meta.width}x${meta.height}` };
  }
  const bytes = statSync(serpDisk).size;
  if (bytes < 5 * 1024) {
    return { url: item.url, ok: false, reason: `too small ${bytes}` };
  }

  cache[item.url] = hash;
  saveCache(cache);
  return { url: item.url, ok: true, bytes, skipped: false };
}

async function contactSheet() {
  const dir = path.join(ROOT, "reports", "image-seo", "contact-sheets");
  mkdirSync(dir, { recursive: true });
  const tiles: Buffer[] = [];
  for (const item of PAGE_VISUALS.slice(0, 30)) {
    const disk = path.join(PUBLIC, item.representativeImage.replace(/^\//, ""));
    if (!existsSync(disk)) continue;
    tiles.push(await sharp(disk).resize(240, 240).jpeg({ quality: 80 }).toBuffer());
  }
  if (!tiles.length) return;
  const cols = 5;
  const rows = Math.ceil(tiles.length / cols);
  await sharp({
    create: {
      width: cols * 240,
      height: rows * 240,
      channels: 3,
      background: "#f7f4ef",
    },
  })
    .composite(
      tiles.map((input, i) => ({
        input,
        left: (i % cols) * 240,
        top: Math.floor(i / cols) * 240,
      })),
    )
    .jpeg({ quality: 85 })
    .toFile(path.join(dir, "all-01.jpg"));

  const byCat = new Map<string, typeof PAGE_VISUALS>();
  for (const v of PAGE_VISUALS) {
    const list = byCat.get(v.category) ?? [];
    list.push(v);
    byCat.set(v.category, list);
  }
  for (const [cat, list] of byCat) {
    const catTiles: Buffer[] = [];
    for (const item of list) {
      const disk = path.join(PUBLIC, item.representativeImage.replace(/^\//, ""));
      if (!existsSync(disk)) continue;
      catTiles.push(
        await sharp(disk).resize(220, 220).jpeg({ quality: 80 }).toBuffer(),
      );
    }
    if (!catTiles.length) continue;
    const c = Math.min(4, catTiles.length);
    const r = Math.ceil(catTiles.length / c);
    await sharp({
      create: {
        width: c * 220,
        height: r * 220,
        channels: 3,
        background: "#f7f4ef",
      },
    })
      .composite(
        catTiles.map((input, i) => ({
          input,
          left: (i % c) * 220,
          top: Math.floor(i / c) * 220,
        })),
      )
      .jpeg({ quality: 85 })
      .toFile(path.join(dir, `${cat}.jpg`));
  }
}

async function main() {
  const force = process.argv.includes("--force");
  const results = [];
  for (const item of PAGE_VISUALS) {
    try {
      results.push(await generateOne(item, force));
    } catch (e) {
      results.push({ url: item.url, ok: false, reason: String(e) });
    }
  }
  await contactSheet();
  const ok = results.filter((r) => r.ok && !("skipped" in r && r.skipped)).length;
  const skipped = results.filter((r) => "skipped" in r && r.skipped).length;
  const failed = results.filter((r) => !r.ok);
  const sizes = results
    .filter((r) => "bytes" in r && r.bytes)
    .map((r) => (r as { bytes: number }).bytes);
  console.log(
    JSON.stringify(
      {
        generated: ok,
        skipped,
        failed,
        avgKb: sizes.length
          ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length / 1024)
          : 0,
        maxKb: sizes.length ? Math.round(Math.max(...sizes) / 1024) : 0,
        designVersion: VISUAL_DESIGN_VERSION,
        contactSheet: "reports/image-seo/contact-sheets/all-01.jpg",
      },
      null,
      2,
    ),
  );
  if (failed.length) process.exitCode = 1;
}

main();
