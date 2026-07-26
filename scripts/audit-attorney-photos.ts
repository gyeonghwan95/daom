/**
 * 안윤정 법무사 사진 전수조사
 * Usage: npm run audit:attorney-photos
 *
 * public/image·public/images 를 재귀 스캔해 크기·용량·중복 hash·투명배경을 수집하고
 * attorney-photo-inventory 분류와 대조한다. 원본은 읽기만 한다.
 */

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  ATTORNEY_PHOTOS,
  EXCLUDED_IMAGE_NOTES,
} from "../src/data/media/attorney-photo-inventory";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const SCAN_DIRS = ["image", "images"];
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const OUT = path.join(ROOT, "scripts", "output");

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const inventoryBySrc = new Map(ATTORNEY_PHOTOS.map((p) => [p.src, p]));
  const excludedBySrc = new Map(EXCLUDED_IMAGE_NOTES.map((e) => [e.src, e.reason]));

  const files = SCAN_DIRS.flatMap((d) => {
    const dir = path.join(PUBLIC, d);
    try {
      return walk(dir);
    } catch {
      return [];
    }
  });

  const hashGroups = new Map<string, string[]>();
  const rows = [];
  for (const file of files) {
    const rel = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
    const bytes = statSync(file).size;
    let meta: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>> | undefined;
    try {
      meta = await sharp(file).metadata();
    } catch {
      // 손상/비지원 파일
    }
    const hash = createHash("md5").update(readFileSync(file)).digest("hex");
    const g = hashGroups.get(hash) ?? [];
    g.push(rel);
    hashGroups.set(hash, g);

    const inv = inventoryBySrc.get(rel);
    const generated = rel.startsWith("/images/generated/");
    rows.push({
      src: rel,
      bytes,
      kb: Math.round(bytes / 1024),
      width: meta?.width ?? null,
      height: meta?.height ?? null,
      format: meta?.format ?? null,
      hasAlpha: meta?.hasAlpha ?? false,
      ratio:
        meta?.width && meta?.height
          ? Number((meta.width / meta.height).toFixed(2))
          : null,
      generated,
      attorneyPhoto: Boolean(inv),
      classification: inv
        ? { context: inv.context, usageSuitability: inv.usageSuitability, notes: inv.notes }
        : excludedBySrc.has(rel)
          ? { context: "excluded", reason: excludedBySrc.get(rel) }
          : null,
    });
  }

  const duplicates = [...hashGroups.values()].filter((g) => g.length > 1);
  const report = {
    generatedAt: new Date().toISOString(),
    scanned: rows.length,
    attorneyPhotosClassified: ATTORNEY_PHOTOS.length,
    excludedNoted: EXCLUDED_IMAGE_NOTES.length,
    duplicateGroups: duplicates,
    files: rows.sort((a, b) => a.src.localeCompare(b.src)),
  };
  writeFileSync(
    path.join(OUT, "audit-attorney-photos.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );
  console.log(
    JSON.stringify(
      {
        scanned: rows.length,
        originals: rows.filter((r) => !r.generated).length,
        generated: rows.filter((r) => r.generated).length,
        duplicateGroups: duplicates.length,
        largest: rows
          .filter((r) => !r.generated)
          .sort((a, b) => b.bytes - a.bytes)
          .slice(0, 3)
          .map((r) => `${r.src} (${r.kb}KB)`),
        report: "scripts/output/audit-attorney-photos.json",
      },
      null,
      2,
    ),
  );
}

main();
