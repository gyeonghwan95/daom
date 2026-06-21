#!/usr/bin/env node
/**
 * Static export build → out/ (Cloudflare Pages 등).
 * API routes are temporarily stashed because `output: export` does not support them.
 * Server build with admin API: `npm run build:server`
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(ROOT, "src/app/api");
const backupDir = path.join(ROOT, "src/app/_api_static_backup");
let stashedApi = false;

function stashApiRoutes() {
  if (!fs.existsSync(apiDir)) return;

  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }

  try {
    fs.renameSync(apiDir, backupDir);
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : "";
    if (code === "EPERM" || code === "EBUSY") {
      console.error(
        "\n[build-static] API 폴더를 임시 이동할 수 없습니다. `npm run dev`를 중지한 뒤 다시 빌드해 주세요.\n",
      );
    }
    throw error;
  }

  stashedApi = true;
}

function restoreApiRoutes() {
  if (!stashedApi || !fs.existsSync(backupDir)) return;

  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
  }

  fs.renameSync(backupDir, apiDir);
  stashedApi = false;
}

stashApiRoutes();

try {
  execSync("next build", {
    stdio: "inherit",
    cwd: ROOT,
    env: { ...process.env, STATIC_EXPORT: "true" },
  });

  const outDir = path.join(ROOT, "out");
  if (!fs.existsSync(outDir)) {
    console.error("\n[build-static] 빌드는 완료됐지만 out/ 폴더가 없습니다.\n");
    process.exit(1);
  }
} finally {
  restoreApiRoutes();
}
