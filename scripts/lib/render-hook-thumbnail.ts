/**
 * 캐러셀·썸네일 1:1 훅.
 * 원본 얼굴·몸은 변형하지 않는다. crop / 그레이드 / 타이포만.
 * 레퍼런스: 흰 글자 + 금색 외곽선, 현장은 남색 배너.
 */
import { existsSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

export const HOOK_SIZE = 1200;
const GOLD = "#C9A24A";
const GOLD_SOFT = "#E0C36A";

const FONT_CANDIDATES = [
  "C:/Windows/Fonts/malgunbd.ttf",
  "C:/Windows/Fonts/malgun.ttf",
  "/usr/share/fonts/truetype/noto/NotoSansKR-Bold.otf",
  "/System/Library/Fonts/AppleSDGothicNeo.ttc",
];

function resolveFontUrl(): string | null {
  for (const file of FONT_CANDIDATES) {
    if (existsSync(file)) return pathToFileURL(file).href;
  }
  return null;
}

const FONT_URL = resolveFontUrl();
const FONT_FAMILY = FONT_URL ? "HookKR" : "'Malgun Gothic','Noto Sans KR',sans-serif";

export type FaceGuide = {
  x: number;
  y: number;
  width: number;
  height: number;
  faceY?: number;
};

export type SourceCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HookThumbnailInput = {
  photoDisk?: string | null;
  photoBuffer?: Buffer;
  title: string;
  cropPosition?: string;
  face?: FaceGuide;
  sourceCrop?: SourceCrop;
  sourceFaceY?: number;
  hasPerson?: boolean;
  textAnchor?: "below" | "above" | "auto" | "center";
  /** 텍스트 블록 중심 y (0–1) */
  textCenterY?: number;
  plate?: "none" | "soft" | "banner";
};

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function emWidth(text: string): number {
  let w = 0;
  for (const ch of text) {
    if (/\s/.test(ch)) w += 0.28;
    else if (/[0-9A-Za-z]/.test(ch)) w += 0.62;
    else if (/[·.,?!:~'"()\-]/.test(ch)) w += 0.34;
    else w += 1;
  }
  return w;
}

function fitSize(lines: string[], maxWidth: number, max: number, min: number): number {
  const widest = Math.max(...lines.map(emWidth), 1);
  return Math.max(min, Math.min(max, Math.floor(maxWidth / widest)));
}

function fontFaceCss(): string {
  if (!FONT_URL) return "";
  return `<style>@font-face{font-family:HookKR;src:url('${FONT_URL}');font-weight:700 900;}</style>`;
}

function headBand(face?: FaceGuide): { top: number; bottom: number } | null {
  if (!face) return null;
  const center = face.faceY ?? face.y + Math.min(face.height, 0.36) * 0.45;
  const half = Math.min(0.2, Math.max(0.14, face.height * 0.45));
  return {
    top: Math.max(0.02, center - half),
    bottom: Math.min(0.82, center + half + 0.04),
  };
}

function layoutTitle(input: {
  lines: string[];
  face?: FaceGuide;
  textAnchor?: HookThumbnailInput["textAnchor"];
  textCenterY?: number;
}) {
  let titleSize = fitSize(input.lines, 860, 108, 74);
  const lineGap = () => Math.round(titleSize * 1.16);
  const blockH = () =>
    input.lines.length === 1 ? titleSize : titleSize + lineGap();
  const band = headBand(input.face);

  const defaultCenter =
    input.textAnchor === "below"
      ? 0.64
      : input.textAnchor === "above"
        ? 0.28
        : 0.48;
  let center = (input.textCenterY ?? defaultCenter) * HOOK_SIZE;
  let textTop = center - blockH() / 2;

  if (band && input.textAnchor === "above" && textTop + blockH() > band.top * HOOK_SIZE - 18) {
    textTop = band.top * HOOK_SIZE - blockH() - 22;
  }
  if (band && input.textAnchor === "below" && textTop < band.bottom * HOOK_SIZE + 22) {
    textTop = band.bottom * HOOK_SIZE + 28;
  }
  if (textTop < HOOK_SIZE * 0.08) textTop = HOOK_SIZE * 0.08;
  if (textTop + blockH() > HOOK_SIZE * 0.9) {
    while (titleSize > 74 && textTop + blockH() > HOOK_SIZE * 0.9) {
      titleSize -= 2;
    }
    textTop = Math.min(textTop, HOOK_SIZE * 0.9 - blockH());
  }

  const firstBaseline = Math.round(textTop + titleSize * 0.86);
  return { titleSize, lineGap: lineGap(), firstBaseline, textTop, blockH: blockH() };
}

async function loadSquarePhoto(input: HookThumbnailInput): Promise<Buffer> {
  const w = HOOK_SIZE;
  const h = HOOK_SIZE;
  const cropPos = input.cropPosition ?? "centre";
  const fallback = () =>
    sharp({
      create: { width: w, height: h, channels: 3, background: "#1a2433" },
    })
      .png()
      .toBuffer();

  const grade = (img: sharp.Sharp) =>
    img
      .modulate({ brightness: 1.03, saturation: 1.06 })
      .linear(1.06, -6);

  if (input.photoBuffer) {
    return grade(sharp(input.photoBuffer).resize(w, h, { fit: "cover", position: "centre" }))
      .toBuffer();
  }
  if (!input.photoDisk) return fallback();

  if (input.sourceCrop) {
    const meta = await sharp(input.photoDisk).rotate().metadata();
    const sw = meta.width ?? 0;
    const sh = meta.height ?? 0;
    if (sw && sh) {
      const left = Math.round(input.sourceCrop.x * sw);
      const top = Math.round(input.sourceCrop.y * sh);
      const width = Math.round(input.sourceCrop.width * sw);
      const height = Math.round(input.sourceCrop.height * sh);
      const side = Math.min(width, height);
      const lift = input.sourceFaceY
        ? Math.round(Math.max(0, input.sourceFaceY - 0.26) * side)
        : 0;
      const extract = {
        left: Math.max(0, Math.min(left, sw - side)),
        top: Math.max(0, Math.min(top + lift, sh - side)),
        width: side,
        height: side,
      };
      return grade(
        sharp(input.photoDisk).rotate().extract(extract).resize(w, h, {
          fit: "cover",
          position: "centre",
        }),
      ).toBuffer();
    }
  }

  return grade(
    sharp(input.photoDisk).rotate().resize(w, h, { fit: "cover", position: cropPos }),
  ).toBuffer();
}

export async function renderHookThumbnail(
  input: HookThumbnailInput,
): Promise<Buffer> {
  const w = HOOK_SIZE;
  const h = HOOK_SIZE;
  const cx = w / 2;
  const photo = await loadSquarePhoto(input);
  const plate = input.plate ?? "none";

  const titleLines = input.title
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2);
  if (titleLines.length === 0) titleLines.push("");

  const { titleSize, lineGap, firstBaseline, textTop, blockH } = layoutTitle({
    lines: titleLines,
    face: input.face,
    textAnchor: input.textAnchor,
    textCenterY: input.textCenterY,
  });

  const stroke = Math.max(8, Math.round(titleSize * 0.095));
  const padX = plate === "banner" ? 72 : 48;
  const padY = plate === "banner" ? 44 : 36;
  const plateW = Math.min(w - 80, 1040);
  const plateH = blockH + padY * 2 + 18;
  const plateX = (w - plateW) / 2;
  const plateY = textTop - padY;
  const ruleY = firstBaseline - titleSize - 22;
  const ruleBottom = textTop + blockH + 18;

  const plateSvg =
    plate === "banner"
      ? `<rect x="${plateX}" y="${plateY}" width="${plateW}" height="${plateH}" rx="${plateH / 2}" fill="#070e18" fill-opacity="0.78"/>
  <line x1="${cx - 86}" y1="${ruleY}" x2="${cx + 86}" y2="${ruleY}" stroke="${GOLD}" stroke-width="2.2"/>
  <line x1="${cx - 86}" y1="${ruleBottom}" x2="${cx + 86}" y2="${ruleBottom}" stroke="${GOLD}" stroke-width="2.2"/>`
      : plate === "soft"
        ? `<rect x="${plateX + 10}" y="${plateY + 4}" width="${plateW - 20}" height="${plateH - 6}" rx="${(plateH - 6) / 2}" fill="#070e18" fill-opacity="0.7"/>
  <line x1="${cx - 72}" y1="${ruleY}" x2="${cx + 72}" y2="${ruleY}" stroke="${GOLD}" stroke-width="2.4"/>
  <line x1="${cx - 72}" y1="${ruleBottom}" x2="${cx + 72}" y2="${ruleBottom}" stroke="${GOLD}" stroke-width="2.4"/>`
        : `<line x1="${cx - 40}" y1="${ruleY}" x2="${cx + 40}" y2="${ruleY}" stroke="${GOLD}" stroke-width="2.4"/>`;

  const overlay = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  ${fontFaceCss()}
  <defs>
    <radialGradient id="vignette" cx="50%" cy="42%" r="72%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.28"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>
  ${plateSvg}
  <g font-family="${FONT_FAMILY}" font-weight="800" font-size="${titleSize}" text-anchor="middle" letter-spacing="1.6">
    ${titleLines
      .map((line, i) => {
        const y = firstBaseline + i * lineGap;
        return `<text x="${cx}" y="${y}" fill="#ffffff" stroke="${GOLD_SOFT}" stroke-width="${stroke + 2}" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke fill">${esc(line)}</text>
    <text x="${cx}" y="${y}" fill="#ffffff" stroke="${GOLD}" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke fill">${esc(line)}</text>`;
      })
      .join("\n    ")}
  </g>
</svg>`;

  void padX;
  return sharp(photo)
    .composite([{ input: Buffer.from(overlay), left: 0, top: 0 }])
    .webp({ quality: 92 })
    .toBuffer();
}

export function hookOutputPath(pageUrl: string): string {
  const slug = pageUrl.replace(/^\//, "").replaceAll("/", "-") || "home";
  return `/images/generated/carousel/hooks/${slug}.webp`;
}

export function hookDiskPath(root: string, pageUrl: string): string {
  return path.join(root, "public", hookOutputPath(pageUrl).replace(/^\//, ""));
}

export function heuristicPersonCrop(
  facePosition?: "left" | "center" | "right",
): SourceCrop {
  const width = 0.72;
  const height = 0.92;
  const y = 0;
  const x =
    facePosition === "left" ? 0.02 : facePosition === "right" ? 0.26 : 0.14;
  return { x, y, width, height };
}

export function writeAtomic(dest: string, buffer: Buffer) {
  const tmp = `${dest}.${process.pid}.tmp`;
  writeFileSync(tmp, buffer);
  try {
    renameSync(tmp, dest);
  } catch {
    try {
      writeFileSync(dest, buffer);
    } finally {
      if (existsSync(tmp)) unlinkSync(tmp);
    }
  }
}
