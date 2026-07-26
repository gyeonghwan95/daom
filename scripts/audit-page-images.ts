/**
 * 페이지 대표 이미지 감사
 * Usage: npx tsx scripts/audit-page-images.ts
 */

import {
  existsSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import path from "node:path";
import { PAGE_IMAGE_MANIFEST } from "../src/data/seo/page-image-manifest";
import { summarizeManifestStatus } from "../src/lib/seo/page-images";

const PUBLIC = path.join(process.cwd(), "public");
const OUT = path.join(process.cwd(), "scripts", "output");

function fileOk(publicPath: string): boolean {
  return existsSync(path.join(PUBLIC, publicPath.replace(/^\//, "")));
}

function main() {
  mkdirSync(OUT, { recursive: true });
  const summaryPath = path.join(
    process.cwd(),
    "src",
    "generated",
    "page-inventory-summary.json",
  );

  let inventorySummary: Record<string, unknown> | null = null;
  if (existsSync(summaryPath)) {
    inventorySummary = JSON.parse(readFileSync(summaryPath, "utf8")) as Record<
      string,
      unknown
    >;
  }

  const manifestIssues = PAGE_IMAGE_MANIFEST.map((item) => {
    const plannedExists = fileOk(item.imagePath);
    const existingOk = item.existingImage ? fileOk(item.existingImage) : null;
    return {
      id: item.id,
      url: item.pageUrl,
      priority: item.imagePriority,
      status: item.status,
      plannedPath: item.imagePath,
      plannedFileExists: plannedExists,
      existingImage: item.existingImage,
      existingFileExists: existingOk,
      unsafeIfApplied:
        (item.status === "approved" || item.status === "applied") &&
        !plannedExists,
    };
  });

  const seoDir = path.join(PUBLIC, "image", "seo");
  const seoFiles = existsSync(seoDir)
    ? readdirSync(seoDir).filter((f) => !f.startsWith("."))
    : [];

  const report = {
    generatedAt: new Date().toISOString(),
    manifestStatus: summarizeManifestStatus(),
    seoFolderFileCount: seoFiles.length,
    unsafeApprovedMissingFiles: manifestIssues.filter((i) => i.unsafeIfApplied),
    neededCount: manifestIssues.filter((i) => i.status === "needed").length,
    existingReviewCount: manifestIssues.filter(
      (i) => i.status === "existing-review",
    ).length,
    inventorySummaryLoaded: Boolean(inventorySummary),
    inventory: inventorySummary,
    manifestIssues,
  };

  writeFileSync(
    path.join(OUT, "page-image-audit.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        manifest: report.manifestStatus,
        seoFiles: report.seoFolderFileCount,
        unsafe: report.unsafeApprovedMissingFiles.length,
        needed: report.neededCount,
        existingReview: report.existingReviewCount,
        totalPages: (inventorySummary as { totalPages?: number } | null)
          ?.totalPages,
        byPriority: (inventorySummary as { byPriority?: unknown } | null)
          ?.byPriority,
      },
      null,
      2,
    ),
  );
}

main();
