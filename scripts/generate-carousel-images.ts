/**
 * 캐러셀 대표이미지 생성 (로컬 사전 생성 전용 — 배포 빌드에서 실행하지 않음)
 *
 * - 원본 사진은 수정하지 않고 crop/resize/합성만 수행
 * - 출력: public/images/generated/carousel/<category>/<file>.webp (매니페스트 width×height)
 * - 검토용 미리보기: docs/generated/carousel-image-preview.html
 *
 * Usage: npm run generate:carousel-images [-- --only=id1,id2]
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  CAROUSEL_IMAGE_MANIFEST,
  type CarouselImageManifestItem,
} from "../src/data/seo/carousel-image-manifest";
import { getAttorneyPhoto } from "../src/data/media/attorney-photo-inventory";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const W = 1200;
const H = 800;

const COLORS = {
  navy: "#1e3a5f",
  navyDark: "#0f1f33",
  navyLight: "#2d4f7c",
  cream: "#f7f4ef",
  beige: "#f0ebe3",
  beigeDark: "#ddd4c6",
  white: "#ffffff",
  text: "#152a45",
};

const ACCENTS: Record<string, { block: string; soft: string; text: string }> = {
  navy: { block: COLORS.navy, soft: "#e6ebf2", text: COLORS.navy },
  warm: { block: "#8a6d3f", soft: "#f3e9d8", text: "#5c4318" },
  sage: { block: "#4f6f5e", soft: "#e7efe9", text: "#31493c" },
  slate: { block: "#44546a", soft: "#e8ebf0", text: "#33404f" },
};

const FONT = `'Malgun Gothic','Noto Sans KR',sans-serif`;

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function icon(name: string | undefined, color: string): string {
  const c = color;
  switch (name) {
    case "family":
      return `<g stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"><circle cx="30" cy="22" r="14"/><circle cx="86" cy="22" r="14"/><path d="M58 50 L30 40 M58 50 L86 40 M58 50 L58 86"/><circle cx="58" cy="98" r="12"/></g>`;
    case "calendar":
      return `<g stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"><rect x="10" y="18" width="96" height="88" rx="10"/><path d="M10 44 H106 M34 6 V26 M82 6 V26"/><circle cx="40" cy="66" r="5" fill="${c}" stroke="none"/><circle cx="58" cy="66" r="5" fill="${c}" stroke="none"/><circle cx="76" cy="66" r="5" fill="${c}" stroke="none"/><circle cx="40" cy="88" r="5" fill="${c}" stroke="none"/><circle cx="58" cy="88" r="5" fill="${c}" stroke="none"/></g>`;
    case "scale":
      return `<g stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"><path d="M58 10 V96 M20 30 H96 M58 96 H34 H82"/><path d="M20 30 L6 62 H34 Z M96 30 L82 62 H110 Z"/></g>`;
    case "building":
      return `<g stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"><rect x="18" y="26" width="52" height="80" rx="4"/><rect x="70" y="50" width="34" height="56" rx="4"/><path d="M30 44 h10 M50 44 h10 M30 62 h10 M50 62 h10 M30 80 h10 M50 80 h10 M80 66 h12 M80 84 h12"/></g>`;
    case "key":
      return `<g stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"><circle cx="36" cy="40" r="22"/><path d="M52 56 L100 104 M84 88 L98 74 M72 76 L84 64"/></g>`;
    case "seal":
      return `<g stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"><rect x="30" y="10" width="56" height="40" rx="8"/><path d="M42 50 v18 h32 v-18"/><rect x="18" y="86" width="80" height="20" rx="6"/></g>`;
    case "court":
      return `<g stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"><path d="M12 44 L58 14 L104 44 M20 44 V96 M44 44 V96 M72 44 V96 M96 44 V96 M8 106 H108"/></g>`;
    case "doc":
      return `<g stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"><path d="M28 8 H74 L94 28 V108 H28 Z M74 8 V28 H94"/><path d="M42 52 h38 M42 70 h38 M42 88 h24"/></g>`;
    case "chart":
      return `<g stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"><path d="M14 104 H108 M14 104 V12"/><path d="M28 88 L52 60 L72 74 L100 34"/></g>`;
    case "check":
    default:
      return `<g stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="58" cy="58" r="48"/><path d="M36 60 L52 76 L84 42"/></g>`;
  }
}

function brandMark(x: number, y: number, color: string): string {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="22" font-weight="600" fill="${color}" letter-spacing="2">다옴법무사사무소</text>`;
}

function headlineBlock(
  item: CarouselImageManifestItem,
  x: number,
  maxWidth: number,
  align: "start" | "middle",
  headlineColor: string,
  subColor: string,
): string {
  void maxWidth;
  const anchor = align === "middle" ? "middle" : "start";
  const hy = 400;
  return `
    <text x="${x}" y="${hy}" font-family="${FONT}" font-size="88" font-weight="800" fill="${headlineColor}" text-anchor="${anchor}">${esc(item.headline)}</text>
    ${
      item.subheadline
        ? `<text x="${x}" y="${hy + 78}" font-family="${FONT}" font-size="40" font-weight="500" fill="${subColor}" text-anchor="${anchor}">${esc(item.subheadline)}</text>`
        : ""
    }`;
}

function baseSvg(inner: string): Buffer {
  return Buffer.from(
    `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`,
  );
}

type Layer = { input: Buffer; left: number; top: number };

async function photoPanel(
  srcDisk: string,
  width: number,
  height: number,
  position: string = "centre",
): Promise<Buffer> {
  // attention 자동 crop은 얼굴을 잘라낼 수 있어 사용하지 않는다.
  return sharp(srcDisk)
    .resize(width, height, { fit: "cover", position })
    .modulate({ brightness: 1.02 })
    .toBuffer();
}

async function buildLayers(
  item: CarouselImageManifestItem,
  photoDisk: string | null,
): Promise<{ base: Buffer; layers: Layer[] }> {
  const a = ACCENTS[item.accent];
  const layers: Layer[] = [];

  switch (item.layoutVariant) {
    case "portrait-right":
    case "portrait-left": {
      const panelW = 470;
      const photoLeft = item.layoutVariant === "portrait-right" ? W - panelW : 0;
      const textX = item.layoutVariant === "portrait-right" ? 90 : panelW + 90;
      if (photoDisk) {
        layers.push({
          input: await photoPanel(photoDisk, panelW, H, item.cropPosition),
          left: photoLeft,
          top: 0,
        });
      }
      const divider =
        item.layoutVariant === "portrait-right"
          ? `<rect x="${W - panelW - 14}" y="0" width="14" height="${H}" fill="${a.block}"/>`
          : `<rect x="${panelW}" y="0" width="14" height="${H}" fill="${a.block}"/>`;
      const base = baseSvg(`
        <rect width="${W}" height="${H}" fill="${COLORS.cream}"/>
        <rect x="0" y="0" width="${W}" height="10" fill="${a.block}"/>
        ${divider}
        <g transform="translate(${textX},170)">${icon(item.topicIcon, a.block)}</g>
        ${headlineBlock(item, textX, 560, "start", COLORS.text, a.text)}
        <rect x="${textX}" y="530" width="120" height="8" rx="4" fill="${a.block}"/>
        ${brandMark(textX, H - 64, COLORS.navyLight)}
      `);
      return { base, layers };
    }

    case "document-focus": {
      const panelW = 540;
      if (photoDisk) {
        const photo = await sharp(photoDisk)
          .resize(panelW, H, { fit: "cover", position: item.cropPosition ?? "centre" })
          .modulate({ brightness: 1.0, saturation: 0.96 })
          .toBuffer();
        layers.push({ input: photo, left: W - panelW, top: 0 });
        const shade = baseSvg(
          `<rect x="${W - panelW}" y="0" width="${panelW}" height="${H}" fill="${COLORS.navyDark}" opacity="0.14"/>`,
        );
        layers.push({
          input: await sharp(shade).png().toBuffer(),
          left: 0,
          top: 0,
        });
      }
      const textX = 90;
      const base = baseSvg(`
        <rect width="${W}" height="${H}" fill="${COLORS.cream}"/>
        <rect x="0" y="0" width="${W - panelW}" height="${H}" fill="${a.soft}"/>
        <rect x="0" y="0" width="18" height="${H}" fill="${a.block}"/>
        <g transform="translate(${textX},166)">${icon(item.topicIcon, a.block)}</g>
        ${headlineBlock(item, textX, 520, "start", COLORS.text, a.text)}
        <rect x="${textX}" y="530" width="120" height="8" rx="4" fill="${a.block}"/>
        ${brandMark(textX, H - 64, COLORS.navyLight)}
      `);
      return { base, layers };
    }

    case "lecture-focus": {
      const photoH = 470;
      if (photoDisk) {
        layers.push({
          input: await photoPanel(photoDisk, W, photoH, item.cropPosition),
          left: 0,
          top: 0,
        });
      }
      const base = baseSvg(`
        <rect width="${W}" height="${H}" fill="${COLORS.navy}"/>
        <rect x="0" y="${photoH}" width="${W}" height="${H - photoH}" fill="${COLORS.navy}"/>
        <rect x="0" y="${photoH}" width="${W}" height="10" fill="${a.soft}"/>
        <g transform="translate(90,${photoH + 96}) scale(0.8)">${icon(item.topicIcon, "#e9eef5")}</g>
        <text x="230" y="${photoH + 150}" font-family="${FONT}" font-size="76" font-weight="800" fill="#ffffff">${esc(item.headline)}</text>
        ${
          item.subheadline
            ? `<text x="230" y="${photoH + 218}" font-family="${FONT}" font-size="36" font-weight="500" fill="#d8e0ea">${esc(item.subheadline)}</text>`
            : ""
        }
        ${brandMark(W - 320, H - 40, "#b9c6d6")}
      `);
      return { base, layers };
    }

    case "minimal-type":
    default: {
      const base = baseSvg(`
        <rect width="${W}" height="${H}" fill="${COLORS.cream}"/>
        <rect x="0" y="0" width="${W}" height="14" fill="${a.block}"/>
        <rect x="${W - 320}" y="${H - 320}" width="480" height="480" rx="64" fill="${a.soft}"/>
        <g transform="translate(${W / 2 - 58},150)">${icon(item.topicIcon, a.block)}</g>
        ${headlineBlock(item, W / 2, 900, "middle", COLORS.text, a.text)}
        <rect x="${W / 2 - 60}" y="530" width="120" height="8" rx="4" fill="${a.block}"/>
        ${brandMark(W / 2 - 96, H - 64, COLORS.navyLight)}
      `);
      return { base, layers };
    }
  }
}

/**
 * centered-hook (1:1) — 사진 전면 배경 + 가운데 타이포.
 * 1:1 그대로, 4:3·3:2·16:9 가로 crop, 3:4 세로 crop, OG 1.91:1 crop 모두에서
 * 글자가 남도록 x 170–1030 · y 300–900 안에만 텍스트를 둔다.
 */
const GOLD = "#c9a96b";
const SERIF = `'Noto Serif KR','Malgun Gothic',serif`;
const SANS = `'Noto Sans KR','Malgun Gothic',sans-serif`;

/** 글자 폭 추정(em). 한글 1, 공백 0.26, 숫자·라틴 0.6, 구두점 0.32 */
function emWidth(text: string): number {
  let w = 0;
  for (const ch of text) {
    if (/\s/.test(ch)) w += 0.26;
    else if (/[0-9A-Za-z]/.test(ch)) w += 0.6;
    else if (/[·.,?!:~'"()\-]/.test(ch)) w += 0.32;
    else w += 1;
  }
  return w;
}

function fitSize(lines: string[], maxWidth: number, max: number, min: number): number {
  const widest = Math.max(...lines.map(emWidth));
  return Math.max(min, Math.min(max, Math.floor(maxWidth / widest)));
}

/** 업무 분류별 색 — 캐러셀에 나란히 놓일 때 카드끼리 구분되게 한다(경로의 분류 폴더 기준). */
const CATEGORY_STYLE: Record<string, { tint: string; badge: string; label: string }> = {
  inheritance: { tint: "#0f2f33", badge: "#2f7d73", label: "상속" },
  "real-estate": { tint: "#2c1f12", badge: "#a0662b", label: "부동산등기" },
  corporate: { tint: "#101f3a", badge: "#3a5f9e", label: "법인등기" },
  rehabilitation: { tint: "#26162f", badge: "#7a4a8f", label: "회생·파산" },
  hub: { tint: "#18222c", badge: "#4f6475", label: "다옴법무사사무소" },
  lecture: { tint: "#1c2414", badge: "#5f7a3a", label: "법률 강의" },
};

function categoryOf(item: CarouselImageManifestItem): string {
  return item.outputPath.split("/")[4] ?? "hub";
}

async function renderCenteredHook(
  item: CarouselImageManifestItem,
  photoDisk: string | null,
): Promise<Buffer> {
  const w = item.width;
  const h = item.height;
  const cx = w / 2;
  const copy = item.thumbnail ?? {
    eyebrow: item.pageTitle,
    title: item.headline,
    subtitle: item.subheadline ?? "",
  };
  const style = CATEGORY_STYLE[categoryOf(item)] ?? CATEGORY_STYLE.hub;
  const tint = style.tint;

  // 사진이 보이도록 흐림·감광을 줄이고, 글자 뒤만 분류 색으로 눌러 대비를 만든다.
  const background = photoDisk
    ? await sharp(photoDisk)
        .rotate()
        .resize(w, h, { fit: "cover", position: item.cropPosition ?? "centre" })
        .blur(3.5)
        .modulate({ saturation: 0.75, brightness: 1.0 })
        .toBuffer()
    : await sharp(
        Buffer.from(
          `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="${tint}"/></svg>`,
        ),
      )
        .png()
        .toBuffer();

  const titleLines = copy.title.split("\n").slice(0, 2);
  const titleSize = fitSize(titleLines, 860, 124, 76);
  const lineGap = Math.round(titleSize * 1.22);
  const titleBaselines = titleLines.length === 2 ? [560, 560 + lineGap] : [624];

  // 분류 배지: 300px 표시에서도 읽히도록 48px(표시 약 12px)
  const badgeText = copy.eyebrow;
  const badgeSize = Math.min(48, Math.floor(760 / Math.max(1, emWidth(badgeText))));
  const badgeW = Math.round(emWidth(badgeText) * badgeSize + 88);
  const badgeH = Math.round(badgeSize * 1.7);
  const badgeY = 330;
  const subtitleSize = Math.min(50, Math.floor(900 / Math.max(1, emWidth(copy.subtitle))));

  const overlay = `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${tint}" stop-opacity="0.45"/>
      <stop offset="30%" stop-color="${tint}" stop-opacity="0.72"/>
      <stop offset="78%" stop-color="${tint}" stop-opacity="0.80"/>
      <stop offset="100%" stop-color="${tint}" stop-opacity="0.55"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-30%" width="120%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
      <feOffset dy="3" result="blur"/>
      <feFlood flood-color="#000" flood-opacity="0.5"/>
      <feComposite in2="blur" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#shade)"/>
  <rect x="0" y="0" width="${w}" height="14" fill="${style.badge}"/>

  <rect x="${cx - badgeW / 2}" y="${badgeY}" width="${badgeW}" height="${badgeH}" rx="${badgeH / 2}" fill="${style.badge}"/>
  <text x="${cx}" y="${badgeY + badgeH / 2 + badgeSize * 0.36}" font-family="${SANS}" font-size="${badgeSize}" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(badgeText)}</text>

  <g font-family="${SERIF}" font-weight="900" font-size="${titleSize}" fill="#ffffff" text-anchor="middle" filter="url(#shadow)">
    ${titleLines.map((line, i) => `<text x="${cx}" y="${titleBaselines[i]}">${esc(line)}</text>`).join("\n    ")}
  </g>

  <rect x="${cx - 44}" y="752" width="88" height="5" rx="2" fill="${GOLD}"/>

  <text x="${cx}" y="828" font-family="${SANS}" font-size="${subtitleSize}" font-weight="600" fill="#f4ecdc" text-anchor="middle" filter="url(#shadow)">${esc(copy.subtitle)}</text>

  <text x="${cx}" y="900" font-family="${SANS}" font-size="34" font-weight="700" fill="#ffffff" fill-opacity="0.88" text-anchor="middle" letter-spacing="4">다옴법무사사무소 · 안윤정 법무사</text>
</svg>`;

  return sharp(background)
    .composite([{ input: Buffer.from(overlay), left: 0, top: 0 }])
    .webp({ quality: 86 })
    .toBuffer();
}

function resolveSourceDisk(item: CarouselImageManifestItem): string | null {
  let publicPath: string | undefined;
  if (item.sourcePhotoId) {
    publicPath = getAttorneyPhoto(item.sourcePhotoId)?.src;
  }
  if (!publicPath) publicPath = item.sourcePhotoPath;
  if (!publicPath) return null;
  const disk = path.join(PUBLIC, decodeURIComponent(publicPath).replace(/^\//, ""));
  return existsSync(disk) ? disk : null;
}

async function generateOne(item: CarouselImageManifestItem) {
  const outDisk = path.join(PUBLIC, item.outputPath.replace(/^\//, ""));
  mkdirSync(path.dirname(outDisk), { recursive: true });

  const photoDisk = resolveSourceDisk(item);
  if ((item.sourcePhotoId || item.sourcePhotoPath) && !photoDisk) {
    return { id: item.id, ok: false, reason: "source photo missing" };
  }

  if (item.layoutVariant === "centered-hook") {
    writeFileSync(outDisk, await renderCenteredHook(item, photoDisk));
  } else {
    const { base, layers } = await buildLayers(item, photoDisk);

    // 배경(SVG: 색면·텍스트·아이콘) 위에 사진 패널을 합성.
    // 텍스트 영역과 사진 패널은 겹치지 않도록 레이아웃되어 있다.
    let pipeline = sharp(base);
    if (layers.length) {
      pipeline = pipeline.composite(
        layers.map((l) => ({ input: l.input, left: l.left, top: l.top })),
      );
    }
    await pipeline.webp({ quality: 85 }).toFile(outDisk);
  }
  const meta = await sharp(outDisk).metadata();
  return {
    id: item.id,
    ok: true,
    out: item.outputPath,
    width: meta.width,
    height: meta.height,
    bytes: (await import("node:fs")).statSync(outDisk).size,
  };
}

function writePreview(
  results: Awaited<ReturnType<typeof generateOne>>[],
): void {
  const dir = path.join(ROOT, "docs", "generated");
  mkdirSync(dir, { recursive: true });
  const rows = CAROUSEL_IMAGE_MANIFEST.map((item) => {
    const r = results.find((x) => x.id === item.id);
    const src = item.sourcePhotoId
      ? getAttorneyPhoto(item.sourcePhotoId)?.src
      : item.sourcePhotoPath;
    return `<tr>
      <td>${item.id}</td>
      <td><a href="..${""}/..${""}/public${src ?? ""}">${src ?? "(없음)"}</a></td>
      <td><img src="../../public${item.outputPath}" width="300" loading="lazy"/></td>
      <td><a href="https://다옴법무사사무소.kr${encodeURI(item.pageUrl)}">${item.pageUrl}</a></td>
      <td>${esc(item.headline)}<br/><small>${esc(item.subheadline ?? "")}</small></td>
      <td>${item.layoutVariant}</td>
      <td>${r?.ok ? `${r.width}×${r.height} · ${(Number(r.bytes) / 1024).toFixed(0)}KB` : "실패"}</td>
      <td>${item.status} → 검토 후 approved 로 변경</td>
    </tr>`;
  }).join("\n");

  const html = `<!doctype html><html lang="ko"><meta charset="utf-8"/>
<title>캐러셀 대표이미지 검토</title>
<style>body{font-family:'Malgun Gothic',sans-serif;background:#f7f4ef;padding:24px;color:#152a45}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd4c6;padding:8px;font-size:13px;background:#fff;vertical-align:top}
img{border-radius:8px;border:1px solid #ddd4c6}</style>
<h1>캐러셀 대표이미지 검토 (로컬 전용 — 배포 금지)</h1>
<p>승인하려면 <code>src/data/seo/carousel-image-manifest.ts</code> 의 status 를 <code>approved</code> 로 변경하세요.</p>
<table><tr><th>id</th><th>원본</th><th>생성 이미지</th><th>연결 페이지</th><th>문구</th><th>variant</th><th>결과</th><th>상태</th></tr>
${rows}</table></html>`;
  writeFileSync(path.join(dir, "carousel-image-preview.html"), html, "utf8");
}

async function main() {
  const only = process.argv
    .find((a) => a.startsWith("--only="))
    ?.slice("--only=".length)
    .split(",");
  const targets = only
    ? CAROUSEL_IMAGE_MANIFEST.filter((i) => only.includes(i.id))
    : CAROUSEL_IMAGE_MANIFEST;
  const results = [];
  for (const item of targets) {
    try {
      results.push(await generateOne(item));
    } catch (e) {
      results.push({ id: item.id, ok: false, reason: String(e) });
    }
  }
  if (!only) writePreview(results);
  const ok = results.filter((r) => r.ok).length;
  console.log(
    JSON.stringify(
      { generated: ok, failed: results.filter((r) => !r.ok), preview: "docs/generated/carousel-image-preview.html" },
      null,
      2,
    ),
  );
}

main();
