/**
 * 1:1 에디토리얼 페이지 썸네일 생성 (로컬 전용 — 배포 prebuild에 묶지 않음)
 *
 * - 원본 법무사 사진은 수정하지 않음 (crop/resize/gradient/typography만)
 * - 출력: public/generated/thumbnails/<category>/<slug>.webp (1200×1200)
 * - hash cache: .cache/thumbnails/hash-map.json
 *
 * Usage:
 *   npm run thumbnails:generate
 *   npm run thumbnails:generate -- --batch=30
 *   npm run thumbnails:generate -- --force
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
import {
  getThumbnailPortrait,
  type NormalizedBox,
  type ThumbnailPortrait,
} from "../src/data/media/thumbnail-portraits";
import {
  PAGE_THUMBNAILS,
  THUMBNAIL_DESIGN_VERSION,
  type PageThumbnailItem,
  type ThumbnailTemplate,
} from "../src/data/seo/page-thumbnails";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const CACHE_DIR = path.join(ROOT, ".cache", "thumbnails");
const CACHE_MAP = path.join(CACHE_DIR, "hash-map.json");
const SIZE = 1200;
const SAFE_MARGIN = 0.1; // 10%
const QUALITY = 84;
const FONT = `'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif`;

const CATEGORY_TINT: Record<
  string,
  { overlay: string; text: string; soft: string }
> = {
  inheritance: { overlay: "rgba(45, 55, 40, 0.42)", text: "#f7f4ef", soft: "rgba(247,244,239,0.12)" },
  realestate: { overlay: "rgba(30, 48, 72, 0.44)", text: "#f7f4ef", soft: "rgba(240,235,227,0.12)" },
  corporate: { overlay: "rgba(15, 31, 51, 0.48)", text: "#f7f4ef", soft: "rgba(232,235,240,0.12)" },
  rehabilitation: { overlay: "rgba(55, 65, 75, 0.46)", text: "#f7f4ef", soft: "rgba(232,235,240,0.1)" },
  lease: { overlay: "rgba(35, 60, 65, 0.44)", text: "#f7f4ef", soft: "rgba(240,235,227,0.1)" },
  lecture: { overlay: "rgba(30, 58, 95, 0.4)", text: "#f7f4ef", soft: "rgba(247,244,239,0.14)" },
  local: { overlay: "rgba(30, 58, 95, 0.42)", text: "#f7f4ef", soft: "rgba(247,244,239,0.12)" },
  office: { overlay: "rgba(30, 58, 95, 0.42)", text: "#f7f4ef", soft: "rgba(247,244,239,0.12)" },
  services: { overlay: "rgba(30, 58, 95, 0.42)", text: "#f7f4ef", soft: "rgba(247,244,239,0.12)" },
  civil: { overlay: "rgba(45, 55, 65, 0.44)", text: "#f7f4ef", soft: "rgba(247,244,239,0.12)" },
};

type Rect = { x: number; y: number; w: number; h: number };

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function intersects(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

function toPx(box: NormalizedBox): Rect {
  return {
    x: box.x * SIZE,
    y: box.y * SIZE,
    w: box.width * SIZE,
    h: box.height * SIZE,
  };
}

function contentHash(item: PageThumbnailItem, portrait: ThumbnailPortrait): string {
  const payload = JSON.stringify({
    v: THUMBNAIL_DESIGN_VERSION,
    designVersion: item.designVersion,
    url: item.url,
    headline: item.headline,
    template: item.template,
    portraitId: portrait.id,
    src: portrait.src,
    crop: portrait.crop,
    faceSafeBox: portrait.faceSafeBox,
    category: item.category,
  });
  return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}

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

function estimateTextBox(
  lines: string[],
  fontSize: number,
  cx: number,
  cy: number,
  align: "start" | "middle" | "end",
): Rect {
  const lineH = fontSize * 1.22;
  const maxChars = Math.max(...lines.map((l) => l.length), 1);
  // 한글 대략 폭 ≈ fontSize * 0.95
  const textW = maxChars * fontSize * 0.95;
  const textH = lines.length * lineH;
  let x = cx;
  if (align === "middle") x = cx - textW / 2;
  if (align === "end") x = cx - textW;
  const y = cy - fontSize * 0.85;
  return { x, y, w: textW, h: textH + fontSize * 0.2 };
}

type LayoutPlan = {
  textX: number;
  textY: number;
  align: "start" | "middle" | "end";
  fontSize: number;
  gradient: string;
  textBox: Rect;
};

function planLayout(
  template: ThumbnailTemplate,
  lines: string[],
  faceSafe: Rect,
): LayoutPlan {
  const margin = SAFE_MARGIN * SIZE;
  const candidates: Array<Omit<LayoutPlan, "textBox" | "fontSize"> & { fontSize?: number }> = [];

  const push = (
    textX: number,
    textY: number,
    align: "start" | "middle" | "end",
    gradient: string,
    fontSize = 78,
  ) => {
    candidates.push({ textX, textY, align, gradient, fontSize });
  };

  switch (template) {
    case "EDITORIAL_LEFT":
      push(margin + 20, SIZE * 0.42, "start", leftGradient(), 82);
      push(margin + 20, SIZE * 0.55, "start", leftGradient(), 76);
      push(SIZE * 0.5, SIZE * 0.72, "middle", bottomGradient(), 72);
      break;
    case "EDITORIAL_RIGHT":
      push(SIZE - margin - 20, SIZE * 0.42, "end", rightGradient(), 82);
      push(SIZE - margin - 20, SIZE * 0.55, "end", rightGradient(), 76);
      push(SIZE * 0.5, SIZE * 0.72, "middle", bottomGradient(), 72);
      break;
    case "CENTER_LOW":
      push(SIZE * 0.5, SIZE * 0.78, "middle", bottomGradient(), 78);
      push(SIZE * 0.5, SIZE * 0.7, "middle", bottomGradient(), 72);
      push(margin + 20, SIZE * 0.42, "start", leftGradient(), 70);
      break;
    case "CENTER_HIGH":
      push(SIZE * 0.5, SIZE * 0.22, "middle", topGradient(), 78);
      push(SIZE * 0.5, SIZE * 0.28, "middle", topGradient(), 72);
      push(margin + 20, SIZE * 0.55, "start", leftGradient(), 70);
      break;
    case "SOFT_SPLIT_LEFT":
      push(SIZE * 0.28, SIZE * 0.48, "middle", leftGradient(0.55), 80);
      push(margin + 20, SIZE * 0.48, "start", leftGradient(), 74);
      push(SIZE * 0.5, SIZE * 0.75, "middle", bottomGradient(), 70);
      break;
    case "SOFT_SPLIT_RIGHT":
      push(SIZE * 0.68, SIZE * 0.48, "middle", rightGradient(0.55), 80);
      push(SIZE - margin - 20, SIZE * 0.48, "end", rightGradient(), 74);
      push(SIZE * 0.5, SIZE * 0.75, "middle", bottomGradient(), 70);
      break;
  }

  for (const c of candidates) {
    let fontSize = c.fontSize ?? 78;
    while (fontSize >= 58) {
      const textBox = estimateTextBox(lines, fontSize, c.textX, c.textY, c.align);
      const withinSafe =
        textBox.x >= margin * 0.85 &&
        textBox.y >= margin * 0.85 &&
        textBox.x + textBox.w <= SIZE - margin * 0.85 &&
        textBox.y + textBox.h <= SIZE - margin * 0.85;
      const coreOk =
        textBox.x >= SIZE * 0.12 &&
        textBox.x + textBox.w <= SIZE * 0.88;
      if (withinSafe && coreOk && !intersects(textBox, faceSafe)) {
        return { ...c, fontSize, textBox };
      }
      fontSize -= 4;
    }
  }

  // 최후: 하단 중앙 + 작은 글씨 (얼굴 위는 절대 금지 — 하단이 비어 있을 때)
  const fallbackY = faceSafe.y + faceSafe.h < SIZE * 0.65 ? SIZE * 0.78 : SIZE * 0.18;
  const align: "middle" = "middle";
  const fontSize = 60;
  const textBox = estimateTextBox(lines, fontSize, SIZE * 0.5, fallbackY, align);
  if (intersects(textBox, faceSafe)) {
    throw new Error("face/text collision unresolved");
  }
  return {
    textX: SIZE * 0.5,
    textY: fallbackY,
    align,
    fontSize,
    gradient: fallbackY > SIZE * 0.5 ? bottomGradient() : topGradient(),
    textBox,
  };
}

function leftGradient(opacity = 0.5): string {
  return `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#0f1f33" stop-opacity="${opacity}"/>
    <stop offset="55%" stop-color="#0f1f33" stop-opacity="${opacity * 0.35}"/>
    <stop offset="100%" stop-color="#0f1f33" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#g)"/>`;
}

function rightGradient(opacity = 0.5): string {
  return `<defs><linearGradient id="g" x1="1" y1="0" x2="0" y2="0">
    <stop offset="0%" stop-color="#0f1f33" stop-opacity="${opacity}"/>
    <stop offset="55%" stop-color="#0f1f33" stop-opacity="${opacity * 0.35}"/>
    <stop offset="100%" stop-color="#0f1f33" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#g)"/>`;
}

function bottomGradient(): string {
  return `<defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="#0f1f33" stop-opacity="0.58"/>
    <stop offset="55%" stop-color="#0f1f33" stop-opacity="0.22"/>
    <stop offset="100%" stop-color="#0f1f33" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#g)"/>`;
}

function topGradient(): string {
  return `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0f1f33" stop-opacity="0.55"/>
    <stop offset="55%" stop-color="#0f1f33" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="#0f1f33" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#g)"/>`;
}

async function cropPortrait(portrait: ThumbnailPortrait): Promise<Buffer> {
  const disk = path.join(PUBLIC, decodeURIComponent(portrait.src).replace(/^\//, ""));
  if (!existsSync(disk)) throw new Error(`missing source ${portrait.src}`);
  const meta = await sharp(disk).metadata();
  const sw = meta.width ?? 0;
  const sh = meta.height ?? 0;
  if (!sw || !sh) throw new Error(`bad dimensions ${portrait.src}`);

  const left = Math.round(portrait.crop.x * sw);
  const top = Math.round(portrait.crop.y * sh);
  const width = Math.round(portrait.crop.width * sw);
  const height = Math.round(portrait.crop.height * sh);
  const side = Math.min(width, height);
  const extract = {
    left: Math.max(0, Math.min(left, sw - side)),
    top: Math.max(0, Math.min(top, sh - side)),
    width: side,
    height: side,
  };

  return sharp(disk)
    .extract(extract)
    .resize(SIZE, SIZE, { fit: "cover", position: "centre" })
    .modulate({ brightness: 1.02, saturation: 0.98 })
    .toBuffer();
}

function textSvg(
  lines: string[],
  plan: LayoutPlan,
  textColor: string,
): Buffer {
  const lineH = plan.fontSize * 1.22;
  const tspans = lines
    .map((line, i) => {
      const dy = i === 0 ? 0 : lineH;
      return `<tspan x="${plan.textX}" dy="${dy}">${esc(line)}</tspan>`;
    })
    .join("");

  const svg = `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
    ${plan.gradient}
    <text x="${plan.textX}" y="${plan.textY}" font-family="${FONT}" font-size="${plan.fontSize}" font-weight="800" fill="${textColor}" text-anchor="${plan.align}" dominant-baseline="alphabetic">${tspans}</text>
  </svg>`;
  return Buffer.from(svg);
}

async function generateOne(
  item: PageThumbnailItem,
): Promise<{
  url: string;
  ok: boolean;
  skipped?: boolean;
  bytes?: number;
  reason?: string;
  hash?: string;
}> {
  const portrait = getThumbnailPortrait(item.sourcePortrait);
  if (!portrait) {
    return { url: item.url, ok: false, reason: `portrait missing: ${item.sourcePortrait}` };
  }

  const lines = item.headline
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0 || lines.length > 2) {
    return { url: item.url, ok: false, reason: "headline must be 1–2 lines" };
  }

  const hash = contentHash(item, portrait);
  const outDisk = path.join(PUBLIC, item.output.replace(/^\//, ""));
  mkdirSync(path.dirname(outDisk), { recursive: true });

  const cache = loadCache();
  if (
    !process.argv.includes("--force") &&
    cache[item.url] === hash &&
    existsSync(outDisk)
  ) {
    return { url: item.url, ok: true, skipped: true, hash, bytes: statSync(outDisk).size };
  }

  try {
    const faceSafe = toPx(portrait.faceSafeBox);
    const plan = planLayout(item.template, lines, faceSafe);
    const tint = CATEGORY_TINT[item.category] ?? CATEGORY_TINT.services;
    const photo = await cropPortrait(portrait);
    const overlay = textSvg(lines, plan, tint.text);

    await sharp(photo)
      .composite([{ input: await sharp(overlay).png().toBuffer(), left: 0, top: 0 }])
      .webp({ quality: QUALITY })
      .toFile(outDisk);

    const bytes = statSync(outDisk).size;
    const meta = await sharp(outDisk).metadata();
    if (meta.width !== SIZE || meta.height !== SIZE) {
      return { url: item.url, ok: false, reason: `bad size ${meta.width}x${meta.height}` };
    }
    if (bytes > 500 * 1024) {
      return { url: item.url, ok: false, reason: `file too large ${bytes}` };
    }

    cache[item.url] = hash;
    saveCache(cache);
    return { url: item.url, ok: true, bytes, hash };
  } catch (e) {
    return { url: item.url, ok: false, reason: String(e) };
  }
}

async function writeContactSheet(items: PageThumbnailItem[]) {
  const reportDir = path.join(ROOT, "reports", "thumbnails");
  mkdirSync(reportDir, { recursive: true });

  const byCat = new Map<string, PageThumbnailItem[]>();
  for (const item of items) {
    const list = byCat.get(item.category) ?? [];
    list.push(item);
    byCat.set(item.category, list);
  }

  const allTiles: Buffer[] = [];
  for (const item of items.slice(0, 30)) {
    const disk = path.join(PUBLIC, item.output.replace(/^\//, ""));
    if (!existsSync(disk)) continue;
    allTiles.push(
      await sharp(disk)
        .resize(300, 300)
        .jpeg({ quality: 82 })
        .toBuffer(),
    );
  }

  if (allTiles.length) {
    const cols = 5;
    const rows = Math.ceil(allTiles.length / cols);
    const composites = allTiles.map((input, i) => ({
      input,
      left: (i % cols) * 300,
      top: Math.floor(i / cols) * 300,
    }));
    await sharp({
      create: {
        width: cols * 300,
        height: rows * 300,
        channels: 3,
        background: "#f7f4ef",
      },
    })
      .composite(composites)
      .jpeg({ quality: 85 })
      .toFile(path.join(reportDir, "contact-sheet.jpg"));
  }

  for (const [cat, list] of byCat) {
    const tiles: Buffer[] = [];
    for (const item of list) {
      const disk = path.join(PUBLIC, item.output.replace(/^\//, ""));
      if (!existsSync(disk)) continue;
      tiles.push(await sharp(disk).resize(280, 280).jpeg({ quality: 82 }).toBuffer());
    }
    if (!tiles.length) continue;
    const cols = Math.min(4, tiles.length);
    const rows = Math.ceil(tiles.length / cols);
    await sharp({
      create: {
        width: cols * 280,
        height: rows * 280,
        channels: 3,
        background: "#f7f4ef",
      },
    })
      .composite(
        tiles.map((input, i) => ({
          input,
          left: (i % cols) * 280,
          top: Math.floor(i / cols) * 280,
        })),
      )
      .jpeg({ quality: 85 })
      .toFile(path.join(reportDir, `contact-sheet-${cat}.jpg`));
  }
}

async function main() {
  const batchArg = process.argv.find((a) => a.startsWith("--batch="));
  const batch = batchArg ? Number(batchArg.split("=")[1]) : PAGE_THUMBNAILS.length;
  const targets = PAGE_THUMBNAILS.slice(0, Number.isFinite(batch) ? batch : 30);

  const results = [];
  for (const item of targets) {
    results.push(await generateOne(item));
  }

  await writeContactSheet(targets.filter((_, i) => results[i]?.ok));

  const ok = results.filter((r) => r.ok && !r.skipped).length;
  const skipped = results.filter((r) => r.skipped).length;
  const failed = results.filter((r) => !r.ok);
  const sizes = results.filter((r) => r.bytes).map((r) => r.bytes as number);
  const avg = sizes.length
    ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length / 1024)
    : 0;
  const max = sizes.length ? Math.round(Math.max(...sizes) / 1024) : 0;

  console.log(
    JSON.stringify(
      {
        generated: ok,
        skipped,
        failed,
        avgKb: avg,
        maxKb: max,
        contactSheet: "reports/thumbnails/contact-sheet.jpg",
        designVersion: THUMBNAIL_DESIGN_VERSION,
      },
      null,
      2,
    ),
  );

  if (failed.length) process.exitCode = 1;
}

main();
