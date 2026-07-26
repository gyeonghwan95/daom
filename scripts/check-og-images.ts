/**
 * OG/대표 이미지 파일 검증 (manifest + existingImage)
 * Usage: npx tsx scripts/check-og-images.ts
 */

import { existsSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PAGE_IMAGE_MANIFEST } from "../src/data/seo/page-image-manifest";

const PUBLIC = path.join(process.cwd(), "public");
const OUT = path.join(process.cwd(), "scripts", "output");

type CheckRow = {
  id: string;
  url: string;
  pathChecked: string;
  exists: boolean;
  bytes?: number;
  note: string;
};

function checkPath(publicPath: string): Omit<CheckRow, "id" | "url" | "note"> {
  const disk = path.join(PUBLIC, publicPath.replace(/^\//, ""));
  const exists = existsSync(disk);
  if (!exists) return { pathChecked: publicPath, exists: false };
  const st = statSync(disk);
  return { pathChecked: publicPath, exists: true, bytes: st.size };
}

function main() {
  mkdirSync(OUT, { recursive: true });
  const rows: CheckRow[] = [];

  for (const item of PAGE_IMAGE_MANIFEST) {
    if (item.existingImage) {
      const r = checkPath(item.existingImage);
      rows.push({
        id: item.id,
        url: item.pageUrl,
        ...r,
        note:
          r.exists && (r.bytes ?? 0) > 5000
            ? "existing ok"
            : r.exists
              ? "existing too small?"
              : "existing missing",
      });
    }
    const planned = checkPath(item.imagePath);
    rows.push({
      id: `${item.id}:planned`,
      url: item.pageUrl,
      ...planned,
      note: planned.exists
        ? "planned file present"
        : "planned not created yet (expected)",
    });
  }

  const missingExisting = rows.filter(
    (r) => !r.id.endsWith(":planned") && !r.exists,
  );
  const presentPlanned = rows.filter(
    (r) => r.id.endsWith(":planned") && r.exists,
  );

  const report = {
    generatedAt: new Date().toISOString(),
    missingExisting,
    presentPlanned,
    rows,
  };
  writeFileSync(
    path.join(OUT, "check-og-images.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );
  console.log(
    JSON.stringify(
      {
        missingExisting: missingExisting.length,
        presentPlanned: presentPlanned.length,
        totalChecks: rows.length,
      },
      null,
      2,
    ),
  );
}

main();
