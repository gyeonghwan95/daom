/**
 * SERP / card visual QA
 * Usage: npm run visuals:validate
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getThumbnailPortrait } from "../src/data/media/thumbnail-portraits";
import { PAGE_VISUALS } from "../src/data/seo/page-visuals";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const REPORT = path.join(ROOT, "reports", "image-seo");

const BANNED = ["무료", "1위", "최고", "상담하세요", "지금 클릭", "BEST", "TOP"];

type Issue = { url: string; level: "error" | "warn"; message: string };

async function main() {
  const issues: Issue[] = [];
  const headlines = new Map<string, string>();
  const fileHashes = new Map<string, string>();
  const serpRows: string[] = [
    "url,title,representativeImage,ogImage,imageWidth,imageHeight,fileSize,unique,visibleInBody,alt,structuredDataImage,status",
  ];

  mkdirSync(REPORT, { recursive: true });

  for (const item of PAGE_VISUALS) {
    const key = item.cardHeadline.replace(/\s+/g, " ").trim();
    if (headlines.has(key)) {
      issues.push({
        url: item.url,
        level: "error",
        message: `duplicate headline with ${headlines.get(key)}`,
      });
    } else headlines.set(key, item.url);

    for (const ban of BANNED) {
      if (item.cardHeadline.includes(ban)) {
        issues.push({ url: item.url, level: "error", message: `banned: ${ban}` });
      }
    }

    if (!getThumbnailPortrait(item.sourcePortrait)) {
      issues.push({
        url: item.url,
        level: "error",
        message: `portrait missing ${item.sourcePortrait}`,
      });
    }

    const serpDisk = path.join(PUBLIC, item.representativeImage.replace(/^\//, ""));
    const cardDisk = path.join(PUBLIC, item.cardImage.replace(/^\//, ""));
    let status = "READY";
    let w = 0;
    let h = 0;
    let size = 0;

    if (!existsSync(serpDisk)) {
      status = "MISSING";
      issues.push({ url: item.url, level: "error", message: "serp missing" });
    } else {
      size = statSync(serpDisk).size;
      if (size < 5 * 1024) {
        status = "TOO_SMALL";
        issues.push({ url: item.url, level: "error", message: `serp <5KB` });
      }
      const meta = await sharp(serpDisk).metadata();
      w = meta.width ?? 0;
      h = meta.height ?? 0;
      if (w !== 1200 || h !== 1200) {
        status = "TOO_SMALL";
        issues.push({
          url: item.url,
          level: "error",
          message: `serp size ${w}x${h}`,
        });
      }
      const buf = readFileSync(serpDisk);
      const hash = createHash("sha256").update(buf).digest("hex");
      if (fileHashes.has(hash)) {
        status = "DUPLICATE";
        issues.push({
          url: item.url,
          level: "error",
          message: `exact duplicate of ${fileHashes.get(hash)}`,
        });
      } else fileHashes.set(hash, item.url);
    }

    if (!existsSync(cardDisk)) {
      issues.push({ url: item.url, level: "error", message: "card missing" });
    }

    if (!item.alt.trim()) {
      issues.push({ url: item.url, level: "error", message: "alt missing" });
    }

    serpRows.push(
      [
        item.url,
        JSON.stringify(item.pageTitle),
        item.representativeImage,
        item.representativeImage,
        w,
        h,
        size,
        status === "DUPLICATE" ? "no" : "yes",
        "yes",
        JSON.stringify(item.alt),
        item.representativeImage,
        status,
      ].join(","),
    );
  }

  writeFileSync(path.join(REPORT, "03-serp-image-audit.csv"), serpRows.join("\n"), "utf8");
  writeFileSync(
    path.join(REPORT, "01-page-visual-manifest.csv"),
    [
      "url,pageTitle,representativeImage,cardImage,cardHeadline,category,portrait,alt",
      ...PAGE_VISUALS.map((v) =>
        [
          v.url,
          JSON.stringify(v.pageTitle),
          v.representativeImage,
          v.cardImage,
          JSON.stringify(v.cardHeadline),
          v.category,
          v.sourcePortrait,
          JSON.stringify(v.alt),
        ].join(","),
      ),
    ].join("\n"),
    "utf8",
  );

  writeFileSync(
    path.join(REPORT, "baseline-checklist.md"),
    `# Image SEO baseline checklist

- Applied date: ${new Date().toISOString().slice(0, 10)}
- Phase 1 pages: ${PAGE_VISUALS.length}
- Design version: 1
- Expect Naver SERP thumbnail changes to lag (days–weeks). Do not assume instant CTR lift.
- Compare Search Advisor: impressions / clicks / CTR for Phase 1 URLs after deploy.
`,
    "utf8",
  );

  const errors = issues.filter((i) => i.level === "error");
  console.log(
    JSON.stringify(
      {
        pages: PAGE_VISUALS.length,
        errors: errors.length,
        warnings: issues.length - errors.length,
        issues,
      },
      null,
      2,
    ),
  );
  if (errors.length) process.exitCode = 1;
}

main();
