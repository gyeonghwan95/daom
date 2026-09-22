/**
 * 1:1 페이지 썸네일 검증
 * Usage: npm run thumbnails:validate
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getThumbnailPortrait } from "../src/data/media/thumbnail-portraits";
import { PAGE_THUMBNAILS } from "../src/data/seo/page-thumbnails";

const PUBLIC = path.join(process.cwd(), "public");
const BANNED = [
  "최고",
  "1위",
  "무료",
  "무조건",
  "완벽",
  "100%",
  "즉시",
  "긴급",
  "상담하세요",
  "지금 클릭",
  "놓치면",
];

type Issue = { url: string; level: "error" | "warn"; message: string };

async function main() {
  const issues: Issue[] = [];
  const headlines = new Map<string, string>();
  const outputs = new Map<string, string>();
  const sizes: number[] = [];

  for (const item of PAGE_THUMBNAILS) {
    const key = item.headline.replace(/\s+/g, " ").trim();
    if (headlines.has(key)) {
      issues.push({
        url: item.url,
        level: "error",
        message: `duplicate headline with ${headlines.get(key)}`,
      });
    } else {
      headlines.set(key, item.url);
    }

    if (outputs.has(item.output)) {
      issues.push({
        url: item.url,
        level: "error",
        message: `duplicate output ${item.output}`,
      });
    } else {
      outputs.set(item.output, item.url);
    }

    const lines = item.headline.split(/\n/).filter(Boolean);
    if (lines.length === 0 || lines.length > 2) {
      issues.push({ url: item.url, level: "error", message: "headline lines must be 1–2" });
    }
    const chars = item.headline.replace(/\n/g, "").length;
    if (chars < 5 || chars > 22) {
      issues.push({
        url: item.url,
        level: "warn",
        message: `headline length ${chars} outside 7–18 preferred`,
      });
    }

    for (const ban of BANNED) {
      if (item.headline.includes(ban)) {
        issues.push({ url: item.url, level: "error", message: `banned phrase: ${ban}` });
      }
    }

    if (!getThumbnailPortrait(item.sourcePortrait)) {
      issues.push({
        url: item.url,
        level: "error",
        message: `unknown portrait ${item.sourcePortrait}`,
      });
    }

    const disk = path.join(PUBLIC, item.output.replace(/^\//, ""));
    if (!existsSync(disk)) {
      issues.push({ url: item.url, level: "error", message: "output file missing" });
      continue;
    }

    const bytes = statSync(disk).size;
    sizes.push(bytes);
    if (bytes < 8 * 1024) {
      issues.push({ url: item.url, level: "error", message: `file too small ${bytes}` });
    }
    if (bytes > 500 * 1024) {
      issues.push({ url: item.url, level: "error", message: `file too large ${bytes}` });
    }

    const meta = await sharp(disk).metadata();
    if (meta.width !== 1200 || meta.height !== 1200) {
      issues.push({
        url: item.url,
        level: "error",
        message: `expected 1200x1200 got ${meta.width}x${meta.height}`,
      });
    }
    if (meta.format !== "webp") {
      issues.push({ url: item.url, level: "error", message: `format ${meta.format}` });
    }
  }

  // orphan check under generated/thumbnails
  const root = path.join(PUBLIC, "generated", "thumbnails");
  if (existsSync(root)) {
    const walk = (d: string): string[] => {
      const out: string[] = [];
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) out.push(...walk(p));
        else if (e.name.endsWith(".webp")) out.push(p);
      }
      return out;
    };
    for (const file of walk(root)) {
      const rel = "/" + path.relative(PUBLIC, file).replace(/\\/g, "/");
      if (![...outputs.keys()].includes(rel)) {
        issues.push({
          url: rel,
          level: "warn",
          message: "orphan thumbnail not in manifest",
        });
      }
    }
  }

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  const avgKb = sizes.length
    ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length / 1024)
    : 0;
  const maxKb = sizes.length ? Math.round(Math.max(...sizes) / 1024) : 0;

  console.log(
    JSON.stringify(
      {
        pages: PAGE_THUMBNAILS.length,
        filesChecked: sizes.length,
        avgKb,
        maxKb,
        errors: errors.length,
        warnings: warns.length,
        issues,
      },
      null,
      2,
    ),
  );

  if (errors.length) process.exitCode = 1;
}

main();
