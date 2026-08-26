#!/usr/bin/env node
/**
 * Cloudflare Pages 단일 파일 한도(25 MiB)를 넘는 public/ 자산을 막는다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIMIT_BYTES = 25 * 1024 * 1024;
const SCAN_DIRS = ["public"].filter((dir) =>
  fs.existsSync(path.join(ROOT, dir)),
);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const oversized = [];
for (const rel of SCAN_DIRS) {
  for (const file of walk(path.join(ROOT, rel))) {
    const size = fs.statSync(file).size;
    if (size >= LIMIT_BYTES) {
      oversized.push({
        file: path.relative(ROOT, file).replaceAll("\\", "/"),
        mib: (size / (1024 * 1024)).toFixed(2),
      });
    }
  }
}

if (oversized.length) {
  console.error(
    `[cloudflare-assets] Pages 한도 25 MiB를 넘는 파일 ${oversized.length}개:`,
  );
  for (const row of oversized) {
    console.error(`  ${row.file} (${row.mib} MiB)`);
  }
  console.error(
    "히어로 영상은 `npx --yes tsx scripts/compress-hero-videos.mjs` 후 다시 빌드하세요.",
  );
  process.exit(1);
}

console.log("[cloudflare-assets] OK — 25 MiB 이상 파일 없음");
