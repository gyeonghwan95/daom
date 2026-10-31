/**
 * 검토용: 원본 사진에 10% 격자를 그려 얼굴 박스(faces.mjs) 좌표를 읽는다.
 * Usage: node scripts/premium-thumbnails/source-grid.mjs <시트이름> <포스팅용 기준 상대경로...>
 */
import { createRequire } from "node:module";
import path from "node:path";
const sharp = createRequire(path.join(process.cwd(), "package.json"))("sharp");

const SRC = "C:/Users/your1/Desktop/윤정블로그/포스팅용";
const [outName, ...names] = process.argv.slice(2);
const TH = Number(process.env.GRID_TH ?? 640), COLS = Number(process.env.GRID_COLS ?? 5), LABEL = 30;
const tiles = [];
let x = 0, y = 0, rowH = 0, maxW = 0, col = 0;
const items = [];
for (const [i, n] of names.entries()) {
  const f = path.join(SRC, n);
  const meta = await sharp(f).rotate().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const w = Math.round((meta.width / meta.height) * TH);
  const img = await sharp(f).rotate().resize(w, TH).toBuffer();
  let grid = "";
  for (let k = 1; k < 10; k++) {
    const gx = (w * k) / 10, gy = (TH * k) / 10;
    const c = k === 5 ? "#ff0" : "#0ff";
    grid += `<line x1="${gx}" y1="0" x2="${gx}" y2="${TH}" stroke="${c}" stroke-width="1" stroke-opacity="0.7"/><line x1="0" y1="${gy}" x2="${w}" y2="${gy}" stroke="${c}" stroke-width="1" stroke-opacity="0.7"/>`;
    grid += `<text x="${gx + 2}" y="12" font-size="11" fill="#ff0">${k}</text><text x="2" y="${gy - 2}" font-size="11" fill="#ff0">${k}</text>`;
  }
  const ov = Buffer.from(`<svg width="${w}" height="${TH}">${grid}</svg>`);
  const lbl = Buffer.from(`<svg width="${w}" height="${LABEL}"><rect width="${w}" height="${LABEL}" fill="#fff"/><text x="4" y="21" font-size="15" font-family="Malgun Gothic">${i}: ${n.replaceAll("&", "&amp;")}</text></svg>`);
  items.push({ img, ov, lbl, w });
}
const tilesPos = [];
for (const it of items) {
  if (col === COLS) { col = 0; x = 0; y += TH + LABEL + 8; }
  tilesPos.push({ input: it.lbl, left: x, top: y }, { input: it.img, left: x, top: y + LABEL }, { input: it.ov, left: x, top: y + LABEL });
  x += it.w + 8; maxW = Math.max(maxW, x); col++;
}
await sharp({ create: { width: maxW, height: y + TH + LABEL + 8, channels: 3, background: "#333" } })
  .composite(tilesPos).jpeg({ quality: 80 }).toFile(path.join(process.cwd(), "reports/thumbnails/source", `${outName}.jpg`));
console.log("ok");
