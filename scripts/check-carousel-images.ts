/**
 * 캐러셀 대표이미지 검증
 * Usage: npm run check:carousel-images
 *
 * 검사: manifest URL 존재, 원본·출력 파일 존재, 규격(1200×800·WebP·비율·용량),
 *       중복 hash, 동일 원본 과다 사용, alt 누락, status-파일 불일치,
 *       허브 ItemList 조건(승인 4개 이상), sitemap 포함 여부.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  CAROUSEL_HUBS,
  CAROUSEL_IMAGE_MANIFEST,
} from "../src/data/seo/carousel-image-manifest";
import { getAttorneyPhoto } from "../src/data/media/attorney-photo-inventory";
import { getAllPageData } from "../src/lib/pageData/registry";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "scripts", "output");

/** 정적 route(App Router 파일 기반)라 registry에 없는 URL */
const KNOWN_STATIC_URLS = new Set([
  "/services",
  "/services/inheritance-registration",
  "/services/inheritance-renunciation",
  "/services/qualified-acceptance",
  "/services/real-estate-registration",
  "/services/ownership-transfer",
  "/services/corporate-registration",
  "/services/company-establishment",
  "/services/director-change",
  "/services/personal-rehabilitation",
  "/services/bankruptcy",
]);

function toDisk(publicPath: string): string {
  return path.join(PUBLIC, decodeURIComponent(publicPath).replace(/^\//, ""));
}

function md5(file: string): string {
  return createHash("md5").update(readFileSync(file)).digest("hex");
}

function loadSitemapUrls(): string[] | null {
  // public/sitemap.xml 은 인덱스 — 실제 URL은 public/sitemaps/tier-*.xml 에 있다.
  const files: string[] = [];
  for (const dir of [PUBLIC, path.join(PUBLIC, "sitemaps")]) {
    try {
      files.push(
        ...readdirSync(dir)
          .filter((f) => f.includes("sitemap") || f.startsWith("tier-"))
          .filter((f) => f.endsWith(".xml"))
          .map((f) => path.join(dir, f)),
      );
    } catch {
      // 폴더 없음 — prebuild 전
    }
  }
  if (!files.length) return null;
  const urls: string[] = [];
  for (const f of files) {
    const xml = readFileSync(f, "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.push(decodeURIComponent(m[1]));
    }
  }
  return urls;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const registryPaths = new Set(getAllPageData().map((p) => p.path));
  const sitemapUrls = loadSitemapUrls();

  const problems: string[] = [];
  const warnings: string[] = [];
  const hashes = new Map<string, string[]>();
  const sourceUsage = new Map<string, string[]>();

  const items = [];
  for (const item of CAROUSEL_IMAGE_MANIFEST) {
    const urlExists =
      registryPaths.has(item.pageUrl) || KNOWN_STATIC_URLS.has(item.pageUrl);
    if (!urlExists) problems.push(`${item.id}: URL 미존재 ${item.pageUrl}`);

    const sourcePublic = item.sourcePhotoId
      ? getAttorneyPhoto(item.sourcePhotoId)?.src
      : item.sourcePhotoPath;
    if ((item.sourcePhotoId || item.sourcePhotoPath) && !sourcePublic) {
      problems.push(`${item.id}: 인벤토리에 없는 sourcePhotoId`);
    }
    if (sourcePublic && !existsSync(toDisk(sourcePublic))) {
      problems.push(`${item.id}: 원본 사진 없음 ${sourcePublic}`);
    }
    if (sourcePublic) {
      const list = sourceUsage.get(sourcePublic) ?? [];
      list.push(item.id);
      sourceUsage.set(sourcePublic, list);
    }
    if (!item.alt?.trim()) problems.push(`${item.id}: alt 누락`);

    const outDisk = toDisk(item.outputPath);
    const outExists = existsSync(outDisk);
    let meta: { width?: number; height?: number; format?: string } = {};
    let bytes = 0;
    if (outExists) {
      meta = await sharp(outDisk).metadata();
      bytes = statSync(outDisk).size;
      if (meta.format !== "webp") problems.push(`${item.id}: WebP 아님 (${meta.format})`);
      if (meta.width !== item.width || meta.height !== item.height) {
        problems.push(`${item.id}: 크기 불일치 ${meta.width}×${meta.height} (기대 ${item.width}×${item.height})`);
      }
      if ((meta.width ?? 0) <= 150 || (meta.height ?? 0) <= 150) {
        problems.push(`${item.id}: 150px 이하`);
      }
      const ratio = (meta.width ?? 1) / (meta.height ?? 1);
      if (ratio > 3 || ratio < 1 / 3) problems.push(`${item.id}: 비율 3:1 초과`);
      if (bytes > 300 * 1024) warnings.push(`${item.id}: ${(bytes / 1024).toFixed(0)}KB — 용량 검토`);
      const h = md5(outDisk);
      const dup = hashes.get(h) ?? [];
      dup.push(item.id);
      hashes.set(h, dup);
    }
    if (
      (item.status === "approved" || item.status === "applied") &&
      !outExists
    ) {
      problems.push(`${item.id}: status=${item.status} 인데 출력 파일 없음`);
    }
    if (sitemapUrls && (item.status === "approved" || item.status === "applied")) {
      const inSitemap = sitemapUrls.some((u) => u.endsWith(item.pageUrl) || decodeURIComponent(u).endsWith(item.pageUrl));
      if (!inSitemap) warnings.push(`${item.id}: sitemap에서 ${item.pageUrl} 미확인`);
    }

    items.push({
      id: item.id,
      pageUrl: item.pageUrl,
      urlExists,
      source: sourcePublic ?? null,
      output: item.outputPath,
      outExists,
      width: meta.width,
      height: meta.height,
      kb: Math.round(bytes / 1024),
      status: item.status,
    });
  }

  for (const [h, ids] of hashes) {
    if (ids.length > 1) problems.push(`동일 이미지 hash(${h.slice(0, 8)}): ${ids.join(", ")}`);
  }
  for (const [src, ids] of sourceUsage) {
    if (ids.length > 5) problems.push(`동일 원본 과다 사용(${ids.length}회): ${src}`);
    else if (ids.length > 3) warnings.push(`동일 원본 ${ids.length}회 사용: ${src} (${ids.join(", ")})`);
  }

  const hubs = CAROUSEL_HUBS.map((hub) => {
    const approved = hub.itemIds.filter((id) => {
      const m = CAROUSEL_IMAGE_MANIFEST.find((i) => i.id === id);
      return m && (m.status === "approved" || m.status === "applied") && m.carouselCandidate;
    });
    return {
      hubUrl: hub.hubUrl,
      totalItems: hub.itemIds.length,
      approvedItems: approved.length,
      itemListEligible: approved.length >= 4,
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    sitemapChecked: Boolean(sitemapUrls),
    items,
    hubs,
    warnings,
    problems,
  };
  writeFileSync(
    path.join(OUT, "check-carousel-images.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );
  console.log(
    JSON.stringify(
      {
        items: items.length,
        outputsPresent: items.filter((i) => i.outExists).length,
        hubs,
        warnings: warnings.length,
        problems,
      },
      null,
      2,
    ),
  );
  if (problems.length) process.exitCode = 1;
}

main();
