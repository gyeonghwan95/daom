/**
 * 캐러셀 대표이미지 생성 (로컬 사전 생성 전용 — 배포 빌드에서 실행하지 않음)
 *
 * - 원본 사진은 수정하지 않고 crop/resize/합성만 수행
 * - 출력: public/images/generated/carousel/<category>/<file>.webp (1200×800)
 * - 검토용 미리보기: docs/generated/carousel-image-preview.html
 *
 * Usage: npm run generate:carousel-images
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
  const results = [];
  for (const item of CAROUSEL_IMAGE_MANIFEST) {
    try {
      results.push(await generateOne(item));
    } catch (e) {
      results.push({ id: item.id, ok: false, reason: String(e) });
    }
  }
  writePreview(results);
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
