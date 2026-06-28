#!/usr/bin/env node
/**
 * 빌드 산출물(out/)에 색인 URL이 모두 생성됐는지 검증합니다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getAllPublishedPaths,
  pathToOutCandidates,
} from "./lib/published-paths.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(ROOT, "out");

function fileExists(relativePath) {
  return fs.existsSync(path.join(outDir, relativePath));
}

function main() {
  if (!fs.existsSync(outDir)) {
    console.error("[validate-out-routes] out/ 폴더가 없습니다. 먼저 빌드하세요.");
    process.exit(1);
  }

  const paths = getAllPublishedPaths();
  const missing = [];

  for (const routePath of paths) {
    const candidates = pathToOutCandidates(routePath);
    const found = candidates.some((candidate) => fileExists(candidate));
    if (!found) {
      missing.push({ path: routePath, tried: candidates });
    }
  }

  if (missing.length > 0) {
    console.error(
      `[validate-out-routes] ${missing.length}/${paths.length} 경로에 HTML 산출물이 없습니다.\n`,
    );
    for (const item of missing.slice(0, 30)) {
      console.error(`  ${item.path}`);
      console.error(`    tried: ${item.tried.join(", ")}`);
    }
    if (missing.length > 30) {
      console.error(`  ... 외 ${missing.length - 30}건`);
    }
    process.exit(1);
  }

  console.log(
    `[validate-out-routes] OK — ${paths.length}개 경로 모두 out/에 존재합니다.`,
  );
}

main();
