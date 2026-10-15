#!/usr/bin/env node
/**
 * 대표 페이지 본문 갤러리용 1:1 이미지(1200×1200) — 실제 사무소·법무사 사진 + 가운데 글자 패널.
 * - 사진: public/image 원본을 자르고 줄이기만 한다(얼굴 편집·AI 생성 없음). 얼굴을 위쪽 1/5 근처에 두고 패널은 몸·책상 위에 둔다.
 * - 글자: Noto Sans KR(SIL OFL 1.1) — 가운데 높이(약 31%–69%)에 크게. 가장자리가 잘려도 제목은 남는다.
 * - 문구는 각 페이지 본문에 이미 있는 사실만 쓴다(gallery-data.mjs).
 * 출력: public/image/cards/gallery/<file>.jpg
 * 사용: node build-gallery.mjs [file ...]  (인자가 있으면 해당 파일만)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { PHOTOS, GALLERY } from "./gallery-data.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../..");
const OUT = path.join(ROOT, "public/image/cards/gallery");
fs.mkdirSync(OUT, { recursive: true });

const S = 1200;
const FONT = "Noto Sans KR";
const P = { x: 64, y: 404, w: S - 128, h: 440, r: 34 }; // 가운데 패널
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const THEMES = {
  dark: { fill: "#13284a", alpha: 0.8, title: "#fbf8f2", kicker: "#d9bd86", sub: "#e7dcc8", line: "#c9a86a" },
  light: { fill: "#f8f4ec", alpha: 0.9, title: "#13284a", kicker: "#94743f", sub: "#3b4c66", line: "#b8955a" },
};

function cropBox(meta, ph) {
  const { width: W, height: H } = meta;
  const target = ph.faceY ?? 0.2; // 정사각형 안에서 얼굴 높이
  let s = Math.min(H, W, (H * (1 - ph.fy)) / (1 - target), ph.maxSide ?? Infinity);
  s = Math.round(s);
  let top = Math.round(ph.fy * H - target * s);
  top = Math.max(0, Math.min(H - s, top));
  let left = Math.round(ph.fx * W - (ph.faceX ?? 0.5) * s);
  left = Math.max(0, Math.min(W - s, left));
  return { left, top, width: s, height: s };
}

function fitTitle(lines) {
  const n = Math.max(...lines.map((t) => [...t].length));
  if (n <= 5) return 120;
  if (n <= 6) return 116;
  if (n <= 7) return 108;
  return 98;
}

function overlaySvg(c, theme) {
  const t = THEMES[theme];
  const fs = fitTitle(c.title);
  const cx = S / 2;
  // 제목 두 줄을 패널 가운데에 두고, 위에 kicker·아래에 sub를 붙인다(글자 크기와 무관하게 패널 안에 들어간다)
  const gap = Math.round(fs * 1.04);
  const yc = P.y + P.h / 2 + 4;
  const t1 = Math.round(yc - ((c.title.length - 1) * gap) / 2 + fs * 0.36); // 첫 줄 기준선
  const kickerY = Math.round(t1 - fs * 0.8 - 34);
  const title = c.title
    .map((line, i) => `<text x="${cx}" y="${t1 + i * gap}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${fs}" letter-spacing="-3" fill="${t.title}">${esc(line)}</text>`)
    .join("");
  const subY = t1 + (c.title.length - 1) * gap + 64;
  const kw = [...c.kicker].length * 32 + 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
  <defs>
    <linearGradient id="b" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#0d1b33" stop-opacity="0.18"/>
      <stop offset="0.3" stop-color="#0d1b33" stop-opacity="0"/>
      <stop offset="0.72" stop-color="#0d1b33" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#0d1b33" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="${S}" height="${S}" fill="url(#b)"/>
  <rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" rx="${P.r}" fill="${t.fill}" fill-opacity="${t.alpha}"/>
  <rect x="${P.x + 14}" y="${P.y + 14}" width="${P.w - 28}" height="${P.h - 28}" rx="${P.r - 10}" fill="none" stroke="${t.line}" stroke-opacity="0.75" stroke-width="2"/>
  <line x1="${cx - kw / 2 - 64}" y1="${kickerY - 11}" x2="${cx - kw / 2 - 8}" y2="${kickerY - 11}" stroke="${t.line}" stroke-width="2.5"/>
  <line x1="${cx + kw / 2 + 8}" y1="${kickerY - 11}" x2="${cx + kw / 2 + 64}" y2="${kickerY - 11}" stroke="${t.line}" stroke-width="2.5"/>
  <text x="${cx}" y="${kickerY}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="34" letter-spacing="1" fill="${t.kicker}">${esc(c.kicker)}</text>
  ${title}
  <text x="${cx}" y="${subY}" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="34" fill="${t.sub}">${esc(c.sub)}</text>
  <text x="${cx}" y="${S - 58}" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="30" letter-spacing="2" fill="#f3ead9" fill-opacity="0.95">다옴법무사사무소 · 안윤정 법무사</text>
</svg>`;
}

const only = new Set(process.argv.slice(2));
const metaCache = new Map();
const rows = [];
for (const g of GALLERY) {
  for (const [i, c] of g.cards.entries()) {
    if (only.size && !only.has(c.file)) continue;
    const ph = PHOTOS[c.photo];
    if (!ph) throw new Error(`photo ${c.photo}`);
    const src = path.join(ROOT, "public/image", ph.file);
    if (!metaCache.has(src)) metaCache.set(src, await sharp(src).rotate().metadata());
    const meta = metaCache.get(src);
    const box = cropBox(meta.orientation >= 5 ? { width: meta.height, height: meta.width } : meta, ph);
    const base = await sharp(src).rotate().extract(box).resize(S, S).toBuffer();
    // 패널 뒤쪽만 흐리게(유리 질감) — 얼굴이 있는 위쪽은 원본 그대로
    const blurred = await sharp(base).extract({ left: P.x, top: P.y, width: P.w, height: P.h }).blur(18).toBuffer();
    const mask = Buffer.from(`<svg width="${P.w}" height="${P.h}"><rect width="${P.w}" height="${P.h}" rx="${P.r}" fill="#fff"/></svg>`);
    const glass = await sharp(blurred).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    const theme = c.theme ?? (i % 2 === 0 ? "dark" : "light");
    const out = path.join(OUT, `${c.file}.jpg`);
    await sharp(base)
      .composite([{ input: glass, left: P.x, top: P.y }, { input: Buffer.from(overlaySvg(c, theme)), left: 0, top: 0 }])
      .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(out);
    rows.push({ path: g.path, file: c.file, bytes: fs.statSync(out).size, photo: ph.file, box });
    console.log(g.path, c.file, fs.statSync(out).size);
  }
}
if (!only.size) fs.writeFileSync(path.join(ROOT, "reports/naver-carousel-2026-10-15/gallery.json"), JSON.stringify(rows, null, 1));
