#!/usr/bin/env node
/**
 * 텍스트 카드 v2 — 가로형(1200×600, 본문 figure용)과 1:1 master(1200×1200, 블로그·공유·목록용)를 함께 만든다.
 * - 사진: public/image 원본(덮어쓰기·얼굴 편집 없음), sharp attention 크롭·축소만.
 * - 글자: Noto Sans KR(SIL OFL 1.1, C:/Windows/Fonts/NotoSansKR-VF.ttf) SVG 합성.
 * - 기존 7종 가로형(reports/naver-12kw-2026-10-13/cards)은 같은 파일 경로로 다시 쓰지 않는다(SKIP_LANDSCAPE).
 * 출력: public/image/cards/<id>.jpg(가로), public/image/cards/square/<id>.jpg(1:1)
 * 편집 소스: reports/naver-15kw-2026-10-14/cards/src/<id>-{landscape,square}.svg, cards.json
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { CARDS } from "./cards-data.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../../..");
const OUT = path.join(ROOT, "public/image/cards");
const OUT_SQ = path.join(OUT, "square");
const SRC = path.join(ROOT, "reports/naver-15kw-2026-10-14/cards/src");
for (const d of [OUT, OUT_SQ, SRC]) fs.mkdirSync(d, { recursive: true });

const FONT = "Noto Sans KR";
const NAVY = "#1b3354";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function landscapeSvg(c) {
  const W = 1200, H = 600, PANEL = 560;
  // 긴 줄(8자 이상)은 글자 패널(약 480px)을 넘지 않게 줄인다
  const longest = Math.max(...c.title.map((t) => t.length));
  const fs = longest >= 8 ? 64 : 78;
  const title = c.title.map((t, i) => `<text x="72" y="${232 + i * 92}" font-family="${FONT}" font-weight="800" font-size="${fs}" letter-spacing="-1.5" fill="#f7f4ef">${esc(t)}</text>`).join("");
  const sub = c.sub.map((t, i) => `<text x="74" y="${398 + i * 40}" font-family="${FONT}" font-weight="500" font-size="27" fill="#e2d5bf">${esc(t)}</text>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="f" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${NAVY}"/><stop offset="0.82" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY}" stop-opacity="0"/></linearGradient></defs>
  <rect width="${PANEL + 90}" height="${H}" fill="url(#f)"/>
  <rect x="72" y="118" width="44" height="4" rx="2" fill="#c4b7a3"/>
  <text x="128" y="128" font-family="${FONT}" font-weight="700" font-size="26" fill="#c4b7a3">${esc(c.kicker)}</text>
  ${title}${sub}
  <rect x="72" y="514" width="8" height="8" transform="rotate(45 76 518)" fill="#c4b7a3"/>
  <text x="94" y="527" font-family="${FONT}" font-weight="600" font-size="22" fill="#cfc3ae">다옴법무사사무소 · 안윤정 법무사</text>
</svg>`;
}

function squareSvg(c) {
  const S = 1200, PH = 680; // 위 680px 사진, 아래 520px 글자 패널
  const title = c.title.map((t, i) => `<text x="84" y="${PH + 158 + i * 102}" font-family="${FONT}" font-weight="800" font-size="90" letter-spacing="-2" fill="#f7f4ef">${esc(t)}</text>`).join("");
  const sub = c.sub.map((t, i) => `<text x="86" y="${PH + 372 + i * 44}" font-family="${FONT}" font-weight="500" font-size="31" fill="#e2d5bf">${esc(t)}</text>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
  <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${NAVY}" stop-opacity="0"/><stop offset="1" stop-color="${NAVY}"/></linearGradient></defs>
  <rect y="${PH - 70}" width="${S}" height="70" fill="url(#g)"/>
  <rect y="${PH}" width="${S}" height="${S - PH}" fill="${NAVY}"/>
  <rect x="84" y="${PH + 52}" width="48" height="4" rx="2" fill="#c4b7a3"/>
  <text x="146" y="${PH + 63}" font-family="${FONT}" font-weight="700" font-size="30" fill="#c4b7a3">${esc(c.kicker)}</text>
  ${title}${sub}
  <rect x="84" y="${S - 66}" width="9" height="9" transform="rotate(45 88.5 ${S - 61.5})" fill="#c4b7a3"/>
  <text x="108" y="${S - 52}" font-family="${FONT}" font-weight="600" font-size="25" fill="#cfc3ae">다옴법무사사무소 · 안윤정 법무사</text>
</svg>`;
}

async function photoBuf(file, w, h, position) {
  // position: 카드별 지정(north/south/center 등) — 얼굴이 글자 패널 경계에 걸리지 않게. 없으면 attention.
  return sharp(path.join(ROOT, "public/image", file)).rotate().resize(w, h, { fit: "cover", position: position ?? sharp.strategy.attention }).toBuffer();
}

// node build-cards-v2.mjs <id> ... : 지정한 카드만 생성(다른 카드 파일은 다시 쓰지 않음)
const only = new Set(process.argv.slice(2));
const results = [];
for (const c of CARDS) {
  if (only.size && !only.has(c.id)) continue;
  const row = { id: c.id, photo: c.photo };
  if (!c.keepLandscape) {
    const svg = landscapeSvg(c);
    fs.writeFileSync(path.join(SRC, `${c.id}-landscape.svg`), svg);
    const out = path.join(OUT, `${c.id}.jpg`);
    await sharp({ create: { width: 1200, height: 600, channels: 3, background: NAVY } })
      .composite([{ input: await photoBuf(c.photo, 720, 600), left: 480, top: 0 }, { input: Buffer.from(svg), left: 0, top: 0 }])
      .jpeg({ quality: 86, mozjpeg: true }).toFile(out);
    row.landscape = { file: path.relative(ROOT, out).replace(/\\/g, "/"), bytes: fs.statSync(out).size };
  }
  const sq = squareSvg(c);
  fs.writeFileSync(path.join(SRC, `${c.id}-square.svg`), sq);
  const outSq = path.join(OUT_SQ, `${c.id}.jpg`);
  await sharp({ create: { width: 1200, height: 1200, channels: 3, background: NAVY } })
    .composite([{ input: await photoBuf(c.photo, 1200, 680, c.sqPosition), left: 0, top: 0 }, { input: Buffer.from(sq), left: 0, top: 0 }])
    .jpeg({ quality: 86, mozjpeg: true }).toFile(outSq);
  row.square = { file: path.relative(ROOT, outSq).replace(/\\/g, "/"), bytes: fs.statSync(outSq).size };
  results.push(row);
  console.log(c.id, row.landscape?.bytes ?? "keep", row.square.bytes);
}
if (!only.size) fs.writeFileSync(path.join(SRC, "cards.json"), JSON.stringify({ font: "Noto Sans KR (SIL OFL 1.1)", sizes: { landscape: "1200x600", square: "1200x1200" }, cards: CARDS, results }, null, 1));
