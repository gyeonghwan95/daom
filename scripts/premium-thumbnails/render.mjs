/**
 * 프리미엄 썸네일 렌더러 — scripts/generate-premium-thumbnails.ts 에서 사용.
 * 얼굴·몸은 변형하지 않는다(crop·톤·타이포만). 제목은 얼굴과 겹치지 않는 가운데 영역에만 둔다.
 * 기본 1:1(1200×1200). 블로그 본문용 가로(예: 1200×600)도 같은 규칙으로 만든다.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { FACES, CY_MAX } from "./faces.mjs";
const sharp = createRequire(path.join(process.cwd(), "package.json"))("sharp");

export const SIZE = 1200;
const PUBLIC = path.join(process.cwd(), "public");

function esc(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/** Noto Sans KR 800 기준 글자 폭(em) — 자간 -0.02em 포함 */
function emWidth(text) {
  let w = 0;
  for (const ch of text) {
    if (/\s/.test(ch)) w += 0.25;
    else if (/[0-9]/.test(ch)) w += 0.58;
    else if (/[A-Za-z]/.test(ch)) w += 0.6;
    else if (/[·]/.test(ch)) w += 0.3;
    else if (/[.,:]/.test(ch)) w += 0.26;
    else if (/[?!]/.test(ch)) w += 0.48;
    else if (/[~\-]/.test(ch)) w += 0.5;
    else w += 0.96;
  }
  return w;
}

/**
 * @param {{ W: number, H: number }} canvas 출력 크기
 * @param cx 제목 가로 중심, cy 제목 세로 중심, scale 글자 크기 배율
 */
export function titleLayout(title, canvas, cx, cy, scale = 1) {
  const lines = title.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 2);
  const widest = Math.max(...lines.map(emWidth));
  const square = canvas.W === canvas.H;
  const maxW = square ? 820 : Math.min(820, canvas.W * 0.46);
  const maxSize = square ? 128 : Math.round(canvas.H * 0.15);
  const minSize = square ? 84 : Math.round(canvas.H * 0.1);
  const size = Math.round(Math.max(minSize, Math.min(maxSize, Math.floor(maxW / widest))) * scale);
  const lineH = Math.round(size * 1.22);
  const cap = size * 0.74; // 한글 글자 높이(대략)
  const blockH = (lines.length - 1) * lineH + cap;
  const top = cy - blockH / 2 + 10; // 금색 선을 위에 두므로 조금 아래로
  const baselines = lines.map((_, i) => top + cap + i * lineH);
  const halfW = (widest * size) / 2;
  return {
    lines,
    size,
    baselines,
    // 충돌 판정용 글자 영역(금색 선 포함)
    rect: { x0: cx - halfW - 30, x1: cx + halfW + 30, y0: top - 62, y1: top + blockH + 30 },
    ruleY: top - 42,
    cx,
    cy,
  };
}

/** 얼굴을 피하는 crop 탐색 */
export function chooseCrop(W, H, faces, title, canvas, cyMax) {
  const { W: OW, H: OH } = canvas;
  const square = OW === OH;
  // 1:1: 제목은 가운데 세로 42–62% · 가로 정중앙. 가로형: 세로 가운데, 가로는 가운데 또는 좌·우 1/3.
  const cys = square
    ? Array.from({ length: Math.floor((cyMax - 500) / 20) + 1 }, (_, i) => 500 + i * 20)
    : [OH / 2 - 20, OH / 2, OH / 2 + 20];
  const cxs = square ? [OW / 2] : [OW / 2, OW * 0.32, OW * 0.68];
  let best = null;
  for (const [scale, sp] of [[1, 0], [0.9, 50], [0.8, 120]]) {
    for (const cx of cxs) {
      for (const cy of cys) {
        const L = titleLayout(title, canvas, cx, cy, scale);
        if (L.rect.x0 < 40 || L.rect.x1 > OW - 40) continue;
        const r = chooseCropAt(W, H, faces, L.rect, canvas);
        if (!r) continue;
        r.score -= Math.abs(cy - OH / 2) * 3 + Math.abs(cx - OW / 2) * 0.4 + sp;
        if (!best || r.score > best.score) best = { ...r, L };
      }
    }
  }
  return best;
}

function chooseCropAt(W, H, faces, rect, canvas) {
  const { W: OW, H: OH } = canvas;
  const square = OW === OH;
  const aspect = OW / OH;
  // crop 높이 s, 너비 s*aspect
  const s0 = Math.min(H, W / aspect);
  let best = null;
  for (let k = 0; k <= 30; k++) {
    const s = s0 * (1 - k * 0.018);
    if (s < s0 * 0.4) break;
    const cw = s * aspect;
    const stepX = Math.max(1, (W - cw) / 40);
    const stepY = Math.max(1, (H - s) / 40);
    for (let x = 0; x <= W - cw + 0.5; x += stepX) {
      for (let y = 0; y <= H - s + 0.5; y += stepY) {
        const sc = OH / s;
        let ok = true;
        let pen = 0;
        for (const f of faces) {
          const [a, b, c, d] = f.box;
          const fx0 = (a * W - x) * sc, fy0 = (b * H - y) * sc, fx1 = (c * W - x) * sc, fy1 = (d * H - y) * sc;
          const inside = fx0 >= 24 && fy0 >= 24 && fx1 <= OW - 24 && fy1 <= OH - 24;
          const outside = fx1 <= 0 || fy1 <= 0 || fx0 >= OW || fy0 >= OH;
          if (f.primary && !inside) { ok = false; break; }
          // 얼굴 둘레 여유(주인공 가로 60·세로 34px, 보조 24px) — 글자가 얼굴·머리선에 붙지 않게
          const mx = f.primary ? 60 : 24, my = f.primary ? 34 : 24;
          const hit = !(fx1 + mx < rect.x0 || fx0 - mx > rect.x1 || fy1 + my < rect.y0 || fy0 - my > rect.y1);
          if (hit) { ok = false; break; }
          if (!f.primary && !inside && !outside) pen += 60; // 보조 인물 잘림
          if (f.primary) {
            const cx = (fx0 + fx1) / 2;
            if (square) {
              pen += Math.abs(cx - OW / 2) * 0.12;
              // 가로 4:3(위아래 150px 잘림)·세로 3:4(좌우 150px 잘림)에서도 얼굴이 남는지
              if (fy1 > OH - 150) { ok = false; break; } // 가로 4:3에서 얼굴이 잘리면 안 됨
              if (fy0 < 150) pen += 70;
              if (fy0 > rect.y1) pen += 260; // 얼굴이 제목 아래(화면 하단)로 가는 구도는 피한다
              if (fx0 < 150 || fx1 > OW - 150) pen += 40;
              if (fy0 < 70) pen += 60; // 머리 위 여백
            } else {
              if (fy0 > rect.y1) pen += 260;
              if (fy0 < 40) pen += 60;
            }
          }
        }
        if (!ok) continue;
        // 사람이 없는 사진은 원래 구도의 가운데를 선호
        pen += (Math.abs(x + cw / 2 - W / 2) / W) * 40 + (Math.abs(y + s / 2 - H / 2) / H) * 40;
        const up = OH / s;
        if (up > 1.3) pen += (up - 1.3) * 260; // 과도한 확대(흐림) 억제
        const score = (s / s0) * 1000 - pen;
        if (!best || score > best.score) best = { x, y, s, cw, score };
      }
    }
  }
  return best;
}

export async function render({ photo, title, format = "webp", brand = true, width = SIZE, height = SIZE }) {
  const OW = width, OH = height;
  const canvas = { W: OW, H: OH };
  const disk = path.join(PUBLIC, photo);
  const img = sharp(disk).rotate();
  const meta = await sharp(disk).metadata();
  const rot = (meta.orientation ?? 1) >= 5;
  const W = rot ? meta.height : meta.width;
  const H = rot ? meta.width : meta.height;
  const faces = FACES[photo] ?? [];
  const crop = chooseCrop(W, H, faces, title, canvas, CY_MAX[photo] ?? 740);
  if (!crop) throw new Error(`no crop: ${photo} ${title}`);
  const L = crop.L;
  const left = Math.round(crop.x), top = Math.round(crop.y);
  const ch = Math.round(Math.min(crop.s, H - top));
  const cw = Math.round(Math.min(crop.cw, W - left));
  const upscale = OH / ch;
  let base = img.extract({ left, top, width: cw, height: ch }).resize(OW, OH, { kernel: "lanczos3", fit: "fill" });
  if (upscale > 1.15) base = base.sharpen({ sigma: 0.7 });
  base = base.modulate({ saturation: 0.96, brightness: 1.03 }).linear(1.05, -6);
  const baseBuf = await base.toBuffer();

  // 얼굴 위치(출력 좌표)
  const sc = OH / ch;
  const fBoxes = faces.map((f) => {
    const [a, b, c, d] = f.box;
    return { x0: (a * W - left) * sc, y0: (b * H - top) * sc, x1: (c * W - left) * sc, y1: (d * H - top) * sc, primary: f.primary };
  }).filter((f) => f.x1 > 0 && f.y1 > 0 && f.x0 < OW && f.y0 < OH);

  // 음영: 글자 중심의 넓은 타원. 얼굴 쪽으로는 부드럽게 사라지게(얼굴에는 닿지 않음).
  const midX = L.cx;
  const midY = (L.rect.y0 + L.rect.y1) / 2;
  const ry = (L.rect.y1 - L.rect.y0) / 2 + Math.round(OH * 0.19);
  const rx = OW === OH ? 760 : Math.max(420, (L.rect.x1 - L.rect.x0) / 2 + 260);
  // 세로 방향 얼굴 차단(위·아래)
  let fadeTopA = -1, fadeTopB = -1, fadeBotA = OH + 1, fadeBotB = OH + 1;
  // 가로형에서 얼굴이 제목 옆에 있으면 가로 방향으로도 차단
  let fadeLeftA = -1, fadeLeftB = -1, fadeRightA = OW + 1, fadeRightB = OW + 1;
  for (const f of fBoxes) {
    const besideRight = f.x0 >= L.rect.x1 - 10, besideLeft = f.x1 <= L.rect.x0 + 10;
    if (OW !== OH && (besideRight || besideLeft)) {
      if (besideRight) fadeRightB = Math.min(fadeRightB, f.x0 - 4);
      if (besideLeft) fadeLeftA = Math.max(fadeLeftA, f.x1 + 4);
      continue;
    }
    if (f.y1 <= L.rect.y0 + 10) fadeTopA = Math.max(fadeTopA, f.y1 + 4);
    if (f.y0 >= L.rect.y1 - 10) fadeBotB = Math.min(fadeBotB, f.y0 - 4);
  }
  // 얼굴 경계에서 최소 120px에 걸쳐 0 → 1
  if (fadeTopA >= 0) fadeTopB = fadeTopA + Math.max(120, Math.min(200, L.rect.y0 + 40 - fadeTopA));
  if (fadeBotB <= OH) fadeBotA = fadeBotB - Math.max(120, Math.min(200, fadeBotB - (L.rect.y1 - 40)));
  if (fadeLeftA >= 0) fadeLeftB = fadeLeftA + 140;
  if (fadeRightB <= OW) fadeRightA = fadeRightB - 140;
  const stops = (a0, a1, b0, b1, total) => {
    const p = (v) => `${Math.max(0, Math.min(100, (v / total) * 100)).toFixed(2)}%`;
    const out = [];
    if (a0 >= 0) out.push(`<stop offset="${p(a0)}" stop-color="#fff" stop-opacity="0"/>`, `<stop offset="${p(a1)}" stop-color="#fff" stop-opacity="1"/>`);
    else out.push(`<stop offset="0%" stop-color="#fff" stop-opacity="1"/>`);
    if (b1 <= total) out.push(`<stop offset="${p(b0)}" stop-color="#fff" stop-opacity="1"/>`, `<stop offset="${p(b1)}" stop-color="#fff" stop-opacity="0"/>`);
    else out.push(`<stop offset="100%" stop-color="#fff" stop-opacity="1"/>`);
    return out.join("");
  };

  // 하단 서명은 얼굴과 겹치지 않을 때만
  const brandY = OH - 72;
  const brandOk = brand && !fBoxes.some((f) => f.y1 > OH - 160 || (f.primary && f.y0 >= L.rect.y1 - 10 && f.x1 > OW / 2 - 200 && f.x0 < OW / 2 + 200));
  const footH = Math.round(OH * 0.17);

  const svg = `<svg width="${OW}" height="${OH}" viewBox="0 0 ${OW} ${OH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="vig" cx="50%" cy="50%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.24"/>
    </radialGradient>
    <radialGradient id="glow" cx="${midX}" cy="${midY}" r="${ry}" gradientUnits="userSpaceOnUse" gradientTransform="translate(${midX} ${midY}) scale(${(rx / ry).toFixed(3)} 1) translate(${-midX} ${-midY})">
      <stop offset="0%" stop-color="#08111d" stop-opacity="0.58"/>
      <stop offset="45%" stop-color="#08111d" stop-opacity="0.46"/>
      <stop offset="75%" stop-color="#08111d" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#08111d" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fm" x1="0" y1="0" x2="0" y2="1">${stops(fadeTopA, fadeTopB, fadeBotA, fadeBotB, OH)}</linearGradient>
    <linearGradient id="fmx" x1="0" y1="0" x2="1" y2="0">${stops(fadeLeftA, fadeLeftB, fadeRightA, fadeRightB, OW)}</linearGradient>
    <mask id="faceMaskX"><rect width="${OW}" height="${OH}" fill="url(#fmx)"/></mask>
    <mask id="faceMask"><rect width="${OW}" height="${OH}" fill="url(#fm)" mask="url(#faceMaskX)"/></mask>
    <linearGradient id="foot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1320" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0a1320" stop-opacity="0.5"/>
    </linearGradient>
    <filter id="ts" x="-20%" y="-40%" width="140%" height="180%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.35"/><feDropShadow dx="0" dy="4" stdDeviation="16" flood-color="#000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="${OW}" height="${OH}" fill="url(#vig)"/>
  <rect width="${OW}" height="${OH}" fill="url(#glow)" mask="url(#faceMask)"/>
  ${brandOk ? `<rect x="0" y="${OH - footH}" width="${OW}" height="${footH}" fill="url(#foot)"/>` : ""}
  <rect x="${L.cx - 36}" y="${L.ruleY}" width="72" height="3" fill="#d6b77a"/>
  <g font-family="Noto Sans KR" font-weight="800" font-size="${L.size}" text-anchor="middle" letter-spacing="${(-0.02 * L.size).toFixed(1)}" filter="url(#ts)">
    ${L.lines.map((line, i) => `<text x="${L.cx}" y="${L.baselines[i].toFixed(1)}" fill="${i === L.lines.length - 1 && L.lines.length > 1 ? "#f3e2bb" : "#ffffff"}">${esc(line)}</text>`).join("\n    ")}
  </g>
  ${brandOk ? `<text x="${OW / 2}" y="${brandY}" font-family="Noto Sans KR" font-weight="500" font-size="25" fill="#ffffff" fill-opacity="0.86" text-anchor="middle" letter-spacing="7">다옴법무사사무소</text>` : ""}
</svg>`;

  const pipe = sharp(baseBuf).composite([{ input: Buffer.from(svg) }]);
  const buf = format === "jpg"
    ? await pipe.jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer()
    : format === "png"
      ? await pipe.png({ compressionLevel: 9, palette: false }).toBuffer()
      : await pipe.webp({ quality: 86, smartSubsample: true }).toBuffer();
  return { buf, crop: { left, top, width: cw, height: ch, upscale: +upscale.toFixed(2), cx: L.cx, cy: L.cy }, size: L.size };
}
